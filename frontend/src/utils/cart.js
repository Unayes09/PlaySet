const KEY = 'playset_cart';

export function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === item.id);
  if (idx >= 0) cart[idx].qty += item.qty || 1;
  else cart.push({ ...item, qty: item.qty || 1 });
  setCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  setCart(cart);
}

export function clearCart() {
  setCart([]);
}
