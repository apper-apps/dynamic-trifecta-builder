import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  children, 
  disabled,
  ...props 
}, ref) => {
return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;