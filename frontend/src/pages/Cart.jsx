import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { getCart, removeFromCart, clearCart, setCart } from '../utils/cart.js';
import { apiPost } from '../api/client.js';

export default function Cart() {
  const [items, setItems] = useState(() => getCart());
  const [cust, setCust] = useState({ phone: '', name: '', address: '', additionalInfo: '', email: '', area: 'Sylhet' });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [orderError, setOrderError] = useState(null);

  
  const subtotal = items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.qty || 1), 0);
  const deliveryFee = cust.area === 'Sylhet' ? 0 : 110;
  const total = subtotal + deliveryFee;

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
    <div className="min-h-screen bg-slate-50 relative pb-10">
      {/* Intuitive Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <div className="max-w-[1100px] mx-auto px-3 pt-5 relative">
      <h2 className="text-2xl font-bold mb-3">Your Cart</h2>
      {!items.length ? (
        <div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl">Your cart is empty</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((i, idx) => (
            <div key={i.id} 
                 className={`grid grid-cols-[120px_1fr] gap-3 bg-white/70 border border-black/5 rounded-2xl overflow-hidden shadow-sm ${items.length > 1 ? 'sticky' : ''}`}
                 style={items.length > 1 ? { 
                   top: `${80 + (idx % 4) * 12}px`, 
                   zIndex: idx,
                   backdropFilter: 'blur(12px)',
                   WebkitBackdropFilter: 'blur(12px)'
                 } : {}}
            >
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

      <div className="bg-white border border-black/5 rounded-xl p-4 mt-4 sticky bottom-4 z-[100] shadow-lg">
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
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl border border-black/5">
                  <button 
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${cust.area === 'Sylhet' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setCust({ ...cust, area: 'Sylhet' })}
                  >
                    Sylhet (Free)
                  </button>
                  <button 
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${cust.area !== 'Sylhet' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setCust({ ...cust, area: 'Non-Sylhet' })}
                  >
                    Outside Sylhet (+৳110)
                  </button>
                </div>
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Phone*" value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Name*" value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Address*" value={cust.address} onChange={(e) => setCust({ ...cust, address: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Additional info" value={cust.additionalInfo} onChange={(e) => setCust({ ...cust, additionalInfo: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300" placeholder="Email*" value={cust.email} onChange={(e) => setCust({ ...cust, email: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button 
                  className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2 disabled:opacity-50" 
                  onClick={() => setConfirmOpen(true)}
                  disabled={!cust.phone || !cust.name || !cust.address || !cust.email}
                >
                  Place Order
                </button>
                <button className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2" onClick={() => setCheckoutOpen(false)}>Cancel</button>
              </div>
              <p className="text-gray-600 mt-2">Payment: Cash on Delivery</p>
              <p className="text-gray-600">Delivery: Sylhet (free), outside Sylhet (৳110)</p>
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
    </div>
  );
}
