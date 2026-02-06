'use client';

/**
 * EpisodeDetailStatusBadges - Client component for episode detail page status badges
 */

import { Badge } from '@/components/ui/badge';
import { MonitorStatusSelect } from '@/components/monitor-status-select';
import {
  getQualityStatusVariant,
  QUALITY_STATUS_LABELS,
  type QualityStatus,
} from '@/lib/status';
import type { MonitorStatus } from '@/generated/prisma/client';

interface EpisodeDetailStatusBadgesProps {
  episodeId: number;
  monitorStatus: MonitorStatus;
  qualityStatus: QualityStatus;
}

export function EpisodeDetailStatusBadges({
  episodeId,
  monitorStatus,
  qualityStatus,
}: EpisodeDetailStatusBadgesProps) {
  // Hide quality badge when explicitly unwanted
  const showQuality = monitorStatus !== 'UNWANTED';

  return (
    <div className="flex items-center gap-2">
      <MonitorStatusSelect
        entityType="episode"
        entityId={episodeId}
        value={monitorStatus}
        displayValue={monitorStatus}
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
