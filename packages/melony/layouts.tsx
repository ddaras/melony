import React from "react";

import { Stack, RootLayout, MelonyProvider, Spacer } from "@melony/ui";

export function root({
  children,
  appName,
  navigate,
  shouldRenderHtml,
  className,
}: {
  children: React.ReactNode;
  appName: string;
  navigate?: (path: string) => void;
  shouldRenderHtml?: boolean;
  className?: string;
}) {
  return (
    <RootLayout shouldRenderHtml={shouldRenderHtml} className={className}>
      <MelonyProvider appName={appName} navigate={navigate}>
        {children}
      </MelonyProvider>
    </RootLayout>
  );
}

export function vstack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Stack className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <React.Fragment key={index}>{child}</React.Fragment>
          ))
        : children}
    </Stack>
  );
}

export function hstack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Stack direction="row" className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <React.Fragment key={index}>{child}</React.Fragment>
          ))
        : children}
    </Stack>
  );
}

export function spacer(props?: { className?: string }) {
  return <Spacer className={props?.className} />;
}
