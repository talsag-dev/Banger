import React from "react";
import { clsx } from "clsx";
import type { TextProps } from "./types";
import styles from "./Text.module.css";

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  size,
  weight,
  color = "primary",
  align = "left",
  as: Component = "p",
  className,
  truncate = false,
  "data-testid": testId,
  ...rest
}) => {
  const variantClasses = {
    headline: styles.variantHeadline,
    subheadline: styles.variantSubheadline,
    title: styles.variantTitle,
    subtitle: styles.variantSubtitle,
    body: styles.variantBody,
    caption: styles.variantCaption,
    overline: styles.variantOverline,
  };

  const sizeClasses = {
    xs: styles.sizeXs,
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    xl: styles.sizeXl,
    "2xl": styles.size2xl,
    "3xl": styles.size3xl,
  };

  const weightClasses = {
    light: styles.weightLight,
    normal: styles.weightNormal,
    medium: styles.weightMedium,
    semibold: styles.weightSemibold,
    bold: styles.weightBold,
  };

  const colorClasses = {
    primary: styles.colorPrimary,
    secondary: styles.colorSecondary,
    muted: styles.colorMuted,
    inverse: styles.colorInverse,
    success: styles.colorSuccess,
    warning: styles.colorWarning,
    error: styles.colorError,
  };

  const alignClasses = {
    left: styles.alignLeft,
    center: styles.alignCenter,
    right: styles.alignRight,
    justify: styles.alignJustify,
  };

  // Auto-select appropriate HTML element based on variant
  const getDefaultElement = () => {
    switch (variant) {
      case "headline":
        return "h1";
      case "subheadline":
        return "h2";
      case "title":
        return "h3";
      case "subtitle":
        return "h4";
      case "overline":
        return "span";
      case "caption":
        return "small";
      default:
        return "p";
    }
  };

  const ElementComponent = Component === "p" ? getDefaultElement() : Component;

  const textClasses = clsx(
    styles.text,
    variantClasses[variant],
    size && sizeClasses[size],
    weight && weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    {
      [styles.truncate]: truncate,
    },
    className
  );

  return (
    <ElementComponent className={textClasses} data-testid={testId} {...rest}>
      {children}
    </ElementComponent>
  );
};
