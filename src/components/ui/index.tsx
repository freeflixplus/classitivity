"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ─── Button ─────────────────────────────────────────────────────── */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantStyles = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-md hover:shadow-glow",
  secondary:
    "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/25 active:bg-brand-200",
  outline:
    "border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:bg-brand-100",
  ghost:
    "text-surface-600 dark:text-surface-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-500/10",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
};

const sizeStyles = {
  sm: "px-3.5 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
  xl: "px-8 py-4 text-lg rounded-2xl gap-3",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  iconRight,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2 dark:focus:ring-offset-surface-900",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </button>
  );
}

/* ─── Input ──────────────────────────────────────────────────────── */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm",
              "text-surface-800 dark:text-surface-200 placeholder:text-surface-400 dark:placeholder:text-surface-500",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400",
              "transition-all duration-200",
              icon && "pl-10",
              error && "border-red-300 focus:ring-red-500/20 focus:border-red-400",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ─── Badge ──────────────────────────────────────────────────────── */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "brand";
  size?: "sm" | "md";
  className?: string;
}

const badgeVariants = {
  default: "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400",
  success: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
  danger: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400",
  brand: "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300",
};

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        badgeVariants[variant],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ─── Card ───────────────────────────────────────────────────────── */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = false, padding = "md", style }: CardProps) {
  const paddings = { none: "p-0", sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      style={style}
      className={cn(
        "bg-white dark:bg-surface-900 rounded-2xl border border-surface-200/60 dark:border-surface-800 shadow-card",
        paddings[padding],
        hover && "card-lift cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────── */

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/* ─── SectionHeader ──────────────────────────────────────────────── */

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ badge, title, description, align = "center", className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl mb-16", align === "center" && "mx-auto text-center", className)}>
      {badge && (
        <Badge variant="brand" size="md" className="mb-4 animate-fade-in">
          {badge}
        </Badge>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white tracking-tight animate-fade-in-up">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 leading-relaxed animate-fade-in-up stagger-1">
          {description}
        </p>
      )}
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────── */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-card p-6 transform transition-all animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white font-display">{title}</h3>
          <button 
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export * from "./SecureViewer";
