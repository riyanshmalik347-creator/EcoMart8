import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    cartItemCount,
    averageCartEcoScore,
    totalReusableCartItems,
    setCurrentView,
    setSelectedProduct
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base font-display">
              Sustainable Cart
            </h3>
            <span className="text-xs text-stone-500 font-medium">({cartItemCount} items)</span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-red-600 transition-colors mr-2"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 text-xs">
          {amountToFreeShipping > 0 ? (
            <p className="text-emerald-900 dark:text-emerald-200 font-medium">
              Add <span className="font-bold">₹{amountToFreeShipping.toLocaleString('en-IN')}</span> more for free carbon-neutral shipping
            </p>
          ) : (
            <p className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              You qualify for Free Carbon-Neutral Shipping!
            </p>
          )}
          <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900/60 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h4 className="text-base font-semibold text-stone-800 dark:text-stone-200">
                Your cart is empty
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Discover verified sustainable products crafted from organic, reclaimed, and zero-plastic materials.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('shop');
                }}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                Browse Shop
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-xs"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setSelectedProduct(item.product);
                  }}
                  className="w-18 h-18 object-cover rounded-xl cursor-pointer bg-stone-100"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          setSelectedProduct(item.product);
                        }}
                        className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate cursor-pointer hover:text-emerald-600 transition-colors"
                      >
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-red-500 p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span>₹{item.product.price} each</span>
                      <span>·</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Eco {item.product.ecoScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-stone-900 dark:text-white min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 space-y-3">
            {/* Sustainability Impact Metrics */}
            <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Avg Eco Score:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-200">
                  {averageCartEcoScore}/100
                </span>
              </div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {totalReusableCartItems} reusable goods
              </span>
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Items Subtotal ({cartItemCount})</span>
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Carbon-Neutral Packaging & Shipping</span>
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">FREE</span>
                  ) : (
                    '₹60'
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between text-sm font-bold text-stone-900 dark:text-stone-50">
                <span>Estimated Total</span>
                <span>
                  ₹{(cartSubtotal + (cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 60)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                setCurrentView('checkout');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <span>Continue to Demo Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-stone-400 text-center">
              Simulation mode · No actual money or credit card processed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
