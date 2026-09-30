import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createEvent,
  deleteEvent,
  deleteShipment,
  getShipment,
  getShipmentEvents,
  updateEvent,
  updateShipment,
  type Shipment,
  type ShipmentEvent,
} from '../../lib/api';
import {
  CARGO_TYPE_OPTIONS,
  SERVICE_OPTIONS,
  STATUSES,
  formatDateTime,
  fromDateTimeInputValue,
  isValidPhone,
  statusLabel,
  toDateInputValue,
  toDateTimeInputValue,
  whatsappLink,
} from '../../lib/tracking';
import { StatusBadge } from '../../components/StatusBadge';

interface EventFormState {
  status: string;
  location: string;
  note: string;
  occurred_at: string;
  is_public: boolean;
}

function nowLocalInput(): string {
  return toDateTimeInputValue(new Date().toISOString());
}

function notifyMessage(
  shipment: Shipment,
  event: { status: string; location: string | null; note: string | null }
): string {
  const trackingUrl = `${window.location.origin}/track/${shipment.tracking_no}`;
  const lines = [
    `Hello ${shipment.customer_name || ''},`.trim(),
    '',
    `Update on your shipment ${shipment.tracking_no}:`,
    `Status: ${statusLabel(event.status)}`,
  ];
  if (event.location) lines.push(`Location: ${event.location}`);
  if (event.note) lines.push(`Note: ${event.note}`);
  lines.push('', `Track it here: ${trackingUrl}`);
  return lines.join('\n');
}

