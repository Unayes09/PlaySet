import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '../api/client.js'

export default function Customers() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [data, setData] = useState({ totalPages: 1, totalCustomers: 0, customers: [] })

  const load = useCallback(async (p = page, s = search) => {
    try {
      setLoading(true)
      setError(null)
      const q = new URLSearchParams()
      q.set('page', String(p))
      if (s.trim()) q.set('search', s.trim())
      const res = await apiGet(`/api/customers?${q.toString()}`)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { load(1) }, [load])

  function submitSearch(e) {
    e.preventDefault()
    setPage(1)
    load(1, search)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Customers</h2>
      <form onSubmit={submitSearch} className="flex gap-2 my-3">
        <input className="px-3 py-2 rounded-md border border-gray-300 flex-1" placeholder="Search by phone or name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300" type="submit">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3">Phone</th><th className="p-3">Name</th><th className="p-3">Address</th><th className="p-3">Email</th><th className="p-3">Additional</th>
                </tr>
              </thead>
              <tbody>
                {data.customers.map((c) => (
                  <tr key={c._id} className="border-b border-gray-100">
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.address}</td>
                    <td className="p-3">{c.email || '-'}</td>
                    <td className="p-3">{c.additionalInfo || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button disabled={page <= 1} onClick={() => { const np = page - 1; setPage(np); load(np, search) }} className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50">Prev</button>
            <span>Page {page} / {data.totalPages}</span>
            <button disabled={page >= data.totalPages} onClick={() => { const np = page + 1; setPage(np); load(np, search) }} className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  )
}
