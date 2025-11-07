import React, { useState } from 'react';
import { Grid, List } from 'lucide-react';
import { Product } from '../../lib/supabase';
import { ProductCard } from './ProductCard';

type Props = {
  products: Product[];
  loading: boolean;
  wishlistIds: Set<string>;
  onWishlistToggle: () => void;
};

export const ProductList: React.FC<Props> = ({
  products,
  loading,
  wishlistIds,
  onWishlistToggle,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse border border-slate-700">
            <div className="h-48 bg-slate-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-700 rounded w-1/2" />
              <div className="h-6 bg-slate-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">No products found</p>
        <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-300">
          Showing <span className="text-cyan-400 font-semibold">{products.length}</span> product{products.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isInWishlist={wishlistIds.has(product.id)}
            onWishlistToggle={onWishlistToggle}
          />
        ))}
      </div>
    </div>
  );
};
