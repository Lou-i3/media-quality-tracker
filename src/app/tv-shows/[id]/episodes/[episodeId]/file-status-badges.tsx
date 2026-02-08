'use client';

/**
 * File Status Badge Components
 *
 * Clickable badges for managing file quality, action, and playback test status.
 * Uses BadgeSelector which handles optimistic updates internally - changes appear
 * immediately while API calls complete in the background.
 */

import { useRouter } from 'next/navigation';
import { BadgeSelector } from '@/components/badge-selector';
import {
  getFileQualityVariant,
  getPlaybackStatusVariant,
  getActionVariant,
  FILE_QUALITY_OPTIONS,
  ACTION_OPTIONS,
  PLAYBACK_STATUS_OPTIONS,
  FILE_QUALITY_LABELS,
  ACTION_LABELS,
  PLAYBACK_STATUS_LABELS,
} from '@/lib/status';
import type { FileQuality, Action, PlaybackStatus } from '@/generated/prisma/client';

interface FileStatusBadgesProps {
  fileId: number;
  quality: FileQuality;
  action: Action;
}

export function FileStatusBadges({ fileId, quality, action }: FileStatusBadgesProps) {
  const router = useRouter();

  const handleQualityChange = async (newQuality: string) => {
    const response = await fetch(`/api/files/${fileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quality: newQuality }),
    });

    if (response.ok) {
      router.refresh();
    } else {
      throw new Error('Failed to update quality');
    }
  };

  const handleActionChange = async (newAction: string) => {
    const response = await fetch(`/api/files/${fileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: newAction }),
    });

    if (response.ok) {
      router.refresh();
    } else {
      throw new Error('Failed to update action');
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
      <div>
        <p className="text-muted-foreground text-xs mb-1">Quality</p>
        <BadgeSelector
          value={quality}
          displayLabel={FILE_QUALITY_LABELS[quality]}
          variant={getFileQualityVariant(quality)}
          getVariant={getFileQualityVariant}
          options={FILE_QUALITY_OPTIONS}
          onValueChange={handleQualityChange}
        />
      </div>
      <div>
        <p className="text-muted-foreground text-xs mb-1">Action</p>
        <BadgeSelector
          value={action}
          displayLabel={ACTION_LABELS[action]}
          variant={getActionVariant(action)}
          getVariant={getActionVariant}
          options={ACTION_OPTIONS}
          onValueChange={handleActionChange}
        />
      </div>
    </div>
  );
}

interface PlaybackTestBadgeProps {
  testId: number;
  platformName: string;
  status: PlaybackStatus;
}

export function PlaybackTestBadge({ testId, platformName, status }: PlaybackTestBadgeProps) {
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    const response = await fetch(`/api/playback-tests/${testId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      router.refresh();
    } else {
      throw new Error('Failed to update test status');
    }
  };

  return (
    <BadgeSelector
      value={status}
      displayLabel={`${platformName}: ${PLAYBACK_STATUS_LABELS[status]}`}
      variant={getPlaybackStatusVariant(status)}
      getVariant={getPlaybackStatusVariant}
      options={PLAYBACK_STATUS_OPTIONS}
      onValueChange={handleStatusChange}
    />
  );
}
