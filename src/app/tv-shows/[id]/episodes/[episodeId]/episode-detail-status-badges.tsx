'use client';

/**
 * EpisodeDetailStatusBadges - Client component for episode detail page status badges
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
  const router = useRouter();

  // Hide quality badge when explicitly unwanted
  const showQuality = monitorStatus !== 'UNWANTED';

  return (
    <div className="flex items-center gap-2">
      <BadgeSelector
        value={monitorStatus}
        displayLabel={MONITOR_STATUS_LABELS[monitorStatus]}
        variant={getMonitorStatusVariant(monitorStatus)}
        getVariant={getMonitorStatusVariant}
        options={MONITOR_STATUS_OPTIONS}
        onValueChange={() => {}} // Handled by cascade API call
        cascadeOptions={{
          entityType: 'episode',
          entityId: episodeId,
          hasChildren: false,
          apiEndpoint: '/api/episodes',
          propertyKey: 'monitorStatus',
          entityLabel: 'episode',
          childrenLabel: '',
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
