import React, { useEffect, useState } from 'react';
import { X, Star, MapPin, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userLocation?: { lat: number; lng: number };
};

type SellerStats = {
  seller_id: string;
  full_name: string;
  profile_image_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  phone?: string;
  total_reviews: number;
  avg_rating: number;
  product_count: number;
  distance?: number;
};

export const Sidebar: React.FC<Props> = ({ isOpen, onClose, userLocation }) => {
  const [topSellers, setTopSellers] = useState<SellerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadTopSellers();
    }
  }, [isOpen, userLocation]);

  const loadTopSellers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seller_stats')
        .select('*')
        .gt('avg_rating', 0)
        .limit(10);

      if (error) throw error;

      const sellersWithDistance = (data || []).map((seller: SellerStats) => {
        let distance;
        if (userLocation && seller.latitude && seller.longitude) {
          distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            seller.latitude,
            seller.longitude
          );
        }
        return { ...seller, distance };
      });

      setTopSellers(sellersWithDistance);
    } catch (error) {
      console.error('Error loading sellers:', error);
    } finally {
      setLoading(false);
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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-slate-900 border-r border-slate-700 transition-transform duration-300 z-50 w-80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-500" />
              <h2 className="text-lg font-semibold text-white">Top Sellers</h2>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-200">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-700 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-slate-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : topSellers.length > 0 ? (
              <div className="space-y-3">
                {topSellers.map((seller, index) => (
                  <div
                    key={seller.seller_id}
                    className="bg-slate-800 hover:bg-slate-700 rounded-lg p-3 transition cursor-pointer border border-slate-700 hover:border-slate-600"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        {seller.profile_image_url ? (
                          <img
                            src={seller.profile_image_url}
                            alt={seller.full_name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ring-2 ring-slate-700">
                            <span className="text-white font-semibold">
                              {seller.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {index < 3 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 ring-2 ring-slate-800">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold text-white truncate">
                            {seller.full_name}
                          </h3>
                          {seller.verified && (
                            <span className="text-blue-400 text-sm flex-shrink-0">✓</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          <Star size={14} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                          <span className="text-sm text-slate-300">
                            {seller.avg_rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({seller.total_reviews} reviews)
                          </span>
                        </div>

                        {seller.distance !== undefined && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                            <MapPin size={12} />
                            <span>{seller.distance.toFixed(1)} km</span>
                          </div>
                        )}

                        {seller.product_count > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {seller.product_count} product{seller.product_count !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No highly rated sellers found yet</p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
