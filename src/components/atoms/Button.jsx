import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  children, 
  disabled,
  ...props 
}, ref) => {
const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 border-0",
    secondary: "bg-gradient-to-r from-secondary to-green-600 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-2xl hover:shadow-green-500/25 border-0",
    accent: "bg-gradient-to-r from-accent to-red-600 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-2xl hover:shadow-red-500/25 border-0",
    outline: "border-2 border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 shadow-md hover:shadow-lg",
    ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:shadow-md",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-2xl hover:shadow-red-500/25 border-0"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  return (
    <button
className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.05] active:scale-[0.95] accessible-button interactive-element",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;