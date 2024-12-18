"use server";

import { DiscordUser } from "./getUser";

function buildDiscordHeaders(referer?: string): HeadersInit {
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0";
  return {
    Host: "discord.com",
    "User-Agent": userAgent,
    Accept: "*/*",
    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    Authorization: import.meta.env.VITE_DISCORD_TOKEN,
    "X-Super-Properties": btoa(
      JSON.stringify({
        os: "Mac OS X",
        browser: "Firefox",
        device: "",
        system_locale: "fr",
        browser_user_agent: userAgent,
        browser_version: "133.0",
        os_version: "10.15",
        referrer: "",
        referring_domain: "",
        referrer_current: "",
        referring_domain_current: "",
        release_channel: "stable",
        client_build_number: 354183,
        client_event_source: null,
        has_client_mods: false,
      })
    ),
    "X-Discord-Locale": "en-GB",
    "X-Discord-Timezone": "Europe/Paris",
    "X-Debug-Options": "bugReporterEnabled",
    Origin: "https://discord.com",
    DNT: "1",
    "Sec-GPC": "1",
    "Alt-Used": "discord.com",
    Connection: "keep-alive",
    Referer: referer ?? "https://discord.com/app",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    Priority: "u=0",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  };
}

type DiscordGuildRoleTag = {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: null;
  subscription_listing_id?: string;
  available_for_purchase?: null;
  guild_connections?: null;
};

type DiscordGuildRole = {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string;
  unicode_emoji?: string;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: DiscordGuildRoleTag;
  flags: number;
};

type DiscordEmojiUser = {
  username: string;
  discriminator: string;
  id: string;
  avatar: string;
  public_flags: number;
};

type DiscordEmoji = {
  id: string | null;
  name: string;
  roles: string[];
  user: DiscordEmojiUser;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
};

type DiscordGuildFeatures = [
  "ANIMATED_BANNER",
  "ANIMATED_ICON",
  "APPLICATION_COMMAND_PERMISSIONS_V2",
  "AUTO_MODERATION",
  "BANNER",
  "COMMUNITY",
  "CREATOR_MONETIZABLE_PROVISIONAL",
  "CREATOR_STORE_PAGE",
  "DEVELOPER_SUPPORT_SERVER",
  "DISCOVERABLE",
  "FEATURABLE",
  "INVITES_DISABLED",
  "INVITE_SPLASH",
  "MEMBER_VERIFICATION_GATE_ENABLED",
  "MORE_SOUNDBOARD",
  "MORE_STICKERS",
  "NEWS",
  "PARTNERED",
  "PREVIEW_ENABLED",
  "RAID_ALERTS_DISABLED",
  "ROLE_ICONS",
  "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  "ROLE_SUBSCRIPTIONS_ENABLED",
  "SOUNDBOARD",
  "TICKETED_EVENTS_ENABLED",
  "VANITY_URL",
  "VERIFIED",
  "VIP_REGIONS",
  "WELCOME_SCREEN_ENABLED"
];

type DiscordSticker = {
  id: string;
  pack_id?: string;
  name: string;
  description?: string;
  tags: string;
  type: number;
  format_type: number;
  available?: boolean;
  guild_id?: string;
  user?: DiscordUser;
  sort_value?: number;
};

type DiscordGuild = {
  id: string;
  name: string;
  icon?: string;
  icon_hash?: string;
  splash?: string;
  discovery_splash?: string;
  owner?: boolean;
  owner_id: string;
  permissions?: string;
  region?: string;
  afk_channel_id?: string;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: string;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: DiscordGuildRole[];
  emojis: DiscordEmoji[];
  features: DiscordGuildFeatures;
  mfa_level: number;
  application_id?: string;
  system_channel_id?: string;
  system_channel_flags: number;
  rules_channel_id?: string;
  max_presences?: number;
  max_members: number;
  vanity_url_code?: string;
  description?: string;
  banner?: string;
  premium_tier: number;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id?: string;
  max_video_channel_users?: number;
  max_stage_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: number;
  nsfw_level: number;
  stickers: DiscordSticker[];
  premium_progress_bar_enabled: boolean;
  safety_alerts_channel_id?: string;
};

type DiscordChannelPermissionOverwrite = {};

type DiscordDefaultReaction = {
  emoji_id?: string;
  emoji_name?: string;
};

