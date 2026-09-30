import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listShipments, type Shipment } from '../../lib/api';
import {
  SERVICE_OPTIONS,
  STATUSES,
  formatDateTime,
  statusLabel,
} from '../../lib/tracking';
import { StatusBadge } from '../../components/StatusBadge';

const PAGE_SIZE = 20;

export function ShipmentListPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [service, setService] = useState('');
  const [staleOnly, setStaleOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<Shipment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await listShipments({
        search,
        status,
        service,
        staleDays: staleOnly ? 3 : undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setRows(result.rows);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load shipments.');
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, status, service, staleOnly, page]);

  useEffect(() => {
    void load();
  }, [load]);

  // Any filter change invalidates the current page number.
  const resetPage = () => setPage(1);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>Shipments</h1>
          <p className="admin-page__subtitle">
            {total} shipment{total === 1 ? '' : 's'} match your filters.
          </p>
        </div>
        <Link to="/admin/shipments/new" className="btn btn-md btn-primary">
          New shipment
        </Link>
      </header>

      <form
        className="admin-filters"
        onSubmit={(e) => {
          e.preventDefault();
          resetPage();
          void load();
        }}
      >
        <div className="admin-field admin-field--grow">
          <label htmlFor="search" className="admin-label">
            Search
          </label>
          <input
            id="search"
            type="search"
            className="admin-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Tracking number, customer, origin or destination"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="status" className="admin-label">
            Status
          </label>
          <select
            id="status"
            className="admin-input"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
          >
            <option value="">All statuses</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="service" className="admin-label">
            Service
          </label>
          <select
            id="service"
            className="admin-input"
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              resetPage();
            }}
          >
            <option value="">All services</option>
            {SERVICE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={staleOnly}
            onChange={(e) => {
              setStaleOnly(e.target.checked);
              resetPage();
            }}
          />
          <span>Not updated in 3 days</span>
        </label>
      </form>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="admin-loading" role="status">
          <div className="page-loader__spinner" />
          <p>Loading shipments…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">
          <h2>No shipments found</h2>
          <p>Try clearing the filters, or create the first shipment.</p>
          <Link to="/admin/shipments/new" className="btn btn-md btn-primary">
            New shipment
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Tracking number</th>
                <th scope="col">Customer</th>
                <th scope="col">Route</th>
                <th scope="col">Service</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((shipment) => (
                <tr key={shipment.id}>
                  <td>
                    <Link to={`/admin/shipments/${shipment.id}`} className="admin-table__link">
                      {shipment.tracking_no}
                    </Link>
                  </td>
                  <td>{shipment.customer_name || '—'}</td>
                  <td>
                    {shipment.origin} → {shipment.destination}
                  </td>
                  <td>{shipment.service}</td>
                  <td>
                    <StatusBadge status={shipment.current_status} size="sm" />
                  </td>
                  <td className="admin-table__muted">
                    {formatDateTime(shipment.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Pagination">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

export default ShipmentListPage;
