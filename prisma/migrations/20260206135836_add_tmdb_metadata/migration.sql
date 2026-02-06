/*
  Warnings:

  - You are about to alter the column `tmdbId` on the `TVShow` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- AlterTable
ALTER TABLE "Episode" ADD COLUMN "airDate" DATETIME;
ALTER TABLE "Episode" ADD COLUMN "description" TEXT;
ALTER TABLE "Episode" ADD COLUMN "runtime" INTEGER;
ALTER TABLE "Episode" ADD COLUMN "stillPath" TEXT;
ALTER TABLE "Episode" ADD COLUMN "tmdbEpisodeId" INTEGER;
ALTER TABLE "Episode" ADD COLUMN "voteAverage" REAL;

-- AlterTable
ALTER TABLE "Season" ADD COLUMN "airDate" DATETIME;
ALTER TABLE "Season" ADD COLUMN "description" TEXT;
ALTER TABLE "Season" ADD COLUMN "posterPath" TEXT;
ALTER TABLE "Season" ADD COLUMN "tmdbSeasonId" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TVShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "tvdbId" TEXT,
    "tmdbId" INTEGER,
    "plexId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TO_CHECK',
    "notes" TEXT,
    "posterPath" TEXT,
    "backdropPath" TEXT,
    "description" TEXT,
    "firstAirDate" DATETIME,
    "voteAverage" REAL,
    "genres" TEXT,
    "networkStatus" TEXT,
    "originalLanguage" TEXT,
    "tmdbSeasonCount" INTEGER,
    "tmdbEpisodeCount" INTEGER,
    "lastMetadataSync" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TVShow" ("createdAt", "id", "notes", "plexId", "status", "title", "tmdbId", "tvdbId", "updatedAt", "year") SELECT "createdAt", "id", "notes", "plexId", "status", "title", "tmdbId", "tvdbId", "updatedAt", "year" FROM "TVShow";
DROP TABLE "TVShow";
ALTER TABLE "new_TVShow" RENAME TO "TVShow";
CREATE UNIQUE INDEX "TVShow_tvdbId_key" ON "TVShow"("tvdbId");
CREATE UNIQUE INDEX "TVShow_tmdbId_key" ON "TVShow"("tmdbId");
CREATE UNIQUE INDEX "TVShow_plexId_key" ON "TVShow"("plexId");
CREATE INDEX "TVShow_title_idx" ON "TVShow"("title");
CREATE INDEX "TVShow_tmdbId_idx" ON "TVShow"("tmdbId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
