import { http } from "@utils/http";
import type { UserSettings, SettingItem } from "./types";

export const getDefaultSettings = (): UserSettings => ({
  showCurrentlyListening: true,
  allowReactions: true,
  allowComments: true,
});

export const getSettingItems = (): SettingItem[] => [
  {
    id: "showCurrentlyListening",
    label: "Show what I'm currently listening to",
    description: "Let friends see your live music activity",
  },
  {
    id: "allowReactions",
    label: "Allow reactions on my posts",
    description: "Friends can react to your music posts",
  },
  {
    id: "allowComments",
    label: "Allow comments on my posts",
    description: "Friends can comment on your music posts",
  },
];

export const updateSetting = (
  currentSettings: UserSettings,
  settingId: keyof UserSettings,
  value: boolean
): UserSettings => ({
  ...currentSettings,
  [settingId]: value,
});

export const saveSettings = async (settings: UserSettings): Promise<void> => {
  try {
    // In a real app, this would save to backend
    // Using central HTTP client for consistency
    await http(`/user/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });

    console.log("Settings saved successfully");
  } catch (error) {
    console.error("Failed to save settings:", error);
    throw error;
  }
};
