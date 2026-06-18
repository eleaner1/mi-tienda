import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import { useAuth } from "@/hooks/useAuth";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Lazy-load every route except Home (first paint)
const Login          = lazy(() => import("@/pages/Login"));
const CartPage       = lazy(() => import("@/pages/CartPage"));
const OrdersPage     = lazy(() => import("@/pages/OrdersPage"));
const SearchPage     = lazy(() => import("@/pages/SearchPage"));
const OffersPage     = lazy(() => import("@/pages/OffersPage"));
const TrendingPage   = lazy(() => import("@/pages/TrendingPage"));
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"));
const CategoryPage   = lazy(() => import("@/pages/CategoryPage"));
const ProductDetail  = lazy(() => import("@/pages/ProductDetail"));

const AdminDashboard  = lazy(() => import("@/pages/AdminDashboard"));
const AdminCategories = lazy(() => import("@/pages/AdminCategories"));
const AdminProducts   = lazy(() => import("@/pages/AdminProducts"));
const AdminOffers     = lazy(() => import("@/pages/AdminOffers"));
const AdminInventory  = lazy(() => import("@/pages/AdminInventory"));
const AdminOrders     = lazy(() => import("@/pages/AdminOrders"));
const AdminSettings   = lazy(() => import("@/pages/AdminSettings"));
const AdminReports    = lazy(() => import("@/pages/AdminReports"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><ScrollToTop /><Layout /></>}>
        <Route index element={<Home />} />

        <Route path="login"      element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
        <Route path="cart"       element={<Suspense fallback={<PageLoader />}><CartPage /></Suspense>} />
        <Route path="orders"     element={<Suspense fallback={<PageLoader />}><OrdersPage /></Suspense>} />
        <Route path="search"     element={<Suspense fallback={<PageLoader />}><SearchPage /></Suspense>} />
        <Route path="offers"     element={<Suspense fallback={<PageLoader />}><OffersPage /></Suspense>} />
        <Route path="trending"   element={<Suspense fallback={<PageLoader />}><TrendingPage /></Suspense>} />
        <Route path="categories" element={<Suspense fallback={<PageLoader />}><CategoriesPage /></Suspense>} />
        <Route path="category/:id" element={<Suspense fallback={<PageLoader />}><CategoryPage /></Suspense>} />
        <Route path="product/:id"  element={<Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>} />

        <Route path="admin" element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></AdminRoute>} />
        <Route path="admin/categories" element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminCategories /></Suspense></AdminRoute>} />
        <Route path="admin/products"   element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminProducts /></Suspense></AdminRoute>} />
        <Route path="admin/offers"     element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminOffers /></Suspense></AdminRoute>} />
        <Route path="admin/inventory"  element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminInventory /></Suspense></AdminRoute>} />
        <Route path="admin/orders"     element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminOrders /></Suspense></AdminRoute>} />
        <Route path="admin/settings"   element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminSettings /></Suspense></AdminRoute>} />
        <Route path="admin/reports"    element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminReports /></Suspense></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
