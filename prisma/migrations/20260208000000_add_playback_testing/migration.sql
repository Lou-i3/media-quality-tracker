-- Add playback testing feature
-- Creates Platform and PlaybackTest tables

-- CreateTable
CREATE TABLE "Platform" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlaybackTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episodeFileId" INTEGER,
    "movieFileId" INTEGER,
    "platformId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "testedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlaybackTest_episodeFileId_fkey" FOREIGN KEY ("episodeFileId") REFERENCES "EpisodeFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlaybackTest_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE INDEX "PlaybackTest_episodeFileId_idx" ON "PlaybackTest"("episodeFileId");

-- CreateIndex
CREATE INDEX "PlaybackTest_platformId_idx" ON "PlaybackTest"("platformId");

-- Drop old CompatibilityTest table if exists
DROP TABLE IF EXISTS "CompatibilityTest";

-- Seed default platforms
INSERT INTO "Platform" ("name", "isRequired", "sortOrder") VALUES ('TV', true, 1);
INSERT INTO "Platform" ("name", "isRequired", "sortOrder") VALUES ('Web Player', true, 2);
INSERT INTO "Platform" ("name", "isRequired", "sortOrder") VALUES ('Mobile', false, 3);
