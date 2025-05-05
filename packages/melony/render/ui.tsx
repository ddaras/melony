import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  NavigationButton,
  QueryContainer,
  RootLayout,
  Spacer,
  Stack,
  Step,
  Stepper,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  TextFormField,
  ThemeToggle,
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

  if (config.type === "navigation-button") {
    return (
      <NavigationButton
        label={config.label}
        href={config?.href || "/"}
        className={config.className}
        variant={config.variant}
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

  if (config.type === "modal-button") {
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

  return null;
};
