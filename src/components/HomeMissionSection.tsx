import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, HeartHandshake, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

export const HomeMissionSection: React.FC = () => {
  const { setIsScoreExplainerOpen, setCurrentView } = useApp();

  return (
    <section className="py-16 bg-stone-100/70 dark:bg-stone-950/40 border-y border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Mission Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span>The EcoMart Commitment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white font-display leading-tight">
              We believe conscious consumerism should be effortless, honest, and verifiable.
            </h2>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Every day, consumers encounter buzzwords like “eco-friendly”, “green”, and “sustainable” without knowing what they mean. EcoMart was founded to dismantle greenwashing with real math, honest supplier audits, and clear scorecards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                  Open Sustainability Rubric
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Standardized 100-point scale across material, lifespan, and recyclability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <RefreshCw className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                  Zero Single-Use Plastic
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  100% biodegradable seed wrappers, unbleached kraft cardboard, and water tapes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <HeartHandshake className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                  Artisan Cooperatives
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Fair wages paid directly to Indian pottery, khadi weavers, and metal smiths.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setIsScoreExplainerOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
              >
                Read our full scoring methodology
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Interactive Score Rubric Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    Verified Rubric Sample
                  </span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    GOTS Organic Cotton Towel
                  </h3>
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-white rounded-xl font-bold text-sm">
                  96 / 100
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-300 font-medium mb-1">
                    <span>1. Material Origin</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">25 / 25</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-300 font-medium mb-1">
                    <span>2. Lifecycle Durability</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">18 / 20</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[90%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-300 font-medium mb-1">
                    <span>3. Reusability vs Single-Use</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">24 / 25</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-300 font-medium mb-1">
                    <span>4. Plastic-Free Packaging</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">15 / 15</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-300 font-medium mb-1">
                    <span>5. Circular Recyclability</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">14 / 15</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[93%]" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                <span>Calculated on manufacturer lifecycle disclosure</span>
                <button
                  onClick={() => setIsScoreExplainerOpen(true)}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Full Rubric →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
