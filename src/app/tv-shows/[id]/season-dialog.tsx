'use client';

/**
 * Season Edit Dialog
 * Edit season details including name, monitorStatus, notes, etc.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPosterUrl } from '@/lib/tmdb/images';
import { MONITOR_STATUS_OPTIONS } from '@/lib/status';

interface Season {
  id: number;
  seasonNumber: number;
  name: string | null;
  monitorStatus: string;
  notes: string | null;
  posterPath: string | null;
  description: string | null;
  airDate: Date | null;
}

interface SeasonDialogProps {
  season: Season;
  trigger?: React.ReactNode;
}

export function SeasonDialog({ season, trigger }: SeasonDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    monitorStatus: 'WANTED',
    notes: '',
    posterPath: '',
    description: '',
    airDate: '',
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: season.name ?? '',
        monitorStatus: season.monitorStatus,
        notes: season.notes ?? '',
        posterPath: season.posterPath ?? '',
        description: season.description ?? '',
        airDate: season.airDate
          ? new Date(season.airDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [open, season]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name || null,
        monitorStatus: formData.monitorStatus,
        notes: formData.notes || null,
        posterPath: formData.posterPath || null,
        description: formData.description || null,
        airDate: formData.airDate || null,
      };

      const response = await fetch(`/api/seasons/${season.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Season {season.seasonNumber}</DialogTitle>
            <DialogDescription>
              Update season details and metadata.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <label htmlFor="season-name" className="text-sm font-medium">
                Season Name
              </label>
              <Input
                id="season-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Specials, Season 1: The Beginning"
              />
              <p className="text-xs text-muted-foreground">
                Optional display name for this season
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="season-monitor-status" className="text-sm font-medium">
                Monitor Status
              </label>
              <Select
                value={formData.monitorStatus}
                onValueChange={(value) =>
                  setFormData({ ...formData, monitorStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONITOR_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="season-airdate" className="text-sm font-medium">
                Air Date
              </label>
              <Input
                id="season-airdate"
                type="date"
                value={formData.airDate}
                onChange={(e) =>
                  setFormData({ ...formData, airDate: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="season-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="season-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Season description..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="season-notes" className="text-sm font-medium">
                Notes
              </label>
              <Input
                id="season-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Personal notes..."
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="season-poster" className="text-sm font-medium">
                Poster Path
              </label>
              <div className="flex gap-3">
                {formData.posterPath ? (
                  <div className="w-16 h-24 rounded bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={getPosterUrl(formData.posterPath, 'w154') || ''}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-24 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="size-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="season-poster"
                    value={formData.posterPath}
                    onChange={(e) =>
                      setFormData({ ...formData, posterPath: e.target.value })
                    }
                    placeholder="/abc123.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    TMDB poster path
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
