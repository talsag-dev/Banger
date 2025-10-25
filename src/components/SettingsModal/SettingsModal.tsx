import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Switch,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "../Button";
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
    React.useState<UserSettings>(settings);
  const settingItems = React.useMemo(() => getSettingItems(), []);

  // Only update settings when the modal opens, not on every settings change
  React.useEffect(() => {
    if (isOpen) {
      setCurrentSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSettingChange = React.useCallback((
    settingId: keyof UserSettings,
    value: boolean
  ) => {
    setCurrentSettings(prevSettings => {
      const newSettings = updateSetting(prevSettings, settingId, value);
      return newSettings;
    });
  }, []);

  const handleSave = React.useCallback(async () => {
    try {
      await saveSettings(currentSettings);
      onSettingsChange?.(currentSettings);
      onClose();
    } catch {
      // Handle error state - could show toast notification
    }
  }, [currentSettings, onSettingsChange, onClose]);

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className={styles.modalDialog}>
        <TransitionChild
          enter={styles.modalBackdropEnter}
          enterFrom={styles.modalBackdropEnterFrom}
          enterTo={styles.modalBackdropEnterTo}
          leave={styles.modalBackdropLeave}
          leaveFrom={styles.modalBackdropLeaveFrom}
          leaveTo={styles.modalBackdropLeaveTo}
        >
          <div className={styles.modalBackdrop} />
        </TransitionChild>

        <div className={styles.modalContainer}>
          <TransitionChild
            enter={styles.modalPanelEnter}
            enterFrom={styles.modalPanelEnterFrom}
            enterTo={styles.modalPanelEnterTo}
            leave={styles.modalPanelLeave}
            leaveFrom={styles.modalPanelLeaveFrom}
            leaveTo={styles.modalPanelLeaveTo}
          >
            <DialogPanel className={styles.modalPanel}>
              <div className={styles.modalHeader}>
                <DialogTitle className={styles.modalTitle}>
                  Settings
                </DialogTitle>
                <Button 
                  onClick={onClose} 
                  variant="ghost" 
                  size="sm"
                  leftIcon={<X size={20} />}
                  className={styles.modalClose}
                />
              </div>
              <div className={styles.modalContent}>
                <div className={styles.settingsList}>
                  {settingItems.map((item) => (
                    <div key={item.id} className={styles.settingItem}>
                      <div className={styles.settingItemContainer}>
                        <div className={styles.settingInfo}>
                          <span className={styles.settingLabel}>
                            {item.label}
                          </span>
                          {item.description && (
                            <span className={styles.settingDescription}>
                              {item.description}
                            </span>
                          )}
                        </div>
                        <Switch
                          checked={currentSettings[item.id]}
                          onChange={(checked) =>
                            handleSettingChange(item.id, checked)
                          }
                          className={styles.settingSwitch}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.settingsActions}>
                  <Button
                    variant="primary"
                    size="md"
                    className={styles.settingsSaveBtn}
                    onClick={handleSave}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
