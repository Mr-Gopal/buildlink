import React, { useState } from 'react';
import { Menu, User, LogOut, Store, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../Auth/AuthModal';

type Props = {
  onMenuClick: () => void;
};

export const Navbar: React.FC<Props> = ({ onMenuClick }) => {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onMenuClick}
                className="lg:hidden text-slate-300 hover:text-white transition"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Store className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">BuildMart</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-slate-300 hover:text-white transition text-sm font-medium">
                Home
              </a>
              <a href="#about" className="text-slate-300 hover:text-white transition text-sm font-medium">
                About
              </a>
              <a href="#contact" className="text-slate-300 hover:text-white transition text-sm font-medium">
                Contact
              </a>
              <a href="#support" className="text-slate-300 hover:text-white transition text-sm font-medium">
                Support
              </a>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition"
                  >
                    {profile?.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={profile.full_name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium">{profile?.full_name}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl py-2 border border-slate-700">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                        <p className="text-xs text-slate-400 capitalize">{profile?.role}</p>
                      </div>
                      <a
                        href="#profile"
                        className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition text-sm"
                      >
                        <User size={16} />
                        Profile
                      </a>
                      {profile?.role === 'buyer' && (
                        <a
                          href="#wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition text-sm"
                        >
                          <Heart size={16} />
                          Wishlist
                        </a>
                      )}
                      {profile?.role === 'seller' && (
                        <a
                          href="#dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition text-sm"
                        >
                          <Store size={16} />
                          Dashboard
                        </a>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition text-sm"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
