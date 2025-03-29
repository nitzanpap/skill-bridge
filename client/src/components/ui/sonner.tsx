import * as React from "react";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const theme = "light"; // You can customize this or make it dynamic later

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
