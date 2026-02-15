import { motion as Motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/playsetlogo.jpg';

export default function Navbar() {
  const { pathname } = useLocation();
  const [openCats, setOpenCats] = useState(false);
  return (
    <Motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-[1000]"
    >
      <div className="max-w-[1200px] mx-auto px-5 py-3 flex justify-center">
        <div className="w-[calc(100%-24px)] mx-3 flex items-center gap-4 bg-white/90 border border-black/5 backdrop-blur-lg rounded-2xl shadow-soft px-4 py-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Playset" className="w-10 h-10 object-cover rounded-md" />
              <span className="font-bold text-lg text-gray-900 hidden sm:inline">Playset</span>
            </Link>
            <div className="relative">
              <button
                className="inline-flex items-center rounded-full bg-gray-900 text-white px-4 py-2 shadow-md hover:bg-pink-600"
                onClick={() => setOpenCats((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={openCats}
              >
                Categories
                <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="m7 10l5 5l5-5z"/></svg>
              </button>
              {openCats && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden">
                  <Link className="block px-4 py-2 hover:bg-gray-100" to="/browse?category=Mini%20bricks" onClick={() => setOpenCats(false)}>Mini bricks</Link>
                  <Link className="block px-4 py-2 hover:bg-gray-100" to="/browse?category=Lego" onClick={() => setOpenCats(false)}>Lego</Link>
                  <Link className="block px-4 py-2 hover:bg-gray-100" to="/browse?category=Puzzle" onClick={() => setOpenCats(false)}>Puzzle</Link>
                  <Link className="block px-4 py-2 hover:bg-gray-100" to="/browse" onClick={() => setOpenCats(false)}>All</Link>
                </div>
              )}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {pathname !== '/' && pathname !== '/browse' && (
              <Link className="inline-flex items-center rounded-full bg-pink-500 text-white px-4 py-2 shadow-md hover:bg-pink-600" to="/">
                Home
              </Link>
            )}
            {pathname !== '/cart' && (
              <Link className="inline-flex items-center rounded-full bg-pink-500 text-white px-4 py-2 shadow-md hover:bg-pink-600" to="/cart">
                Cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </Motion.nav>
  );
}
