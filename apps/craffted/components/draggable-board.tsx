"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS, Transform } from "@dnd-kit/utilities";
import { vstack } from "melony";
import { GripVerticalIcon } from "lucide-react";

interface Widget {
  id: string;
  content: React.ReactNode;
  position: { x: number; y: number };
}

interface DraggableBoardProps {
  widgets?: Widget[];
  onWidgetsChange?: (widgets: Widget[]) => void;
}

function DraggableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...listeners}
        {...attributes}
        className="absolute bottom-1 right-1 w-6 h-6 cursor-move z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-200"
      >
        <GripVerticalIcon className="w-4 h-4" />
      </div>
      {children}
    </div>
  );
}

export function DraggableBoard({
  widgets = [],
  onWidgetsChange,
}: DraggableBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<Widget[]>(widgets);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const activeItem = items.find((item) => item.id === active.id);

    if (activeItem) {
      // Snap to 20px grid
      const snapToGrid = (value: number) => Math.round(value / 20) * 20;

      const newItems = items.map((item) => {
        if (item.id === active.id) {
          return {
            ...item,
            position: {
              x: snapToGrid(item.position.x + delta.x),
              y: snapToGrid(item.position.y + delta.y),
            },
          };
        }
        return item;
      });

      setItems(newItems);
      onWidgetsChange?.(newItems);
    }

    setActiveId(null);
  }

  const activeItem = items.find((item) => item.id === activeId);

  return vstack({
    className: "relative w-full h-screen",
    children: [
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              transform: CSS.Transform.toString({
                x: item.position.x,
                y: item.position.y,
                scaleX: 1,
                scaleY: 1,
              } as Transform),
            }}
            className="touch-none group"
          >
            <DraggableItem id={item.id}>{item.content}</DraggableItem>
          </div>
        ))}
        <DragOverlay>
          {activeId && activeItem ? (
            <div className="opacity-50">{activeItem.content}</div>
          ) : null}
        </DragOverlay>
      </DndContext>,
    ],
  });
}
