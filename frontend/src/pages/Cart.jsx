import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { getCart, removeFromCart, clearCart, setCart } from '../utils/cart.js';
import { apiPost } from '../api/client.js';

export default function Cart() {
  const [items, setItems] = useState(() => getCart());
  const [cust, setCust] = useState({ phone: '', name: '', address: '', additionalInfo: '', email: '' });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [orderError, setOrderError] = useState(null);

  
  const total = items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.qty || 1), 0);

  function remove(id) { removeFromCart(id); setItems(getCart()); }
  function reset() { clearCart(); setItems([]); }

  function dec(id) {
    setItems((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, Number(i.qty || 1) - 1) } : i);
      setCart(updated);
      return updated;
    });
  }
  function inc(id) {
    setItems((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, qty: Math.min(99, Number(i.qty || 1) + 1) } : i);
      setCart(updated);
      return updated;
    });
  }

  async function checkout() {
    try {
      if (!items.length) return alert('Cart is empty');
      const productIds = items.map((i) => i.id);
      const productNames = items.map((i) => i.name);
      const quantities = items.map((i) => i.qty);
      const body = { customer: cust, productIds, productNames, quantities, priceTotal: total, status: 'ordered' };
      await apiPost('/api/orders', body);
      setOrderError(null);
      reset();
      setSuccessOpen(true);
    } catch (e) {
      setOrderError(e.message || 'Failed to place order');
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto px-3 my-5">
      <h2 className="text-2xl font-bold mb-3">Your Cart</h2>
      {!items.length ? (
        <div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl">Your cart is empty</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((i) => (
            <div key={i.id} className="grid grid-cols-[120px_1fr] gap-3 bg-white border border-black/5 rounded-xl overflow-hidden">
              <img className="w-[120px] h-[120px] object-contain bg-gray-100" src={i.imageUrl} alt={i.name} />
              <div className="p-3">
                <h4 className="font-semibold">{i.name}</h4>
                <div className="inline-flex items-center rounded-lg border border-black/10 overflow-hidden mt-2">
                  <button className="px-3 py-2 bg-gray-100 text-gray-900" onClick={() => dec(i.id)} aria-label="Decrease quantity">-</button>
                  <div className="px-4 py-2 min-w-10 text-center">{i.qty}</div>
                  <button className="px-3 py-2 bg-gray-100 text-gray-900" onClick={() => inc(i.id)} aria-label="Increase quantity">+</button>
                </div>
                <p>৳{i.price}</p>
                <button className="bg-gray-200 text-gray-900 rounded-lg px-3 py-2 mt-2" onClick={() => remove(i.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-black/5 rounded-xl p-4 mt-4">
        <div className="font-semibold">Total: ৳{total}</div>
        <div className="flex gap-3 mt-3">
          <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2" onClick={() => setCheckoutOpen(true)}>Checkout (COD)</button>
          <button className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2" onClick={reset}>Clear Cart</button>
        </div>
        <p className="text-gray-600 mt-2">Payment: Cash on Delivery</p>
      </div>

      {checkoutOpen && (
        <Motion.div className="fixed inset-0 z-[1100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/35" onClick={() => setCheckoutOpen(false)} />
          <Motion.div
            className="absolute right-0 inset-y-0 w-[92%] max-w-[420px] bg-white shadow-xl"
            initial={{ x: 460 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Checkout - Cash on Delivery</h3>
                <button className="rounded-full px-3 py-1 bg-gray-200 text-gray-900" onClick={() => setCheckoutOpen(false)}>Close</button>
              </div>
              <div className="font-semibold mt-1">Total: ৳{total}</div>
              {orderError && <p className="text-red-600 mt-2">{orderError}</p>}
              <div className="grid gap-3 my-3">
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Phone*" value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Name*" value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Address*" value={cust.address} onChange={(e) => setCust({ ...cust, address: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Additional info" value={cust.additionalInfo} onChange={(e) => setCust({ ...cust, additionalInfo: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Email" value={cust.email} onChange={(e) => setCust({ ...cust, email: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2" onClick={() => setConfirmOpen(true)}>Place Order</button>
                <button className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2" onClick={() => setCheckoutOpen(false)}>Cancel</button>
              </div>
              <p className="text-gray-600 mt-2">Payment: Cash on Delivery</p>
              <p className="text-gray-600">Delivery: Sylhet ~2 days (free), outside Sylhet ~7 days (৳150)</p>
            </div>
          </Motion.div>
        </Motion.div>
      )}

      {confirmOpen && (
        <Motion.div className="fixed inset-0 z-[1150]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/35" onClick={() => setConfirmOpen(false)} />
          <Motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div className="bg-white rounded-2xl p-4 w-[92%] max-w-[420px] shadow-xl">
              <h3 className="text-lg font-semibold">Confirm Checkout</h3>
              <p className="text-gray-700 mt-1">Cash on Delivery — Total ৳{total}</p>
              <div className="flex gap-3 mt-3">
                <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2" onClick={() => { setConfirmOpen(false); checkout(); }}>Confirm</button>
                <button className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2" onClick={() => setConfirmOpen(false)}>Cancel</button>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}

      {successOpen && (
        <Motion.div className="fixed inset-0 z-[1150]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/35" onClick={() => { setSuccessOpen(false); setCheckoutOpen(false); }} />
          <Motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div className="bg-white rounded-2xl p-4 w-[92%] max-w-[420px] shadow-xl text-center">
              <h3 className="text-lg font-semibold">Order placed</h3>
              <p className="text-gray-700 mt-1">Thank you! We’ll contact you soon.</p>
              <button className="mt-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2" onClick={() => { setSuccessOpen(false); setCheckoutOpen(false); }}>Close</button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </div>
  );
}
