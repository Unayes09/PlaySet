import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const label = product.stock === 0 ? 'Sold out!' : (product.offerPrice != null ? 'On sale!' : null);
  return (
    <Motion.div
      className="group relative bg-white rounded-xl overflow-hidden border border-black/5 flex flex-col"
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {label && <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition shadow">{label}</div>}
      <div className="h-[180px] bg-gray-100 flex items-center justify-center">
        {product.imageUrls?.[0] ? (
          <img className="w-full h-full object-cover" src={product.imageUrls[0]} alt={product.name} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600 line-through">৳{product.actualPrice}</span>
          {product.offerPrice != null && (
            <span className="text-brand-pink font-extrabold text-lg">৳{product.offerPrice}</span>
          )}
        </div>
      </div>
      <Link className="mx-3 mb-3 inline-block text-center rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-pink-600 hover:shadow-md" to={`/product/${product._id}`}>View details</Link>
    </Motion.div>
  );
}
