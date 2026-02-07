'use client';

/**
 * ShowDetailStatusBadges - Client component for show detail page status badges
 */

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { BadgeSelector } from '@/components/badge-selector';
import {
  getQualityStatusVariant,
  getMonitorStatusVariant,
  QUALITY_STATUS_LABELS,
  MONITOR_STATUS_LABELS,
  MONITOR_STATUS_OPTIONS,
  type QualityStatus,
  type DisplayMonitorStatus,
} from '@/lib/status';
import type { MonitorStatus } from '@/generated/prisma/client';

interface ShowDetailStatusBadgesProps {
  showId: number;
  monitorStatus: MonitorStatus;
  displayMonitorStatus: DisplayMonitorStatus;
  qualityStatus: QualityStatus;
  hasChildren?: boolean;
}

export function ShowDetailStatusBadges({
  showId,
  monitorStatus,
  displayMonitorStatus,
  qualityStatus,
  hasChildren = false,
}: ShowDetailStatusBadgesProps) {
  const router = useRouter();

  // Hide quality badge when explicitly unwanted
  const showQuality = monitorStatus !== 'UNWANTED';

  return (
    <div className="flex items-center gap-2">
      <BadgeSelector
        value={monitorStatus}
        displayLabel={MONITOR_STATUS_LABELS[displayMonitorStatus]}
        variant={getMonitorStatusVariant(displayMonitorStatus)}
        getVariant={getMonitorStatusVariant}
        options={MONITOR_STATUS_OPTIONS}
        onValueChange={() => {}} // Handled by cascade API call
        cascadeOptions={{
          entityType: 'show',
          entityId: showId,
          hasChildren,
          apiEndpoint: '/api/tv-shows',
          propertyKey: 'monitorStatus',
          entityLabel: 'show',
          childrenLabel: 'seasons and episodes',
          getConfirmationText: (value: string) =>
            value === 'WANTED' ? 'Change to Wanted' : 'Change to Unwanted',
        }}
        onUpdate={() => router.refresh()}
        className="text-sm"
      />
      {showQuality && (
        <Badge variant={getQualityStatusVariant(qualityStatus)} className="text-sm">
          {QUALITY_STATUS_LABELS[qualityStatus]}
        </Badge>
      )}
    </div>
  );
}
