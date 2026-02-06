'use client';

/**
 * StatusSelect - A clickable badge that opens a dropdown to change status values
 * Uses optimistic updates for immediate feedback while API calls complete in background
 */

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2 } from 'lucide-react';
import type { BadgeVariant } from '@/lib/status';

interface StatusSelectProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  displayLabel: string;
  variant: BadgeVariant;
  onValueChange: (value: T) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function StatusSelect<T extends string>({
  value,
  options,
  displayLabel,
  variant,
  onValueChange,
  disabled = false,
  className,
}: StatusSelectProps<T>) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Local state for optimistic updates
  const [localValue, setLocalValue] = useState(value);
  const [localLabel, setLocalLabel] = useState(displayLabel);
  const [localVariant, setLocalVariant] = useState(variant);

  // Sync with props when they change (after router.refresh())
  useEffect(() => {
    setLocalValue(value);
    setLocalLabel(displayLabel);
    setLocalVariant(variant);
  }, [value, displayLabel, variant]);

  const handleSelect = async (newValue: T) => {
    if (newValue === localValue) {
      setOpen(false);
      return;
    }

    // Find the option to get its label
    const option = options.find((o) => o.value === newValue);
    if (!option) return;

    // Optimistic update - show new value immediately
    setLocalValue(newValue);
    setLocalLabel(option.label);
    // Note: variant will be updated when parent re-renders with new props

    setLoading(true);
    setOpen(false);

    try {
      const result = onValueChange(newValue);
      if (result instanceof Promise) {
        await result;
      }
    } catch {
      // Revert on error
      setLocalValue(value);
      setLocalLabel(displayLabel);
      setLocalVariant(variant);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled || loading}>
        <span
          role="button"
          tabIndex={0}
          className="inline-flex focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Badge
            variant={localVariant}
            className={`cursor-pointer hover:opacity-80 transition-opacity ${className ?? ''}`}
          >
            {loading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              localLabel
            )}
          </Badge>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={option.value === localValue ? 'bg-accent' : ''}
          >
            <Badge variant="outline" className="mr-2">
              {option.label}
            </Badge>
            {option.value === localValue && (
              <span className="ml-auto text-xs text-muted-foreground">Current</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
