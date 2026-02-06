'use client';

/**
 * Edit button wrapper for the show detail page
 * Client component to enable the edit dialog
 */

import { TVShowDialog } from '../show-dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface ShowEditButtonProps {
  show: {
    id: number;
    title: string;
    folderName: string | null;
    year: number | null;
    status: string;
    notes: string | null;
    description: string | null;
  };
}

export function ShowEditButton({ show }: ShowEditButtonProps) {
  return (
    <TVShowDialog
      show={show}
      trigger={
        <Button variant="outline" size="sm">
          <Pencil className="size-4 mr-1" />
          Edit
        </Button>
      }
    />
  );
}
