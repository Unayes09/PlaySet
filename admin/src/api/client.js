export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
import { getToken } from '../auth.js'

async function request(path, init = {}) {
  const isFormData = init && init.body && typeof FormData !== 'undefined' && init.body instanceof FormData
  const headers = { ...(init.headers || {}) }
  if (!isFormData) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export function apiGet(path) { return request(path) }
export function apiPost(path, body) { return request(path, { method: 'POST', body: JSON.stringify(body) }) }
export function apiPut(path, body) { return request(path, { method: 'PUT', body: JSON.stringify(body) }) }
export function apiDelete(path) { return request(path, { method: 'DELETE' }) }
export function apiUpload(path, formData) { return request(path, { method: 'POST', body: formData }) }
