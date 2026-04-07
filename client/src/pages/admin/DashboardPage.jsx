import { useState, useEffect } from 'react';
import { MapIcon, TicketIcon, UsersIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import api from '../../utils/axios';
import Spinner from '../../components/Spinner';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [destRes, bookRes, userRes] = await Promise.allSettled([
          api.get('/destinations?limit=1'),
          api.get('/bookings'),
          api.get('/users'),
        ]);

        const totalDestinations = destRes.status === 'fulfilled' ? (destRes.value.data.total || destRes.value.data.destinations?.length || 0) : 0;

        const bookings = bookRes.status === 'fulfilled' ? (bookRes.value.data.bookings || bookRes.value.data || []) : [];
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
        const revenue = bookings.filter((b) => b.paymentStatus === 'paid' || b.status === 'completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        const totalUsers = userRes.status === 'fulfilled' ? (userRes.value.data.total || userRes.value.data.users?.length || userRes.value.data.length || 0) : 0;

        setStats({ totalDestinations, totalBookings, pendingBookings, totalUsers, revenue });
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: 'Total Destinations', value: stats?.totalDestinations || 0, icon: MapIcon, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: TicketIcon, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: ClockIcon, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: UsersIcon, color: 'bg-purple-50 text-purple-600' },
    { label: 'Revenue', value: `$${(stats?.revenue || 0).toLocaleString()}`, icon: CurrencyDollarIcon, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
