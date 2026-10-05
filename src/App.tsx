import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { CategoryTiles } from './components/CategoryTiles.tsx';
import { HomeFeaturedProducts } from './components/HomeFeaturedProducts.tsx';
import { HomeMissionSection } from './components/HomeMissionSection.tsx';
import { ShopView } from './components/ShopView.tsx';
import { CheckoutView } from './components/CheckoutView.tsx';
import { OrderConfirmationView } from './components/OrderConfirmationView.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { ProductComparisonModal } from './components/ProductComparisonModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { EcoAgentDrawer } from './components/EcoAgentDrawer.tsx';
import { EcoScoreExplainerModal } from './components/EcoScoreExplainerModal.tsx';
import { Footer } from './components/Footer.tsx';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    selectedProduct, 
    setSelectedProduct,
    toastMessage 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-app text-main transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar />

      {/* Main View Container */}
      <div className="flex-1">
        {currentView === 'home' && (
          <main>
            <Hero />
            <CategoryTiles />
            <HomeFeaturedProducts />
            <HomeMissionSection />
          </main>
        )}

        {currentView === 'shop' && (
          <main>
            <ShopView />
          </main>
        )}

        {currentView === 'checkout' && (
          <main>
            <CheckoutView />
          </main>
        )}

        {currentView === 'confirmation' && (
          <main>
            <OrderConfirmationView />
          </main>
        )}

        {currentView === 'compare' && (
          <ProductComparisonModal 
            isOpen={true} 
            onClose={() => setCurrentView('shop')} 
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Slide-out Drawers & Modals */}
      <CartDrawer />
      <EcoAgentDrawer />
      <EcoScoreExplainerModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 py-3 px-4 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs font-semibold shadow-xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
