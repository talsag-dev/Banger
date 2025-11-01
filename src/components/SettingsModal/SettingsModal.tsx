import React, { useState, useMemo, useCallback } from "react";
import { Field, Input, Switch } from "@headlessui/react";
import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
import { useAuth } from "@hooks/useAuth";
import { useUpdateProfile } from "@hooks/useUpdateProfile";
import type { SettingsModalProps, UserSettings } from "./types";
import {
  getDefaultSettings,
  getSettingItems,
  updateSetting,
  saveSettings,
} from "./utils";
import styles from "./SettingsModal.module.css";

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings = getDefaultSettings(),
  onSettingsChange,
}) => {
  const { user } = useAuth();
  const {
    mutateAsync: updateProfile,
    isPending: isUpdatingProfile,
    error: updateProfileError,
  } = useUpdateProfile();
  const [currentSettings, setCurrentSettings] =
    useState<UserSettings>(settings);
  const [username, setUsername] = useState(user?.username || "");
  const settingItems = useMemo(() => getSettingItems(), []);

  const handleSettingChange = useCallback(
    (settingId: keyof UserSettings, value: boolean) => {
      setCurrentSettings((prevSettings) => {
        const newSettings = updateSetting(prevSettings, settingId, value);
        return newSettings;
      });
    },
    []
  );

  const handleSave = useCallback(async () => {
    try {
      if (username !== user?.username) {
        await updateProfile({ username });
      }

      await saveSettings(currentSettings);
      onSettingsChange?.(currentSettings);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  }, [
    currentSettings,
    username,
    user?.username,
    updateProfile,
    onSettingsChange,
    onClose,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="md">
      <div className={styles.settingsList}>
        <div className={styles.profileSection}>
          <h3 className={styles.sectionTitle}>Profile</h3>
          <Field className={styles.inputGroup}>
            <label htmlFor="username" className={styles.inputLabel}>
              Username
            </label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
              className={styles.input}
              placeholder="Enter your username"
              disabled={isUpdatingProfile}
            />
            {updateProfileError && (
              <span className={styles.errorText}>
                {updateProfileError instanceof Error
                  ? updateProfileError.message
                  : "Failed to update profile"}
              </span>
            )}
          </Field>
        </div>

        {/* Settings Section */}
        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>Preferences</h3>
          {settingItems.map((item) => (
            <div key={item.id} className={styles.settingItem}>
              <div className={styles.settingItemContainer}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingLabel}>{item.label}</span>
                  {item.description && (
                    <span className={styles.settingDescription}>
                      {item.description}
                    </span>
                  )}
                </div>
                <Switch
                  checked={currentSettings[item.id]}
                  onChange={(checked) => handleSettingChange(item.id, checked)}
                  className={styles.settingSwitch}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.settingsActions}>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Modal>
  );
};
