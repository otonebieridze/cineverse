import type { ComponentProps } from "react";

export const ACCENT_BUTTON_CLASS_NAME =
  "rounded-full bg-accent font-medium text-accent-foreground transition-opacity hover:opacity-90";

type ButtonProps = Pick<
  ComponentProps<"button">,
  "type" | "onClick" | "disabled" | "children" | "className"
>;

export function Button({ type = "button", className = "", ...props }: ButtonProps) {
  return (
    <button type={type} className={`${ACCENT_BUTTON_CLASS_NAME} ${className}`} {...props} />
  );
}
