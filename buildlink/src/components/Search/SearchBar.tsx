import React from 'react';
import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
      <input
        type="text"
        placeholder="Search products, materials, sellers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-slate-600 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
      />
    </div>
  );
};
