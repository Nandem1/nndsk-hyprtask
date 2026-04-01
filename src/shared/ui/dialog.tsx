"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, useReducedMotion } from "framer-motion"
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

// Premium overlay with glassmorphism effect
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <DialogPrimitive.Overlay asChild>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0.8 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        className={cn(
          "fixed inset-0 z-50 backdrop-blur-md bg-black/60",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        {...(props as React.ComponentProps<typeof motion.div>)}
      />
    </DialogPrimitive.Overlay>
  )
}

// Premium dialog content with glassmorphism
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
          initial={shouldReduceMotion 
            ? { opacity: 0.9, scale: 0.98 } 
            : { opacity: 0, scale: 0.95, y: 20 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion 
            ? { opacity: 0.9, scale: 0.98 } 
            : { opacity: 0, scale: 0.95, y: 20 }
          }
          transition={{
            type: "spring",
            damping: shouldReduceMotion ? 30 : 25,
            stiffness: shouldReduceMotion ? 400 : 300,
            duration: shouldReduceMotion ? 0.1 : undefined,
          }}
          data-slot="dialog-content"
          className={cn(
            // Base styles
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 p-6",
            // Glassmorphism effect
            "backdrop-blur-2xl bg-white/10 dark:bg-black/20",
            "border border-white/20 dark:border-white/10",
            // Shadow and depth
            "shadow-2xl shadow-black/20 dark:shadow-black/50",
            // Size
            sizeClasses[size],
            // Responsive
            "max-w-[calc(100%-2rem)]",
            // Rounded corners
            "rounded-2xl",
            // Animation classes for radix state
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            className
          )}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {/* Decorative gradient border */}
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl pointer-events-none",
              "bg-gradient-to-br from-white/10 via-transparent to-white/5",
              "dark:from-white/5 dark:via-transparent dark:to-white/2"
            )} 
          />
          
          {/* Content wrapper */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Close button */}
          {showCloseButton && (
            <DialogPrimitive.Close 
              className={cn(
                "absolute top-4 right-4 z-20",
                "size-8 flex items-center justify-center",
                "rounded-full",
                "bg-white/10 dark:bg-white/5",
                "border border-white/20 dark:border-white/10",
                "text-muted-foreground hover:text-foreground",
                "transition-all duration-200",
                "hover:bg-white/20 dark:hover:bg-white/10",
                "hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
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
        "pb-4 border-b border-white/10 dark:border-white/5",
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
        "pt-4 border-t border-white/10 dark:border-white/5",
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
