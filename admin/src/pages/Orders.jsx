import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPut, apiDelete } from '../api/client.js'

export default function Orders() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ totalPages: 1, totalOrders: 0, orders: [] })

  const load = useCallback(async (p = page) => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiGet(`/api/orders?page=${p}`)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load(1) }, [load])

  async function updateStatus(id, status) {
    try {
      await apiPut(`/api/orders/${id}`, { status })
      load(page)
    } catch (e) { alert(e.message) }
  }
  async function remove(id) {
    try { await apiDelete(`/api/orders/${id}`); load(page) } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Orders</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow mt-3">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Phone</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-100">
                    <td className="p-3">{new Date(o.createdAt || o.date).toLocaleString()}</td>
                    <td className="p-3">{o.customer?.name}</td>
                    <td className="p-3">{o.customer?.phone}</td>
                    <td className="p-3">{(o.productNames || []).map((n, i) => `${n} x${(o.quantities || [])[i] || 1}`).join(', ')}</td>
                    <td className="p-3">৳{o.priceTotal}</td>
                    <td className="p-3">{o.status || '-'}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <select className="px-2 py-1 rounded-md border border-gray-300" value={o.status || ''} onChange={(e) => updateStatus(o._id, e.target.value)}>
                          <option value="ordered">ordered</option>
                          <option value="ready_to_deliver">ready_to_deliver</option>
                          <option value="delivered">delivered</option>
                        </select>
                        <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={() => remove(o._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button disabled={page <= 1} onClick={() => { const np = page - 1; setPage(np); load(np) }} className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50">Prev</button>
            <span>Page {page} / {data.totalPages}</span>
            <button disabled={page >= data.totalPages} onClick={() => { const np = page + 1; setPage(np); load(np) }} className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  )
}
