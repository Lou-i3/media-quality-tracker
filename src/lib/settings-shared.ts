/**
 * Shared settings types and constants (safe for client and server)
 */

export type DateFormat = 'EU' | 'US' | 'ISO';

export interface AppSettings {
  id: number;
  dateFormat: DateFormat;
  maxParallelTasks: number;
  updatedAt: Date;
}

/** Default max parallel tasks */
export const DEFAULT_MAX_PARALLEL_TASKS = 2;

/**
 * Format a date according to the specified format
 */
export function formatDateWithFormat(date: Date, format: DateFormat): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'US':
      return `${month}/${day}/${year}`;
    case 'ISO':
      return `${year}-${month}-${day}`;
    case 'EU':
    default:
      return `${day}/${month}/${year}`;
  }
}

/**
 * Format a datetime according to the specified format
 */
export function formatDateTimeWithFormat(date: Date, format: DateFormat): string {
  const dateStr = formatDateWithFormat(date, format);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Date format labels for UI
 */
export const DATE_FORMAT_OPTIONS = [
  { value: 'EU', label: 'European (DD/MM/YYYY)', example: '05/02/2026' },
  { value: 'US', label: 'American (MM/DD/YYYY)', example: '02/05/2026' },
  { value: 'ISO', label: 'ISO (YYYY-MM-DD)', example: '2026-02-05' },
] as const;

/**
 * Format file size for display (client-safe)
 */
export function formatFileSize(bytes: bigint | number): string {
  const num = typeof bytes === 'bigint' ? Number(bytes) : bytes;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Format duration in seconds to human readable (client-safe)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
}
