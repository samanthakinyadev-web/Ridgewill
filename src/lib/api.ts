import { supabase } from './supabase';

/** Shape returned by the public `track_shipment` RPC. Carries no customer data. */
export interface TrackingEvent {
  status: string;
  location: string | null;
  note: string | null;
  occurred_at: string;
}

export interface TrackingResult {
  tracking_no: string;
  service: string;
  cargo_type: string | null;
  origin: string;
  destination: string;
  eta: string | null;
  current_status: string;
  updated_at: string;
  events: TrackingEvent[];
}

/** Full row, staff only. Never sent to a public route. */
export interface Shipment {
  id: string;
  tracking_no: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  reference: string | null;
  service: string;
  cargo_type: string | null;
  origin: string;
  destination: string;
  eta: string | null;
  current_status: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  status: string;
  location: string | null;
  note: string | null;
  is_public: boolean;
  occurred_at: string;
  created_at: string;
  created_by: string | null;
}

export type ShipmentDraft = Omit<Shipment, 'id' | 'created_at' | 'updated_at' | 'current_status'>;
export type ShipmentEventDraft = Omit<
  ShipmentEvent,
  'id' | 'shipment_id' | 'created_by' | 'created_at'
>;

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function requireClient() {
  if (!supabase) {
    throw new ApiError(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}

// ============================================================
// Public tracking
// ============================================================

/**
 * Looks up a shipment through the `track_shipment` RPC, which is the only
 * data path available to anonymous visitors. Returns null when no shipment has
 * that number, which is also how we answer for a malformed-but-valid number:
 * the public page must not distinguish "no such shipment" from "no access".
 */
export async function trackShipment(trackingNo: string): Promise<TrackingResult | null> {
  const client = requireClient();
  const { data, error } = await client.rpc('track_shipment', {
    p_tracking_no: trackingNo,
  });

  if (error) throw new ApiError(error.message);
  if (!data) return null;

  // The RPC is declared to return json, which PostgREST hands back already
  // parsed; guard anyway in case it arrives as a string.
  const parsed = typeof data === 'string' ? (JSON.parse(data) as TrackingResult) : (data as TrackingResult);
  return parsed ?? null;
}

// ============================================================
// Auth
// ============================================================

export async function signIn(email: string, password: string) {
  const client = requireClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new ApiError(error.message);
}

/**
 * Confirms the signed-in user is on the staff table. Supabase Auth success on
 * its own is not enough: RLS silently returns zero rows for non-staff, so we
 * check explicitly and surface a clear message instead of an empty dashboard.
 */
export async function isStaff(userId: string): Promise<boolean> {
  const client = requireClient();
  const { data, error } = await client.from('staff').select('user_id').eq('user_id', userId).maybeSingle();
  if (error) throw new ApiError(error.message);
  return data !== null;
}

export async function signOut() {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw new ApiError(error.message);
}

// ============================================================
// Admin queries
// ============================================================

export interface ShipmentListFilters {
  search: string;
  status: string;
  service: string;
  staleDays?: number;
  page: number;
  pageSize: number;
}

export interface ShipmentListResult {
  rows: Shipment[];
  total: number;
}

export async function listShipments({
  search,
  status,
  service,
  staleDays,
  page,
  pageSize,
}: ShipmentListFilters): Promise<ShipmentListResult> {
  const client = requireClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = client
    .from('shipments')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('current_status', status);
  if (service) query = query.eq('service', service);

  // Stale filter runs in Postgres so it stays correct across pages; doing it
  // client side would only ever see the current page.
  if (staleDays && staleDays > 0) {
    query = query.lt('updated_at', new Date(Date.now() - staleDays * 86_400_000).toISOString());
  }

  const term = search.trim();
  if (term) {
    // Postgres OR across the four searchable columns; the wildcard wrapping
    // gives a contains match. ilike is used so staff need not match case.
    const pattern = `%${term.replace(/[%_]/g, (c) => `\\${c}`)}%`;
    query = query.or(
      `tracking_no.ilike.${pattern},customer_name.ilike.${pattern},origin.ilike.${pattern},destination.ilike.${pattern}`
    );
  }

  const { data, error, count } = await query;
  if (error) throw new ApiError(error.message);
  return { rows: (data as Shipment[]) ?? [], total: count ?? 0 };
}

export async function getShipment(id: string): Promise<Shipment | null> {
  const client = requireClient();
  const { data, error } = await client.from('shipments').select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(error.message);
  return (data as Shipment) ?? null;
}

export async function getShipmentEvents(shipmentId: string): Promise<ShipmentEvent[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('shipment_events')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('occurred_at', { ascending: false });
  if (error) throw new ApiError(error.message);
  return (data as ShipmentEvent[]) ?? [];
}

export async function createShipment(draft: ShipmentDraft): Promise<Shipment> {
  const client = requireClient();
  const { data, error } = await client.from('shipments').insert(draft).select().single();
  if (error) throw new ApiError(error.message);
  return data as Shipment;
}

export async function updateShipment(id: string, draft: Partial<ShipmentDraft>): Promise<Shipment> {
  const client = requireClient();
  const { data, error } = await client
    .from('shipments')
    .update(draft)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new ApiError(error.message);
  return data as Shipment;
}

export async function deleteShipment(id: string): Promise<void> {
  const client = requireClient();
  const { error } = await client.from('shipments').delete().eq('id', id);
  if (error) throw new ApiError(error.message);
  // Events go with it via on delete cascade.
}

export async function createEvent(
  shipmentId: string,
  draft: ShipmentEventDraft
): Promise<ShipmentEvent> {
  const client = requireClient();
  const { data, error } = await client
    .from('shipment_events')
    .insert({ ...draft, shipment_id: shipmentId })
    .select()
    .single();
  if (error) throw new ApiError(error.message);
  return data as ShipmentEvent;
}

export async function updateEvent(id: string, draft: Partial<ShipmentEventDraft>): Promise<ShipmentEvent> {
  const client = requireClient();
  const { data, error } = await client
    .from('shipment_events')
    .update(draft)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new ApiError(error.message);
  return data as ShipmentEvent;
}

export async function deleteEvent(id: string): Promise<void> {
  const client = requireClient();
  const { error } = await client.from('shipment_events').delete().eq('id', id);
  if (error) throw new ApiError(error.message);
}
