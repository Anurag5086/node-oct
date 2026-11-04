import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminGuard } from './admin/AdminGuard'
import { AdminLayout } from './admin/AdminLayout'
import { AdminCategoriesPage } from './admin/pages/AdminCategoriesPage'
import { AdminOrdersPage } from './admin/pages/AdminOrdersPage'
import { AdminOverviewPage } from './admin/pages/AdminOverviewPage'
import { AdminProductsPage } from './admin/pages/AdminProductsPage'
import { AdminUsersPage } from './admin/pages/AdminUsersPage'
import { BagPage } from './pages/BagPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MyOrdersPage } from './pages/MyOrdersPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/bag" element={<BagPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<MyOrdersPage />} />
      <Route path="/order/success/:orderId" element={<OrderConfirmationPage />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
