'use client';

/**
 * ShowDetailStatusBadges - Client component for show detail page status badges
 */

import { Badge } from '@/components/ui/badge';
import { MonitorStatusSelect } from '@/components/monitor-status-select';
import {
  getQualityStatusVariant,
  QUALITY_STATUS_LABELS,
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
  // Hide quality badge when explicitly unwanted
  const showQuality = monitorStatus !== 'UNWANTED';

  return (
    <div className="flex items-center gap-2">
      <MonitorStatusSelect
        entityType="show"
        entityId={showId}
        value={monitorStatus}
        displayValue={displayMonitorStatus}
        hasChildren={hasChildren}
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
