import React, { useState } from 'react';
import { Product } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { Star, ShoppingBag, Eye, Layers, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    setSelectedProduct, 
    addToComparison, 
    removeFromComparison, 
    isInComparison 
  } = useApp();
  const [imageError, setImageError] = useState(false);
  const inCompare = isInComparison(product.id);

  // SVG Fallback for resilient image loading
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%23EFEAE1"><rect width="400" height="300" fill="%23F3EFE7"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="16" fill="%23677A6D">EcoMart Sustainable Goods</text><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="13" fill="%238E9F94">${encodeURIComponent(product.name)}</text></svg>`;

  const getEcoScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (score >= 90) return 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800';
    return 'text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700';
  };

  return (
    <article className="group flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-emerald-600">
      {/* Product Image & Quick Action Overlay */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img
          src={imageError ? fallbackSvg : product.image}
          alt={product.name}
          onError={() => setImageError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
        />

        {/* Quiet Kicker badge if bestseller/award */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-stone-100 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase rounded-md shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Eco Score Indicator */}
        <div 
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold backdrop-blur-xs shadow-xs ${getEcoScoreColor(product.ecoScore)}`}
          title={`Eco Score: ${product.ecoScore}/100. Based on verified lifecycle sustainability.`}
        >
          <span className="text-[10px] uppercase tracking-wider opacity-80">Eco</span>
          <span className="text-sm font-bold">{product.ecoScore}</span>
        </div>

        {/* Quick hover action bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 text-xs font-medium rounded-lg shadow-md hover:bg-white dark:hover:bg-stone-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick view
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (inCompare) {
                removeFromComparison(product.id);
              } else {
                addToComparison(product.id);
              }
            }}
            aria-label={inCompare ? 'Remove from compare' : 'Compare product'}
            title={inCompare ? 'Remove from compare' : 'Compare product'}
            className={`p-2 rounded-lg shadow-md text-xs font-medium transition-colors ${
              inCompare
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white/95 dark:bg-stone-900/95 text-stone-800 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800'
            }`}
          >
            {inCompare ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line (anti-slop rule) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="truncate">{product.materialTag}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="text-base font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="ml-1 font-semibold text-stone-800 dark:text-stone-200">
                {product.rating}
              </span>
            </div>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Price & Primary Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900 dark:text-stone-50">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              Verified Sustainable
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold hover:bg-emerald-800 dark:hover:bg-emerald-300 dark:hover:text-stone-950 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
