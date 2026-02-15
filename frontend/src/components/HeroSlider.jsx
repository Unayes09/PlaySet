import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import bricks from '../assets/bricks.jpg';
import car from '../assets/car.jpg';
import cycle from '../assets/cycle.jpg';
import mecca from '../assets/mecca.jpg';
import stadium from '../assets/stadium.jpg';
import merge from '../assets/merge.png';

const slides = [
  { src: merge, caption: 'Merge your own sets' },
  { src: bricks, caption: 'Bring back childhood vibes' },
  { src: car, caption: 'Mini world, big smiles' },
  { src: cycle, caption: 'Play. Build. Imagine.' },
  { src: mecca, caption: 'Inspired sets for curious minds' },
  { src: stadium, caption: 'Create your own arena' },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="w-full max-w-[1200px] mx-auto mb-12 px-3">
      <div className="relative w-full rounded-2xl overflow-hidden border border-black/5 bg-gradient-to-br from-gray-100 to-gray-200 h-[clamp(360px,52vh,540px)]">
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
        <div className="absolute inset-0 flex items-center justify-between px-3 z-10">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6z"/></svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/></svg>
          </button>
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-pink-500' : 'bg-white/80'} hover:bg-pink-400`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
