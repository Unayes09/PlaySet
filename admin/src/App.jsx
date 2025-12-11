import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { getToken, logout } from './auth.js'
import Login from './pages/Login.jsx'
import Customers from './pages/Customers.jsx'
import Products from './pages/Products.jsx'
import Orders from './pages/Orders.jsx'

function Shell({ children }) {
  const nav = useNavigate()
  return (
    <div className="min-h-full">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <strong className="text-lg">Playset Admin</strong>
        <nav className="flex gap-3 text-sm ml-6">
          <Link className="text-gray-700 hover:text-pink-600" to="/customers">Customers</Link>
          <Link className="text-gray-700 hover:text-pink-600" to="/products">Products</Link>
          <Link className="text-gray-700 hover:text-pink-600" to="/orders">Orders</Link>
        </nav>
        <div className="ml-auto">
          <button onClick={() => { logout(); nav('/login') }} className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300">Logout</button>
        </div>
      </header>
      <main className="p-4 max-w-[1200px] mx-auto">{children}</main>
    </div>
  )
}

function RequireAuth({ children }) {
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/customers" element={<RequireAuth><Shell><Customers /></Shell></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><Shell><Products /></Shell></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Shell><Orders /></Shell></RequireAuth>} />
        <Route path="*" element={<Navigate to="/customers" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
