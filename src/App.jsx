import { Routes, Route } from 'react-router-dom'
import { CatalogProvider } from './context/CatalogContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import MachinePage from './pages/MachinePage'
import CategoriesOverview from './pages/CategoriesOverview'
import TrackOrder from './pages/TrackOrder'
import OrderDetail from './pages/OrderDetail'
import OrderConfirmation from './pages/OrderConfirmation'
import MyOrders from './pages/MyOrders'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductEdit from './pages/admin/AdminProductEdit'
import AdminEnquiries from './pages/admin/AdminEnquiries'

export default function App() {
  return (
    <ErrorBoundary>
      <CatalogProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<CategoriesOverview />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route path="machine/:machineId" element={<MachinePage />} />
            <Route path="track" element={<TrackOrder />} />
            <Route path="order/:orderId" element={<OrderDetail />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminLogin />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<AdminOrderDetail />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductEdit />} />
            <Route path="products/:productId" element={<AdminProductEdit />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
          </Route>
        </Routes>
      </CatalogProvider>
    </ErrorBoundary>
  )
}
