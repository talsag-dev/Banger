import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./EmailSignupModal.module.css";

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailSignupModal: React.FC<EmailSignupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    username: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { signUpWithEmail } = useAuth();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ email: "", password: "", displayName: "", username: "" });
      setFormError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (!formData.displayName.trim()) {
        setFormError("Display name is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.username.trim()) {
        setFormError("Username is required");
        setIsSubmitting(false);
        return;
      }
      await signUpWithEmail(
        formData.email,
        formData.password,
        formData.displayName,
        formData.username
      );
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create your account</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="displayName" className={styles.label}>
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your display name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {formError && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{formError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Please wait..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};
