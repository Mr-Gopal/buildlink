import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, role);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  I am a
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="buyer"
                      checked={role === 'buyer'}
                      onChange={(e) => setRole(e.target.value as 'buyer')}
                      className="w-4 h-4 text-cyan-500 accent-cyan-500"
                    />
                    <span className="text-sm text-slate-300">Buyer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="seller"
                      checked={role === 'seller'}
                      onChange={(e) => setRole(e.target.value as 'seller')}
                      className="w-4 h-4 text-cyan-500 accent-cyan-500"
                    />
                    <span className="text-sm text-slate-300">Seller</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/30 border border-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
