'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, LayoutGrid, Table } from 'lucide-react';
import { TVShowDialog } from './show-dialog';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'TO_CHECK', label: 'To Check' },
  { value: 'GOOD', label: 'Good' },
  { value: 'BAD', label: 'Bad' },
  { value: 'DELETED', label: 'Deleted' },
];

export function TVShowsToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('q') ?? '';
  const currentStatus = searchParams.get('status') ?? 'all';
  const currentView = searchParams.get('view') ?? 'grid';

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.replace(`?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams('q', e.target.value);
  };

  const handleStatusChange = (value: string) => {
    updateParams('status', value);
  };

  const handleViewChange = (view: string) => {
    updateParams('view', view);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search shows..."
          defaultValue={currentSearch}
          onChange={handleSearchChange}
          className={`pl-10 ${isPending ? 'opacity-50' : ''}`}
        />
      </div>

      {/* Status Filter */}
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* View Toggle */}
      <div className="flex border rounded-md">
        <Button
          variant={currentView === 'grid' ? 'secondary' : 'ghost'}
          size="icon"
          className="rounded-r-none"
          onClick={() => handleViewChange('grid')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={currentView === 'table' ? 'secondary' : 'ghost'}
          size="icon"
          className="rounded-l-none"
          onClick={() => handleViewChange('table')}
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Button */}
      <TVShowDialog trigger="add" />
    </div>
  );
}
