import type { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";

type PolymorphicProps<T extends ElementType> = {
  as?: T;
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
  className?: string;
  truncate?: boolean;
  "data-testid"?: string;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children" | "as">;

export type TextProps<T extends ElementType = "p"> = PolymorphicProps<T>;
