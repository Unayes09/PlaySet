import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import bricks from '../assets/bricks.jpg';
import car from '../assets/car.jpg';
import cycle from '../assets/cycle.jpg';
import mecca from '../assets/mecca.jpg';
import stadium from '../assets/stadium.jpg';

const slides = [
  { src: bricks, caption: 'Bring back childhood vibes' },
  { src: car, caption: 'Mini world, big smiles' },
  { src: cycle, caption: 'Play. Build. Imagine.' },
  { src: mecca, caption: 'Inspired sets for curious minds' },
  { src: stadium, caption: 'Create your own arena' },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState('');
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, []);

  function copy(text, key) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  }

  return (
    <div className="max-w-[1200px] mx-auto mb-12 grid md:grid-cols-2 grid-cols-1 gap-5 items-stretch md:h-[clamp(360px,52vh,540px)] px-3">
      <div className="bg-gradient-to-br from-pink-50 to-white border border-black/5 rounded-2xl p-4 flex flex-col justify-center relative">
        <h1 className="text-2xl font-bold mb-1">Playset</h1>
        <p className="text-gray-600 mb-2">Bringing your childhood back — Explore the Mini world ✨</p>

        

        <ul className="grid gap-2 mt-3">
         
          <li className="flex items-center gap-2 px-2 py-1">
            <svg className="text-blue-600" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9a2 2 0 1 1 0-4a2 2 0 0 1 0 4"/></svg>
            <span className="text-gray-800">Shibganj, Sylhet, Bangladesh, 3100</span>
          </li>
          <li className="flex items-center gap-2 px-2 py-1">
            <svg className="text-emerald-600" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.06-.24a11.36 11.36 0 0 0 3.56.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1a11.36 11.36 0 0 0 .57 3.56a1 1 0 0 1-.24 1.06z"/></svg>
            <span className="text-gray-800">Mobile: 01969-881026</span>
            <button
              type="button"
              className={`ml-auto inline-grid place-items-center w-7 h-7 rounded-md ${copied==='phone' ? 'bg-green-100' : 'bg-gray-100'} hover:bg-gray-200`}
              onClick={() => copy('01969-881026','phone')}
              aria-label="Copy mobile">
              {copied==='phone' ? (
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1m3 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 14H8V7h11v12Z"/></svg>
              )}
            </button>
          </li>
          <li className="flex items-center gap-2 px-2 py-1">
            <svg className="text-green-600" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2C6.61 2 2.2 6.41 2.21 11.84c0 2.07.6 3.99 1.63 5.62L2 22l4.7-1.51a10.01 10.01 0 0 0 5.34 1.55c5.43 0 9.85-4.41 9.85-9.84C21.88 6.41 17.47 2 12.04 2m5.82 12.69c-.25.71-1.27 1.29-1.77 1.37c-.47.08-1.07.12-1.73-.11a11.65 11.65 0 0 1-3.36-2.07a10.77 10.77 0 0 1-2.42-3.02c-.26-.45-.52-1.19-.61-1.62c-.13-.59.03-.99.29-1.29c.2-.24.45-.54.78-.55c.2 0 .39.01.56.02c.18.02.42-.07.66.5c.25.59.85 2.04.92 2.19c.07.15.11.33.02.53c-.09.21-.14.34-.29.52c-.15.17-.31.39-.45.52c-.15.13-.31.28-.14.56c.17.28.76 1.23 1.65 1.99c1.13.93 2.09 1.22 2.37 1.35c.28.12.45.11.62-.07c.17-.18.72-.84.91-1.13c.19-.29.4-.24.66-.14c.27.1 1.71.81 2 .96c.29.15.48.22.55.35c.08.13.08.75-.17 1.46"/></svg>
            <span className="text-gray-800">WhatsApp: +880 1969-881026</span>
            <button
              type="button"
              className={`ml-auto inline-grid place-items-center w-7 h-7 rounded-md ${copied==='whatsapp' ? 'bg-green-100' : 'bg-gray-100'} hover:bg-gray-200`}
              onClick={() => copy('+880 1969-881026','whatsapp')}
              aria-label="Copy WhatsApp">
              {copied==='whatsapp' ? (
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1m3 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 14H8V7h11v12Z"/></svg>
              )}
            </button>
          </li>
          <li className="flex items-center gap-2 px-2 py-1">
            <svg className="text-rose-600" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20 8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l8 5l8-5m0-2H4l8 5l8-5Z"/></svg>
            <span className="text-gray-800">build.playset@gmail.com</span>
            <button
              type="button"
              className={`ml-auto inline-grid place-items-center w-7 h-7 rounded-md ${copied==='email' ? 'bg-green-100' : 'bg-gray-100'} hover:bg-gray-200`}
              onClick={() => copy('build.playset@gmail.com','email')}
              aria-label="Copy email">
              {copied==='email' ? (
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1m3 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 14H8V7h11v12Z"/></svg>
              )}
            </button>
          </li>
          <li className="flex items-center gap-2 px-2 py-1">
            <svg className="text-indigo-600" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16m1-9.41V7h-2v5l4.25 2.52l1-1.73z"/></svg>
            <span className="text-gray-800">Always open</span>
          </li>
        </ul>
        <div className="flex gap-2 mt-3">
          <a className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] text-white px-3 py-2" href="https://www.facebook.com/share/1FWWYxB7By/" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20m2 6h-1c-.55 0-1 .45-1 1v2h2l-.3 2H12v6H10v-6H9v-2h1V9a2 2 0 0 1 2-2h2z"/></svg>
            Facebook
          </a>
        </div>
        
      </div>
      <div className="relative rounded-2xl overflow-hidden border border-black/5 bg-gradient-to-br from-gray-100 to-gray-200 h-[240px] md:h-full">
        <AnimatePresence mode="wait">
          <Motion.img
            key={index}
            src={slides[index].src}
            alt={slides[index].caption}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
