-- Status System Redesign Migration
-- Replaces Status/FileStatus with MonitorStatus/FileQuality
-- Removes ArrStatus, updates TestStatus values

-- Disable foreign keys for the migration
PRAGMA foreign_keys=OFF;

-------------------------------------------------
-- TVShow: status → monitorStatus
-------------------------------------------------
CREATE TABLE "new_TVShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "folderName" TEXT,
    "year" INTEGER,
    "tvdbId" TEXT,
    "tmdbId" INTEGER,
    "plexId" TEXT,
    "monitorStatus" TEXT NOT NULL DEFAULT 'WANTED',
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

INSERT INTO "new_TVShow" (
    "id", "title", "folderName", "year", "tvdbId", "tmdbId", "plexId",
    "monitorStatus", "notes", "posterPath", "backdropPath", "description",
    "firstAirDate", "voteAverage", "genres", "networkStatus", "originalLanguage",
    "tmdbSeasonCount", "tmdbEpisodeCount", "lastMetadataSync", "createdAt", "updatedAt"
)
SELECT
    "id", "title", "folderName", "year", "tvdbId", "tmdbId", "plexId",
    CASE WHEN "status" = 'UNWANTED' THEN 'UNWANTED' ELSE 'WANTED' END,
    "notes", "posterPath", "backdropPath", "description",
    "firstAirDate", "voteAverage", "genres", "networkStatus", "originalLanguage",
    "tmdbSeasonCount", "tmdbEpisodeCount", "lastMetadataSync", "createdAt", "updatedAt"
FROM "TVShow";

DROP TABLE "TVShow";
ALTER TABLE "new_TVShow" RENAME TO "TVShow";

CREATE UNIQUE INDEX "TVShow_tvdbId_key" ON "TVShow"("tvdbId");
CREATE UNIQUE INDEX "TVShow_tmdbId_key" ON "TVShow"("tmdbId");
CREATE UNIQUE INDEX "TVShow_plexId_key" ON "TVShow"("plexId");
CREATE INDEX "TVShow_title_idx" ON "TVShow"("title");
CREATE INDEX "TVShow_tmdbId_idx" ON "TVShow"("tmdbId");

-------------------------------------------------
-- Season: status → monitorStatus
-------------------------------------------------
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tvShowId" INTEGER NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "name" TEXT,
    "monitorStatus" TEXT NOT NULL DEFAULT 'WANTED',
    "notes" TEXT,
    "tmdbSeasonId" INTEGER,
    "posterPath" TEXT,
    "description" TEXT,
    "airDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Season_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TVShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Season" (
    "id", "tvShowId", "seasonNumber", "name", "monitorStatus", "notes",
    "tmdbSeasonId", "posterPath", "description", "airDate", "createdAt", "updatedAt"
)
SELECT
    "id", "tvShowId", "seasonNumber", "name",
    CASE WHEN "status" = 'UNWANTED' THEN 'UNWANTED' ELSE 'WANTED' END,
    "notes", "tmdbSeasonId", "posterPath", "description", "airDate", "createdAt", "updatedAt"
FROM "Season";

DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";

CREATE INDEX "Season_tvShowId_idx" ON "Season"("tvShowId");
CREATE UNIQUE INDEX "Season_tvShowId_seasonNumber_key" ON "Season"("tvShowId", "seasonNumber");

-------------------------------------------------
-- Episode: status → monitorStatus
-------------------------------------------------
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seasonId" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT,
    "monitorStatus" TEXT NOT NULL DEFAULT 'WANTED',
    "notes" TEXT,
    "tmdbEpisodeId" INTEGER,
    "stillPath" TEXT,
    "description" TEXT,
    "airDate" DATETIME,
    "runtime" INTEGER,
    "voteAverage" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Episode" (
    "id", "seasonId", "episodeNumber", "title", "monitorStatus", "notes",
    "tmdbEpisodeId", "stillPath", "description", "airDate", "runtime", "voteAverage",
    "createdAt", "updatedAt"
)
SELECT
    "id", "seasonId", "episodeNumber", "title",
    CASE WHEN "status" = 'UNWANTED' THEN 'UNWANTED' ELSE 'WANTED' END,
    "notes", "tmdbEpisodeId", "stillPath", "description", "airDate", "runtime", "voteAverage",
    "createdAt", "updatedAt"
