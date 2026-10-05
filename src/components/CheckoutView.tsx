import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CAUSES } from '../data/products.ts';
import { EcoCause, OrderConfirmationData } from '../types.ts';
import { 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  Heart, 
  Trees, 
  Waves, 
  Recycle, 
  ShieldCheck, 
  ShoppingBag,
  Info,
  Lock
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartItemCount, 
    averageCartEcoScore, 
    totalReusableCartItems,
    clearCart,
    setCurrentView,
    setConfirmedOrder 
  } = useApp();

  // Customer details form
  const [formData, setFormData] = useState({
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Meadows Residency, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });

  // Environmental Contribution states (defaults to 0 as required!)
  const [contributionChoice, setContributionChoice] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedCause, setSelectedCause] = useState<EcoCause>('tree_plantation');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute final contribution amount
  const finalContribution = isCustom
    ? Math.max(0, parseInt(customAmount, 10) || 0)
    : contributionChoice;

  const FREE_SHIPPING_THRESHOLD = 999;
  const shippingFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 60;
  const grandTotal = cartSubtotal + shippingFee + finalContribution;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const causeObj = CAUSES.find((c) => c.id === selectedCause);

    setTimeout(() => {
      const orderConfirmation: OrderConfirmationData = {
        orderId: `ECO-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cart],
        subtotal: cartSubtotal,
        shipping: shippingFee,
        contributionAmount: finalContribution,
        total: grandTotal,
        selectedCause,
        customer: { ...formData },
        createdAt: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        impactStats: {
          averageEcoScore: averageCartEcoScore,
          sustainableProductsCount: cartItemCount,
          reusableItemsCount: totalReusableCartItems,
          plasticBottlesAvoided: totalReusableCartItems * 450,
          carbonOffsetKg: Math.round((cartSubtotal * 0.008 + finalContribution * 0.05) * 10) / 10,
          contributionAmount: finalContribution,
          causeName: causeObj ? causeObj.name : 'Environmental Restoration',
        },
      };

      setConfirmedOrder(orderConfirmation);
      clearCart();
      setIsSubmitting(false);
      setCurrentView('confirmation');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">
          Your cart is currently empty
        </h2>
        <p className="text-xs text-stone-500">
          Add sustainable products to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="py-2.5 px-5 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const causeIcons = {
    tree_plantation: Trees,
    ocean_cleanup: Waves,
    waste_reduction: Recycle,
    wildlife_conservation: ShieldCheck,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Return button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shopping
      </button>

      {/* Prominent Simulated Demo Notice */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong className="block font-bold mb-0.5">Simulation Notice:</strong>
          This is an interactive demo checkout for EcoMart. No real payments, donations, or credit cards are collected or processed. Environmental contributions and order confirmations are simulated for sustainable impact visualization.
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer & Shipping Details Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white font-display">
                1. Delivery & Contact Details
              </h2>
              <span className="text-[11px] text-stone-400">Step 1 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Email Address (for receipt & impact summary) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Street Address (Zero-plastic dispatch packaging) *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Optional Environmental Contribution Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-stone-900 dark:text-white font-display">
                  2. Optional Environmental Contribution
                </h2>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                100% Optional
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Offset the micro-footprint of manufacturing or restore vulnerable habitats. 100% of optional contributions go directly to verified grassroots partners.
            </p>

            {/* Contribution Amount Selector (default is ₹0) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-2">
                Select Contribution Amount (₹)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                {[
                  { label: 'None (₹0)', value: 0 },
                  { label: '₹10', value: 10 },
                  { label: '₹25', value: 25 },
                  { label: '₹50', value: 50 },
                  { label: '₹100', value: 100 },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setContributionChoice(item.value);
                    }}
                    className={`py-2 px-3 rounded-xl border font-semibold transition-all text-center ${
                      !isCustom && contributionChoice === item.value
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setIsCustom(true);
                  }}
                  className={`py-2 px-3 rounded-xl border font-semibold transition-all text-center ${
                    isCustom
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustom && (
                <div className="mt-3 flex items-center gap-2 max-w-xs">
                  <span className="text-sm font-bold text-stone-600 dark:text-stone-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Cause Selector */}
            {finalContribution > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                  Select Cause for Your ₹{finalContribution} Contribution
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAUSES.map((cause) => {
                    const Icon = causeIcons[cause.id] || ShieldCheck;
                    const isSelected = selectedCause === cause.id;

                    return (
                      <div
                        key={cause.id}
                        onClick={() => setSelectedCause(cause.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                              {cause.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                              {cause.tagline}
                            </p>
                            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold block mt-1">
                              {cause.impactMetric}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white font-display pb-3 border-b border-stone-100 dark:border-stone-800">
              Order Summary ({cartItemCount} items)
            </h3>

            {/* List of items in checkout */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-stone-400">
                      Qty: {item.quantity} · Eco Score: {item.product.ecoScore}/100
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-white shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Carbon-Neutral Packaging & Courier</span>
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">FREE</span>
                  ) : (
                    '₹60'
                  )}
                </span>
              </div>

              {finalContribution > 0 && (
                <div className="flex justify-between text-emerald-800 dark:text-emerald-300">
                  <span>Environmental Contribution</span>
                  <span className="font-bold">
                    +₹{finalContribution.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between text-base font-extrabold text-stone-900 dark:text-white">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Simulated Payment Notice & Submit button */}
            <div className="pt-4 space-y-3">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-500 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simulated Checkout Guarantee</span>
                </div>
                <p>
                  No card details required. Clicking the button immediately simulates an instant order placement and computes your sustainability metrics.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                {isSubmitting ? (
                  <span>Generating Eco Impact Summary...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Simulated Order · ₹{grandTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
