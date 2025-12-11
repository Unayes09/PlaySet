import { useEffect, useState, useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '../api/client.js'

export default function Products() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ totalPages: 1, totalProducts: 0, products: [] })

  const [form, setForm] = useState({ name: '', actualPrice: '', offerPrice: '', stock: '', imageUrls: '', videoUrls: '', description: '' })
  const [imageFiles, setImageFiles] = useState([])
  const [videoFiles, setVideoFiles] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editImageFiles, setEditImageFiles] = useState([])
  const [editVideoFiles, setEditVideoFiles] = useState([])
  const [editSaving, setEditSaving] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [creating, setCreating] = useState(false)
  const videoRef = useRef(null)

  const closeLightbox = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setLightbox(null)
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') closeLightbox() }
    if (lightbox) { window.addEventListener('keydown', onKey) }
    return () => { window.removeEventListener('keydown', onKey) }
  }, [lightbox, closeLightbox])

  const load = useCallback(async (p = page) => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiGet(`/api/products?page=${p}`)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load(1) }, [load])

  function parseList(val) {
    return val.split(',').map((s) => s.trim()).filter(Boolean)
  }

  function uniq(arr) {
    const s = new Set(arr.filter(Boolean))
    return Array.from(s)
  }

  function combineUploadedFirst(uploadedArr, existingArr) {
    const u = (uploadedArr || []).filter(Boolean)
    const e = (existingArr || []).filter(Boolean)
    const setU = new Set(u)
    return uniq([...u, ...e.filter((x) => !setU.has(x))])
  }

  async function createProduct(e) {
    e.preventDefault()
    try {
      setCreating(true)
      let uploaded = { imageUrls: [], videoUrls: [] }
      if ((imageFiles && imageFiles.length) || (videoFiles && videoFiles.length)) {
        const fd = new FormData()
        imageFiles.forEach((f) => fd.append('images', f))
        videoFiles.forEach((f) => fd.append('videos', f))
        const res = await apiUpload('/api/uploads', fd)
        uploaded = res || uploaded
      }
      const body = {
        name: form.name,
        actualPrice: Number(form.actualPrice),
        offerPrice: form.offerPrice ? Number(form.offerPrice) : undefined,
        stock: Number(form.stock),
        imageUrls: combineUploadedFirst(uploaded.imageUrls, parseList(form.imageUrls)),
        videoUrls: combineUploadedFirst(uploaded.videoUrls, parseList(form.videoUrls)),
        description: form.description,
      }
      await apiPost('/api/products', body)
      setForm({ name: '', actualPrice: '', offerPrice: '', stock: '', imageUrls: '', videoUrls: '', description: '' })
      setImageFiles([])
      setVideoFiles([])
      load(page)
    } catch (err) { alert(err.message) }
    finally { setCreating(false) }
  }

  function startEdit(p) {
    setEditingId(p._id)
    setEditForm({
      name: p.name || '',
      actualPrice: p.actualPrice || '',
      offerPrice: p.offerPrice ?? '',
      stock: p.stock || '',
      imageUrls: (p.imageUrls || []).join(', '),
      videoUrls: (p.videoUrls || []).join(', '),
      description: p.description || '',
    })
    setEditImageFiles([])
    setEditVideoFiles([])
    setEditModalOpen(true)
  }

  async function saveEdit(id) {
    try {
      setEditSaving(true)
      let uploaded = { imageUrls: [], videoUrls: [] }
      if ((editImageFiles && editImageFiles.length) || (editVideoFiles && editVideoFiles.length)) {
        const fd = new FormData()
        editImageFiles.forEach((f) => fd.append('images', f))
        editVideoFiles.forEach((f) => fd.append('videos', f))
        const res = await apiUpload('/api/uploads', fd)
        uploaded = res || uploaded
      }
      const body = {
        name: editForm.name,
        actualPrice: Number(editForm.actualPrice),
        offerPrice: editForm.offerPrice !== '' ? Number(editForm.offerPrice) : undefined,
        stock: Number(editForm.stock),
        imageUrls: combineUploadedFirst(uploaded.imageUrls, parseList(editForm.imageUrls)),
        videoUrls: combineUploadedFirst(uploaded.videoUrls, parseList(editForm.videoUrls)),
        description: editForm.description,
      }
      await apiPut(`/api/products/${id}`, body)
      setEditingId(null)
      setEditModalOpen(false)
      load(page)
    } catch (err) { alert(err.message) }
    finally { setEditSaving(false) }
  }

  async function remove(id) { try { await apiDelete(`/api/products/${id}`); load(page) } catch (e) { alert(e.message) } }

  return (
    <div>
      <h2 className="text-xl font-semibold">Products</h2>
      <form onSubmit={createProduct} className="grid gap-2 my-3 bg-white rounded-xl shadow p-3">
        <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="flex gap-2">
          <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Actual Price" value={form.actualPrice} onChange={(e) => setForm({ ...form, actualPrice: e.target.value })} />
          <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Offer Price" value={form.offerPrice} onChange={(e) => setForm({ ...form, offerPrice: e.target.value })} />
          <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm">Upload Images</label>
            <input className="px-3 py-2 rounded-md border border-gray-300" type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Upload Videos</label>
            <input className="px-3 py-2 rounded-md border border-gray-300" type="file" accept="video/*" multiple onChange={(e) => setVideoFiles(Array.from(e.target.files || []))} />
          </div>
        </div>
        <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Image URLs (comma-separated)" value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} />
        <input className="px-3 py-2 rounded-md border border-gray-300" placeholder="Video URLs (comma-separated)" value={form.videoUrls} onChange={(e) => setForm({ ...form, videoUrls: e.target.value })} />
        <textarea className="px-3 py-2 rounded-md border border-gray-300" placeholder="Description (Markdown supported)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        {form.description && (
          <div className="rounded-md border border-gray-200 p-3 mt-2 bg-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-xl font-semibold mt-1 mb-1">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold mt-1 mb-1">{children}</h2>,
                p: ({ children }) => <p className="text-gray-700 mt-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-5 mt-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-5 mt-2">{children}</ol>,
                li: ({ children }) => <li className="mt-1">{children}</li>,
                a: ({ href, children }) => <a className="text-pink-600 hover:underline" href={href} target="_blank" rel="noreferrer">{children}</a>,
                code: ({ children }) => <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">{children}</code>,
                pre: ({ children }) => <pre className="bg-gray-100 rounded p-3 overflow-auto mt-2 text-sm">{children}</pre>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-3 text-gray-700 italic mt-2">{children}</blockquote>,
                table: ({ children }) => <div className="overflow-auto mt-2"><table className="min-w-full text-left border border-gray-200">{children}</table></div>,
                th: ({ children }) => <th className="border-b border-gray-200 px-2 py-1 font-semibold">{children}</th>,
                td: ({ children }) => <td className="border-b border-gray-100 px-2 py-1">{children}</td>,
              }}
            >
              {form.description}
            </ReactMarkdown>
          </div>
        )}
        <button disabled={creating} className="px-3 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-60" type="submit">{creating ? 'Adding...' : 'Add Product'}</button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-sm">Preview Images</div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {imageFiles.map((f, i) => (
              <img key={i} src={URL.createObjectURL(f)} className="w-20 h-20 object-cover rounded" />
            ))}
            {parseList(form.imageUrls).map((u, i) => (
              <img key={`u-${i}`} src={u} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm">Preview Videos</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {videoFiles.map((f, i) => (
              <video key={i} src={URL.createObjectURL(f)} className="w-full h-24 rounded" controls muted />
            ))}
            {parseList(form.videoUrls).map((u, i) => (
              <video key={`v-${i}`} src={u} className="w-full h-24 rounded" controls muted />
            ))}
          </div>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3">Name</th><th className="p-3">Prices</th><th className="p-3">Stock</th><th className="p-3">Images</th><th className="p-3">Videos</th><th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p._id} className="border-b border-gray-100">
                    <td className="p-3">{editingId === p._id ? (<input className="px-2 py-1 rounded-md border border-gray-300" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />) : p.name}</td>
                    <td className="p-3">
                      {editingId === p._id ? (
                        <div className="flex gap-2">
                          <input className="px-2 py-1 rounded-md border border-gray-300" value={editForm.actualPrice} onChange={(e) => setEditForm({ ...editForm, actualPrice: e.target.value })} />
                          <input className="px-2 py-1 rounded-md border border-gray-300" value={editForm.offerPrice} onChange={(e) => setEditForm({ ...editForm, offerPrice: e.target.value })} />
                        </div>
                      ) : (
                        <>৳{p.actualPrice} {p.offerPrice != null && (<strong className="text-pink-600">৳{p.offerPrice}</strong>)}</>
                      )}
                    </td>
                    <td className="p-3">{editingId === p._id ? (<input className="px-2 py-1 rounded-md border border-gray-300" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />) : p.stock}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {(p.imageUrls || []).slice(0, 3).map((u, i) => (
                          <img key={i} src={u} className="w-10 h-10 object-cover rounded cursor-pointer" onClick={() => setLightbox({ type: 'image', url: u })} />
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {(p.videoUrls || []).slice(0, 2).map((u, i) => (
                          <video key={i} src={u} className="w-16 h-10 rounded cursor-pointer" muted onClick={() => setLightbox({ type: 'video', url: u })} />
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={() => startEdit(p)}>Edit</button>
                        <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={() => remove(p._id)}>Delete</button>
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

          {editModalOpen && (
            <div className="fixed inset-0 z-[1200]">
              <div className="absolute inset-0 bg-black/35" onClick={() => { setEditModalOpen(false); setEditingId(null) }} />
              <div className="absolute inset-0 flex items-center justify-center p-3">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-[680px]">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Edit Product</h3>
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[70vh]">
                    <div className="grid gap-2">
                      <input className="px-3 py-2 rounded-md border border-gray-300 w-full" placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input className="px-3 py-2 rounded-md border border-gray-300 w-full" placeholder="Actual Price" value={editForm.actualPrice} onChange={(e) => setEditForm({ ...editForm, actualPrice: e.target.value })} />
                        <input className="px-3 py-2 rounded-md border border-gray-300 w-full" placeholder="Offer Price" value={editForm.offerPrice} onChange={(e) => setEditForm({ ...editForm, offerPrice: e.target.value })} />
                        <input className="px-3 py-2 rounded-md border border-gray-300 w-full" placeholder="Stock" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <label className="text-sm">Upload Images</label>
                          <input className="px-3 py-2 rounded-md border border-gray-300 w-full" type="file" accept="image/*" multiple onChange={(e) => setEditImageFiles(Array.from(e.target.files || []))} />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm">Upload Videos</label>
                          <input className="px-3 py-2 rounded-md border border-gray-300 w-full" type="file" accept="video/*" multiple onChange={(e) => setEditVideoFiles(Array.from(e.target.files || []))} />
                        </div>
                      </div>
                      <input className="px-3 py-2 rounded-md border border-gray-300 w-full" placeholder="Image URLs (comma-separated)" value={editForm.imageUrls} onChange={(e) => setEditForm({ ...editForm, imageUrls: e.target.value })} />
                      <input className="px-3 py-2 rounded-md border border-gray-300 w-full" placeholder="Video URLs (comma-separated)" value={editForm.videoUrls} onChange={(e) => setEditForm({ ...editForm, videoUrls: e.target.value })} />
                      <textarea className="px-3 py-2 rounded-md border border-gray-300 w-full" placeholder="Description (Markdown supported)" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      {editForm.description && (
                        <div className="rounded-md border border-gray-200 p-3 mt-2 bg-white">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => <h1 className="text-xl font-semibold mt-1 mb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg font-semibold mt-1 mb-1">{children}</h2>,
                              p: ({ children }) => <p className="text-gray-700 mt-2">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc ml-5 mt-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-5 mt-2">{children}</ol>,
                              li: ({ children }) => <li className="mt-1">{children}</li>,
                              a: ({ href, children }) => <a className="text-pink-600 hover:underline" href={href} target="_blank" rel="noreferrer">{children}</a>,
                              code: ({ children }) => <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">{children}</code>,
                              pre: ({ children }) => <pre className="bg-gray-100 rounded p-3 overflow-auto mt-2 text-sm">{children}</pre>,
                              blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-3 text-gray-700 italic mt-2">{children}</blockquote>,
                              table: ({ children }) => <div className="overflow-auto mt-2"><table className="min-w-full text-left border border-gray-200">{children}</table></div>,
                              th: ({ children }) => <th className="border-b border-gray-200 px-2 py-1 font-semibold">{children}</th>,
                              td: ({ children }) => <td className="border-b border-gray-100 px-2 py-1">{children}</td>,
                            }}
                          >
                            {editForm.description}
                          </ReactMarkdown>
                        </div>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <div className="text-sm">Preview Images</div>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {editImageFiles.map((f, i) => (
                              <img key={i} src={URL.createObjectURL(f)} className="w-20 h-20 object-cover rounded" />
                            ))}
                            {parseList(editForm.imageUrls).map((u, i) => (
                              <img key={`eu-${i}`} src={u} className="w-20 h-20 object-cover rounded" />
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm">Preview Videos</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {editVideoFiles.map((f, i) => (
                              <video key={i} src={URL.createObjectURL(f)} className="w-full h-24 rounded" controls muted />
                            ))}
                            {parseList(editForm.videoUrls).map((u, i) => (
                              <video key={`ev-${i}`} src={u} className="w-full h-24 rounded" controls muted />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 flex gap-2">
                    <button disabled={editSaving} className="px-3 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-60" onClick={() => saveEdit(editingId)}>{editSaving ? 'Saving...' : 'Save'}</button>
                    <button className="px-3 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={() => { setEditModalOpen(false); setEditingId(null) }}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {lightbox && (
            <div className="fixed inset-0 z-[1250]" onClick={closeLightbox}>
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-[90vw] max-h-[85vh] relative">
                  <button className="absolute top-2 right-2 z-20 rounded-md bg-black/70 text-white px-3 py-1" onClick={(e) => { e.stopPropagation(); closeLightbox(); }}>X</button>
                  {lightbox.type === 'image' ? (
                    <img src={lightbox.url} className="w-[80vw] max-w-[900px] h-auto object-contain" />
                  ) : (
                    <video ref={videoRef} src={lightbox.url} controls className="w-[80vw] max-w-[900px] h-auto" />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
