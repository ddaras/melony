import { ThemeProvider } from "next-themes";
import React from "react";

export type RootLayoutProps = {
  children: React.ReactNode;
  shouldRenderHtml?: boolean;
  className?: string;
};

export const RootLayout = ({
  children,
  shouldRenderHtml = false,
  className,
}: RootLayoutProps) => {
  if (shouldRenderHtml) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`antialiased ${className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {Array.isArray(children)
              ? children.map((child, index) => (
                  <React.Fragment key={index}>{child}</React.Fragment>
                ))
              : children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className={`antialiased ${className}`}>
        {Array.isArray(children)
          ? children.map((child, index) => (
              <React.Fragment key={index}>{child}</React.Fragment>
            ))
          : children}
      </div>
    </ThemeProvider>
  );
};
