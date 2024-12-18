import { useNavigate } from "@solidjs/router";
import { OAuthCredential } from "~/components/oauth/callback";

export async function makeDiscordAPICall<T>(
  credential: OAuthCredential,
  f: (accessToken: string) => Promise<T>,
  pathname: string
): Promise<T | null> {
  const navigate = useNavigate();

  const now = new Date();

  if (credential.expiresAt < now) {
    navigate(`/?redirect=${encodeURIComponent(pathname)}`, {
      replace: true,
    });
    return null;
  }

  const response = await f(credential.accessToken);

  if (null !== response) return response;

  navigate(`/?redirect=${encodeURIComponent(pathname)}`, {
    replace: true,
  });
  return null;
}
