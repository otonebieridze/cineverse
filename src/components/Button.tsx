import type { ComponentProps } from "react";

type ButtonProps = Pick<
  ComponentProps<"button">,
  "type" | "onClick" | "disabled" | "children" | "className"
>;

export function Button({ type = "button", className = "", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-full bg-accent font-medium text-accent-foreground transition-opacity hover:opacity-90 ${className}`}
      {...props}
    />
  );
}
