import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import HeroSlider from '../components/HeroSlider.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { fetchAllProducts } from '../api/products.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchAllProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load products');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <HeroSlider />
      <section id="products" className="max-w-[1200px] mx-auto px-3">
        <div className="text-center my-5">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-gray-600 mt-2">Handpicked sets for builders of all ages</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-black/5 h-[240px] bg-white animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <Motion.div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">We couldn’t load products</h3>
            <p className="text-gray-600">Please check back soon. Our shelves are being restocked!</p>
          </Motion.div>
        )}

        {!loading && !error && products.length === 0 && (
          <Motion.div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">No products available</h3>
            <p className="text-gray-600">Stay tuned — new Playset arrivals are on the way.</p>
          </Motion.div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id || p.name} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-[1100px] mx-auto px-3 my-5">
        <h2 className="text-2xl font-bold mb-3">What customers say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-white border border-black/5 rounded-xl p-4">
            <p>
              Thank you for bringing back my childhood with this play set! I bought two sets, SpongeBob and Super Mario and the instructions were easy to follow. I was able to put them together perfectly. 100% recommend. ✨
            </p>
            <div className="mt-2 font-semibold">— Mamunul Islam</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-white border border-black/5 rounded-xl p-4">
            <p>
              Beautiful sets and great quality. My kid loved the mini stadium — awesome detail and colors!
            </p>
            <div className="mt-2 font-semibold">— Ayesha Ahkthar</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-white border border-black/5 rounded-xl p-4">
            <p>
              Fast delivery, friendly support, and the Mecca set is stunning. Will buy again.
            </p>
            <div className="mt-2 font-semibold">— Farhan Rahman</div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-[1100px] mx-auto flex justify-between px-3 py-4">
          <div>© {new Date().getFullYear()} Playset — Bringing your childhood back</div>
        </div>
      </footer>
    </div>
  );
}
