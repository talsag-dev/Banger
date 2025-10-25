import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "../Button";
import { clsx } from "clsx";
import type { ModalProps } from "./types";
import styles from "./Modal.module.css";

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    xl: styles.sizeXl,
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className={styles.modalDialog}>
        <TransitionChild
          enter={styles.backdropEnter}
          enterFrom={styles.backdropEnterFrom}
          enterTo={styles.backdropEnterTo}
          leave={styles.backdropLeave}
          leaveFrom={styles.backdropLeaveFrom}
          leaveTo={styles.backdropLeaveTo}
        >
          <div className={styles.modalBackdrop} />
        </TransitionChild>

        <div className={styles.modalContainer}>
          <TransitionChild
            enter={styles.panelEnter}
            enterFrom={styles.panelEnterFrom}
            enterTo={styles.panelEnterTo}
            leave={styles.panelLeave}
            leaveFrom={styles.panelLeaveFrom}
            leaveTo={styles.panelLeaveTo}
          >
            <DialogPanel
              className={clsx(styles.modalPanel, sizeClasses[size], className)}
            >
              {(title || showCloseButton) && (
                <div className={styles.modalHeader}>
                  {title && (
                    <DialogTitle className={styles.modalTitle}>
                      {title}
                    </DialogTitle>
                  )}
                  {showCloseButton && (
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      size="sm"
                      leftIcon={<X size={20} />}
                      className={styles.modalClose}
                    />
                  )}
                </div>
              )}
              <div className={styles.modalContent}>{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
