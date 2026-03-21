type Variant = "primary" | "secondary" | "success" | "error" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  neutral: "bg-gray-100 text-text-muted",
};

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
