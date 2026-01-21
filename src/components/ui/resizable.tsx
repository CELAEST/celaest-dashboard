"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Placeholder components - react-resizable-panels needs compatible version
const ResizablePanelGroup = ({ children, ...props }: any) => <div {...props}>{children}</div>;

function ResizablePanel({ children, ...props }: any) {
  return <div data-slot="resizable-panel" {...props}>{children}</div>;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: any & {
  withHandle?: boolean;
}) {
  return (
    <div
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
