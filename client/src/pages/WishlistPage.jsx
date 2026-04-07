import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';
import Spinner from '../components/Spinner';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/users/wishlist');
      setWishlist(data.wishlist || data || []);
    } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    load();
  }, [user, navigate]);

  if (loading) return <div className="pt-24"><Spinner /></div>;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="text-sm text-gray-500">{wishlist.length} saved</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-3xl">
            <p className="text-5xl mb-4">&#10084;&#65039;</p>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save destinations you love and come back to them later.</p>
            <Link to="/destinations" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((d) => (
              <DestinationCard key={d._id} destination={d} wishlisted={true} onWishlistChange={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
