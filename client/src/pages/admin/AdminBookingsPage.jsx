import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import Spinner from '../../components/Spinner';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/bookings');
        setBookings(data.bookings || data || []);
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Traveler</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Destination</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Guests</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 hover:bg-stone-50/50">
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{b._id?.slice(-6)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{b.user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-400">{b.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.destination?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{b.startDate ? new Date(b.startDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{b.guests}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${b.totalPrice}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer outline-none ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/bookings/${b._id}`} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors inline-block">
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
