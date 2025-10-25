import type { ReactNode, ElementType } from "react";

export interface TextProps {
  children: ReactNode;
  variant?:
    | "headline"
    | "subheadline"
    | "title"
    | "subtitle"
    | "body"
    | "caption"
    | "overline";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?:
    | "primary"
    | "secondary"
    | "muted"
    | "inverse"
    | "success"
    | "warning"
    | "error";
  align?: "left" | "center" | "right" | "justify";
  as?: ElementType;
  className?: string;
  truncate?: boolean;
  "data-testid"?: string;
}
