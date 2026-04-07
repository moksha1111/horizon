import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPinIcon, CalendarDaysIcon, UserGroupIcon, CheckIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const steps = ['pending', 'confirmed', 'ongoing', 'completed'];
const stepLabels = ['Pending', 'Confirmed', 'Ongoing', 'Completed'];

export default function BookingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        setBooking(data.booking || data);
      } catch {
        toast.error('Booking not found');
        navigate('/bookings');
      }
      setLoading(false);
    };
    load();
  }, [id, user, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBooking((prev) => ({ ...prev, status: 'cancelled' }));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
    setCancelling(false);
  };

  if (loading) return <div className="pt-24"><Spinner /></div>;
  if (!booking) return null;

  const currentStep = booking.status === 'cancelled' ? -1 : steps.indexOf(booking.status);
  const dest = booking.destination;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/bookings" className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors">&larr; Back to My Trips</Link>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-4 mb-8">Booking Details</h1>

        {/* Status Progress */}
        {booking.status !== 'cancelled' && (
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
              <div className="absolute top-5 left-0 h-0.5 bg-emerald-600 transition-all" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
              {steps.map((s, i) => (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i < currentStep ? <CheckIcon className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {stepLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {booking.status === 'cancelled' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
            <p className="text-red-600 font-semibold">This booking has been cancelled.</p>
          </div>
        )}

        {/* Destination Card */}
        {dest && (
          <Link to={`/destinations/${dest._id}`} className="block mb-8 group">
            <div className="flex flex-col sm:flex-row gap-4 bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <div className="sm:w-56 h-40 sm:h-auto shrink-0 overflow-hidden">
                <img
                  src={dest.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">{dest.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPinIcon className="w-4 h-4 text-emerald-600" />
                  {dest.country}
                </div>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{dest.shortDescription || dest.description?.substring(0, 150)}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-stone-50 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <CalendarDaysIcon className="w-4 h-4" />
              Travel Date
            </div>
            <p className="font-semibold text-gray-900">{booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <UserGroupIcon className="w-4 h-4" />
              Guests
            </div>
            <p className="font-semibold text-gray-900">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-5">
            <p className="text-gray-500 text-sm mb-1">Total Price</p>
            <p className="font-bold text-emerald-600 text-xl">${booking.totalPrice}</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-5">
            <p className="text-gray-500 text-sm mb-1">Payment Status</p>
            <p className="font-semibold text-gray-900 capitalize">{booking.paymentStatus || 'Pending'}</p>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="mb-8">
            <h2 className="font-display text-lg font-semibold text-gray-900 mb-3">Special Requests</h2>
            <p className="text-gray-600 text-sm bg-stone-50 rounded-2xl p-5">{booking.specialRequests}</p>
          </div>
        )}

        {/* Cancel */}
        {booking.status === 'pending' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
      </div>
    </div>
  );
}
