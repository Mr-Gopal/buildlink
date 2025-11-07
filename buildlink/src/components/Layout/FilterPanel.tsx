import React from 'react';
import { SlidersHorizontal, X, Star } from 'lucide-react';

export type FilterOptions = {
  priceMin: number;
  priceMax: number;
  maxDistance: number;
  minRating: number;
  category: string;
  availability: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
};

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'cement', label: 'Cement' },
  { value: 'sand', label: 'Sand' },
  { value: 'iron_rods', label: 'Iron Rods' },
  { value: 'pop', label: 'POP (Plaster of Paris)' },
  { value: 'bed', label: 'Beds' },
  { value: 'table', label: 'Tables' },
  { value: 'lamp', label: 'Lamps' },
  { value: 'wardrobe', label: 'Wardrobes' },
  { value: 'other', label: 'Other' },
];

export const FilterPanel: React.FC<Props> = ({ isOpen, onClose, filters, onFilterChange }) => {
  const handleChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({ ...filters, [key]: value });
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
        className={`fixed lg:hidden top-0 right-0 h-screen bg-slate-800 border-l border-slate-700 transition-transform duration-300 z-50 w-80 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Price Range
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.priceMin || ''}
                  onChange={(e) => handleChange('priceMin', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.priceMax || ''}
                  onChange={(e) => handleChange('priceMax', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Maximum Distance: <span className="text-cyan-400">{filters.maxDistance} km</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.maxDistance}
                onChange={(e) => handleChange('maxDistance', Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Minimum Rating
              </label>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50 p-2 rounded transition">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === rating}
                      onChange={() => handleChange('minRating', rating)}
                      className="w-4 h-4 text-cyan-500 accent-cyan-500"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
                      ))}
                      {[...Array(5 - rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-slate-600" />
                      ))}
                      <span className="text-sm text-slate-300 ml-1">& up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50 p-2 rounded transition">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === 0}
                    onChange={() => handleChange('minRating', 0)}
                    className="w-4 h-4 text-cyan-500 accent-cyan-500"
                  />
                  <span className="text-sm text-slate-300">Any rating</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-700/50 rounded transition">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={(e) => handleChange('availability', e.target.checked)}
                  className="w-4 h-4 text-cyan-500 accent-cyan-500 rounded"
                />
                <span className="text-sm text-slate-200">Available only</span>
              </label>
            </div>

            <button
              onClick={() =>
                onFilterChange({
                  priceMin: 0,
                  priceMax: 0,
                  maxDistance: 50,
                  minRating: 0,
                  category: '',
                  availability: false,
                })
              }
              className="w-full py-2 border border-slate-600 rounded-lg text-slate-200 hover:bg-slate-700 transition font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
