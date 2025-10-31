import React from "react";
import { Text } from "../Text";
import styles from "./Loading.module.css";

type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
  className?: string;
};

export const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  fullScreen = false,
  className,
}) => {
  const containerClassName = [
    styles.container,
    fullScreen ? styles.fullScreen : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      <div className={styles.spinner} />
      {message && (
        <Text variant="body" color="muted">
          {message}
        </Text>
      )}
    </div>
  );
};
