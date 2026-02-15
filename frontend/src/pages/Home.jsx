import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import HeroSlider from '../components/HeroSlider.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { fetchProducts } from '../api/products.js';

export default function Home() {
  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorNew, setErrorNew] = useState(null);
  const [errorFeatured, setErrorFeatured] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchProducts({ isNewProduct: true })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : [];
        setNewProducts(list);
        setLoadingNew(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setErrorNew(err.message || 'Failed to load new products');
        setLoadingNew(false);
      });
    fetchProducts({ isFeatured: true })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : [];
        setFeaturedProducts(list);
        setLoadingFeatured(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setErrorFeatured(err.message || 'Failed to load featured products');
        setLoadingFeatured(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <HeroSlider />
      <section id="products" className="max-w-[1200px] mx-auto px-3">
        <div className="text-center my-5">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <p className="text-gray-600 mt-2">Fresh builds just in</p>
        </div>

        {loadingNew && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-black/5 h-[240px] bg-white animate-pulse" />
            ))}
          </div>
        )}

        {!loadingNew && errorNew && (
          <Motion.div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">We couldn’t load new products</h3>
            <p className="text-gray-600">Please check back soon. Our shelves are being restocked!</p>
          </Motion.div>
        )}

        {!loadingNew && !errorNew && newProducts.length === 0 && (
          <Motion.div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">No products available</h3>
            <p className="text-gray-600">Stay tuned — new Playset arrivals are on the way.</p>
          </Motion.div>
        )}

        {!loadingNew && !errorNew && newProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.map((p) => (
              <ProductCard key={p._id || p.name} product={p} />
            ))}
          </div>
        )}
      </section>

      <section id="featured" className="max-w-[1200px] mx-auto px-3 my-8">
        <div className="text-center my-5">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-gray-600 mt-2">Handpicked sets for builders of all ages</p>
        </div>
        {loadingFeatured && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-black/5 h-[240px] bg-white animate-pulse" />
            ))}
          </div>
        )}
        {!loadingFeatured && errorFeatured && (
          <Motion.div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">We couldn’t load featured products</h3>
            <p className="text-gray-600">Please check back soon. Our shelves are being restocked!</p>
          </Motion.div>
        )}
        {!loadingFeatured && !errorFeatured && featuredProducts.length === 0 && (
          <Motion.div className="text-center bg-white border border-dashed border-gray-300 p-6 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">No featured products</h3>
            <p className="text-gray-600">Curators are selecting sets — check again soon.</p>
          </Motion.div>
        )}
        {!loadingFeatured && !errorFeatured && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((p) => (
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

      <section className="mt-8 bg-black text-white border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] text-white/70">ABOUT US</h3>
            <div className="mt-2 w-10 h-0.5 bg-white/40" />
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Playset BD is a small brick shop for builders who love mini bricks,
              Lego-style sets, and display puzzles. Our collections are picked so kids
              and collectors can relax, build something beautiful, and keep it on the shelf with pride.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/share/1FWWYxB7By/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20m2 6h-1c-.55 0-1 .45-1 1v2h2l-.3 2H12v6H10v-6H9v-2h1V9a2 2 0 0 1 2-2h2z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/play__set?igsh=MWRsN21zZTNyazBtaA=="
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3m10 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 2a3 3 0 1 1 0 6a3 3 0 0 1 0-6"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] text-white/70">CONTACT US</h3>
            <div className="mt-2 w-10 h-0.5 bg-white/40" />
            <p className="mt-4 text-sm text-white/80">
              <span className="font-semibold text-white">Mobile:</span> 01969-881026
            </p>
            <p className="mt-1 text-sm text-white/80">
              <span className="font-semibold text-white">Email:</span> build.playset@gmail.com
            </p>
            <p className="mt-1 text-sm text-white/80">
              <span className="font-semibold text-white">Location:</span> Shibganj, Sylhet
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] text-white/70">USEFUL LINKS</h3>
            <div className="mt-2 w-10 h-0.5 bg-white/40" />
            <p className="mt-4 text-sm text-white/80">About Us</p>
            <p className="mt-1 text-sm text-white/80">Terms of Service</p>
            <p className="mt-1 text-sm text-white/80">Privacy Policy</p>
          </div>
        </div>
      </section>
    </div>
  );
}
