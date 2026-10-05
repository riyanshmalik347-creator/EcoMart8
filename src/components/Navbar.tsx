import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ThemeSelector } from './ThemeSelector.tsx';
import { CATEGORIES } from '../data/products.ts';
import { ProductCategory } from '../types.ts';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Layers, 
  Menu, 
  X, 
  Leaf, 
  Info,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cartItemCount,
    setIsCartDrawerOpen,
    comparedIds,
    setIsEcoAgentOpen,
    setAgentInitialPrompt,
    setIsScoreExplainerOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('shop');
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (cat: ProductCategory | 'All') => {
    setSelectedCategory(cat);
    setCurrentView('shop');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top Banner with mission hint & rubric explainer */}
      <div className="bg-emerald-900 dark:bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="font-semibold tracking-wide">“Don’t Just Shop. Shop With Purpose.”</span>
          <span className="hidden md:inline opacity-60">·</span>
          <span className="hidden md:inline text-emerald-200">100% verified plastic-free packaging & circular lifecycle</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <button
            onClick={() => setIsScoreExplainerOpen(true)}
            className="hover:text-white flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
          >
            <Info className="w-3 h-3" />
            How Eco Scores Work
          </button>
          <span className="opacity-40">|</span>
          <span className="text-emerald-300">Catalog Demo</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
                setSelectedCategory('All');
                setSearchQuery('');
                setLocalSearch('');
              }}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-stone-50 font-display block leading-none">
                  EcoMart
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
                  Purposeful Living
                </span>
              </div>
            </button>
          </div>

          {/* Search bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search sustainable products, materials (e.g. bamboo, cotton)..."
              className="w-full pl-9 pr-10 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white dark:focus:bg-stone-900 transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Eco Agent Button (Prominent) */}
            <button
              onClick={() => {
                setAgentInitialPrompt('');
                setIsEcoAgentOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
              title="Open Gemini-Powered Shopping Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Eco Agent</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Comparison Badge / Action */}
            <button
              onClick={() => setCurrentView('compare')}
              className={`relative p-2 rounded-lg text-xs font-medium transition-colors ${
                comparedIds.length > 0
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Compare Products"
              aria-label="Compare Products"
            >
              <Layers className="w-4 h-4" />
              {comparedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {comparedIds.length}
                </span>
              )}
            </button>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Cart Icon with Live Count */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label={`View shopping cart with ${cartItemCount} items`}
              className="relative p-2 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-150">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar (Clean Typography, No Pills) */}
        <nav className="hidden md:flex items-center gap-6 py-2.5 border-t border-stone-100 dark:border-stone-800/80 text-xs font-medium">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`transition-colors py-1 relative ${
              currentView === 'shop' && selectedCategory === 'All'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Shop All Catalog
            {currentView === 'shop' && selectedCategory === 'All' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`transition-colors py-1 relative ${
                currentView === 'shop' && selectedCategory === cat
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {cat}
              {currentView === 'shop' && selectedCategory === cat && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 font-normal">
            <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-medium">
              <Leaf className="w-3 h-3" />
              Rupee (₹) Pricing
            </span>
            <span>·</span>
            <button 
              onClick={() => setIsScoreExplainerOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Open Rubric (0-100)
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search sustainable items..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </form>

          <div className="space-y-1 text-sm font-medium">
            <button
              onClick={() => {
                setCurrentView('home');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                currentView === 'home'
                  ? 'bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleCategoryClick('All')}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                currentView === 'shop' && selectedCategory === 'All'
                  ? 'bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              Shop All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  currentView === 'shop' && selectedCategory === cat
                    ? 'bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setIsScoreExplainerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-stone-600 dark:text-stone-400 flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              How Eco Scores Work
            </button>
            <button
              onClick={() => {
                setIsEcoAgentOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Eco Agent
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
