import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Switch } from "@headlessui/react";
import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
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
  const [currentSettings, setCurrentSettings] =
    useState<UserSettings>(settings);
  const settingItems = useMemo(() => getSettingItems(), []);

  // Only update settings when the modal opens, not on every settings change
  useEffect(() => {
    if (isOpen) {
      setCurrentSettings(settings);
    }
  }, [isOpen, settings]);

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
      await saveSettings(currentSettings);
      onSettingsChange?.(currentSettings);
      onClose();
    } catch {
      // Handle error state - could show toast notification
    }
  }, [currentSettings, onSettingsChange, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="md">
      <div className={styles.settingsList}>
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
      <div className={styles.settingsActions}>
        <Button variant="primary" size="md" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </Modal>
  );
};
