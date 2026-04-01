"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/shared/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

// ARQUITECTURA: Timing sincronizado - mismo duration para overlay y content
// Esto elimina el micro-parpadeo causado por desincronización
const DIALOG_TRANSITION = {
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1], // ease-out cubic-bezier
} as const

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <DialogPrimitive.Overlay asChild>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : DIALOG_TRANSITION}
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          className
        )}
        style={{ willChange: "opacity" }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      />
    </DialogPrimitive.Overlay>
  )
}

// ARQUITECTURA: Duration fijo en lugar de spring para sincronización perfecta
// Eliminado spring physics que causaba desincronización con overlay
function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "default",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  size?: "default" | "sm" | "lg" | "xl" | "full";
}) {
  const shouldReduceMotion = useReducedMotion()

  const sizeClasses = {
    sm: "max-w-sm",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[calc(100%-2rem)] h-[calc(100%-2rem)]",
  }

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={shouldReduceMotion ? { duration: 0 } : DIALOG_TRANSITION}
          data-slot="dialog-content"
          className={cn(
            // Base styles
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 p-6",
            // Clean background sin excessive transparency
            "bg-background",
            // Subtle border
            "border border-border",
            // Shadow for depth
            "shadow-xl",
            // Size
            sizeClasses[size],
            // Responsive
            "max-w-[calc(100%-2rem)]",
            // Rounded corners
            "rounded-xl",
            className
          )}
          style={{ willChange: "transform, opacity" }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {/* Content wrapper */}
          <div className="relative">
            {children}
          </div>
          
          {/* Close button */}
          {showCloseButton && (
            <DialogPrimitive.Close 
              className={cn(
                "absolute top-4 right-4",
                "size-8 flex items-center justify-center",
                "rounded-lg",
                "hover:bg-muted",
                "text-muted-foreground hover:text-foreground",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:pointer-events-none"
              )}
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 text-center sm:text-left",
        "pb-4 border-b border-border/50",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        "pt-4 border-t border-border/50",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl font-semibold leading-tight tracking-tight",
        "text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
