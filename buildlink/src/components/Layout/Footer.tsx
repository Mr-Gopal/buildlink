import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} BuildMart. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-slate-400 hover:text-cyan-400 transition">
              Privacy Policy
            </a>
            <a href="#terms" className="text-slate-400 hover:text-cyan-400 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
