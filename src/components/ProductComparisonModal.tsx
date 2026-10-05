import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PRODUCTS } from '../data/products.ts';
import { X, ShoppingBag, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({ isOpen, onClose }) => {
  const { 
    comparedIds, 
    removeFromComparison, 
    clearComparison, 
    addToCart, 
    setSelectedProduct, 
    setCurrentView 
  } = useApp();

  if (!isOpen) return null;

  const comparedProducts = comparedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is typeof PRODUCTS[0] => Boolean(p));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/50">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-display">
              Sustainable Product Comparison
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              Comparing {comparedProducts.length} of max 3 products side-by-side
            </p>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-xs text-stone-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close comparison view"
              className="p-2 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="p-6 overflow-x-auto flex-1">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">
                No products selected for comparison
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Click the layer icon on any product card or in the product details to compare lifecycle metrics, materials, and eco scores.
              </p>
              <button
                onClick={() => {
                  onClose();
                  setCurrentView('shop');
                }}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                Explore sustainable catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse min-w-[650px] text-xs">
              <thead>
                <tr>
                  <th className="p-3 text-left w-1/4 text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider text-[11px] align-top">
                    Attributes
                  </th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-3 text-left w-1/4 align-top">
                      <div className="relative group">
                        <button
                          onClick={() => removeFromComparison(p.id)}
                          title="Remove from comparison"
                          className="absolute -top-1 -right-1 p-1 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={p.image}
                          alt={p.name}
                          onClick={() => {
                            onClose();
                            setSelectedProduct(p);
                          }}
                          className="w-full h-36 object-cover rounded-xl mb-2 cursor-pointer shadow-xs"
                        />
                        <div className="text-[11px] text-stone-500 font-medium">{p.category}</div>
                        <h4 
                          onClick={() => {
                            onClose();
                            setSelectedProduct(p);
                          }}
                          className="text-sm font-bold text-stone-900 dark:text-white hover:text-emerald-600 cursor-pointer line-clamp-2"
                        >
                          {p.name}
                        </h4>
                        <div className="mt-1 text-base font-extrabold text-stone-900 dark:text-stone-100">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* Empty slots placeholders if less than 3 */}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <th key={`empty-${idx}`} className="p-3 w-1/4 align-middle">
                      <div className="h-52 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-xs text-stone-400 font-medium">Slot available</span>
                        <button
                          onClick={() => {
                            onClose();
                            setCurrentView('shop');
                          }}
                          className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                        >
                          + Add product
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {/* Eco Score Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-900 dark:text-stone-200 bg-stone-50/50 dark:bg-stone-800/20">
                    Eco Score (0-100)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 bg-stone-50/50 dark:bg-stone-800/20">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                        <span>{p.ecoScore}</span>
                        <span className="text-[10px] opacity-75">/ 100</span>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-eco-${idx}`} className="p-3 bg-stone-50/50 dark:bg-stone-800/20" />
                  ))}
                </tr>

                {/* Score Breakdown Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                    Score Breakdown
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-stone-600 dark:text-stone-400 space-y-1">
                      <div>Raw Material: <span className="font-semibold text-stone-900 dark:text-stone-100">{p.scoreBreakdown.material}/25</span></div>
                      <div>Durability: <span className="font-semibold text-stone-900 dark:text-stone-100">{p.scoreBreakdown.durability}/20</span></div>
                      <div>Reusability: <span className="font-semibold text-stone-900 dark:text-stone-100">{p.scoreBreakdown.reusability}/25</span></div>
                      <div>Packaging: <span className="font-semibold text-stone-900 dark:text-stone-100">{p.scoreBreakdown.packaging}/15</span></div>
                      <div>Recyclability: <span className="font-semibold text-stone-900 dark:text-stone-100">{p.scoreBreakdown.recyclability}/15</span></div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-breakdown-${idx}`} className="p-3" />
                  ))}
                </tr>

                {/* Material Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                    Primary Material
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-stone-800 dark:text-stone-200">
                      {p.material}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-mat-${idx}`} className="p-3" />
                  ))}
                </tr>

                {/* Durability Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                    Durability & Lifespan
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-stone-700 dark:text-stone-300">
                      {p.durability}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-dur-${idx}`} className="p-3" />
                  ))}
                </tr>

                {/* Reusability Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                    Reusability & Single-Use Impact
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-stone-700 dark:text-stone-300">
                      {p.reusability}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-reu-${idx}`} className="p-3" />
                  ))}
                </tr>

                {/* Packaging Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                    Packaging Standard
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-stone-700 dark:text-stone-300">
                      {p.packaging}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-pack-${idx}`} className="p-3" />
                  ))}
                </tr>

                {/* Recyclability Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                    End-of-Life Recyclability
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-stone-700 dark:text-stone-300">
                      {p.recyclability}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-rec-${idx}`} className="p-3" />
                  ))}
                </tr>

                {/* Certifications Row */}
                <tr>
                  <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                    Verified Certifications
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-stone-700 dark:text-stone-300">
                      <div className="flex flex-wrap gap-1">
                        {p.certifications.map((c) => (
                          <span
                            key={c}
                            className="inline-block px-2 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-600 dark:text-stone-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                    <td key={`empty-cert-${idx}`} className="p-3" />
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
