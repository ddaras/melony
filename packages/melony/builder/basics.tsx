import { UIBuilder } from "./base";
import {
  PrimaryButton,
  GhostButton,
  NavigationButton,
  Heading,
  Text,
  RichText,
  Icon,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@melony/ui";
import {
  PrimaryButtonProps,
  GhostButtonProps,
  RichTextProps,
  IconProps,
} from "@melony/ui";

export class PrimaryButtonBuilder extends UIBuilder {
  constructor(props?: PrimaryButtonProps) {
    super(PrimaryButton);
    if (props) {
      this._props = { ...props };
    }
  }

  label(label: string) {
    this._props.label = label;
    return this;
  }

  onClick(onClick: () => void) {
    this._props.onClick = onClick;
    return this;
  }
}

export class GhostButtonBuilder extends UIBuilder {
  constructor(props?: GhostButtonProps) {
    super(GhostButton);
    if (props) {
      this._props = { ...props };
    }
  }
}

export class NavigationButtonBuilder extends UIBuilder {
  constructor(label?: string) {
    super(NavigationButton);
    if (label) {
      this._props.label = label;
    }

    this._props.variant = "ghost";
  }

  label(label: string) {
    this._props.label = label;
    return this;
  }

  href(href: string) {
    this._props.href = href;
    return this;
  }

  variant(variant: string) {
    this._props.variant = variant;
    return this;
  }
}

export class HeadingBuilder extends UIBuilder {
  constructor(title?: string) {
    super(Heading);
    if (title) {
      this._props.title = title;
    }
  }

  title(title: string) {
    this._props.title = title;
    return this;
  }

  build() {
    const Element = this._element as any;
    return <Element {...this._props}>{this._props.title}</Element>;
  }
}

export class TextBuilder extends UIBuilder {
  constructor(children?: React.ReactNode) {
    super(Text);
    if (children) {
      this._children = [children];
    }
  }

  content(children: React.ReactNode) {
    this._children = [children];
    return this;
  }
}

export class RichTextBuilder extends UIBuilder {
  constructor(props?: RichTextProps) {
    super(RichText);
    if (props) {
      this._props = { ...props };
    }
  }
}

export class IconBuilder extends UIBuilder {
  constructor(props?: IconProps) {
    super(Icon);
    if (props) {
      this._props = { ...props };
    }
  }
}

export class TabsBuilder extends UIBuilder {
  private _tabs: {
    label: string;
    content: React.ReactNode;
    description?: string;
    footer?: React.ReactNode;
  }[] = [];

  constructor() {
    super(Tabs);
  }

  tab(
    label: string,
    content: React.ReactNode,
    {
      description,
      footer,
    }: {
      description?: string;
      footer?: React.ReactNode;
    } = {}
  ) {
    this._tabs.push({ label, content, description, footer });
    return this;
  }

  build() {
    return (
      <Tabs defaultValue={this._tabs[0].label} className={this._className}>
        <TabsList>
          {this._tabs.map((tab) => (
            <TabsTrigger key={tab.label} value={tab.label}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {this._tabs.map((tab) => (
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
}
export const primaryButton = (props: PrimaryButtonProps) => {
  return new PrimaryButtonBuilder(props);
};

export const ghostButton = (props: GhostButtonProps) => {
  return new GhostButtonBuilder(props);
};

export const navigationButton = (label?: string) => {
  return new NavigationButtonBuilder(label);
};

export const heading = (title: string) => {
  return new HeadingBuilder(title);
};

export const text = (children: React.ReactNode) => {
  return new TextBuilder(children);
};

export const richText = (props: RichTextProps) => {
  return new RichTextBuilder(props);
};

export const icon = (props: IconProps) => {
  return new IconBuilder(props);
};

export const tabs = () => {
  return new TabsBuilder();
};
