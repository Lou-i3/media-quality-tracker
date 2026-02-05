/**
 * Status utilities for badge variants
 */

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "GOOD":
    case "WORKS":
      return "default";
    case "BAD":
    case "FAILS":
      return "destructive";
    case "TO_CHECK":
    case "NEEDS_TRANSCODING":
      return "secondary";
    default:
      return "outline";
  }
}
