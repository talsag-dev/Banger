export interface ButtonProps {
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "icon"
    | "spotify"
    | "apple";
  size?: "xs" | "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "data-testid"?: string;
}
