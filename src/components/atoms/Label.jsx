import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800",
        className
      )}
      {...props}
    />
  );
});

Label.displayName = "Label";

export default Label;