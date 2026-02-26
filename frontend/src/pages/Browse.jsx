import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/products.js';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = ['Mini bricks', 'Lego', 'Puzzle'];

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const category = params.get('category') || '';
  const qParam = params.get('q') || '';
  const [q, setQ] = useState(qParam);
  const isNewParam = params.get('isNewProduct') ?? params.get('isNew');
  const isFeaturedParam = params.get('isFeatured');
  const isNew = isNewParam === 'true';
  const isFeatured = isFeaturedParam === 'true';

  useEffect(() => {
    setTimeout(() => setLoading(true), 0);
    fetchProducts({
      category: category || undefined,
      q: qParam || undefined,
      isNewProduct: isNewParam != null ? isNew : undefined,
      isFeatured: isFeaturedParam != null ? isFeatured : undefined,
    })
      .then((res) => {
        const list = Array.isArray(res.products) ? res.products : Array.isArray(res) ? res : res.products || [];
        setProducts(list);
        setError(null);
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [category, qParam, isNewParam, isFeaturedParam, isNew, isFeatured]);

  const activeCat = useMemo(() => category, [category]);

  function setCategory(next) {
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set('category', next);
    else nextParams.delete('category');
    setParams(nextParams, { replace: true });
  }
  function applySearch() {
    const nextParams = new URLSearchParams(params);
    if (q.trim()) nextParams.set('q', q.trim());
    else nextParams.delete('q');
    setParams(nextParams, { replace: true });
  }
  function toggleNew() {
    const nextParams = new URLSearchParams(params);
    if (isNew) nextParams.delete('isNewProduct');
    else nextParams.set('isNewProduct', 'true');
    // When enabling 'New', leave 'Featured' as-is to allow intersection if desired
    setParams(nextParams, { replace: true });
  }
  function toggleFeatured() {
    const nextParams = new URLSearchParams(params);
    if (isFeatured) nextParams.delete('isFeatured');
    else nextParams.set('isFeatured', 'true');
    setParams(nextParams, { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 relative pb-10">
      {/* Intuitive Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <div className="max-w-[1100px] mx-auto px-3 pt-5 relative">
      <h2 className="text-2xl font-bold mb-3">Browse Products</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 inline-flex items-center gap-2">
          <input
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
            placeholder="Search by name or description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') applySearch(); }}
          />
          <button className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600" onClick={applySearch}>Search</button>
        </div>
        <div className="inline-flex flex-wrap gap-2">
          <button
            className={`px-3 py-2 rounded-full border ${!activeCat ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border-gray-300'}`}
            onClick={() => setCategory('')}
          >All</button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`px-3 py-2 rounded-full border ${activeCat === c ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border-gray-300'}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
          <button
            className={`px-3 py-2 rounded-full border ${isNew ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border-gray-300'}`}
            onClick={toggleNew}
          >New</button>
          <button
            className={`px-3 py-2 rounded-full border ${isFeatured ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border-gray-300'}`}
            onClick={toggleFeatured}
          >Featured</button>
        </div>
      </div>

      {error && <div className="mt-3 text-red-600">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[240px] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 mt-4">
          {products.length ? products.map((p, idx) => (
            <div key={p._id} className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(33.33%-11px)] min-h-[320px]">
              <ProductCard product={p} index={products.length > 1 ? idx : undefined} />
            </div>
          )) : (
            <div className="w-full text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl">No products found</div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
