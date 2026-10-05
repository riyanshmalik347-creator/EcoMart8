import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PRODUCTS, CATEGORIES, MATERIAL_TAGS } from '../data/products.ts';
import { ProductCard } from './ProductCard.tsx';
import { ProductCategory, Product } from '../types.ts';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Leaf,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    comparedIds,
    setCurrentView
  } = useApp();

  // Local filter states
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [onlyReusable, setOnlyReusable] = useState(false);
  const [minEcoScore, setMinEcoScore] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(3000); // max price filter
  const [sortBy, setSortBy] = useState<'featured' | 'ecoHigh' | 'priceLow' | 'priceHigh' | 'rating'>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Toggle material tag filter
  const toggleMaterial = (tag: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedMaterials([]);
    setOnlyReusable(false);
    setMinEcoScore(0);
    setPriceRange(3000);
    setSortBy('featured');
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (searchQuery.trim()) count++;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (onlyReusable) count++;
    if (minEcoScore > 0) count++;
    if (priceRange < 3000) count++;
    return count;
  }, [selectedCategory, searchQuery, selectedMaterials, onlyReusable, minEcoScore, priceRange]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query filter (matches name, description, material, category)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.materialTag.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Material filter
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(p.materialTag)) {
        return false;
      }

      // Reusable filter
      if (onlyReusable && !p.isReusable) {
        return false;
      }

      // Minimum Eco Score
      if (p.ecoScore < minEcoScore) {
        return false;
      }

      // Price filter
      if (p.price > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'ecoHigh') return b.ecoScore - a.ecoScore;
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' keeps default catalog ordering
    });
  }, [selectedCategory, searchQuery, selectedMaterials, onlyReusable, minEcoScore, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Demo Catalog Disclaimer Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-stone-900 dark:text-white">EcoMart Demo Catalog:</strong> All 14 items feature verified open sustainability rubrics, zero-single-use packaging, and genuine supplier specifications.
          </span>
        </div>
        {comparedIds.length > 0 && (
          <button
            onClick={() => setCurrentView('compare')}
            className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 hover:underline self-start sm:self-auto shrink-0"
          >
            <Layers className="w-3.5 h-3.5" />
            Compare {comparedIds.length} items
          </button>
        )}
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-2">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200"
            >
              <option value="featured">Featured</option>
              <option value="ecoHigh">Eco Score: High to Low</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Sidebar Filters Desktop & Mobile Drawer */}
        <aside 
          className={`space-y-6 ${
            isMobileFiltersOpen 
              ? 'block fixed inset-0 z-50 p-6 bg-white dark:bg-stone-900 overflow-y-auto' 
              : 'hidden lg:block'
          }`}
        >
          {isMobileFiltersOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 lg:hidden">
              <h3 className="font-bold text-base text-stone-900 dark:text-white">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-stone-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Filter Header & Clear */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Search inside catalog */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
              Search by Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product name, material..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
              Category
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] opacity-70">({PRODUCTS.length})</span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[11px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimum Eco Score Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Minimum Eco Score
              </label>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {minEcoScore === 0 ? 'All Scores' : `${minEcoScore}+`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs">
              {[0, 85, 90, 95].map((val) => (
                <button
                  key={val}
                  onClick={() => setMinEcoScore(val)}
                  className={`py-1.5 rounded-lg font-medium border text-center transition-all ${
                    minEcoScore === val
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {val === 0 ? 'All' : `${val}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Max Price (₹)
              </label>
              <span className="text-xs font-bold text-stone-900 dark:text-white">
                Up to ₹{priceRange.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="299"
              max="3000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>₹299</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Reusable Item Filter Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs font-medium text-stone-800 dark:text-stone-200">
              <input
                type="checkbox"
                checked={onlyReusable}
                onChange={(e) => setOnlyReusable(e.target.checked)}
                className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span>Only show Reusable Goods</span>
            </label>
          </div>

          {/* Material Tag Filters */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
              Sustainable Materials
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MATERIAL_TAGS.map((tag) => {
                const isSelected = selectedMaterials.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleMaterial(tag)}
                    className={`text-xs py-1 px-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-emerald-800 dark:bg-emerald-600 text-white border-emerald-800 dark:border-emerald-600 font-semibold shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500 bg-white dark:bg-stone-800'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {isMobileFiltersOpen && (
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-800 text-white font-semibold text-xs mt-6"
            >
              Show {filteredProducts.length} Results
            </button>
          )}
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort & Active Filters Toolbar */}
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              Showing <span className="font-bold text-stone-900 dark:text-stone-100">{filteredProducts.length}</span> sustainable products
              {selectedCategory !== 'All' && <span> in <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedCategory}</span></span>}
            </div>

            {/* Desktop Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-hidden focus:border-emerald-600"
              >
                <option value="featured">Featured Picks</option>
                <option value="ecoHigh">Eco Score: Highest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-stone-400 font-medium mr-1">Active:</span>

              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-200"
                >
                  <span>Category: {selectedCategory}</span>
                  <X className="w-3 h-3 text-stone-500" />
                </button>
              )}

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-200"
                >
                  <span>Query: “{searchQuery}”</span>
                  <X className="w-3 h-3 text-stone-500" />
                </button>
              )}

              {minEcoScore > 0 && (
                <button
                  onClick={() => setMinEcoScore(0)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium"
                >
                  <span>Score: {minEcoScore}+</span>
                  <X className="w-3 h-3 text-emerald-600" />
                </button>
              )}

              {onlyReusable && (
                <button
                  onClick={() => setOnlyReusable(false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-200"
                >
                  <span>Reusable Only</span>
                  <X className="w-3 h-3 text-stone-500" />
                </button>
              )}

              {selectedMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => toggleMaterial(mat)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-200"
                >
                  <span>{mat}</span>
                  <X className="w-3 h-3 text-stone-500" />
                </button>
              ))}

              {priceRange < 3000 && (
                <button
                  onClick={() => setPriceRange(3000)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-200"
                >
                  <span>≤ ₹{priceRange}</span>
                  <X className="w-3 h-3 text-stone-500" />
                </button>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-stone-500 hover:text-red-500 underline ml-2"
              >
                Reset
              </button>
            </div>
          )}

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                No matching sustainable products found
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                We couldn't find items matching your active combination of filters. Try broadening your price range, clearing specific material tags, or resetting all filters.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 py-2 px-5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
