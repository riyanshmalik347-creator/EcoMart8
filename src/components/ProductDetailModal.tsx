import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { PRODUCTS } from '../data/products.ts';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Layers, 
  Check, 
  Package, 
  Recycle, 
  Sparkles,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { 
    addToCart, 
    addToComparison, 
    removeFromComparison, 
    isInComparison, 
    setSelectedProduct,
    setIsScoreExplainerOpen
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const inCompare = isInComparison(product.id);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Related products (same category or high eco score, excluding current)
  const relatedProducts = PRODUCTS
    .filter((p) => p.id !== product.id && (p.category === product.category || p.ecoScore >= 95))
    .slice(0, 3);

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500" fill="%23EFEAE1"><rect width="600" height="500" fill="%23F3EFE7"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="20" fill="%23677A6D">EcoMart Sustainable Goods</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="16" fill="%238E9F94">${encodeURIComponent(product.name)}</text></svg>`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-xs text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white shadow-xs hover:bg-white dark:hover:bg-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Product Media Column */}
          <div className="p-6 md:p-8 bg-stone-50 dark:bg-stone-950/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800">
            <div>
              <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden shadow-md bg-stone-100 dark:bg-stone-800">
                <img
                  src={imageError ? fallbackSvg : product.image}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-stone-900/90 text-stone-100 text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Certifications row */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-md"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Comparison toggle action */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={() => {
                  if (inCompare) removeFromComparison(product.id);
                  else addToComparison(product.id);
                }}
                className={`flex items-center gap-2 text-xs font-medium py-2 px-3 rounded-lg border transition-colors ${
                  inCompare
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {inCompare ? <Check className="w-4 h-4 text-emerald-600" /> : <Layers className="w-4 h-4" />}
                {inCompare ? 'Added to Comparison (view in Compare)' : 'Compare with other products'}
              </button>
            </div>
          </div>

          {/* Details & Specs Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-2 font-medium">
                  <span>{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.materialTag}</span>
                </div>
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 mr-1" />
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{product.rating}</span>
                  <span className="text-stone-400 ml-1">({product.reviewCount})</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mt-2 font-display">
                {product.name}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                {product.tagline}
              </p>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-sm">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Full Description */}
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Comprehensive Sustainability Rubric */}
              <div className="mt-6 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                      Eco Score Breakdown
                    </span>
                    <button
                      onClick={() => setIsScoreExplainerOpen(true)}
                      title="Learn how EcoMart calculates scores"
                      className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-xs">
                    <span>{product.ecoScore}</span>
                    <span className="text-xs opacity-75 font-normal">/ 100</span>
                  </div>
                </div>

                {/* Progress bars for the 5 pillars */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                      <span>Raw Material Origin</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">{product.scoreBreakdown.material} / 25</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(product.scoreBreakdown.material / 25) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                      <span>Durability & Lifespan</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">{product.scoreBreakdown.durability} / 20</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(product.scoreBreakdown.durability / 20) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                      <span>Reusability vs Disposable</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">{product.scoreBreakdown.reusability} / 25</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(product.scoreBreakdown.reusability / 25) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                      <span>Low-Impact Packaging</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">{product.scoreBreakdown.packaging} / 15</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(product.scoreBreakdown.packaging / 15) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                      <span>Circular Recyclability</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">{product.scoreBreakdown.recyclability} / 15</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(product.scoreBreakdown.recyclability / 15) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 italic">
                  * Calculated by EcoMart Open Sustainability Rubric based on manufacturer disclosures.
                </p>
              </div>

              {/* Sustainability Specifications Grid */}
              <div className="mt-5 space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-50 dark:bg-stone-800/40">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900 dark:text-white">Material Composition</span>
                    <span>{product.material}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-50 dark:bg-stone-800/40">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900 dark:text-white">Durability & Longevity</span>
                    <span>{product.durability}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-50 dark:bg-stone-800/40">
                  <Recycle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900 dark:text-white">Reusability Impact</span>
                    <span>{product.reusability}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-50 dark:bg-stone-800/40">
                  <Package className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900 dark:text-white">Zero-Plastic Packaging</span>
                    <span>{product.packaging}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-3 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-sm font-semibold transition-colors"
                >
                  -
                </button>
                <span className="px-2 text-sm font-bold text-stone-900 dark:text-white min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="px-3 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-sm font-semibold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Bar */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-stone-50/80 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-3">
              Frequently Paired Sustainable Alternatives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => setSelectedProduct(rel)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 cursor-pointer transition-all shadow-xs"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {rel.name}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      ₹{rel.price} · Eco {rel.ecoScore}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
