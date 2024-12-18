"use server";

export function getAuthorizationUrl(origin: string, state: string): string {
  const CLIENT_ID = process.env["DISCORD_CLIENT_ID"];

  if (undefined === CLIENT_ID)
    throw new Error("No 'DISCORD_CLIENT_ID' found in environment variables.");

  const baseUrl = new URL("https://discord.com/oauth2/authorize");
  const scopes = [
    "email",
    "identify",
    "guilds",
    "messages.read",
    "guilds.members.read",
    // "dm_channels.read",
  ];
  const scope = scopes.join(" ");

  baseUrl.searchParams.append("client_id", CLIENT_ID);
  baseUrl.searchParams.append("scope", scope);
  baseUrl.searchParams.append("redirect_uri", origin);
  baseUrl.searchParams.append("response_type", "token");
  baseUrl.searchParams.append("state", state);

  return baseUrl.toString();
}
