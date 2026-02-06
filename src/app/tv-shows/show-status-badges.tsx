'use client';

/**
 * ShowStatusBadges - Client component for displaying show status badges
 * Wraps MonitorStatusSelect and QualityStatus badge
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

interface ShowStatusBadgesProps {
  showId: number;
  monitorStatus: MonitorStatus;
  displayMonitorStatus: DisplayMonitorStatus;
  qualityStatus: QualityStatus;
  hasChildren?: boolean;
  showQuality?: boolean;
}

export function ShowStatusBadges({
  showId,
  monitorStatus,
  displayMonitorStatus,
  qualityStatus,
  hasChildren = false,
  showQuality = true,
}: ShowStatusBadgesProps) {
  return (
    <div className="flex items-center gap-2">
      <MonitorStatusSelect
        entityType="show"
        entityId={showId}
        value={monitorStatus}
        displayValue={displayMonitorStatus}
        hasChildren={hasChildren}
      />
      {showQuality && (
        <Badge variant={getQualityStatusVariant(qualityStatus)}>
          {QUALITY_STATUS_LABELS[qualityStatus]}
        </Badge>
      )}
    </div>
  );
}
