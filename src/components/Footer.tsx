import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Leaf, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/products.ts';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setIsScoreExplainerOpen, setIsEcoAgentOpen } = useApp();

  return (
    <footer className="mt-20 bg-stone-900 dark:bg-stone-950 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-lg font-display tracking-tight">EcoMart</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              “Don’t Just Shop. Shop With Purpose.”
            </p>
            <p className="text-stone-500 leading-relaxed text-[11px]">
              Democratizing verified, plastic-free living with transparent Eco Scores, sustainable artisan sourcing, and responsible materials.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentView('shop');
                    }}
                    className="hover:text-emerald-400 transition-colors text-stone-400"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sustainability & Transparency */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Sustainability Rubric
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => setIsScoreExplainerOpen(true)}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  How Eco Scores Work (0-100)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsScoreExplainerOpen(true)}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Raw Material Origin Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsScoreExplainerOpen(true)}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Zero-Plastic Packaging Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsEcoAgentOpen(true);
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400"
                >
                  <Sparkles className="w-3 h-3" />
                  Ask Gemini Eco Agent
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Demo Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Catalog Transparency
            </h4>
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 text-[11px] text-stone-400 space-y-1.5 leading-relaxed">
              <span className="text-white font-bold block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Demo Catalog Notice
              </span>
              <p>
                Products, pricing in Indian Rupees (₹), and lifecycle scores are curated demo data representing genuine sustainable manufacturing principles.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} EcoMart. Don’t Just Shop. Shop With Purpose.</p>
          <div className="flex items-center gap-4">
            <span>Prices in Indian Rupees (₹)</span>
            <span>·</span>
            <span>Zero Plastic Packaging</span>
            <span>·</span>
            <span>Clean Energy Grounding</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
