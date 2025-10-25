export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: UserSettings;
  onSettingsChange?: (settings: UserSettings) => void;
}

export interface UserSettings {
  showCurrentlyListening: boolean;
  allowReactions: boolean;
  allowComments: boolean;
}

export interface SettingItem {
  id: keyof UserSettings;
  label: string;
  description?: string;
}
