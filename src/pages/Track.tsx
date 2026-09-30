import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { company } from '../content/company';
import { isSupabaseConfigured } from '../lib/supabase';
import { trackShipment, type TrackingResult } from '../lib/api';
import {
  formatDate,
  formatDateTime,
  isValidTrackingNo,
  normaliseTrackingInput,
} from '../lib/tracking';
import { Seo, NoIndex } from '../components/Seo';
import { StatusBadge } from '../components/StatusBadge';
import { StageProgress, Timeline } from '../components/Timeline';

type ViewState = 'idle' | 'loading' | 'found' | 'notfound' | 'error';

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API needs a secure context; fall back to a temporary input.
      const field = document.createElement('input');
      field.value = value;
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(field);
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" className="btn btn-md btn-outline" onClick={copy}>
      {copied ? 'Copied' : label}
    </button>
  );
}

function ShipmentResult({
  result,
  shareUrl,
}: {
  result: TrackingResult;
  shareUrl: string;
}) {
  return (
    <article className="track-result card">
      <header className="track-result__header">
        <div>
          <p className="track-result__label">Tracking number</p>
          <h2 className="track-result__no">{result.tracking_no}</h2>
        </div>
        <StatusBadge status={result.current_status} />
      </header>

      <dl className="track-result__grid">
        <div className="track-result__field">
          <dt>Service</dt>
          <dd>{result.service}</dd>
        </div>
        <div className="track-result__field">
          <dt>Cargo type</dt>
          <dd>{result.cargo_type || 'Not specified'}</dd>
        </div>
        <div className="track-result__field">
          <dt>Origin</dt>
          <dd>{result.origin}</dd>
        </div>
        <div className="track-result__field">
          <dt>Destination</dt>
          <dd>{result.destination}</dd>
        </div>
        <div className="track-result__field">
          <dt>Estimated arrival</dt>
          <dd>{result.eta ? formatDate(result.eta) : 'To be confirmed'}</dd>
        </div>
        <div className="track-result__field">
          <dt>Last updated</dt>
          <dd>{formatDateTime(result.updated_at)}</dd>
        </div>
      </dl>

      <section className="track-result__section" aria-label="Progress">
        <h3>Progress</h3>
        <StageProgress currentStatus={result.current_status} events={result.events} />
      </section>

      <section className="track-result__section" aria-label="Updates">
        <h3>Updates</h3>
        <Timeline events={result.events} />
      </section>

      <footer className="track-result__footer">
        <CopyButton value={shareUrl} label="Copy tracking link" />
        <Link to="/contact" className="btn btn-md btn-outline">
          Contact us
        </Link>
      </footer>
    </article>
  );
}

