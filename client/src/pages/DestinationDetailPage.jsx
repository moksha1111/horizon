import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, CheckIcon, XMarkIcon as XIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { HeartIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import ReviewCard from '../components/ReviewCard';

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  challenging: 'bg-orange-100 text-orange-700',
  expert: 'bg-red-100 text-red-700',
};

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [openDay, setOpenDay] = useState(0);
  const [saved, setSaved] = useState(false);

  // Booking
  const [startDate, setStartDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/destinations/${id}`);
        setDest(data);
      } catch {
        toast.error('Destination not found');
        navigate('/destinations');
        return;
      }
      try {
        const { data } = await api.get(`/destinations/${id}/reviews`);
        setReviews(data.reviews || data || []);
      } catch { /* ok */ }
      if (user) {
        try {
          const { data } = await api.get('/users/wishlist');
          const list = data.wishlist || data || [];
          setSaved(list.some((w) => (w._id || w) === id));
        } catch { /* ok */ }
      }
      setLoading(false);
    };
    load();
  }, [id, user, navigate]);

  const toggleWishlist = async () => {
    if (!user) return toast.error('Please sign in');
    try {
      if (saved) {
        await api.delete(`/users/wishlist/${id}`);
        setSaved(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/users/wishlist/${id}`);
        setSaved(true);
        toast.success('Added to wishlist');
      }
    } catch { toast.error('Failed'); }
  };

  const handleBook = async () => {
    if (!user) return toast.error('Please sign in to book');
    if (!startDate) return toast.error('Please select a date');
    setBooking(true);
    try {
      await api.post('/bookings', {
        destination: id,
        startDate,
        guests,
        totalPrice: dest.price * guests,
      });
      toast.success('Booking created!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBooking(false);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const { data } = await api.post(`/destinations/${id}/reviews`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviews((prev) => [data.review || data, ...prev]);
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  if (loading) return <div className="pt-24"><Spinner /></div>;
  if (!dest) return null;

  const images = dest.images?.length > 0 ? dest.images : ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'];
  const avgRating = dest.rating || 0;

  return (
    <div className="pt-20">
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-3 rounded-2xl overflow-hidden aspect-[16/9]">
            <img src={images[activeImg]} alt={dest.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${i === activeImg ? 'border-emerald-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold capitalize">{dest.category}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${difficultyColors[dest.difficulty] || 'bg-gray-100 text-gray-600'}`}>{dest.difficulty}</span>
              <span className="px-3 py-1 bg-stone-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{dest.duration}</span>
              {dest.groupSize && <span className="px-3 py-1 bg-stone-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1"><UserGroupIcon className="w-3.5 h-3.5" />Up to {dest.groupSize}</span>}
            </div>

            {/* Title */}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">{dest.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPinIcon className="w-4 h-4 text-emerald-600" />
                  {dest.country}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{avgRating.toFixed(1)} ({dest.reviewCount || reviews.length})</span>
                </div>
                <button onClick={toggleWishlist} className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                  {saved ? <HeartSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">About This Trip</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{dest.description}</p>
            </div>

            {/* Highlights */}
            {dest.highlights?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-stone-50 rounded-xl p-3">
                      <CheckIcon className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Includes / Excludes */}
            {(dest.includes?.length > 0 || dest.excludes?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dest.includes?.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                    <ul className="space-y-2">
                      {dest.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {dest.excludes?.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-gray-900 mb-3">Not Included</h3>
                    <ul className="space-y-2">
                      {dest.excludes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <XIcon className="w-4 h-4 text-red-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary */}
            {dest.itinerary?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Day-by-Day Itinerary</h2>
                <div className="space-y-3">
                  {dest.itinerary.map((day, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenDay(openDay === i ? -1 : i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{day.title || `Day ${i + 1}`}</p>
                          </div>
                        </div>
                        {openDay === i ? <ChevronUpIcon className="w-5 h-5 text-gray-400" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
                      </button>
                      {openDay === i && (
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                          <p className="text-gray-600 text-sm leading-relaxed">{day.description}</p>
                          {day.activities?.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {day.activities.map((a, j) => (
                                <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              <div className="flex items-center gap-4 mb-6 p-4 bg-stone-50 rounded-2xl">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {user && (
                <form onSubmit={handleReview} className="mb-8 p-6 bg-white border border-gray-100 rounded-2xl space-y-4">
                  <h3 className="font-semibold text-gray-900">Write a Review</h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewRating(s)}>
                        <StarIcon className={`w-6 h-6 ${s <= reviewRating ? 'text-amber-400' : 'text-gray-200'} cursor-pointer`} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Review title (optional)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {reviews.map((r, i) => <ReviewCard key={r._id || i} review={r} />)}
                {reviews.length === 0 && <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-baseline gap-2">
                {dest.originalPrice && dest.originalPrice > dest.price && (
                  <span className="text-lg text-gray-400 line-through">${dest.originalPrice}</span>
                )}
                <span className="text-3xl font-bold text-emerald-600">${dest.price}</span>
                <span className="text-sm text-gray-500">/ person</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Travel Date</label>
                  <div className="relative">
                    <CalendarDaysIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">${dest.price} x {guests} guest{guests > 1 ? 's' : ''}</span>
                  <span className="font-semibold text-gray-900">${dest.price * guests}</span>
                </div>
                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-emerald-600 text-lg">${dest.price * guests}</span>
                </div>
              </div>

              {user ? (
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {booking ? 'Booking...' : 'Book Now'}
                </button>
              ) : (
                <button onClick={() => navigate('/login')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors">
                  Sign In to Book
                </button>
              )}

              <p className="text-xs text-gray-400 text-center">Free cancellation up to 48 hours before</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
