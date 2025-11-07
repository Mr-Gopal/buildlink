import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { Navbar } from './components/Layout/Navbar.tsx';
import { Sidebar } from './components/Layout/Sidebar.tsx';
import { FilterPanel, type FilterOptions } from './components/Layout/FilterPanel.tsx';
import { Footer } from './components/Layout/Footer.tsx';
import { MapView } from './components/Map/MapView.tsx';
import { SearchBar } from './components/Search/SearchBar.tsx';
import { ProductList } from './components/Products/ProductList.tsx';
import { SellerDashboard } from './components/Dashboard/SellerDashboard.tsx';
import { supabase, type Product } from './lib/supabase.ts';

function AppContent() {
  const { profile, loading: authLoading } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    priceMin: 0,
    priceMax: 0,
    maxDistance: 50,
    minRating: 0,
    category: '',
    availability: false,
  });

  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#dashboard' && profile?.role === 'seller') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#dashboard' && profile?.role === 'seller') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [profile]);

  useEffect(() => {
    if (!authLoading) {
      loadProducts();
      if (profile?.role === 'buyer') {
        loadWishlist();
      }
    }
  }, [authLoading, profile]);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery, userLocation]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles(*),
          reviews(rating)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id');

      if (error) throw error;
      setWishlistIds(new Set(data?.map((w) => w.product_id) || []));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.seller?.full_name.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.priceMin > 0) {
      filtered = filtered.filter((p) => p.price >= filters.priceMin);
    }

    if (filters.priceMax > 0) {
      filtered = filtered.filter((p) => p.price <= filters.priceMax);
    }

    if (filters.availability) {
      filtered = filtered.filter((p) => p.available);
    }

    if (userLocation && filters.maxDistance > 0) {
      filtered = filtered.filter((p) => {
        if (!p.seller?.latitude || !p.seller?.longitude) return false;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          p.seller.latitude,
          p.seller.longitude
        );
        return distance <= filters.maxDistance;
      });
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((p) => {
        const avgRating = p.reviews?.length
          ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length
          : 0;
        return avgRating >= filters.minRating;
      });
    }

    setFilteredProducts(filtered);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentView === 'dashboard' && profile?.role === 'seller') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar onMenuClick={() => setShowSidebar(!showSidebar)} />
        <SellerDashboard />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar onMenuClick={() => setShowSidebar(!showSidebar)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          userLocation={userLocation}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex gap-4 items-center">
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white rounded-lg transition font-medium"
              >
                <SlidersHorizontal size={20} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            <div className="mb-8">
              <MapView
                products={filteredProducts}
                userLocation={userLocation}
                onLocationChange={setUserLocation}
              />
            </div>

            <ProductList
              products={filteredProducts}
              loading={loading}
              wishlistIds={wishlistIds}
              onWishlistToggle={loadWishlist}
            />
          </div>
        </main>

        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
