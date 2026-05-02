"use client"

import * as React from "react"
import { Modal, type ModalProps } from "flowbite-react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type DialogContextValue = {
  onOpenChange?: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue>({})

type DialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  size?: ModalProps["size"]
  children?: React.ReactNode
}

function Dialog({ open, onOpenChange, size = "md", children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <Modal
        show={open}
        onClose={() => onOpenChange?.(false)}
        dismissible
        size={size}
        theme={{
          content: {
            base: "relative w-full p-4",
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-xl bg-popover text-popover-foreground shadow ring-1 ring-foreground/10",
          },
        }}
      >
        {children}
      </Modal>
    </DialogContext.Provider>
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <div
      data-slot="dialog-content"
      className={cn("relative grid gap-4 p-4 text-sm", className)}
    >
      {children}
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2"
          onClick={() => onOpenChange?.(false)}
          aria-label="Close"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
}
