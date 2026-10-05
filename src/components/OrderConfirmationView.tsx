import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CAUSES } from '../data/products.ts';
import { 
  CheckCircle2, 
  Leaf, 
  Sparkles, 
  Package, 
  Repeat, 
  ArrowRight, 
  Heart, 
  Download, 
  ShoppingBag,
  Clock,
  MapPin
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { confirmedOrder, setCurrentView, setIsEcoAgentOpen, setAgentInitialPrompt } = useApp();

  if (!confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">
          No recent order found
        </h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="py-2.5 px-5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const causeInfo = CAUSES.find((c) => c.id === confirmedOrder.selectedCause);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
          Order Placed Successfully (Simulated Demo)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white font-display">
          Thank you for shopping with purpose, {confirmedOrder.customer.fullName.split(' ')[0]}!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
          Your order <span className="font-mono font-bold text-stone-900 dark:text-white">{confirmedOrder.orderId}</span> is being prepared using 100% plastic-free packaging and carbon-neutral logistics.
        </p>
      </div>

      {/* Eco Impact Summary Card (Key Requirement!) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-700/60 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 block">
              Your Environmental Impact Footprint
            </span>
            <h2 className="text-2xl font-bold font-display">
              EcoMart Lifecycle Dashboard
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 fill-emerald-300" />
            <span>Verified Lifecycle Impact</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-2xl sm:text-3xl font-extrabold block font-display">
              {confirmedOrder.impactStats.averageEcoScore}
              <span className="text-xs font-normal opacity-70"> / 100</span>
            </span>
            <span className="text-xs text-emerald-200 mt-1 block font-medium">
              Average Eco Score
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-2xl sm:text-3xl font-extrabold block font-display">
              {confirmedOrder.impactStats.sustainableProductsCount}
            </span>
            <span className="text-xs text-emerald-200 mt-1 block font-medium">
              Sustainable Items
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-2xl sm:text-3xl font-extrabold block font-display">
              {confirmedOrder.impactStats.reusableItemsCount}
            </span>
            <span className="text-xs text-emerald-200 mt-1 block font-medium">
              Reusable Goods
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-2xl sm:text-3xl font-extrabold block font-display">
              ~{confirmedOrder.impactStats.plasticBottlesAvoided}
            </span>
            <span className="text-xs text-emerald-200 mt-1 block font-medium">
              Plastics Displaced
            </span>
          </div>
        </div>

        {/* Optional Environmental Contribution Highlight */}
        {confirmedOrder.contributionAmount > 0 ? (
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-emerald-900 shrink-0">
                <Heart className="w-5 h-5 fill-emerald-800" />
              </div>
              <div>
                <span className="text-emerald-200 font-medium block">
                  Simulated Contribution to {confirmedOrder.impactStats.causeName}
                </span>
                <span className="font-bold text-sm sm:text-base text-white">
                  ₹{confirmedOrder.contributionAmount} {causeInfo ? `(${causeInfo.impactMetric})` : ''}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-200 bg-white/10 px-3 py-1 rounded-full self-start sm:self-auto font-medium">
              {causeInfo?.organization}
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white/10 text-xs text-emerald-100 flex items-center justify-between">
            <span>Environmental Contribution: ₹0 (No optional donation selected)</span>
            <span className="text-emerald-300">Default setting maintained</span>
          </div>
        )}
      </div>

      {/* Order Details & Items Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchased Items List */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider">
              Purchased Sustainable Items
            </h3>
            <span className="text-xs text-stone-500 font-semibold">
              {confirmedOrder.items.length} product lines
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {confirmedOrder.items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 text-xs">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 dark:text-white truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-stone-500">
                    Qty: {item.quantity} × ₹{item.product.price} · Eco Score: {item.product.ecoScore}/100
                  </div>
                </div>
                <span className="font-bold text-stone-900 dark:text-white">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                ₹{confirmedOrder.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Carbon-Neutral Packaging & Shipping</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {confirmedOrder.shipping === 0 ? 'FREE' : `₹${confirmedOrder.shipping}`}
              </span>
            </div>
            {confirmedOrder.contributionAmount > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span>Optional Environmental Contribution</span>
                <span className="font-bold">
                  +₹{confirmedOrder.contributionAmount}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between text-sm font-extrabold text-stone-900 dark:text-white">
              <span>Total Simulated Amount</span>
              <span>₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Dispatch Specs */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider">
              Zero-Plastic Dispatch Info
            </h3>
          </div>

          <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-stone-900 dark:text-white">
                  Recipient & Address
                </span>
                <p>{confirmedOrder.customer.fullName}</p>
                <p>{confirmedOrder.customer.address}</p>
                <p>{confirmedOrder.customer.city}, {confirmedOrder.customer.state} - {confirmedOrder.customer.pincode}</p>
                <p className="text-stone-500 mt-0.5">{confirmedOrder.customer.phone} · {confirmedOrder.customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-stone-900 dark:text-white">
                  Estimated Dispatch Timeline
                </span>
                <p>2-4 business days via electric delivery fleets where available.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <Package className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-stone-900 dark:text-white">
                  Packaging Specifications
                </span>
                <p>100% Unbleached FSC corrugated box, sealed with water-activated starch paper tape. Zero plastic air cushions.</p>
              </div>
            </div>
          </div>

          {/* Quick assistant consultation */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => {
                setAgentInitialPrompt('What are the best care and maintenance tips for the sustainable products I just purchased?');
                setIsEcoAgentOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Eco Agent for product care & maintenance tips</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => setCurrentView('shop')}
          className="flex items-center gap-2 py-3 px-6 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-emerald-900 dark:hover:bg-white transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Sustainable Shopping</span>
        </button>
      </div>
    </div>
  );
};
