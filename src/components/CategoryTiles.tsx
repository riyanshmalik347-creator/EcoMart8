import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCategory } from '../types.ts';
import { PRODUCTS } from '../data/products.ts';
import { Home, UtensilsCrossed, Sparkles, Shirt, Repeat, ArrowRight } from 'lucide-react';

interface CategoryCardInfo {
  category: ProductCategory;
  title: string;
  tagline: string;
  icon: React.ElementType;
  signatureMaterial: string;
  bgGrad: string;
}

export const CategoryTiles: React.FC = () => {
  const { setSelectedCategory, setCurrentView } = useApp();

  const categoriesData: CategoryCardInfo[] = [
    {
      category: 'Kitchen',
      title: 'Kitchen & Cookware',
      tagline: 'Non-toxic, chemical-free cookware & food preservation',
      icon: UtensilsCrossed,
      signatureMaterial: 'Cast Iron · Beeswax · Copper',
      bgGrad: 'hover:border-emerald-500/60',
    },
    {
      category: 'Home',
      title: 'Home & Living',
      tagline: 'GOTS organic cotton, terracotta, and clean lighting',
      icon: Home,
      signatureMaterial: 'Organic Waffle · Earthenware',
      bgGrad: 'hover:border-amber-500/60',
    },
    {
      category: 'Reusable Goods',
      title: 'Reusable Goods',
      tagline: 'Daily containers & bottles eliminating single-use waste',
      icon: Repeat,
      signatureMaterial: 'Pro Stainless Steel · Bamboo',
      bgGrad: 'hover:border-teal-500/60',
    },
    {
      category: 'Personal Care',
      title: 'Personal Care',
      tagline: 'Solid waterless bars, botanical soaps, and bamboo dental care',
      icon: Sparkles,
      signatureMaterial: 'Active Neem · Charcoal · Shea',
      bgGrad: 'hover:border-emerald-500/60',
    },
    {
      category: 'Fashion',
      title: 'Artisan Fashion',
      tagline: 'Hand-spun khadi cotton & heavy industrial hemp totes',
      icon: Shirt,
      signatureMaterial: 'Khadi Cotton · Wild Hemp',
      bgGrad: 'hover:border-stone-500/60',
    },
  ];

  const handleSelect = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setCurrentView('shop');
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white font-display">
            Browse by Sustainable Category
          </h2>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('All');
            setCurrentView('shop');
          }}
          className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View entire 14-item catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categoriesData.map((item) => {
          const Icon = item.icon;
          const count = PRODUCTS.filter((p) => p.category === item.category).length;

          return (
            <div
              key={item.category}
              onClick={() => handleSelect(item.category)}
              className={`p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between ${item.bgGrad}`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 group-hover:bg-emerald-800 group-hover:text-white dark:group-hover:bg-emerald-600 transition-colors flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                  {count} Products
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-white mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span className="truncate">{item.signatureMaterial}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