export function TrackPage() {
  const { trackingNo } = useParams<{ trackingNo: string }>();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [state, setState] = useState<ViewState>('idle');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const lookup = useCallback(async (raw: string) => {
    const trackingNo = normaliseTrackingInput(raw);

    if (!isValidTrackingNo(trackingNo)) {
      setFormError('Enter a tracking number in the format RGL-2609-K4T9QZ.');
      return;
    }

    setFormError('');
    setState('loading');

    try {
      const found = await trackShipment(trackingNo);
      if (found) {
        setResult(found);
        setState('found');
      } else {
        setResult(null);
        setState('notfound');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (trackingNo) {
      setInput(trackingNo);
      void lookup(trackingNo);
    }
  }, [trackingNo, lookup]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trackingNo = normaliseTrackingInput(input);
    if (!isValidTrackingNo(trackingNo)) {
      setFormError('Enter a tracking number in the format RGL-2609-K4T9QZ.');
      return;
    }
    // Navigating only to a path we build from an already-validated format,
    // never from raw input.
    navigate(`/track/${trackingNo}`);
  };

  // Without a number in the URL the page is always the bare search form, so the
  // "reset to idle" behaviour is derived during render rather than pushed from
  // an effect.
  const viewState: ViewState = trackingNo ? state : 'idle';
  const viewResult: TrackingResult | null = trackingNo ? result : null;
  const showResult = viewState === 'found' && viewResult !== null;

  const shareUrl =
    typeof window !== 'undefined' && viewResult
      ? `${window.location.origin}/track/${viewResult.tracking_no}`
      : '';

  const notFoundMessage = encodeURIComponent(
    `Hello ${company.name}, please update me on shipment ${normaliseTrackingInput(
      input || trackingNo || ''
    )}.`
  );

  return (
    <div className="track-page">
      <Seo
        title="Track your shipment"
        description="Enter your Ridgewill tracking number to see the current status, route and dated updates for your shipment."
      />
      {showResult && <NoIndex />}

      <section className="track-page__hero" aria-labelledby="track-title">
        <div className="container">
          <h1 className="track-page__title" id="track-title">
            Track your shipment
          </h1>
          <p className="track-page__subtitle">
            Enter the tracking number from your booking confirmation to see where
            your cargo is and what happens next.
          </p>
        </div>
      </section>

      <section className="track-page__content" aria-label="Shipment result">
        <div className="container">
          <form className="track-form card" onSubmit={onSubmit} noValidate>
            <label htmlFor="trackingNo" className="track-form__label">
              Tracking number
            </label>
            <div className="track-form__row">
              <input
                id="trackingNo"
                name="trackingNo"
                type="text"
                className={`track-form__input ${formError ? 'error' : ''}`}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="RGL-2609-K4T9QZ"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                inputMode="text"
                required
                aria-invalid={!!formError}
                aria-describedby={formError ? 'trackingNo-error' : 'trackingNo-help'}
              />
              <button type="submit" className="btn btn-md btn-primary">
                Track
              </button>
            </div>
            {formError ? (
              <span id="trackingNo-error" className="track-form__error" role="alert">
                {formError}
              </span>
            ) : (
              <span id="trackingNo-help" className="track-form__help">
                Numbers are not case sensitive.
              </span>
            )}
          </form>

          {!isSupabaseConfigured && (
            <div className="track-notice" role="status">
              <h2>Tracking is not available yet</h2>
              <p>
                This site has not been connected to the shipment database yet. Set{' '}
                <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>{' '}
                to enable live lookups. You can still{' '}
                <Link to="/contact">contact our team</Link> for a status update.
              </p>
            </div>
          )}

          {viewState === 'loading' && (
            <div className="track-status" role="status">
              <div className="page-loader__spinner" />
              <p>Looking up your shipment…</p>
            </div>
          )}

          {viewState === 'error' && (
            <div className="track-notice track-notice--error" role="alert">
              <h2>We could not reach the tracking service</h2>
              <p>{error}</p>
              <div className="track-notice__actions">
                <button
                  type="button"
                  className="btn btn-md btn-primary"
                  onClick={() => void lookup(trackingNo || input)}
                >
                  Try again
                </button>
                <Link to="/contact" className="btn btn-md btn-outline">
                  Contact us
                </Link>
              </div>
            </div>
          )}

          {viewState === 'notfound' && (
            <div className="track-notice" role="alert">
              <h2>We could not find that tracking number</h2>
              <p>
                Check for typos and try again. If you booked with us recently, our
                team can look it up for you.
              </p>
              <div className="track-notice__actions">
                <button
                  type="button"
                  className="btn btn-md btn-primary"
                  onClick={() => {
                    setState('idle');
                    setResult(null);
                    setInput('');
                  }}
                >
                  Check another number
                </button>
                <a
                  href={`${company.whatsappLink}?text=${notFoundMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-md btn-gold"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          )}

          {showResult && (
            <ShipmentResult result={viewResult} shareUrl={shareUrl} />
          )}
        </div>
      </section>
    </div>
  );
}

export default TrackPage;
