import React, { useState } from "react";
import { Field, Input } from "@headlessui/react";
import { useAuth } from "../hooks/useAuth";
import { EmailSignupModal } from "../components/Auth/EmailSignupModal";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import styles from "./Landing.module.css";

const Landing = () => {
  const { loginWithGoogle, loginWithApple, loginWithEmail, isLoading, error } =
    useAuth();

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
    } catch (err) {
      console.error("Apple login failed:", err);
    }
  };

  const handleEmailSignup = () => {
    setIsEmailModalOpen(true);
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setLoginError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");

    try {
      await loginWithEmail(loginForm.email, loginForm.password);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* App Logo and Title */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎵</span>
          </div>
          <Text variant="headline" color="inverse" align="center">
            Banger
          </Text>
          <Text variant="body" color="secondary" align="center">
            Your music, everywhere
          </Text>
        </div>

        {/* Error Message */}
        {(error || loginError) && (
          <div className={styles.errorContainer}>
            <Text variant="caption" color="error" align="center">
              {error || loginError}
            </Text>
          </div>
        )}

        {/* Email Login Form */}
        <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
          <Field className={styles.inputGroup}>
            <Input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginInputChange}
              placeholder="Email"
              className={styles.input}
              required
              disabled={isLoading || isLoginLoading}
            />
          </Field>
          <Field className={styles.inputGroup}>
            <Input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginInputChange}
              placeholder="Password"
              className={styles.input}
              required
              disabled={isLoading || isLoginLoading}
            />
          </Field>
          <Button
            type="submit"
            disabled={isLoading || isLoginLoading}
            loading={isLoginLoading}
            variant="apple"
            fullWidth
          >
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <Text variant="caption" color="muted">
            or continue with
          </Text>
          <div className={styles.dividerLine} />
        </div>

        {/* OAuth Providers */}
        <div className={styles.oauthOptions}>
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading || isLoginLoading}
            variant="secondary"
            fullWidth
            leftIcon={
              <svg className={styles.buttonIcon} viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Google
          </Button>

          <Button
            onClick={handleAppleLogin}
            disabled={isLoading || isLoginLoading}
            variant="apple"
            fullWidth
            leftIcon={
              <svg
                className={styles.buttonIcon}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            }
          >
            Apple
          </Button>
        </div>

        {/* Signup Link */}
        <div className={styles.signupLink}>
          <Text variant="body" color="secondary" align="center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleEmailSignup}
              className={styles.linkButton}
            >
              Sign up
            </button>
          </Text>
        </div>
      </div>

      {/* Email Signup Modal */}
      <EmailSignupModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};

export default Landing;
