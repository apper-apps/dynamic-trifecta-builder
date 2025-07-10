import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;