import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ComboboxFormField,
  DataTable,
  DateFormField,
  FieldRenderer,
  Form,
  Heading,
  MelonyProvider,
  MutationContainer,
  QueryContainer,
  RootLayout,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
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
        <MelonyProvider>{compiled.children}</MelonyProvider>
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
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
                {tab.description && (
                  <CardDescription>{tab.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">{tab.content}</CardContent>
              {tab.footer && <CardFooter>{tab.footer}</CardFooter>}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
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
        level={config.level}
        className={config.className}
        content={config.content}
      />
    );
  }

  if (config.type === "avatar") {
    return (
      <Avatar
        src={config.src}
        name={config.name}
        className={config.className}
      />
    );
  }

  return null;
};
