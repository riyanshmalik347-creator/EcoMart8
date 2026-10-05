import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PRODUCTS } from '../data/products.ts';
import { ProductCard } from './ProductCard.tsx';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';

export const HomeFeaturedProducts: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useApp();
  const [activeTab, setActiveTab] = useState<'featured' | 'popular' | 'highEco'>('featured');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'featured':
        return PRODUCTS.filter((p) => p.featured).slice(0, 6);
      case 'popular':
        return PRODUCTS.filter((p) => p.popular).slice(0, 6);
      case 'highEco':
        return PRODUCTS.filter((p) => p.ecoScore >= 95).slice(0, 6);
      default:
        return PRODUCTS.slice(0, 6);
    }
  };

  const displayedProducts = getFilteredProducts();

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Filter segmented control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Carefully Vetted Goods
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white font-display">
            Featured & Popular Essentials
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl self-start md:self-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('featured')}
            className={`py-1.5 px-3.5 rounded-lg transition-all ${
              activeTab === 'featured'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Featured Staff Picks
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`py-1.5 px-3.5 rounded-lg transition-all ${
              activeTab === 'popular'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Community Favorites
          </button>
          <button
            onClick={() => setActiveTab('highEco')}
            className={`py-1.5 px-3.5 rounded-lg transition-all ${
              activeTab === 'highEco'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Eco Score 95+
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-12 text-center">
        <button
          onClick={() => {
            setSelectedCategory('All');
            setCurrentView('shop');
          }}
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-emerald-900 dark:hover:bg-white transition-colors shadow-xs"
        >
          <span>Explore All 14 Catalog Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
