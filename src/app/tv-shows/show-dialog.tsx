'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Pencil, Plus, ImageIcon } from 'lucide-react';
import { getPosterUrl, getBackdropUrl } from '@/lib/tmdb/images';
import { MONITOR_STATUS_OPTIONS } from '@/lib/status';

interface TVShow {
  id: number;
  title: string;
  folderName?: string | null;
  year: number | null;
  monitorStatus: string;
  notes: string | null;
  description?: string | null;
  posterPath?: string | null;
  backdropPath?: string | null;
}

interface TVShowDialogProps {
  show?: TVShow;
  trigger?: 'icon' | 'button' | 'add' | React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TVShowDialog({ show, trigger = 'icon', open, onOpenChange }: TVShowDialogProps) {
  const router = useRouter();
  const isEdit = !!show;
  const isControlled = open !== undefined;

  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    folderName: '',
    year: '',
    monitorStatus: 'WANTED',
    notes: '',
    description: '',
    posterPath: '',
    backdropPath: '',
  });

  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  // Reset form when dialog opens/closes or show changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: show?.title ?? '',
        folderName: show?.folderName ?? '',
        year: show?.year?.toString() ?? '',
        monitorStatus: show?.monitorStatus ?? 'WANTED',
        notes: show?.notes ?? '',
        description: show?.description ?? '',
        posterPath: show?.posterPath ?? '',
        backdropPath: show?.backdropPath ?? '',
      });
    }
  }, [isOpen, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        folderName: formData.folderName || null,
        year: formData.year ? parseInt(formData.year, 10) : null,
        monitorStatus: formData.monitorStatus,
        notes: formData.notes || null,
        description: formData.description || null,
        posterPath: formData.posterPath || null,
        backdropPath: formData.backdropPath || null,
      };

      const response = await fetch(
        isEdit ? `/api/tv-shows/${show.id}` : '/api/tv-shows',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!show || !confirm(`Are you sure you want to delete "${show.title}"? This cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tv-shows/${show.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTrigger = () => {
    // Custom React node trigger
    if (trigger && typeof trigger !== 'string') {
      return trigger;
    }
    if (trigger === 'add') {
      return (
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Show
        </Button>
      );
    }
    if (trigger === 'button') {
      return (
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
          Edit
        </Button>
      );
    }
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit TV Show' : 'Add TV Show'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the details for this TV show.'
                : 'Manually add a TV show to your library.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <label htmlFor="dialog-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="dialog-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Breaking Bad"
                required
              />
            </div>
            {isEdit && (
              <div className="grid gap-2">
                <label htmlFor="dialog-folder" className="text-sm font-medium">
                  Folder Name
                </label>
                <Input
                  id="dialog-folder"
                  value={formData.folderName}
                  onChange={(e) => setFormData({ ...formData, folderName: e.target.value })}
                  placeholder="Original folder name on disk"
                />
                <p className="text-xs text-muted-foreground">
                  The folder name on disk, if different from the display title
                </p>
              </div>
            )}
            <div className="grid gap-2">
              <label htmlFor="dialog-year" className="text-sm font-medium">
                Year
              </label>
              <Input
                id="dialog-year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2008"
                min="1900"
                max="2100"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="dialog-monitor-status" className="text-sm font-medium">
                Monitor Status
              </label>
              <Select
                value={formData.monitorStatus}
                onValueChange={(value) => setFormData({ ...formData, monitorStatus: value })}
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
              <label htmlFor="dialog-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="dialog-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Show description..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="dialog-notes" className="text-sm font-medium">
                Notes
              </label>
              <Input
                id="dialog-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Personal notes..."
              />
            </div>
            {isEdit && (
              <>
                <div className="grid gap-2">
                  <label htmlFor="dialog-poster" className="text-sm font-medium">
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
                        id="dialog-poster"
                        value={formData.posterPath}
                        onChange={(e) => setFormData({ ...formData, posterPath: e.target.value })}
                        placeholder="/abc123.jpg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        TMDB poster path (e.g., /abc123.jpg)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="dialog-backdrop" className="text-sm font-medium">
                    Backdrop Path
                  </label>
                  <div className="flex gap-3">
                    {formData.backdropPath ? (
                      <div className="w-24 h-14 rounded bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={getBackdropUrl(formData.backdropPath, 'w300') || ''}
                          alt="Backdrop preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-14 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="size-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="dialog-backdrop"
                        value={formData.backdropPath}
                        onChange={(e) => setFormData({ ...formData, backdropPath: e.target.value })}
                        placeholder="/xyz789.jpg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        TMDB backdrop path (e.g., /xyz789.jpg)
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className={isEdit ? 'flex justify-between sm:justify-between' : ''}>
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Show')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