export function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Shipment>>({});

  const [eventForm, setEventForm] = useState<EventFormState>({
    status: 'booked',
    location: '',
    note: '',
    occurred_at: nowLocalInput(),
    is_public: true,
  });
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventError, setEventError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [row, rowEvents] = await Promise.all([getShipment(id), getShipmentEvents(id)]);
      if (!row) {
        setError('That shipment no longer exists.');
        setShipment(null);
      } else {
        setShipment(row);
        setDraft({});
      }
      setEvents(rowEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the shipment.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shipment) return;
    setBusy(true);
    setError('');
    try {
      const updated = await updateShipment(shipment.id, {
        customer_name: draft.customer_name ?? shipment.customer_name,
        customer_email: draft.customer_email ?? shipment.customer_email,
        customer_phone: draft.customer_phone ?? shipment.customer_phone,
        reference: draft.reference ?? shipment.reference,
        service: draft.service ?? shipment.service,
        cargo_type: draft.cargo_type ?? shipment.cargo_type,
        origin: draft.origin ?? shipment.origin,
        destination: draft.destination ?? shipment.destination,
        eta: draft.eta ?? shipment.eta,
      });
      setShipment(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the changes.');
    } finally {
      setBusy(false);
    }
  };

  const startEditingEvent = (event: ShipmentEvent) => {
    setEditingEventId(event.id);
    setEventForm({
      status: event.status,
      location: event.location ?? '',
      note: event.note ?? '',
      occurred_at: toDateTimeInputValue(event.occurred_at),
      is_public: event.is_public,
    });
    setEventError('');
  };

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventForm({
      status: 'booked',
      location: '',
      note: '',
      occurred_at: nowLocalInput(),
      is_public: true,
    });
    setEventError('');
  };

  const submitEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shipment) return;

    const occurredAt = fromDateTimeInputValue(eventForm.occurred_at);
    if (!occurredAt) {
      setEventError('Enter a valid date and time.');
      return;
    }

    setBusy(true);
    setEventError('');
    try {
      const payload = {
        status: eventForm.status,
        location: eventForm.location.trim() || null,
        note: eventForm.note.trim() || null,
        is_public: eventForm.is_public,
        occurred_at: occurredAt,
      };

      if (editingEventId) {
        await updateEvent(editingEventId, payload);
      } else {
        await createEvent(shipment.id, payload);
      }

      resetEventForm();
      // Reload rather than patching locally: the current_status trigger runs
      // in Postgres, so the server is the only source of truth for it.
      await load();
    } catch (err) {
      setEventError(err instanceof Error ? err.message : 'Could not save the update.');
    } finally {
      setBusy(false);
    }
  };

  const onDeleteEvent = async (event: ShipmentEvent) => {
    if (!window.confirm('Delete this update? This cannot be undone.')) return;
    setBusy(true);
    try {
      await deleteEvent(event.id);
      if (editingEventId === event.id) resetEventForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the update.');
    } finally {
      setBusy(false);
    }
  };

  const onDeleteShipment = async () => {
    if (!shipment) return;
    const ok = window.confirm(
      `Delete shipment ${shipment.tracking_no}? All of its updates will be deleted too.`
    );
    if (!ok) return;
    setBusy(true);
    try {
      await deleteShipment(shipment.id);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the shipment.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading" role="status">
        <div className="page-loader__spinner" />
        <p>Loading shipment…</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="admin-empty">
        <h1>Shipment not found</h1>
        <p>{error || 'It may have been deleted.'}</p>
        <Link to="/admin" className="btn btn-md btn-primary">
          Back to list
        </Link>
      </div>
    );
  }

  const trackingUrl = `${window.location.origin}/track/${shipment.tracking_no}`;
  const canNotify = isValidPhone(shipment.customer_phone);
  const latestPublic = events.find((e) => e.is_public);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">
            <Link to="/admin">Shipments</Link>
          </p>
          <h1 className="admin-page__title">{shipment.tracking_no}</h1>
          <div className="admin-detail__badges">
            <StatusBadge status={shipment.current_status} />
            <span className="admin-detail__meta">{shipment.service}</span>
          </div>
        </div>
        <div className="admin-page__header-actions">
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
          >
            View public page
          </a>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? 'Close' : 'Edit details'}
          </button>
        </div>
      </header>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {editing ? (
        <form className="card admin-form" onSubmit={saveDetails} noValidate>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="customer_name" className="admin-label">
                Customer name
              </label>
              <input
                id="customer_name"
                className="admin-input"
                value={draft.customer_name ?? shipment.customer_name ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, customer_name: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="customer_email" className="admin-label">
                Customer email
              </label>
              <input
                id="customer_email"
                type="email"
                className="admin-input"
                value={draft.customer_email ?? shipment.customer_email ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, customer_email: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="customer_phone" className="admin-label">
                Customer phone
              </label>
              <input
                id="customer_phone"
                type="tel"
                className="admin-input"
                value={draft.customer_phone ?? shipment.customer_phone ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, customer_phone: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="reference" className="admin-label">
                Booking reference
              </label>
              <input
                id="reference"
                className="admin-input"
                value={draft.reference ?? shipment.reference ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, reference: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="service" className="admin-label">
                Service
              </label>
              <select
                id="service"
                className="admin-input"
                value={draft.service ?? shipment.service}
                onChange={(e) => setDraft((d) => ({ ...d, service: e.target.value }))}
              >
                {SERVICE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="cargo_type" className="admin-label">
                Cargo type
              </label>
              <select
                id="cargo_type"
                className="admin-input"
                value={draft.cargo_type ?? shipment.cargo_type ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, cargo_type: e.target.value }))}
              >
                <option value="">Not specified</option>
                {CARGO_TYPE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="origin" className="admin-label">
                Origin
              </label>
              <input
                id="origin"
                className="admin-input"
                value={draft.origin ?? shipment.origin}
                onChange={(e) => setDraft((d) => ({ ...d, origin: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="destination" className="admin-label">
                Destination
              </label>
              <input
                id="destination"
                className="admin-input"
                value={draft.destination ?? shipment.destination}
                onChange={(e) => setDraft((d) => ({ ...d, destination: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="eta" className="admin-label">
                Estimated arrival
              </label>
              <input
                id="eta"
                type="date"
                className="admin-input"
                value={toDateInputValue(draft.eta ?? shipment.eta)}
                onChange={(e) => setDraft((d) => ({ ...d, eta: e.target.value || null }))}
              />
            </div>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-md btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="btn btn-md btn-outline"
              onClick={() => {
                setDraft({});
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <section className="card admin-detail__summary">
          <dl className="admin-detail__grid">
            <div>
              <dt>Customer</dt>
              <dd>{shipment.customer_name || '—'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{shipment.customer_email || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{shipment.customer_phone || '—'}</dd>
            </div>
            <div>
              <dt>Reference</dt>
              <dd>{shipment.reference || '—'}</dd>
            </div>
            <div>
              <dt>Route</dt>
              <dd>
                {shipment.origin} → {shipment.destination}
              </dd>
            </div>
            <div>
              <dt>Cargo type</dt>
              <dd>{shipment.cargo_type || '—'}</dd>
            </div>
            <div>
              <dt>ETA</dt>
              <dd>{shipment.eta ? formatDateTime(shipment.eta) : '—'}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(shipment.created_at)}</dd>
            </div>
          </dl>
        </section>
      )}

      <section className="card admin-notify">
        <div>
          <h2>Notify the customer</h2>
          <p className="admin-hint">
            Opens WhatsApp with the latest public update and the tracking link.
            Nothing is sent automatically.
          </p>
        </div>
        {canNotify && latestPublic ? (
          <a
            href={whatsappLink(
              shipment.customer_phone,
              notifyMessage(shipment, latestPublic)
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-md btn-gold"
          >
            Send latest update on WhatsApp
          </a>
        ) : (
          <button
            type="button"
            className="btn btn-md btn-gold is-disabled"
            disabled
            title={
              canNotify
                ? 'Post a public update first, then you can send it.'
                : 'This customer has no valid phone number. Add one under Edit details.'
            }
          >
            Send latest update on WhatsApp
          </button>
        )}
      </section>

      <section className="card admin-events">
        <h2>{editingEventId ? 'Edit update' : 'Add an update'}</h2>
        <form className="admin-form" onSubmit={submitEvent} noValidate>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="event_status" className="admin-label">
                Status
              </label>
              <select
                id="event_status"
                className="admin-input"
                value={eventForm.status}
                onChange={(e) =>
                  setEventForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {statusLabel(value)}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="event_occurred_at" className="admin-label">
                Date and time
              </label>
              <input
                id="event_occurred_at"
                type="datetime-local"
                className="admin-input"
                value={eventForm.occurred_at}
                onChange={(e) =>
                  setEventForm((f) => ({ ...f, occurred_at: e.target.value }))
                }
              />
            </div>

            <div className="admin-field">
              <label htmlFor="event_location" className="admin-label">
                Location
              </label>
              <input
                id="event_location"
                className="admin-input"
                value={eventForm.location}
                onChange={(e) =>
                  setEventForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="e.g. Mombasa port"
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="event_note" className="admin-label">
              Note
            </label>
            <textarea
              id="event_note"
              className="admin-input"
              rows={3}
              value={eventForm.note}
              onChange={(e) => setEventForm((f) => ({ ...f, note: e.target.value }))}
            />
          </div>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={eventForm.is_public}
              onChange={(e) =>
                setEventForm((f) => ({ ...f, is_public: e.target.checked }))
              }
            />
            <span>
              Public — shown on the tracking page. Uncheck for an internal note.
            </span>
          </label>

          {eventError && (
            <p className="admin-error" role="alert">
              {eventError}
            </p>
          )}

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-md btn-primary" disabled={busy}>
              {busy ? 'Saving…' : editingEventId ? 'Save update' : 'Post update'}
            </button>
            {editingEventId && (
              <button
                type="button"
                className="btn btn-md btn-outline"
                onClick={resetEventForm}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card admin-events">
        <h2>History</h2>
        {events.length === 0 ? (
          <p className="admin-hint">No updates yet.</p>
        ) : (
          <ul className="admin-event-list">
            {events.map((event) => (
              <li key={event.id} className="admin-event">
                <div className="admin-event__head">
                  <StatusBadge status={event.status} size="sm" />
                  <span className={`admin-tag ${event.is_public ? '' : 'admin-tag--internal'}`}>
                    {event.is_public ? 'Public' : 'Internal'}
                  </span>
                  <time className="admin-event__time" dateTime={event.occurred_at}>
                    {formatDateTime(event.occurred_at)}
                  </time>
                </div>
                {event.location && <p className="admin-event__location">{event.location}</p>}
                {event.note && <p className="admin-event__note">{event.note}</p>}
                <div className="admin-event__actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => startEditingEvent(event)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => void onDeleteEvent(event)}
                    disabled={busy}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-danger">
        <div>
          <h2>Delete shipment</h2>
          <p className="admin-hint">
            This removes the shipment and all of its updates. It cannot be undone.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-md btn-danger"
          onClick={() => void onDeleteShipment()}
          disabled={busy}
        >
          Delete shipment
        </button>
      </section>
    </div>
  );
}

export default ShipmentDetailPage;
