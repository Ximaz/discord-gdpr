"use server";

type DiscordUserAvatarDecorationData = {
  asset: string;
  sku_id: string;
};

export type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  avatar_decoration_data?: DiscordUserAvatarDecorationData;
};

export async function getUser(
  accessToken: string
): Promise<DiscordUser | null> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (401 === response.status)
    return null;

  return response.json();
}
