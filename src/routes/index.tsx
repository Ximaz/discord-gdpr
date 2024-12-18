import { UploadFile } from "@solid-primitives/upload";
import {
  Accessor,
  createResource,
  createSignal,
  For,
  JSX,
  Resource,
  Setter,
  Show,
} from "solid-js";
import { makeDiscordAPICall } from "~/api/discord/apiHandler";
import {
  deleteMessage,
  DiscordGuildPartial,
  getGuilds,
  getMyGuildMessages,
  threadIsArchivedHandler,
} from "~/api/discord/getGuilds";
import { DiscordUser, getUser } from "~/api/discord/getUser";
import { AuthorizationButton } from "~/components/oauth/authorization";
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";
import {
  loadOAuthCallback,
  OAuthCredential,
} from "~/components/oauth/callback";
import { Button } from "~/components/ui/button";

import { Image, ImageFallback, ImageRoot } from "~/components/ui/image";
import { CheckboxLabel } from "@kobalte/core/src/checkbox/checkbox-label.jsx";
import { createStore } from "solid-js/store";

function User({ credential }: { credential: OAuthCredential }) {
  const [user, _] = createResource<DiscordUser | null>(
    () =>
      makeDiscordAPICall<DiscordUser | null>(
        credential,
        getUser,
        window.location.href
      ),
    { deferStream: true }
  );

  return (
    <Show
      when={"ready" === user.state}
      fallback={<p>We are fetching your Discord profile...</p>}
    >
      <div class="flex">
        <ImageRoot>
          <Image
            src={`https://cdn.discordapp.com/avatars/${user()!.id}/${
              user()!.avatar
            }.webp?size=4096`}
            alt="Avatar"
          />
          <ImageFallback>Avatar</ImageFallback>
        </ImageRoot>
        <p>{user()!.username}</p>
      </div>
    </Show>
  );
}

function getRandomIntInclusive(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function randomSleep() {
  return new Promise((resolve, _reject) =>
    setTimeout(
      resolve,
      (2 + getRandomIntInclusive(1, 2)) * 1000 +
        getRandomIntInclusive(1, 9) * 100 +
        getRandomIntInclusive(1, 9) * 10 +
        getRandomIntInclusive(1, 9)
    )
  );
}

async function startGdpr(
  setGuildName: Setter<string>,
  setTotalMessages: Setter<number>,
  setDeletedMessages: Setter<number>,
  setError: Setter<string | null>,
  selectedGuilds: { [k: string]: boolean },
  allGuilds: DiscordGuildPartial[]
) {
  for (const guild of allGuilds) {
    const enabled = selectedGuilds[guild.id];
    if (!enabled) continue;
    let deletedMessages = 0;
    let totalMessages = -1;
    setGuildName(guild.name);
    do {
      const messages = await getMyGuildMessages(guild.id, deletedMessages);
      if (null === messages) {
        setError(`Unable to retrieve your messages in ${guild.name}`);
        return;
      }
      if (-1 === totalMessages) totalMessages = messages.total_results;
      setTotalMessages(totalMessages);
      for (const _messages of messages.messages)
        for (const message of _messages) {
          await randomSleep();

          const response = await deleteMessage(message.channel_id, message.id);

          if (50083 === (response as { code: number }).code) {
            await randomSleep();
            await threadIsArchivedHandler(message.channel_id);
            await randomSleep();
            await deleteMessage(message.channel_id, message.id);
          }

          setDeletedMessages(++deletedMessages);
        }
    } while (deletedMessages < totalMessages);
  }
}

function DeleteStatus({
  guildName,
  deletedMessages,
  totalMessages,
  error,
}: {
  guildName: Accessor<string>;
  deletedMessages: Accessor<number>;
  totalMessages: Accessor<number>;
  error: Accessor<string | null>;
}) {
  return (
    <div>
      <p>Nom du serveur : {guildName()}</p>
      <p>
        Messages supprimés : {deletedMessages()} / {totalMessages()}
      </p>
      <Show when={null !== error()}>
        <p>{error()}</p>
      </Show>
    </div>
  );
}

function Dashboard({
  credential,
}: {
  credential: OAuthCredential;
}): JSX.Element {
  const [guilds] = createResource<DiscordGuildPartial[] | null>(
    () => getGuilds(credential.accessToken),
    {
      deferStream: true,
    }
  );
  const [guildName, setGuildName] = createSignal<string>("N/A");
  const [error, setError] = createSignal<string | null>(null);
  const [totalMessages, setTotalMessages] = createSignal<number>(0);
  const [deletedMessages, setDeletedMessages] = createSignal<number>(0);
  const [selectedGuilds, setSelectedGuilds] = createStore();

  const [user, _] = createResource<DiscordUser | null>(
    // () => ({ avatar: "#", id: "" } as DiscordUser),
    () => makeDiscordAPICall<DiscordUser | null>(
      credential,
      getUser,
      window.location.href
    ),
    { deferStream: true }
  );

  return (
    <>
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Show
            when={"ready" === user.state}
            fallback={<p>Loading your Discord profile...</p>}
          >
            <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-8 h-8 rounded-full"
                  src={`https://cdn.discordapp.com/avatars/${user()!.id}/${
                    user()!.avatar
                  }.png?size=4096`}
                  alt="user photo"
                />
              </button>
            </div>
          </Show>
        </div>
      </nav>
      <div class="max-w-screen-xl mx-auto p-4">
        <Show when={null !== guilds()}>
          <For each={guilds()}>
            {(guild) => (
              <div class="my-2">
                <Checkbox
                  class="flex items-center space-x-2"
                  onChange={(checked) =>
                    setSelectedGuilds((state) => ({
                      ...state,
                      [guild.id]: checked,
                    }))
                  }
                >
                  <CheckboxControl />
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {guild.name}
                  </label>
                </Checkbox>
              </div>
            )}
          </For>
          <Button
            onClick={() =>
              startGdpr(
                setGuildName,
                setTotalMessages,
                setDeletedMessages,
                setError,
                selectedGuilds,
                guilds()!
              )
            }
          >
            Start
          </Button>
          <DeleteStatus
            guildName={guildName}
            deletedMessages={deletedMessages}
            totalMessages={totalMessages}
            error={error}
          />
        </Show>
      </div>
    </>
  );
}

function Login(): JSX.Element {
  return (
    <>
      <AuthorizationButton />
    </>
  );
}

export default function Home() {
  const credential = loadOAuthCallback();

  return (
    <main>
      <Show when={null !== credential} fallback={<Login />}>
        <Dashboard credential={credential!} />
      </Show>
    </main>
  );
}
