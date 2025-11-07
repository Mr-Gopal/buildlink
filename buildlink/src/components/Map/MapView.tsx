import React, { useState, useEffect } from 'react';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';
import { type Product } from '../../lib/supabase.ts';

type Props = {
  products: Product[];
  userLocation?: { lat: number; lng: number };
  onLocationChange?: (location: { lat: number; lng: number }) => void;
};

export const MapView: React.FC<Props> = ({ products, userLocation, onLocationChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationChange?.({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const sellerLocations = products
    .filter((p) => p.seller?.latitude && p.seller?.longitude)
    .map((p) => ({
      id: p.seller_id,
      name: p.seller?.full_name || 'Unknown',
      lat: p.seller!.latitude!,
      lng: p.seller!.longitude!,
    }))
    .filter((loc, index, self) =>
      index === self.findIndex((l) => l.id === loc.id)
    );

  return (
    <div
      className={`bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-slate-700 ${
        isExpanded ? 'fixed inset-4 z-30' : 'relative'
      }`}
    >
      <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <MapPin className="text-cyan-400" size={20} />
          <h3 className="font-semibold text-white">Seller Locations</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-200 transition"
        >
          {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      <div className={`bg-slate-900 ${isExpanded ? 'h-[calc(100%-4rem)]' : 'h-96'}`}>
        {mapError ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <MapPin size={48} className="text-slate-600 mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">Map View</h4>
            <p className="text-slate-400 mb-4">
              Google Maps integration requires an API key. Displaying seller locations list instead.
            </p>
            {userLocation && (
              <div className="mb-4 text-sm text-slate-400">
                <p>Your Location:</p>
                <p className="font-mono text-cyan-400">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
              </div>
            )}
            {sellerLocations.length > 0 && (
              <div className="w-full max-w-md space-y-2">
                <p className="font-medium text-white mb-2">Sellers Near You:</p>
                {sellerLocations.map((loc) => (
                  <div key={loc.id} className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                    <p className="font-medium text-white">{loc.name}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin size={48} className="text-cyan-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">
                Interactive Map
              </h4>
              <p className="text-slate-400 max-w-md">
                Add your Google Maps API key to view interactive maps with seller locations.
                <br />
                <span className="text-sm mt-2 block text-cyan-400">
                  Showing {sellerLocations.length} seller location{sellerLocations.length !== 1 ? 's' : ''}
                </span>
              </p>
              {userLocation && (
                <div className="mt-4 text-sm text-slate-400">
                  <p className="font-medium">Your Current Location:</p>
                  <p className="font-mono text-xs text-cyan-400">
                    Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
