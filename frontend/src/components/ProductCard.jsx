import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, index }) {
  const label = product.stock === 0 ? 'Sold out!' : (product.offerPrice != null ? 'On sale!' : null);
  
  // Sticky stacking effect: cards get a sticky top offset based on their index
  // This makes them "stack" as you scroll. 
  const stickyStyles = index !== undefined ? {
     position: 'sticky',
     top: `${80 + (index % 4) * 8}px`, // Tighter stack
     zIndex: index,
     backdropFilter: 'blur(16px)',
     WebkitBackdropFilter: 'blur(16px)',
   } : {};
 
    return (
      <Link to={`/product/${product._id}`} className="block h-full sticky" style={stickyStyles}>
        <Motion.div
          className="group relative bg-white/60 rounded-2xl overflow-hidden border border-black/5 flex flex-col h-full shadow-lg"
          whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {label && <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition shadow z-10">{label}</div>}
        <div className="h-[180px] bg-gray-100 flex items-center justify-center">
          {product.imageUrls?.[0] ? (
            <img className="max-w-full max-h-full object-contain" src={product.imageUrls[0]} alt={product.name} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>
        <div className="p-3 flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-600 line-through text-sm">৳{product.actualPrice}</span>
            {product.offerPrice != null && (
              <span className="text-pink-600 font-extrabold text-lg">৳{product.offerPrice}</span>
            )}
          </div>
        </div>
        <div className="mx-3 mb-3 inline-block text-center rounded-lg bg-gray-900 text-white px-4 py-2 group-hover:bg-pink-600 transition-colors">
          View details
        </div>
      </Motion.div>
    </Link>
  );
}
