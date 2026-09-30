import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/Home';

const ServicePage = lazy(() => import('./pages/Service'));
const PortfolioPage = lazy(() => import('./pages/Portfolio'));
const ContactPage = lazy(() => import('./pages/Contact'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const TrackPage = lazy(() => import('./pages/Track'));
const AdminLoginPage = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const ShipmentListPage = lazy(() => import('./pages/admin/ShipmentList'));
const ShipmentFormPage = lazy(() => import('./pages/admin/ShipmentForm'));
const ShipmentDetailPage = lazy(() => import('./pages/admin/ShipmentDetail'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <div className="page-loader__spinner"></div>
    </div>
  );
}

export function App() {
  return (
    <>
      <ScrollToTop />
      {/* Every page below is lazy-loaded, so the top level needs a boundary of
          its own. The admin routes sit outside the marketing shell and have no
          inner Suspense, so without this /admin/login suspends into a crash. */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin runs outside the marketing shell: no site header or footer, so
              staff get a full-height, one-handed-friendly surface. ProtectedRoute
              and AdminLayout both render an Outlet, hence the nesting. */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<ShipmentListPage />} />
              <Route path="shipments/new" element={<ShipmentFormPage />} />
              <Route path="shipments/:id" element={<ShipmentDetailPage />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <>
                <Header />
                <main>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/services/:slug" element={<ServicePage />} />
                      <Route path="/portfolio" element={<PortfolioPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/track" element={<TrackPage />} />
                      <Route path="/track/:trackingNo" element={<TrackPage />} />
                      <Route path="/404" element={<NotFoundPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
