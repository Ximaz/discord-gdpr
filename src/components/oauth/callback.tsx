import { useNavigate } from "@solidjs/router";

type OAuthCallbackResponse = {
  accessToken: string;
  expiresAt: Date;
  scope: string;
  state: string;
};

export type OAuthCredential = Pick<
  OAuthCallbackResponse,
  "accessToken" | "expiresAt"
>;

function getOAuthCallbackValues(url: string): OAuthCallbackResponse | null {
  const searchParams = new URLSearchParams(url.slice(url.indexOf("#") + 1));

  const accessToken = searchParams.get("access_token");
  if (!accessToken) return null;

  const tokenType = searchParams.get("token_type");
  if ("Bearer" !== tokenType) return null;

  const expiresIn = searchParams.get("expires_in");
  if (!expiresIn) return null;

  const scope = searchParams.get("scope");
  if (!scope) return null;

  const state = searchParams.get("state");
  if (!state) return null;

  const expiresAt = new Date(Date.now() + (+expiresIn - 5));
  if (isNaN(+expiresAt)) return null;

  return {
    accessToken,
    expiresAt,
    scope,
    state,
  };
}

function loadState(): string | null {
  const state = localStorage.getItem("oauth-state");

  if (null === state) return null;

  localStorage.removeItem("oauth-state");
  return state;
}

export function loadOAuthCallback(): OAuthCredential | null {
  const credentialString = localStorage.getItem("oauth");
  if (null !== credentialString)
    try {
      const credential = JSON.parse(credentialString);
      if (new Date(credential["expiresAt"]).getTime() > Date.now())
        return credential;
      localStorage.removeItem("oauth");
      return loadOAuthCallback();
    } catch (e) {
      localStorage.removeItem("oauth");
      return loadOAuthCallback();
    }

  const oauthCallbackResponse = getOAuthCallbackValues(window.location.href);
  if (null === oauthCallbackResponse) return null;
  
  const state = loadState();
  if (null === state || state !== oauthCallbackResponse!.state) return null;

  const callbackCredential = {
    accessToken: oauthCallbackResponse!.accessToken,
    expiresAt: oauthCallbackResponse!.expiresAt,
  };

  localStorage.setItem("oauth", JSON.stringify(callbackCredential));

  const navigation = useNavigate();

  navigation("/", { replace: true });
  return callbackCredential;
}