type DiscordChannel = {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: DiscordChannelPermissionOverwrite[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: null;
  icon?: string;
  owner_id?: string;
  application_id?: string;
  managed?: boolean;
  parent_id?: string;
  last_pin_timestamp?: string;
  rtc_region?: string;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  thread_metadata?: null;
  member?: null;
  default_auto_archive_duration?: number;
  permissions?: string;
  flags?: number;
  total_message_sent?: number;
  available_tags?: any[];
  applied_tags?: string[];
  default_reaction_emoji?: DiscordDefaultReaction[];
  default_thread_rate_limit_per_user?: number;
  default_sort_order?: number;
  default_forum_layout?: number;
};

export type DiscordGuildPartial = Pick<
  DiscordGuild,
  | "id"
  | "name"
  | "icon"
  | "banner"
  | "owner"
  | "permissions"
  | "features"
  | "approximate_member_count"
  | "approximate_presence_count"
>;

type DiscordMessage = {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: DiscordUser;
  attachments: object[];
  embeds: object[];
  mentions: object[];
  mention_roles: object[];
  mention_everyone: boolean;
  pinned: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp?: string;
  flags: number;
  components: object[];
  hit: boolean;
};

type DiscordSearchResponse = {
  analytics_id: string;
  doing_deep_historical_index: boolean;
  total_results: number;
  channels: DiscordChannel[];
  messages: DiscordMessage[][];
};

function errorHandler(
  r: Response,
  ratelimitCallback: (...args: never[]) => Promise<unknown>
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    switch (r.status) {
      case 403:
        return resolve(null);

      case 429:
        const ratelimitHeader = r.headers.get("X-RateLimit-Reset-After");

        if (null === ratelimitHeader) return resolve(null);

        const retryAfter = Math.ceil(+ratelimitHeader);

        const delay = (retryAfter + 1) * 1000;

        const timeout = setTimeout(async () => {
          const data = await ratelimitCallback();

          clearTimeout(timeout);

          return resolve(data);
        }, delay);
        break;

      default:
        if (204 !== r.status) r.json().then(resolve).catch(reject);
        else resolve("ok");
        break;
    }
  });
}

export async function getGuilds(
  accessToken: string
): Promise<DiscordGuildPartial[] | null> {
  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  return errorHandler(response, () => getGuilds(accessToken)) as Promise<
    DiscordGuildPartial[] | null
  >;
}

export async function getGuildChannels(
  accessToken: string,
  guildId: string
): Promise<DiscordChannel[] | null> {
  const response = await fetch(
    `https://discord.com/api/guilds/${guildId}/channels`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return errorHandler(response, () =>
    getGuildChannels(accessToken, guildId)
  ) as Promise<DiscordChannel[] | null>;
}

export async function getMyChannelMessages(
  channelId: string,
  offset: number = 0
): Promise<DiscordSearchResponse | null> {
  const userId = import.meta.env.VITE_DISCORD_USER_ID;

  let url = `https://discord.com/api/channels/${channelId}/messages/search?author_id=${userId}`;
  if (0 < offset) url += `&offset=${offset}`;

  const response = await fetch(url, {
    headers: buildDiscordHeaders(`https://discord.com/channels/${channelId}`),
  });

  return errorHandler(response, () =>
    getMyChannelMessages(channelId, offset)
  ) as Promise<never>;
}
export async function getMyGuildMessages(
  guildId: string,
  offset: number = 0
): Promise<DiscordSearchResponse | null> {
  const userId = import.meta.env.VITE_DISCORD_USER_ID;

  let url = `https://discord.com/api/guilds/${guildId}/messages/search?author_id=${userId}`;
  if (0 < offset) url += `&offset=${offset}`;

  const response = await fetch(url, {
    headers: buildDiscordHeaders(`https://discord.com/guilds/${guildId}`),
  });

  return errorHandler(response, () =>
    getMyGuildMessages(guildId, offset)
  ) as Promise<never>;
}

export async function threadIsArchivedHandler(
  channelId: string,
): Promise<never> {
  const response = await fetch(
    `https://discord.com/api/v9/channels/${channelId}`,
    {
      body: JSON.stringify({
        archived: false,
      }),
      headers: { ...buildDiscordHeaders(), "Content-Type": "application/json" },
      method: "PATCH",
    }
  );

  return errorHandler(response, () =>
    threadIsArchivedHandler(channelId)
  ) as Promise<never>;
}

export async function deleteMessage(
  channelId: string,
  messageId: string
): Promise<never> {
  const response = await fetch(
    `https://discord.com/api/channels/${channelId}/messages/${messageId}`,
    {
      method: "DELETE",
      headers: buildDiscordHeaders(),
    }
  );

  return errorHandler(response, () =>
    deleteMessage(channelId, messageId)
  ) as Promise<never>;
}

// export async function getDirectMessages(accessToken: string): Promise<DiscordChannel[] | null> {

// }
