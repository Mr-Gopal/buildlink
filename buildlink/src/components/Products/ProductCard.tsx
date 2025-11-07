import React, { useState } from 'react';
import { MapPin, Heart, Package, CheckCircle, XCircle } from 'lucide-react';
import { type Product } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type Props = {
  product: Product;
  onWishlistToggle?: () => void;
  isInWishlist?: boolean;
};

export const ProductCard: React.FC<Props> = ({ product, onWishlistToggle, isInWishlist }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleWishlistToggle = async () => {
    if (!user || profile?.role !== 'buyer') return;

    setLoading(true);
    try {
      if (isInWishlist) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
      } else {
        await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: product.id,
          });
      }
      onWishlistToggle?.();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:border-cyan-500/50 transition-all border border-slate-700 hover:bg-slate-700">
      <div className="relative h-48 bg-slate-900">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-slate-600" />
          </div>
        )}
        {profile?.role === 'buyer' && (
          <button
            onClick={handleWishlistToggle}
            disabled={loading}
            className="absolute top-2 right-2 p-2 bg-slate-900/80 backdrop-blur rounded-full shadow-md hover:bg-slate-900 transition disabled:opacity-50 border border-slate-700"
          >
            <Heart
              size={20}
              className={isInWishlist ? 'text-red-500 fill-red-500' : 'text-slate-400'}
            />
          </button>
        )}
        <div className="absolute top-2 left-2">
          {product.available ? (
            <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
              <CheckCircle size={12} />
              Available
            </span>
          ) : (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
              <XCircle size={12} />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{product.category.replace('_', ' ')}</p>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-slate-300 mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-cyan-400">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">per {product.unit}</p>
          </div>
          {product.stock_quantity > 0 && (
            <p className="text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded">
              {product.stock_quantity} in stock
            </p>
          )}
        </div>

        {product.seller && (
          <div className="pt-3 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.seller.profile_image_url ? (
                  <img
                    src={product.seller.profile_image_url}
                    alt={product.seller.full_name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {product.seller.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-1">
                    {product.seller.full_name}
                    {product.seller.verified && (
                      <span className="text-blue-400 text-xs">✓</span>
                    )}
                  </p>
                  {product.seller.address && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={10} />
                      {product.seller.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
