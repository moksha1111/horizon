import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data.bookings || data || []);
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  if (loading) return <div className="pt-24"><Spinner /></div>;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">My Trips</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-3xl">
            <p className="text-5xl mb-4">&#9992;&#65039;</p>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-6">Your adventure is waiting. Start exploring destinations!</p>
            <Link to="/destinations" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Link key={b._id} to={`/bookings/${b._id}`} className="block group">
                <div className="flex flex-col sm:flex-row gap-4 bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                  <div className="sm:w-48 h-32 sm:h-auto shrink-0 overflow-hidden">
                    <img
                      src={b.destination?.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                      alt={b.destination?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display font-semibold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                            {b.destination?.name || 'Destination'}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPinIcon className="w-4 h-4" />
                            {b.destination?.country || 'Unknown'}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {b.startDate ? new Date(b.startDate).toLocaleDateString() : 'TBD'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserGroupIcon className="w-4 h-4" />
                        {b.guests} guest{b.guests > 1 ? 's' : ''}
                      </span>
                      <span className="ml-auto font-bold text-emerald-600 text-lg">${b.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
