import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isTransparent = transparent && !scrolled;
  const bg = isTransparent ? 'bg-transparent' : 'bg-white shadow-sm';
  const textColor = isTransparent ? 'text-white' : 'text-gray-900';
  const mutedColor = isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900';

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className={`font-display font-bold text-2xl tracking-widest ${textColor} transition-colors`}>
            HORIZON
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/destinations" className={`text-sm font-medium tracking-wide transition-colors ${mutedColor}`}>
              Destinations
            </Link>
            <Link to="/journals" className={`text-sm font-medium tracking-wide transition-colors ${mutedColor}`}>
              Journals
            </Link>
            <Link to="/about" className={`text-sm font-medium tracking-wide transition-colors ${mutedColor}`}>
              About
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user && (
              <Link to="/wishlist" className={`p-2 rounded-full transition-colors ${mutedColor}`}>
                <HeartIcon className="w-5 h-5" />
              </Link>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 p-2 rounded-full transition-colors ${mutedColor}`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDownIcon className="w-4 h-4 hidden sm:block" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-stone-50 transition-colors">
                      Profile
                    </Link>
                    <Link to="/bookings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-stone-50 transition-colors">
                      My Bookings
                    </Link>
                    <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-stone-50 transition-colors">
                      My Wishlist
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-emerald-600 font-medium hover:bg-stone-50 transition-colors">
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isTransparent
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 rounded-lg ${mutedColor}`}>
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link to="/destinations" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-stone-50 rounded-xl font-medium">
              Destinations
            </Link>
            <Link to="/journals" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-stone-50 rounded-xl font-medium">
              Journals
            </Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-stone-50 rounded-xl font-medium">
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
