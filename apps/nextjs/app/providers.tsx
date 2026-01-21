'use client'

import { ThemeProvider } from "@/providers/theme-provider";
import { MelonyProvider } from "@melony/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MelonyClient } from "melony/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ReactNode } from "react";
import { FoodEvent } from "./agents/food-agent";

export interface ProvidersProps {
  children: ReactNode;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});


const melonyClient = new MelonyClient<FoodEvent>({
  url: "/api/chat",
})

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <MelonyProvider client={melonyClient}>
      <ThemeProvider>
        <QueryClientProvider client={defaultQueryClient}>
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </QueryClientProvider>
      </ThemeProvider>
    </MelonyProvider>
  );
};