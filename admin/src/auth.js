const KEY = 'admin_token'

export function setToken(token) {
  const expiresAt = Date.now() + 3 * 24 * 60 * 60 * 1000
  localStorage.setItem(KEY, JSON.stringify({ token, expiresAt }))
}

export function getToken() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const obj = JSON.parse(raw)
    if (!obj || !obj.token || !obj.expiresAt) return null
    if (Date.now() > obj.expiresAt) {
      localStorage.removeItem(KEY)
      return null
    }
    return obj.token
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(KEY)
}
