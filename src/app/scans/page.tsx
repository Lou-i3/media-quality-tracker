/**
 * Scans page - View scan history and trigger new scans
 */

import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { getConfig } from '@/lib/scanner/config';
import { ScanControls } from './scan-controls';
import { ScanHistoryTable } from './scan-history-table';

export const dynamic = 'force-dynamic';

export default async function ScansPage() {
  const [scans, settings] = await Promise.all([
    prisma.scanHistory.findMany({
      orderBy: { startedAt: 'desc' },
      take: 50,
    }),
    getSettings(),
  ]);

  // Get configured paths (safely)
  let tvShowsPath = '';
  let moviesPath = '';
  try {
    const config = getConfig();
    tvShowsPath = config.tvShowsPath;
    moviesPath = config.moviesPath;
  } catch {
    // Config not set
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Library Scans</h1>
          <p className="text-muted-foreground mt-2">
            Scan your media library to discover and track TV shows
          </p>
        </header>

        {/* Scan Controls */}
        <section className="mb-8">
          <ScanControls tvShowsPath={tvShowsPath} moviesPath={moviesPath} />
        </section>

        {/* Scan History */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Scan History</h2>
          <ScanHistoryTable initialScans={scans} dateFormat={settings.dateFormat} />
        </section>
      </div>
    </div>
  );
}
