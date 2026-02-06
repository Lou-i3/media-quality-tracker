'use client';

/**
 * MonitorStatusSelect - Specialized status selector for shows/seasons/episodes
 * Shows a cascade confirmation dialog when changing status on entities with children
 * Uses optimistic updates for immediate feedback
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2 } from 'lucide-react';
import {
  getMonitorStatusVariant,
  MONITOR_STATUS_LABELS,
  MONITOR_STATUS_OPTIONS,
  type DisplayMonitorStatus,
} from '@/lib/status';
import type { MonitorStatus } from '@/generated/prisma/client';

type EntityType = 'show' | 'season' | 'episode';

interface MonitorStatusSelectProps {
  entityType: EntityType;
  entityId: number;
  value: MonitorStatus;
  displayValue: DisplayMonitorStatus;
  hasChildren?: boolean;
  onUpdate?: () => void;
  className?: string;
}

const ENTITY_LABELS: Record<EntityType, { singular: string; children: string }> = {
  show: { singular: 'show', children: 'seasons and episodes' },
  season: { singular: 'season', children: 'episodes' },
  episode: { singular: 'episode', children: '' },
};

const API_PATHS: Record<EntityType, string> = {
  show: '/api/tv-shows',
  season: '/api/seasons',
  episode: '/api/episodes',
};

export function MonitorStatusSelect({
  entityType,
  entityId,
  value,
  displayValue,
  hasChildren = false,
  onUpdate,
  className,
}: MonitorStatusSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cascadeDialogOpen, setCascadeDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<MonitorStatus | null>(null);

  // Local state for optimistic updates
  const [localDisplayValue, setLocalDisplayValue] = useState<DisplayMonitorStatus>(displayValue);

  // Sync with props when they change
  useEffect(() => {
    setLocalDisplayValue(displayValue);
  }, [displayValue]);

  const handleSelect = async (newValue: MonitorStatus) => {
    if (newValue === value) {
      setDropdownOpen(false);
      return;
    }

    // If has children, show cascade dialog for any status change
    if (hasChildren && entityType !== 'episode') {
      setPendingStatus(newValue);
      setDropdownOpen(false);
      setCascadeDialogOpen(true);
      return;
    }

    // Otherwise, just update directly
    await updateStatus(newValue, false);
  };

  const updateStatus = async (status: MonitorStatus, cascade: boolean) => {
    setLoading(true);
    // Optimistic update
    setLocalDisplayValue(status);

    try {
      const response = await fetch(`${API_PATHS[entityType]}/${entityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monitorStatus: status, cascade }),
      });

      if (response.ok) {
        router.refresh();
        onUpdate?.();
      } else {
        // Revert on error
        setLocalDisplayValue(displayValue);
      }
    } catch (error) {
      console.error('Failed to update monitor status:', error);
      // Revert on error
      setLocalDisplayValue(displayValue);
    } finally {
      setLoading(false);
      setDropdownOpen(false);
      setCascadeDialogOpen(false);
      setPendingStatus(null);
    }
  };

  const handleCascadeConfirm = (cascade: boolean) => {
    if (pendingStatus) {
      updateStatus(pendingStatus, cascade);
    }
  };

  const entityLabels = ENTITY_LABELS[entityType];

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild disabled={loading}>
          <span
            role="button"
            tabIndex={0}
            className="inline-flex focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Badge
              variant={getMonitorStatusVariant(localDisplayValue)}
              className={`cursor-pointer hover:opacity-80 transition-opacity ${className ?? ''}`}
            >
              {loading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                MONITOR_STATUS_LABELS[localDisplayValue]
              )}
            </Badge>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {MONITOR_STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={option.value === value ? 'bg-accent' : ''}
            >
              <Badge variant={getMonitorStatusVariant(option.value)} className="mr-2">
                {option.label}
              </Badge>
              {option.value === value && (
                <span className="ml-auto text-xs text-muted-foreground">Current</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cascade Confirmation Dialog */}
      <Dialog open={cascadeDialogOpen} onOpenChange={setCascadeDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              Change to {pendingStatus === 'WANTED' ? 'Wanted' : 'Unwanted'}
            </DialogTitle>
            <DialogDescription>
              Do you want to mark all {entityLabels.children} as{' '}
              {pendingStatus === 'WANTED' ? 'wanted' : 'unwanted'} as well?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => handleCascadeConfirm(false)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : null}
              This {entityLabels.singular} only
            </Button>
            <Button
              onClick={() => handleCascadeConfirm(true)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : null}
              Include all {entityLabels.children}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
