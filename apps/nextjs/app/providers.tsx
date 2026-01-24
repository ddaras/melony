'use client'

import { ThemeProvider } from "@/providers/theme-provider";
import { MelonyProvider } from "@melony/react";
import { MelonyUIProvider } from "@melony/ui-kit/client";
import { melonyUIImplementation } from "@/app/melony-ui-impl";
import { MelonyClient } from "melony/client";
import { ReactNode } from "react";
import { FoodEvent } from "./agents/food-agent";

export interface ProvidersProps {
  children: ReactNode;
}

const melonyClient = new MelonyClient<FoodEvent>({
  url: "/api/chat",
})

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <MelonyProvider client={melonyClient}>
      <MelonyUIProvider components={melonyUIImplementation}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </MelonyUIProvider>
    </MelonyProvider>
  );
};