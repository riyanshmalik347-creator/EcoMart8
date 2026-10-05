import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, ShieldCheck, Leaf, Recycle, Clock, Package, CheckCircle2 } from 'lucide-react';

export const EcoScoreExplainerModal: React.FC = () => {
  const { isScoreExplainerOpen, setIsScoreExplainerOpen } = useApp();

  if (!isScoreExplainerOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setIsScoreExplainerOpen(false)}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsScoreExplainerOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white font-display">
              EcoMart Open Sustainability Rubric
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Transparent, multi-dimensional scoring (0-100)
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          Greenwashing stops when math begins. EcoMart scores every product across 5 lifecycle dimensions to provide an objective composite index from 0 to 100. We do not invent claims: all scores are computed from supplier documentation, third-party lab certificates (GOTS, OEKO-TEX, FSC), and material lifecycle analysis.
        </p>

        {/* 5 Pillars */}
        <div className="mt-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
              <span className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                1. Raw Material Origin & Extraction
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">Max 25 Pts</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Evaluates renewable, organic, upcycled, or non-toxic extraction. Heavy virgin synthetics score low; certified organic cotton, wild bamboo, riverbed clay, and reclaimed metals score highest.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                2. Lifecycle Durability & Reparability
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">Max 20 Pts</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Rewards products engineered to last years or generations (such as heirloom virgin cast iron or reinforced canvas) rather than planned obsolescence.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
              <span className="flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-600" />
                3. Reusability vs Single-Use Plastic Displacement
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">Max 25 Pts</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Quantifies how many disposable bottles, bags, wrappers, or cups this product eliminates throughout its active lifetime.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                4. Low-Waste & Plastic-Free Packaging
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">Max 15 Pts</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Enforces unbleached post-consumer cartons, water-activated cornstarch paper tape, plantable seed papers, and zero plastic bubble wraps.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                5. Circular Recyclability & Biodegradation
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">Max 15 Pts</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Assesses whether the item can safely return to the soil as home compost or be melted curbside without downcycling or microplastic pollution.
            </p>
          </div>
        </div>

        {/* Score Tiers */}
        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800">
          <div className="text-xs font-bold text-stone-900 dark:text-white mb-2 uppercase tracking-wider">
            Rating Bands
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <span className="font-bold block">95 - 100</span>
              <span className="text-[11px] opacity-80">Pioneer Impact</span>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300">
              <span className="font-bold block">90 - 94</span>
              <span className="text-[11px] opacity-80">High Circular</span>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
              <span className="font-bold block">80 - 89</span>
              <span className="text-[11px] opacity-80">Commendable</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsScoreExplainerOpen(false)}
          className="mt-6 w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs transition-colors hover:bg-stone-800 dark:hover:bg-white"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
