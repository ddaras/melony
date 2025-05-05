"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const stepperVariants = cva("flex w-full items-center", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col gap-2",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const stepIconVariants = cva(
  "relative flex items-center justify-center rounded-full border transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary",
        ghost: "border-muted",
        outline: "border-input",
      },
      state: {
        active: "bg-primary text-primary-foreground",
        completed: "bg-primary text-primary-foreground",
        disabled: "bg-muted border-muted-foreground/20 text-muted-foreground",
        waiting: "bg-background text-muted-foreground",
      },
      size: {
        default: "h-8 w-8 text-sm",
        sm: "h-6 w-6 text-xs",
        lg: "h-10 w-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "waiting",
      size: "default",
    },
  }
);

const stepContentVariants = cva("flex flex-col", {
  variants: {
    orientation: {
      horizontal: "text-left w-full",
      vertical: "items-start justify-start text-left",
    },
    state: {
      active: "text-foreground",
      completed: "text-foreground",
      disabled: "text-muted-foreground",
      waiting: "text-muted-foreground",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    state: "waiting",
  },
});

const stepConnectorVariants = cva("flex-1 w-full transition-colors", {
  variants: {
    orientation: {
      horizontal: "h-[1px] mx-2",
      vertical: "w-[1px] my-2 self-center",
    },
    state: {
      active: "bg-primary",
      completed: "bg-primary",
      disabled: "bg-muted-foreground/20",
      waiting: "bg-muted",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    state: "waiting",
  },
});

interface StepperContextValue {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  variant: "default" | "ghost" | "outline";
  size: "default" | "sm" | "lg";
}

const StepperContext = React.createContext<StepperContextValue>({
  activeStep: 0,
  orientation: "horizontal",
  variant: "default",
  size: "default",
});

function useStepperContext() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("useStepperContext must be used within a Stepper");
  }
  return context;
}

interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof stepperVariants>, "orientation"> {
  activeStep?: number;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  orientation?: "horizontal" | "vertical";
}

function Stepper({
  className,
  activeStep = 0,
  orientation = "horizontal",
  variant = "default",
  size = "default",
  ...props
}: StepperProps) {
  const contextValue = React.useMemo(
    () => ({ activeStep, orientation, variant, size }),
    [activeStep, orientation, variant, size]
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={cn(stepperVariants({ orientation, className }), "w-full justify-between")}
        {...props}
      />
    </StepperContext.Provider>
  );
}
Stepper.displayName = "Stepper";

interface StepProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  index?: number;
  state?: "active" | "completed" | "disabled" | "waiting";
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showConnector?: boolean;
}

function Step({
  className,
  index,
  state: propState,
  icon,
  title,
  description,
  showConnector = true,
  children,
  ...props
}: StepProps) {
  const { activeStep, orientation, variant, size } = useStepperContext();

  const state = React.useMemo(() => {
    if (propState) return propState;
    if (index === undefined) return "waiting";

    if (index < activeStep) return "completed";
    if (index === activeStep) return "active";
    if (index > activeStep) return "waiting";

    return "waiting";
  }, [activeStep, index, propState]);

  return (
    <div
      className={cn(
        "flex flex-1",
        orientation === "horizontal"
          ? "flex-col"
          : "flex-row items-start gap-3",
        className
      )}
      {...props}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center w-full mb-2">
          <StepIcon state={state} variant={variant} size={size}>
            {state === "completed" && !icon ? (
              <Check className="h-4 w-4" />
            ) : (
              icon || (index !== undefined ? index + 1 : null)
            )}
          </StepIcon>

          {showConnector && (
            <StepConnector orientation={orientation} state={state} />
          )}
        </div>

        {(title || description) && (
          <StepContent orientation={orientation} state={state} className="ml-0">
            {title && <StepTitle>{title}</StepTitle>}
            {description && <StepDescription>{description}</StepDescription>}
          </StepContent>
        )}
      </div>

      {children}
    </div>
  );
}
Step.displayName = "Step";

interface StepIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepIconVariants> {}

function StepIcon({
  className,
  variant,
  state,
  size,
  children,
  ...props
}: StepIconProps) {
  const ctx = useStepperContext();

  return (
    <div
      className={cn(
        stepIconVariants({
          variant: variant || ctx.variant,
          state,
          size: size || ctx.size,
          className,
        })
      )}
      {...props}
    >
      {children}
    </div>
  );
}
StepIcon.displayName = "StepIcon";

interface StepContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepContentVariants> {}

function StepContent({
  className,
  orientation,
  state,
  children,
  ...props
}: StepContentProps) {
  const ctx = useStepperContext();

  return (
    <div
      className={cn(
        stepContentVariants({
          orientation: orientation || ctx.orientation,
          state,
          className,
        })
      )}
      {...props}
    >
      {children}
    </div>
  );
}
StepContent.displayName = "StepContent";

interface StepConnectorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepConnectorVariants> {}

function StepConnector({
  className,
  orientation,
  state,
  ...props
}: StepConnectorProps) {
  const ctx = useStepperContext();

  return (
    <div
      className={cn(
        stepConnectorVariants({
          orientation: orientation || ctx.orientation,
          state,
          className,
        }),
        "flex-1 min-w-[30px]"
      )}
      {...props}
    />
  );
}
StepConnector.displayName = "StepConnector";

function StepTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm font-medium", className)} {...props} />;
}
StepTitle.displayName = "StepTitle";

function StepDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} {...props} />
  );
}
StepDescription.displayName = "StepDescription";

export {
  Stepper,
  Step,
  StepIcon,
  StepContent,
  StepConnector,
  StepTitle,
  StepDescription,
};
