/**
 * Loading skeleton for TV Shows page
 * Shown during navigation for instant feedback
 */

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ShowCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Poster skeleton */}
          <Skeleton className="w-20 h-30 flex-shrink-0" />

          {/* Content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>

            {/* Description skeleton */}
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-3" />

            {/* Stats skeleton */}
            <div className="flex gap-3">
              <Skeleton className="h-9 w-24 rounded" />
              <Skeleton className="h-9 w-28 rounded" />
              <Skeleton className="h-9 w-32 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TVShowsLoading() {
  return (
    <div className="p-8">
      {/* Sticky Header + Toolbar skeleton */}
      <div className="sticky top-0 z-10 bg-background pb-4 -mx-8 px-8 pt-0 -mt-8 border-b">
        <div className="pt-8 mb-4">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Toolbar skeleton */}
        <div className="flex items-center gap-3 flex-wrap">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mt-6 grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ShowCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
