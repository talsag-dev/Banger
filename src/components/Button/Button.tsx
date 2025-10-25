import React from "react";
import { clsx } from "clsx";
import { Button as HeadlessButton } from "@headlessui/react";
import type { ButtonProps } from "./types";
import styles from "./Button.module.css";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onClick,
  className,
  "data-testid": testId,
  ...rest
}) => {
  const variantClasses = {
    primary: styles.variantPrimary,
    secondary: styles.variantSecondary,
    danger: styles.variantDanger,
    ghost: styles.variantGhost,
    spotify: styles.variantSpotify,
    apple: styles.variantApple,
  };

  const sizeClasses = {
    xs: styles.sizeXs,
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const buttonClasses = clsx(
    styles.button,
    variantClasses[variant],
    sizeClasses[size],
    {
      [styles.fullWidth]: fullWidth,
      [styles.loading]: loading,
      [styles.disabled]: disabled,
    },
    className
  );

  return (
    <HeadlessButton
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      data-testid={testId}
      {...rest}
    >
      {loading && <div className={styles.loadingSpinner} />}
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      {children && <span className={styles.content}>{children}</span>}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </HeadlessButton>
  );
};
