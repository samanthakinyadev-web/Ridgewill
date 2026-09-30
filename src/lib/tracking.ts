/**
 * Shipment tracking domain logic.
 *
 * Deliberately free of React and Supabase imports so every function here can
 * be unit tested in isolation (see PRD section 13).
 */

// ============================================================
// Statuses
// ============================================================

export const STATUSES = [
  'booked',
  'picked_up',
  'at_warehouse',
  'export_clearance',
  'departed',
  'in_transit',
  'arrived',
  'import_clearance',
  'out_for_delivery',
  'delivered',
  'delayed',
  'on_hold',
] as const;

export type ShipmentStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  booked: 'Booked',
  picked_up: 'Picked up',
  at_warehouse: 'At warehouse',
  export_clearance: 'Export clearance',
  departed: 'Departed',
  in_transit: 'In transit',
  arrived: 'Arrived',
  import_clearance: 'Import clearance',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  delayed: 'Delayed',
  on_hold: 'On hold',
};

/** Statuses that are a problem state rather than a point on the journey. */
export const WARNING_STATUSES: readonly ShipmentStatus[] = ['delayed', 'on_hold'];

// ============================================================
// Main progress stages
// ============================================================

export const STAGES = [
  'Booked',
  'Picked up',
  'Customs clearance',
  'In transit',
  'Arrived',
  'Delivered',
] as const;

export type StageName = (typeof STAGES)[number];

/**
 * Each status maps to one of the six customer-facing stages, or to null when
 * it is a warning that sits on top of the timeline rather than on it.
 *
 * Note the deliberate flattening of `at_warehouse` (stage 2) and of
 * `import_clearance` / `out_for_delivery` (stage 5): these are real events but
 * they do not deserve their own stage, and mapping them this way keeps the
 * progress bar strictly monotonic so it never appears to move backwards.
 */
const STAGE_INDEX: Record<ShipmentStatus, number | null> = {
  booked: 0,
  picked_up: 1,
  at_warehouse: 1,
  export_clearance: 2,
  departed: 3,
  in_transit: 3,
  arrived: 4,
  import_clearance: 4,
  out_for_delivery: 4,
  delivered: 5,
  delayed: null,
  on_hold: null,
};

export function isWarningStatus(status: string | null | undefined): boolean {
  return !!status && WARNING_STATUSES.includes(status as ShipmentStatus);
}

export function statusLabel(status: string | null | undefined): string {
  if (!status) return 'Unknown';
  return STATUS_LABELS[status as ShipmentStatus] ?? status;
}

export function stageIndexForStatus(status: string | null | undefined): number | null {
  if (!status) return null;
  const index = STAGE_INDEX[status as ShipmentStatus];
  return index === undefined ? null : index;
}

export interface EventLike {
  status: string;
  occurred_at: string;
}

/**
 * The stage to highlight. Warning statuses carry no stage of their own, so we
 * fall back to the most recent event that does, which keeps a delayed shipment
 * from collapsing the progress bar back to zero.
 */
export function resolveCurrentStage(
  currentStatus: string | null | undefined,
  events: readonly EventLike[] = []
): number | null {
  const direct = stageIndexForStatus(currentStatus);
  if (direct !== null) return direct;

  const ordered = [...events].sort(
    (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  );
  for (const event of ordered) {
    const index = stageIndexForStatus(event.status);
    if (index !== null) return index;
  }
  return null;
}

// ============================================================
// Tracking numbers
// ============================================================

/**
 * Excludes characters that are easy to confuse when a tracking number is read
 * aloud or copied by hand: no O/0/I/1.
 */
const TRACKING_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const TRACKING_NO_PATTERN = /^RGL-\d{2}(0[1-9]|1[0-2])-[A-HJ-NP-Z2-9]{6}$/;

function randomChar(): string {
  // Rejection sampling keeps the distribution uniform; a plain modulo would
  // bias toward the first few letters of the alphabet.
  const max = 256 - (256 % TRACKING_ALPHABET.length);
  const buf = new Uint8Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= max);
  return TRACKING_ALPHABET[value % TRACKING_ALPHABET.length];
}

export function generateTrackingSuffix(length = 6): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += randomChar();
  }
  return out;
}

/** RGL + YYMM + six random characters, e.g. `RGL-2609-K4T9QZ`. */
export function generateTrackingNo(now: Date = new Date()): string {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return `RGL-${yy}${mm}-${generateTrackingSuffix()}`;
}

/** Trims, upper-cases and collapses the spaces customers tend to paste in. */
export function normaliseTrackingInput(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

export function isValidTrackingNo(input: string): boolean {
  return TRACKING_NO_PATTERN.test(normaliseTrackingInput(input));
}

// ============================================================
// Phone
// ============================================================

/**
 * Normalises a Kenyan number to the `2547XXXXXXXX` form that wa.me expects.
 * Returns an empty string when the input is not a usable number.
 */
export function normalisePhone(input: string | null | undefined): string {
  if (!input) return '';
  const digits = input.replace(/\D/g, '');
  if (digits.length < 9) return '';
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return '';
}

export function isValidPhone(input: string | null | undefined): boolean {
  return /^2547\d{8}$/.test(normalisePhone(input));
}

export function whatsappLink(
  phone: string | null | undefined,
  message: string
): string {
  const normalised = normalisePhone(phone);
  if (!normalised) return '';
  return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
}

// ============================================================
// Select options
// ============================================================

export const SERVICE_OPTIONS = [
  'Air Freight',
  'Sea Freight',
  'Fresh Produce Logistics',
  'Customs Clearance',
  'Dangerous Goods Handling',
  'Warehousing & Distribution',
] as const;

export const CARGO_TYPE_OPTIONS = [
  'General',
  'Fresh produce',
  'Dangerous goods',
  'Time-sensitive',
  'Other',
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
export type CargoTypeOption = (typeof CARGO_TYPE_OPTIONS)[number];

// ============================================================
// Formatting
// ============================================================

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** `local` guards against a bare date string being parsed as UTC midnight. */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `T...` value for `<input type="datetime-local">`, interpreted as local time. */
export function toDateTimeInputValue(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

/** Converts a `datetime-local` value to an ISO instant for timestamptz. */
export function fromDateTimeInputValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
