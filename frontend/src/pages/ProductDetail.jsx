import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { fetchAllProducts } from '../api/products.js';
import { addToCart } from '../utils/cart.js';
import { apiPost } from '../api/client.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProductDetail() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [cust, setCust] = useState({ phone: '', name: '', address: '', additionalInfo: '', email: '', area: 'Sylhet' });
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [addSuccessOpen, setAddSuccessOpen] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [qty, setQty] = useState(1);
  const product = useMemo(() => products.find((p) => (p._id || '') === id), [products, id]);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch((err) => { setError(err.message || 'Failed to load'); setLoading(false); });
  }, []);

  

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Grid for consistency */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <Motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* A brick-like loader or spinner */}
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full shadow-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-4 h-4 bg-pink-500 rounded-sm animate-pulse" />
          </div>
        </Motion.div>
        
        <Motion.p 
          className="mt-6 text-gray-500 font-medium tracking-wide uppercase text-xs"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Building your set...
        </Motion.p>
      </div>
    );
  }
  if (error) return <div className="detail-error">{error}</div>;
  if (!product) return <div className="detail-error">Product not found</div>;

  const price = product.offerPrice ?? product.actualPrice;
  const deliveryFee = cust.area === 'Sylhet' ? 0 : 110;
  const totalPrice = Number(price) * Number(qty) + deliveryFee;
  const displayImageIdx = (Array.isArray(product.imageUrls) && product.imageUrls[activeImageIdx]) ? activeImageIdx : 0;

  async function instantBuy() {
    try {
      const orderBody = {
        customer: cust,
        productIds: [product._id],
        productNames: [product.name],
        quantities: [qty],
        priceTotal: totalPrice,
        status: 'ordered',
      };
      await apiPost('/api/orders', orderBody);
      setOrderError(null);
      setSuccessOpen(true);
    } catch (e) {
      setOrderError(e.message || 'Failed to place order');
    }
  }

  function addCart() {
    addToCart({ id: product._id, name: product.name, price, imageUrl: product.imageUrls?.[0], qty });
    setAddSuccessOpen(true);
  }

  function decQty() {
    setQty((q) => Math.max(1, q - 1));
  }
  function incQty() {
    const max = Number(product?.stock) > 0 ? Number(product.stock) : 99;
    setQty((q) => Math.min(max, q + 1));
  }

  return (
    <div className="min-h-screen bg-slate-50 relative pb-10">
      {/* Intuitive Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 grid-cols-1 gap-5 px-3 pt-5 relative">
      <div className="rounded-2xl p-3">
        <div className="rounded-xl overflow-hidden h-[320px] flex items-center justify-center bg-gray-100">
          {product.imageUrls?.[displayImageIdx] ? (
            <img
              className="max-w-full max-h-full object-contain"
              src={product.imageUrls[displayImageIdx]}
              alt={product.name}
            />
          ) : <div className="w-full h-full" />}
        </div>
        {Array.isArray(product.imageUrls) && product.imageUrls.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {product.imageUrls.map((url, idx) => (
              <button
                key={idx}
                className={`w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 ${displayImageIdx === idx ? 'border-pink-500' : 'border-black/10'}`}
                onClick={() => setActiveImageIdx(idx)}
              >
                <img
                  className="w-full h-full object-contain"
                  src={url}
                  alt={product.name + ' ' + (idx + 1)}
                />
              </button>
            ))}
          </div>
        )}
        {product.description ? (
          <div className="mt-3 text-gray-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-semibold mt-3 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mt-3 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-gray-700 mt-3">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-5 mt-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-5 mt-2">{children}</ol>,
                li: ({ children }) => <li className="mt-1">{children}</li>,
                a: ({ href, children }) => (
                  <a className="text-pink-600 hover:underline" href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
                code: ({ children }) => <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">{children}</code>,
                pre: ({ children }) => (
                  <pre className="bg-gray-100 rounded p-3 overflow-auto mt-2 text-sm">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-3 text-gray-700 italic mt-2">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-auto mt-3">
                    <table className="min-w-full text-left border border-gray-200">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="border-b border-gray-200 px-2 py-1 font-semibold">{children}</th>,
                td: ({ children }) => <td className="border-b border-gray-100 px-2 py-1">{children}</td>,
              }}
            >
              {product.description}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-700 mt-3">No description provided.</p>
        )}
      </div>
      <div className="rounded-2xl p-4 sticky top-24 self-start bg-white/80 border border-black/5 shadow-sm"
           style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-baseline gap-3">
          {product.offerPrice != null ? (
            <>
              <span className="text-gray-600 line-through">৳{product.actualPrice}</span>
              <span className="text-pink-600 font-extrabold text-lg">৳{product.offerPrice}</span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">৳{product.actualPrice}</span>
          )}
        </div>
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="inline-flex items-center gap-2 text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-600" /> Available in stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-gray-600">
              <span className="w-2 h-2 rounded-full bg-gray-400" /> Out of stock
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="inline-flex items-center rounded-lg border border-black/10 overflow-hidden">
            <button className="px-3 py-2 bg-gray-100 text-gray-900" onClick={decQty} aria-label="Decrease quantity">-</button>
            <div className="px-4 py-2 min-w-10 text-center">{qty}</div>
            <button className="px-3 py-2 bg-gray-100 text-gray-900" onClick={incQty} aria-label="Increase quantity">+</button>
          </div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2 disabled:opacity-50" onClick={() => setBuyOpen(true)} disabled={product.stock <= 0}>Buy now</button>
          <button className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2 disabled:opacity-50" onClick={addCart} disabled={product.stock <= 0}>Add to Cart</button>
        </div>
      </div>

      {Array.isArray(product.videoUrls) && product.videoUrls.length > 0 && (
        <div className="md:col-span-2 rounded-2xl p-4">
          <h3 className="text-lg font-semibold">Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {product.videoUrls.map((v, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <video className="w-full" controls src={v} />
              </div>
            ))}
          </div>
        </div>
      )}

      {buyOpen && (
        <Motion.div className="fixed inset-0 z-[1100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/35" onClick={() => setBuyOpen(false)} />
          <Motion.div
            className="absolute right-0 inset-y-0 w-[92%] max-w-[420px] bg-white shadow-xl"
            initial={{ x: 460 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cash on Delivery</h3>
                <button className="rounded-full px-3 py-1 bg-gray-200 text-gray-900" onClick={() => setBuyOpen(false)}>Close</button>
              </div>
              <div className="text-gray-700 mt-1">{product.name}</div>
              <div className="font-semibold mt-1">Total: ৳{totalPrice}</div>
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
                <button className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2" onClick={() => setBuyOpen(false)}>Cancel</button>
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
              <h3 className="text-lg font-semibold">Confirm Order</h3>
              <p className="text-gray-700 mt-1">Cash on Delivery — Total ৳{totalPrice}</p>
              <div className="flex gap-3 mt-3">
                <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2" onClick={() => { setConfirmOpen(false); instantBuy(); }}>Confirm</button>
                <button className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2" onClick={() => setConfirmOpen(false)}>Cancel</button>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}

      {successOpen && (
        <Motion.div className="fixed inset-0 z-[1150]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/35" onClick={() => { setSuccessOpen(false); setBuyOpen(false); }} />
          <Motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div className="bg-white rounded-2xl p-4 w-[92%] max-w-[420px] shadow-xl text-center">
              <h3 className="text-lg font-semibold">Order placed</h3>
              <p className="text-gray-700 mt-1">Thank you! We’ll contact you soon.</p>
              <button className="mt-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2" onClick={() => { setSuccessOpen(false); setBuyOpen(false); }}>Close</button>
            </div>
          </Motion.div>
        </Motion.div>
      )}

      {addSuccessOpen && (
        <Motion.div className="fixed inset-0 z-[1150]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/35" onClick={() => setAddSuccessOpen(false)} />
          <Motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div className="bg-white rounded-2xl p-4 w-[92%] max-w-[420px] shadow-xl text-center">
              <h3 className="text-lg font-semibold">Added to cart</h3>
              <p className="text-gray-700 mt-1">You can review items in your cart.</p>
              <button className="mt-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-4 py-2" onClick={() => setAddSuccessOpen(false)}>Close</button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </div>
    </div>
  );
}
