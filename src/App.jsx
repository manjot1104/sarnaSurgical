import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import MachinePage from './pages/MachinePage'
import CategoriesOverview from './pages/CategoriesOverview'
import TrackOrder from './pages/TrackOrder'
import OrderDetail from './pages/OrderDetail'
import OrderConfirmation from './pages/OrderConfirmation'
import MyOrders from './pages/MyOrders'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'

export default function App() {
  return (
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
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminLogin />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:orderId" element={<AdminOrderDetail />} />
      </Route>
    </Routes>
  )
}
