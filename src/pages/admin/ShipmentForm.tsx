import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { company } from '../../content/company';
import { createShipment, type Shipment } from '../../lib/api';
import {
  CARGO_TYPE_OPTIONS,
  SERVICE_OPTIONS,
  STATUS_LABELS,
  generateTrackingNo,
  isValidTrackingNo,
  normalisePhone,
  normaliseTrackingInput,
} from '../../lib/tracking';

interface FormState {
  tracking_no: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reference: string;
  service: string;
  cargo_type: string;
  origin: string;
  destination: string;
  eta: string;
}

const INITIAL: FormState = {
  tracking_no: generateTrackingNo(),
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  reference: '',
  service: '',
  cargo_type: '',
  origin: '',
  destination: '',
  eta: '',
};

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      <div className="admin-copy">
        <code className="admin-copy__value">{value}</code>
        <button type="button" className="btn btn-sm btn-outline" onClick={() => void copy()}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export function ShipmentFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<Shipment | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');

  const update =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
    };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!isValidTrackingNo(form.tracking_no)) {
      next.tracking_no = 'Use the format RGL-2609-K4T9QZ with no letter O or digit 0.';
    }
    if (!form.customer_name.trim()) next.customer_name = 'Customer name is required.';
    if (form.customer_email.trim() && !/\S+@\S+\.\S+/.test(form.customer_email.trim())) {
      next.customer_email = 'Enter a valid email address.';
    }
    if (!form.service) next.service = 'Select a service.';
    if (!form.origin.trim()) next.origin = 'Origin is required.';
    if (!form.destination.trim()) next.destination = 'Destination is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setFailure('');
    try {
      const shipment = await createShipment({
        tracking_no: normaliseTrackingInput(form.tracking_no),
        customer_name: form.customer_name.trim() || null,
        customer_email: form.customer_email.trim() || null,
        customer_phone: normalisePhone(form.customer_phone) || null,
        reference: form.reference.trim() || null,
        service: form.service,
        cargo_type: form.cargo_type || null,
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        eta: form.eta || null,
      });
      setCreated(shipment);
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Could not save the shipment.');
    } finally {
      setBusy(false);
    }
  };

  if (created) {
    const trackingUrl = `${window.location.origin}/track/${created.tracking_no}`;
    const message = [
      `Hello ${created.customer_name || ''},`.trim(),
      '',
      `Your shipment ${created.tracking_no} is now booked with ${company.name}.`,
      `Route: ${created.origin} → ${created.destination}`,
      `Service: ${created.service}`,
      '',
      `Track it here: ${trackingUrl}`,
    ].join('\n');

    return (
      <div className="admin-page">
        <header className="admin-page__header">
          <div>
            <h1>Shipment created</h1>
            <p className="admin-page__subtitle">
              It is booked and waiting for its first update.
            </p>
          </div>
        </header>

        <div className="card admin-success">
          <CopyField label="Tracking number" value={created.tracking_no} />
          <CopyField label="Customer tracking link" value={trackingUrl} />
          <CopyField label="Message to send to the customer" value={message} />

          <div className="admin-success__actions">
            {created.customer_phone ? (
              <a
                href={`https://wa.me/${normalisePhone(created.customer_phone)}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-md btn-gold"
              >
                Open in WhatsApp
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-md btn-gold is-disabled"
                disabled
                title="Add a customer phone number to send WhatsApp messages"
              >
                Open in WhatsApp
              </button>
            )}
            <Link
              to={`/admin/shipments/${created.id}`}
              className="btn btn-md btn-primary"
            >
              Add the first update
            </Link>
            <Link to="/admin" className="btn btn-md btn-outline">
              Back to list
            </Link>
          </div>
          {!created.customer_phone && (
            <p className="admin-hint">
              No customer phone number was saved, so the WhatsApp link is not
              available. You can add one from the shipment page.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>New shipment</h1>
          <p className="admin-page__subtitle">
            A tracking number is generated for you. You can change it until you save.
          </p>
        </div>
        <Link to="/admin" className="btn btn-md btn-outline">
          Cancel
        </Link>
      </header>

      <form className="card admin-form" onSubmit={onSubmit} noValidate>
        <fieldset className="admin-fieldset">
          <legend>Tracking</legend>
          <div className="admin-field">
            <label htmlFor="tracking_no" className="admin-label">
              Tracking number <span className="required">*</span>
            </label>
            <div className="admin-inline">
              <input
                id="tracking_no"
                name="tracking_no"
                type="text"
                className={`admin-input ${errors.tracking_no ? 'error' : ''}`}
                value={form.tracking_no}
                onChange={update('tracking_no')}
                spellCheck={false}
                aria-invalid={!!errors.tracking_no}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setForm((prev) => ({ ...prev, tracking_no: generateTrackingNo() }))}
              >
                Regenerate
              </button>
            </div>
            {errors.tracking_no && (
              <span className="admin-field__error" role="alert">
                {errors.tracking_no}
              </span>
            )}
          </div>

          <div className="admin-field">
            <label htmlFor="reference" className="admin-label">
              Booking reference
            </label>
            <input
              id="reference"
              name="reference"
              type="text"
              className="admin-input"
              value={form.reference}
              onChange={update('reference')}
              placeholder="Internal only"
            />
          </div>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>Customer (internal only — never shown publicly)</legend>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="customer_name" className="admin-label">
                Name <span className="required">*</span>
              </label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                className={`admin-input ${errors.customer_name ? 'error' : ''}`}
                value={form.customer_name}
                onChange={update('customer_name')}
                aria-invalid={!!errors.customer_name}
              />
              {errors.customer_name && (
                <span className="admin-field__error" role="alert">
                  {errors.customer_name}
                </span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="customer_email" className="admin-label">
                Email
              </label>
              <input
                id="customer_email"
                name="customer_email"
                type="email"
                className={`admin-input ${errors.customer_email ? 'error' : ''}`}
                value={form.customer_email}
                onChange={update('customer_email')}
                aria-invalid={!!errors.customer_email}
              />
              {errors.customer_email && (
                <span className="admin-field__error" role="alert">
                  {errors.customer_email}
                </span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="customer_phone" className="admin-label">
                Phone / WhatsApp
              </label>
              <input
                id="customer_phone"
                name="customer_phone"
                type="tel"
                className="admin-input"
                value={form.customer_phone}
                onChange={update('customer_phone')}
                placeholder="0721 148 009"
              />
              <span className="admin-hint">Stored as 2547XXXXXXXX for WhatsApp.</span>
            </div>
          </div>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>Shipment</legend>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="service" className="admin-label">
                Service <span className="required">*</span>
              </label>
              <select
                id="service"
                name="service"
                className={`admin-input ${errors.service ? 'error' : ''}`}
                value={form.service}
                onChange={update('service')}
                aria-invalid={!!errors.service}
              >
                <option value="">Select a service</option>
                {SERVICE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.service && (
                <span className="admin-field__error" role="alert">
                  {errors.service}
                </span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="cargo_type" className="admin-label">
                Cargo type
              </label>
              <select
                id="cargo_type"
                name="cargo_type"
                className="admin-input"
                value={form.cargo_type}
                onChange={update('cargo_type')}
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
                Origin <span className="required">*</span>
              </label>
              <input
                id="origin"
                name="origin"
                type="text"
                className={`admin-input ${errors.origin ? 'error' : ''}`}
                value={form.origin}
                onChange={update('origin')}
                aria-invalid={!!errors.origin}
              />
              {errors.origin && (
                <span className="admin-field__error" role="alert">
                  {errors.origin}
                </span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="destination" className="admin-label">
                Destination <span className="required">*</span>
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                className={`admin-input ${errors.destination ? 'error' : ''}`}
                value={form.destination}
                onChange={update('destination')}
                aria-invalid={!!errors.destination}
              />
              {errors.destination && (
                <span className="admin-field__error" role="alert">
                  {errors.destination}
                </span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="eta" className="admin-label">
                Estimated arrival
              </label>
              <input
                id="eta"
                name="eta"
                type="date"
                className="admin-input"
                value={form.eta}
                onChange={update('eta')}
              />
            </div>
          </div>
        </fieldset>

        {failure && (
          <p className="admin-error" role="alert">
            {failure}
          </p>
        )}

        <div className="admin-form__actions">
          <button type="submit" className="btn btn-md btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Create shipment'}
          </button>
          <button
            type="button"
            className="btn btn-md btn-outline"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </button>
        </div>

        <p className="admin-hint">
          New shipments start as <strong>{STATUS_LABELS.booked}</strong>. The status
          changes as you post public updates.
        </p>
      </form>
    </div>
  );
}

export default ShipmentFormPage;
