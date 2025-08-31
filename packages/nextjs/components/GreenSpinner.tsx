"use client";

interface GreenSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "green" | "emerald" | "teal";
  className?: string;
}

export const GreenSpinner = ({ size = "md", color = "green", className = "" }: GreenSpinnerProps) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorClasses = {
    green: "border-green-600",
    emerald: "border-emerald-600",
    teal: "border-teal-600",
  };

  // lightColorClasses se define en GreenSpinnerLight

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Cargando..."
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

// Variante para fondos oscuros
export const GreenSpinnerLight = ({ size = "md", color = "green", className = "" }: GreenSpinnerProps) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const lightColorClasses = {
    green: "border-green-200",
    emerald: "border-emerald-200",
    teal: "border-teal-200",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${lightColorClasses[color]} ${className}`}
      role="status"
      aria-label="Cargando..."
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};
