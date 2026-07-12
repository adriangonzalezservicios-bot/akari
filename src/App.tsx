import React, { useState, useMemo, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Filters } from './components/Filters';
import { ChatWidget } from './components/ChatWidget';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { AdminPanel } from './components/AdminPanel';
import { initialProducts } from './data';
import { Product, CartItem, SiteSettings } from './types';
import { Sparkles, PackageSearch } from 'lucide-react';

export default function App() {
  // Global State
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ bannerUrl: '/src/assets/images/appliances_banner_1783868055333.jpg' });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as SiteSettings);
        }

        // Fetch Products
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(productsCol);
        
        if (productSnapshot.empty) {
          console.log("Seeding database with initial products...");
          const batchPromises = initialProducts.map(product => {
            return setDoc(doc(db, 'products', product.id), product);
          });
          await Promise.all(batchPromises);
          setProducts(initialProducts);
        } else {
          const productList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));
          setProducts(productList);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setErrorMsg("Error de conexión. Si usas bloqueadores de anuncios (como Brave o uBlock), intenta desactivarlos, o verifica tu conexión a internet.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Derived Data
  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];
  const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 500;

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchCategory && matchPrice;
    });
  }, [products, selectedCategory, priceRange]);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.featured);
  }, [products]);

  // Actions
  const handleAddToCart = (product: Product) => {
    // Inventory check
    if (product.inventory <= 0) {
      alert("¡Lo sentimos! Este producto está agotado.");
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.inventory) return prev; // Cannot exceed inventory
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckoutSuccess = () => {
    // Deduct inventory
    setProducts(prevProducts => {
      let updatedProducts = [...prevProducts];
      cartItems.forEach(cartItem => {
        updatedProducts = updatedProducts.map(p => 
          p.id === cartItem.id ? { ...p, inventory: Math.max(0, p.inventory - cartItem.quantity) } : p
        );
      });
      return updatedProducts;
    });

    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (currentRoute === '#admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-akari-orange selection:text-white relative bg-orange-50/50">
      {/* Background gradients for glassmorphism */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-akari-orange/20 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-akari-green/20 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-orange-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      <Header 
        cartItemCount={cartTotalItems} 
        onOpenCart={() => setIsCartOpen(true)} 
        logoUrl="/logo.jpg"
      />
      
      <main className="pb-20 overflow-hidden">
        <Hero bannerUrl={settings.bannerUrl} />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akari-orange"></div>
          </div>
        ) : errorMsg ? (
          <div className="flex justify-center items-center py-20 px-4">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center max-w-lg">
              <span className="text-3xl mb-4 block">⚠️</span>
              <p className="font-semibold">{errorMsg}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 pt-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Sparkles className="text-akari-orange" size={32} />
              <h2 className="text-3xl font-extrabold text-akari-brown tracking-tight">Destacados del mes</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map(product => (
              <div key={product.id} className="h-full">
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                  onClick={() => setSelectedProduct(product)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Shop Section */}
        <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex items-center justify-between mb-10 border-t border-akari-cream pt-16">
            <div className="flex items-center gap-3">
              <PackageSearch className="text-akari-green" size={32} />
              <h2 className="text-3xl font-extrabold text-akari-brown tracking-tight">Explorar Tienda</h2>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <Filters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                maxPrice={Math.ceil(maxProductPrice)}
              />
            </aside>

            {/* Product Grid */}
            <div className="flex-1 relative group min-w-0">
              {filteredProducts.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md rounded-md p-12 text-center shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] flex flex-col items-center justify-center border border-white/60">
                  <div className="text-6xl mb-4">🦊</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No encontramos productos</h3>
                  <p className="text-gray-500">Intenta ajustar los filtros para ver más resultados.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('Todas');
                      setPriceRange([0, Math.ceil(maxProductPrice)]);
                    }}
                    className="mt-6 px-6 py-2 bg-akari-green/10 text-akari-green-dark font-semibold rounded-md hover:bg-akari-green/20 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="h-full">
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart} 
                        onClick={() => setSelectedProduct(product)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        </>
        )}
      </main>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartTotalPrice}
        onSuccess={handleCheckoutSuccess}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <Footer />

      <ChatWidget />
    </div>
  );
}