FROM "Episode";

DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";

CREATE INDEX "Episode_seasonId_idx" ON "Episode"("seasonId");
CREATE UNIQUE INDEX "Episode_seasonId_episodeNumber_key" ON "Episode"("seasonId", "episodeNumber");

-------------------------------------------------
-- EpisodeFile: status → quality, remove arrStatus
-------------------------------------------------
CREATE TABLE "new_EpisodeFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episodeId" INTEGER NOT NULL,
    "filepath" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "dateModified" DATETIME NOT NULL,
    "fileExists" BOOLEAN NOT NULL DEFAULT true,
    "quality" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "action" TEXT NOT NULL DEFAULT 'NOTHING',
    "notes" TEXT,
    "codec" TEXT,
    "resolution" TEXT,
    "bitrate" INTEGER,
    "container" TEXT,
    "audioFormat" TEXT,
    "hdrType" TEXT,
    "duration" INTEGER,
    "metadataSource" TEXT,
    "plexMatched" BOOLEAN NOT NULL DEFAULT false,
    "audioLanguages" TEXT,
    "subtitleLanguages" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EpisodeFile_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_EpisodeFile" (
    "id", "episodeId", "filepath", "filename", "fileSize", "dateModified", "fileExists",
    "quality", "action", "notes", "codec", "resolution", "bitrate", "container",
    "audioFormat", "hdrType", "duration", "metadataSource", "plexMatched",
    "audioLanguages", "subtitleLanguages", "createdAt", "updatedAt"
)
SELECT
    "id", "episodeId", "filepath", "filename", "fileSize", "dateModified", "fileExists",
    CASE
        WHEN "status" = 'GOOD' THEN 'OK'
        WHEN "status" = 'BAD' THEN 'BROKEN'
        ELSE 'UNVERIFIED'
    END,
    "action", "notes", "codec", "resolution", "bitrate", "container",
    "audioFormat", "hdrType", "duration", "metadataSource", "plexMatched",
    "audioLanguages", "subtitleLanguages", "createdAt", "updatedAt"
FROM "EpisodeFile";

DROP TABLE "EpisodeFile";
ALTER TABLE "new_EpisodeFile" RENAME TO "EpisodeFile";

CREATE UNIQUE INDEX "EpisodeFile_filepath_key" ON "EpisodeFile"("filepath");
CREATE INDEX "EpisodeFile_episodeId_idx" ON "EpisodeFile"("episodeId");
CREATE INDEX "EpisodeFile_quality_idx" ON "EpisodeFile"("quality");
CREATE INDEX "EpisodeFile_action_idx" ON "EpisodeFile"("action");

-------------------------------------------------
-- CompatibilityTest: update TestStatus values
-------------------------------------------------
CREATE TABLE "new_CompatibilityTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "episodeFileId" INTEGER,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "testedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompatibilityTest_episodeFileId_fkey" FOREIGN KEY ("episodeFileId") REFERENCES "EpisodeFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_CompatibilityTest" (
    "id", "episodeFileId", "platform", "status", "notes", "testedAt"
)
SELECT
    "id", "episodeFileId", "platform",
    CASE
        WHEN "status" = 'NEEDS_TRANSCODING' THEN 'PLAYABLE'
        ELSE "status"
    END,
    "notes", "testedAt"
FROM "CompatibilityTest";

DROP TABLE "CompatibilityTest";
ALTER TABLE "new_CompatibilityTest" RENAME TO "CompatibilityTest";

CREATE INDEX "CompatibilityTest_episodeFileId_idx" ON "CompatibilityTest"("episodeFileId");

-------------------------------------------------
-- Re-enable foreign keys
-------------------------------------------------
PRAGMA foreign_keys=ON;
