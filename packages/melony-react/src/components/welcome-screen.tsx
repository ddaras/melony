import React from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { IconBrandGoogle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface WelcomeScreenProps {
  title?: string;
  description?: string;
  features?: { title: string; description: string }[];
  className?: string;
  onLoginClick?: () => void;
  termsUrl?: string;
  privacyUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function WelcomeScreen({
  title = "Welcome to Melony",
  description = "The most powerful AI agent framework for building modern applications. Connect your tools, build your brain, and ship faster.",
  features = [
    {
      title: "Context Aware",
      description: "Built-in state management for complex LLM flows.",
    },
    {
      title: "Extensible",
      description: "Plugin architecture for easy integrations.",
    },
    {
      title: "Real-time",
      description: "Streaming responses and live state updates.",
    },
    {
      title: "Tool-ready",
      description: "Ready-to-use actions for common tasks.",
    },
  ],
  className,
  onLoginClick,
  termsUrl = "#",
  privacyUrl = "#",
  imageUrl,
  imageAlt = "Product screenshot",
}: WelcomeScreenProps) {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      login();
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-[600px] h-full w-full flex-col md:flex-row bg-background overflow-hidden",
        className
      )}
    >
      {/* Left side: Introduction */}
      <div className="flex w-8/12 flex-col bg-sidebar text-foreground relative overflow-hidden">
        {/* Decorative background element - these are now contained by overflow-hidden */}
        <div className="absolute -top-24 -left-24 size-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 size-96 bg-primary/5 rounded-full blur-3xl" />

        {/* Scrollable content wrapper */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 flex flex-col p-8 md:p-12 lg:p-20">
          <div className="max-w-xl mx-auto w-full my-auto">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
              {title}
            </h1>
            <p className="mb-12 text-lg text-muted-foreground md:text-xl leading-relaxed">
              {description}
            </p>

            {imageUrl && (
              <div className="mb-12 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="relative rounded-xl border border-border/50 shadow-2xl transition-transform duration-500 hover:scale-[1.02] w-full"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              {features.map((feature, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login */}
      <div className="flex w-4/12 flex-col overflow-y-auto p-8 md:p-12 lg:p-20 bg-background transition-colors duration-300">
        <div className="w-full max-w-sm space-y-8 my-auto mx-auto">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Get Started</h2>
            <p className="text-muted-foreground text-lg">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 border-2 font-medium bg-background text-foreground hover:bg-accent"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <IconBrandGoogle className="size-6" />
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground tracking-widest font-medium">
                  Secure access
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed text-center md:text-left">
            By continuing, you agree to our <br className="hidden md:block" />
            <a
              href={termsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary transition-colors font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href={privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary transition-colors font-medium"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

