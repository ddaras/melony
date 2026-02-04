import React from "react";
import { UIAlign, UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { cn } from "../lib/utils";
import { paddingMap, colorBgMap, radiusMap, interactivePaddingMap } from "../lib/theme-utils";
import { Row } from "./Row";

export const ListItem: React.FC<
  UIContract["listItem"] & { children?: React.ReactNode; align?: UIAlign }
> = ({
  children,
  onClickAction,
  gap = "sm",
  padding = "sm",
  background,
  radius = "md",
  align = "center",
}) => {
    const { send } = useMelony();
    const isInteractive = !!onClickAction;

    const handleClick = () => {
      if (onClickAction) {
        send(onClickAction as any);
      }
    };

    return (
      <div
        onClick={isInteractive ? handleClick : undefined}
        className={cn(
          "flex flex-row transition-colors text-sm",
          interactivePaddingMap[padding],
          background ? colorBgMap[background] : isInteractive && "hover:bg-muted",
          radiusMap[radius],
          isInteractive ? "cursor-pointer" : "cursor-default",
        )}
      >
        <Row align={align} gap={gap}>
          {children}
        </Row>
      </div>
    );
  };
