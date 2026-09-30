import {
  STAGES,
  formatDateTime,
  isWarningStatus,
  resolveCurrentStage,
  statusLabel,
} from '../lib/tracking';
import type { TrackingEvent } from '../lib/api';
import { StatusBadge } from './StatusBadge';

interface TimelineProps {
  currentStatus: string;
  events: TrackingEvent[];
}

interface EventListProps {
  events: TrackingEvent[];
}

export function StageProgress({ currentStatus, events }: TimelineProps) {
  const currentIndex = resolveCurrentStage(currentStatus, events);
  const warning = isWarningStatus(currentStatus);

  return (
    <div className="stage-progress">
      <ol className="stage-progress__list">
        {STAGES.map((stage, index) => {
          const done = currentIndex !== null && index < currentIndex;
          const current = index === currentIndex;
          return (
            <li
              key={stage}
              className={[
                'stage-progress__step',
                done ? 'is-done' : '',
                current ? 'is-current' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={current ? 'step' : undefined}
            >
              <span className="stage-progress__marker" aria-hidden="true" />
              <span className="stage-progress__label">{stage}</span>
            </li>
          );
        })}
      </ol>

      {warning && (
        <p className="stage-progress__warning" role="status">
          This shipment is currently marked <strong>{statusLabel(currentStatus)}</strong>.
          Our team is handling it and will post the next update as soon as there is
          progress.
        </p>
      )}
    </div>
  );
}

export function Timeline({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <p className="timeline__empty">
        No public updates have been posted for this shipment yet.
      </p>
    );
  }

  return (
    <ol className="timeline">
      {events.map((event, index) => (
        <li
          key={`${event.occurred_at}-${index}`}
          className="timeline__item"
        >
          <div className="timeline__marker" aria-hidden="true" />
          <div className="timeline__body">
            <div className="timeline__head">
              <StatusBadge status={event.status} size="sm" />
              <time className="timeline__time" dateTime={event.occurred_at}>
                {formatDateTime(event.occurred_at)}
              </time>
            </div>
            {event.location && (
              <p className="timeline__location">{event.location}</p>
            )}
            {event.note && <p className="timeline__note">{event.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
