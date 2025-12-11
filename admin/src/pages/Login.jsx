import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPost } from '../api/client.js'
import { setToken } from '../auth.js'

export default function Login() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const res = await apiPost('/api/admin/login', { username, password })
      setToken(res.token)
      nav('/customers')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold">Admin Login</h2>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <form onSubmit={submit} className="grid gap-3 mt-4">
        <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="px-3 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  )
}
