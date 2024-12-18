import { getAuthorizationUrl } from "~/api/oauth/authorization";
import { Button } from "@/components/ui/button";
import { createResource, JSX, Show } from "solid-js";

function generateState(): string {
  return btoa(
    String.fromCharCode(
      ...Array(32)
        .fill(null)
        .map(() => 33 + Math.floor(Math.random() * 67))
    )
  );
}

export function AuthorizationButton(): JSX.Element {
  const state = generateState();

  localStorage.setItem("oauth-state", state);

  const [authorizationUrl, _] = createResource(() =>
    getAuthorizationUrl(window.location.origin, state)
  );

  return (
    <Show
      when={"ready" === authorizationUrl.state}
      fallback={"Fetching Discord's OAuth authorization URL..."}
    >
      <Button as="a" href={authorizationUrl()!} variant="outline">
        Login with Discord
      </Button>
    </Show>
  );
}
