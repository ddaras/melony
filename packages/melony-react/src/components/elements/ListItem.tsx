import React from "react";
import { UIAlign, UIContract } from "melony";
import { useMelony } from "@/hooks/use-melony";
import { cn } from "@/lib/utils";
import {
  paddingMap,
  colorBgMap,
  radiusMap
} from "@/lib/theme-utils";
import { Row } from "./Row";

export const ListItem: React.FC<UIContract["listItem"] & { children?: React.ReactNode, align?: UIAlign }> = ({
  children,
  onClickAction,
  gap = "sm",
  padding = "sm",
  background,
  radius = "md",
  align = "center",
}) => {
  const { sendEvent } = useMelony();
  const isInteractive = !!onClickAction;

  const handleClick = () => {
    if (onClickAction) {
      sendEvent(onClickAction as any);
    }
  };

  return (
    <div
      onClick={isInteractive ? handleClick : undefined}
      className={cn(
        "flex flex-row transition-colors text-sm",
        paddingMap[padding],
        background ? colorBgMap[background] : isInteractive && "hover:bg-muted",
        radiusMap[radius],
        isInteractive ? "cursor-pointer" : "cursor-default"
      )}
    >
      <Row align={align} gap={gap}>
        {children as React.ReactNode[]}
      </Row>
    </div>
  );
};
