import type { ReactNode } from "react";
import { Music } from "lucide-react";
import { clsx } from "clsx";
import styles from "./Card.module.css";

export interface CardProps {
  image?: string;
  imageAlt?: string;
  imagePlaceholder?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "noImage" | "fullPadding";
}

export const Card: React.FC<CardProps> = ({
  image,
  imageAlt,
  imagePlaceholder,
  children,
  className,
  onClick,
  variant = "default",
}) => {
  return (
    <div
      className={clsx(
        styles.card,
        {
          [styles.noImage]: variant === "noImage",
          [styles.fullPadding]: variant === "fullPadding",
        },
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {image || imagePlaceholder ? (
        <div className={styles.cardImageContainer}>
          {image ? (
            <img
              src={image}
              alt={imageAlt || ""}
              className={styles.cardImage}
            />
          ) : (
            <div className={styles.cardImagePlaceholder}>
              {imagePlaceholder || <Music size={32} />}
            </div>
          )}
        </div>
      ) : null}
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
};
