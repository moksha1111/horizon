import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HomeIcon, MapIcon, TicketIcon, UsersIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/admin/destinations', label: 'Destinations', icon: MapIcon },
  { to: '/admin/bookings', label: 'Bookings', icon: TicketIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 text-white flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="font-display font-bold text-xl tracking-widest text-emerald-400">HORIZON</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`
              }
            >
              <l.icon className="w-5 h-5" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <NavLink to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Site
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-stone-50 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
