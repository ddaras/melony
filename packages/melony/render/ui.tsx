import {
  Avatar,
  BooleanFormField,
  Button,
  Card,
  CardContent,
  Chip,
  CodeBlock,
  ComboboxFormField,
  DataTable,
  DateFormField,
  Form,
  Heading,
  MelonyProvider,
  ModalButton,
  MutationContainer,
  NumberFormField,
  PasswordFormField,
  QueryContainer,
  RootLayout,
  SelectFormField,
  Spacer,
  Stack,
  Step,
  Stepper,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  TextareaFormField,
  TextFormField,
  ThemeToggle,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
  Progress,
  Loader,
} from "@melony/ui";
import { compile } from "../builder/compile";
import { UIConfig } from "../builder/types";
import { validate } from "../builder/validate";
import React from "react";

export const renderUI = (config: UIConfig) => {
  const compiled = compile(config);

  if (!validate(compiled)) {
    throw new Error("Invalid config");
  }

  if (compiled.type === "root") {
    return (
      <RootLayout
        shouldRenderHtml={compiled.shouldRenderHtml}
        className={compiled.className}
      >
        <MelonyProvider navigate={compiled.navigate}>
          {compiled.children}
        </MelonyProvider>
      </RootLayout>
    );
  }

  if (compiled.type === "stack") {
    return (
      <Stack direction={compiled.direction} className={compiled.className}>
        {Array.isArray(compiled.children)
          ? compiled.children.map((child, index) => (
              <React.Fragment key={`stack-child-${index}`}>
                {child}
              </React.Fragment>
            ))
          : compiled.children}
      </Stack>
    );
  }

  if (config.type === "table") {
    return <DataTable columns={config.columns} data={config.data} />;
  }

  if (config.type === "form") {
    return (
      <Form
        onSubmit={config.onSubmit || (() => Promise.resolve())}
        defaultValues={config.defaultValues}
      >
        {Array.isArray(config.children)
          ? config.children.map((child, index) => (
              <React.Fragment key={`stack-child-${index}`}>
                {child}
              </React.Fragment>
            ))
          : config.children}
      </Form>
    );
  }

  if (config.type === "tabs") {
    return (
      <Tabs defaultValue={config.tabs[0].label} className={config.className}>
        <TabsList>
          {config.tabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {config.tabs.map((tab) => (
          <TabsContent key={tab.label} value={tab.label}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  if (config.type === "form-text-field") {
    return (
      <TextFormField
        field={{
          name: config.name,
          label: config.label,
          type: "text",
          config: {},
        }}
        className={config.className}
      />
    );
  }

  if (config.type === "form-combobox-field") {
    return (
      <ComboboxFormField
        field={{
          name: config.name,
          label: config.label,
          type: "combobox",
          config: {
            options: config.options || [],
          },
        }}
        onSearch={config.onSearch}
        isLoading={config.isLoading}
        className={config.className}
      />
    );
  }

  if (config.type === "form-date-field") {
    return (
      <DateFormField
        field={{
          name: config.name,
          label: config.label,
          type: "date",
          config: {},
        }}
        className={config.className}
      />
    );
  }

  if (config.type === "button") {
    return (
      <Button
        type={config.submit ? "submit" : "button"}
        variant={config.variant}
        disabled={config.disabled || config.isLoading}
        className={config.className}
        onClick={config.onClick}
      >
        {config.isLoading ? "Loading..." : config.label}
      </Button>
    );
  }

  if (config.type === "mutation") {
    return (
      <MutationContainer
        action={config.action}
        render={config.render}
        mutationKey={config.mutationKey}
        onSuccess={config.onSuccess}
        onError={config.onError}
        onSettled={config.onSettled}
      />
    );
  }

  if (config.type === "query") {
    return (
      <QueryContainer
        action={config.action}
        render={config.render}
        queryKey={config.queryKey}
      />
    );
  }

  if (config.type === "text") {
    return <Text className={config.className}>{config.content}</Text>;
  }

  if (config.type === "heading") {
    return (
      <Heading
        variant={config.variant || "h1"}
        className={config.className}
        content={config.content}
      />
    );
  }

  if (config.type === "avatar") {
    return (
      <Avatar
        src={config.src || ""}
        name={config.name}
        className={config.className}
      />
    );
  }

  if (config.type === "chip") {
    return (
      <Chip
        label={config.label}
        variant={config.variant}
        className={config.className}
      />
    );
  }

  if (config.type === "modal") {
    return (
      <ModalButton
        label={config.label}
        title={config.title}
        description={config.description}
        content={config.content}
      />
    );
  }

  if (config.type === "code-block") {
    return (
      // @ts-ignore - React 19 compatibility issue
      <CodeBlock
        title={config.title}
        lang={config.lang}
        className={config.className}
        keepBackground={config.keepBackground}
        allowCopy={config.allowCopy}
      >
        {config.code}
      </CodeBlock>
    );
  }

  if (config.type === "theme-toggle") {
    return <ThemeToggle className={config.className} />;
  }

  if (config.type === "card") {
    return (
      <Card>
        <CardContent className={config.className}>
          {Array.isArray(config.children)
            ? config.children.map((child, index) => (
                <React.Fragment key={`card-child-${index}`}>
                  {child}
                </React.Fragment>
              ))
            : config.children}
        </CardContent>
      </Card>
    );
  }

  if (config.type === "spacer") {
    return <Spacer className={config.className} />;
  }

  if (config.type === "stepper") {
    return (
      <div className="w-full">
        <Stepper activeStep={config.activeStep || 0} className="w-full">
          {config.steps.map((step, index) => (
            <Step
              key={index}
              index={index}
              title={step.title}
              description={step.description}
              showConnector={step.showConnector}
            />
          ))}
        </Stepper>
      </div>
    );
  }

  if (config.type === "form-boolean-field") {
    return (
      <BooleanFormField
        field={{ name: config.name, label: config.label, type: "boolean" }}
        className={config.className}
      />
    );
  }

  if (config.type === "form-number-field") {
    return (
      <NumberFormField
        field={{ name: config.name, label: config.label, type: "number" }}
        className={config.className}
      />
    );
  }

  if (config.type === "form-password-field") {
    return (
      <PasswordFormField
        field={{ name: config.name, label: config.label, type: "password" }}
        className={config.className}
      />
    );
  }

  if (config.type === "form-select-field") {
    return (
      <SelectFormField
        field={{ name: config.name, label: config.label, type: "select" }}
        className={config.className}
      />
    );
  }

  if (config.type === "form-textarea-field") {
    return (
      <TextareaFormField
        field={{ name: config.name, label: config.label, type: "textarea" }}
        className={config.className}
      />
    );
  }

  if (config.type === "tooltip") {
    return (
      // @ts-ignore - React 19 compatibility issue
      <TooltipProvider>
        {/* @ts-ignore - React 19 compatibility issue */}
        <Tooltip>
          {/* @ts-ignore - React 19 compatibility issue */}
          <TooltipTrigger asChild>{config.children}</TooltipTrigger>
          {/* @ts-ignore - React 19 compatibility issue */}
          <TooltipContent
            side={config.side}
            align={config.align}
            className={config.className}
          >
            {config.content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (config.type === "loader") {
    return <Loader className={config.className} />;
  }

  if (config.type === "progress") {
    return <Progress value={config.value} className={config.className} />;
  }

  return null;
};
