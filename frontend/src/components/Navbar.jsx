import { motion as Motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/playsetlogo.jpg';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <Motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-[1000]"
    >
      <div className="max-w-[1200px] mx-auto px-5 py-3 flex justify-center">
        <div className="w-[calc(100%-24px)] mx-3 flex items-center gap-3 bg-white/90 border border-black/5 backdrop-blur-lg rounded-2xl shadow-soft px-4 py-2 justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Playset" className="w-10 h-10 object-cover rounded-md" />
            <span className="font-bold text-lg text-gray-900">Playset</span>
          </Link>
          <div className="flex gap-2">
            {pathname !== '/' && <Link className="inline-flex items-center rounded-full bg-pink-500 text-white px-4 py-2 shadow-md hover:bg-pink-600" to="/">Home</Link>}
            {pathname !== '/cart' && <Link className="inline-flex items-center rounded-full bg-pink-500 text-white px-4 py-2 shadow-md hover:bg-pink-600" to="/cart">Cart</Link>}
          </div>
        </div>
      </div>
    </Motion.nav>
  );
}
