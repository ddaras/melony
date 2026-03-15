type AnalyticsProvider = "plausible" | "posthog" | "vercel" | "none";

function getProvider(): AnalyticsProvider {
  const raw = (import.meta.env.VITE_ANALYTICS_PROVIDER ?? "none")
    .toString()
    .trim()
    .toLowerCase();

  if (raw === "plausible" || raw === "posthog" || raw === "vercel") {
    return raw;
  }

  return "none";
}

export function trackPageView(pathname: string): void {
  const provider = getProvider();

  if (provider === "plausible") {
    const plausible = (
      window as Window & {
        plausible?: (eventName: string, options?: Record<string, unknown>) => void;
      }
    ).plausible;

    plausible?.("pageview", { props: { pathname } });
    return;
  }

  if (provider === "posthog") {
    const posthog = (
      window as Window & {
        posthog?: { capture: (eventName: string, props?: Record<string, unknown>) => void };
      }
    ).posthog;

    posthog?.capture("pageview", { pathname });
  }
}
