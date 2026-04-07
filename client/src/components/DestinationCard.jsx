import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const categoryIcons = {
  beach: '\u{1F3D6}\u{FE0F}',
  mountain: '\u{1F3D4}\u{FE0F}',
  city: '\u{1F3D9}\u{FE0F}',
  countryside: '\u{1F33F}',
  desert: '\u{1F3DC}\u{FE0F}',
  island: '\u{1F3DD}\u{FE0F}',
  forest: '\u{1F332}',
  arctic: '\u2744\uFE0F',
};

const countryFlags = {
  'Thailand': '\u{1F1F9}\u{1F1ED}',
  'Switzerland': '\u{1F1E8}\u{1F1ED}',
  'Japan': '\u{1F1EF}\u{1F1F5}',
  'Italy': '\u{1F1EE}\u{1F1F9}',
  'Maldives': '\u{1F1F2}\u{1F1FB}',
  'Peru': '\u{1F1F5}\u{1F1EA}',
  'Iceland': '\u{1F1EE}\u{1F1F8}',
  'France': '\u{1F1EB}\u{1F1F7}',
  'USA': '\u{1F1FA}\u{1F1F8}',
  'Indonesia': '\u{1F1EE}\u{1F1E9}',
  'Norway': '\u{1F1F3}\u{1F1F4}',
  'Morocco': '\u{1F1F2}\u{1F1E6}',
  'New Zealand': '\u{1F1F3}\u{1F1FF}',
  'Greece': '\u{1F1EC}\u{1F1F7}',
  'Australia': '\u{1F1E6}\u{1F1FA}',
  'Brazil': '\u{1F1E7}\u{1F1F7}',
};

export default function DestinationCard({ destination, wishlisted = false, onWishlistChange }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(wishlisted);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to save destinations');
      return;
    }
    setLoading(true);
    try {
      if (saved) {
        await api.delete(`/users/wishlist/${destination._id}`);
        setSaved(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/users/wishlist/${destination._id}`);
        setSaved(true);
        toast.success('Added to wishlist');
      }
      onWishlistChange?.();
    } catch {
      toast.error('Failed to update wishlist');
    }
    setLoading(false);
  };

  const flag = countryFlags[destination.country] || '\u{1F30D}';
  const icon = categoryIcons[destination.category] || '\u{1F30D}';
  const image = destination.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';

  return (
    <Link to={`/destinations/${destination._id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-sm">{icon}</span>
            <span className="text-xs font-medium text-white capitalize">{destination.category}</span>
          </div>

          {/* Heart button */}
          <button
            onClick={toggleWishlist}
            disabled={loading}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-all"
          >
            {saved ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Bottom info on image */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <span>{flag}</span>
              <span className="font-medium">{destination.country}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-gray-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">
            {destination.name}
          </h3>

          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${i < Math.round(destination.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({destination.reviewCount || 0})</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">{destination.duration}</span>
            <div className="flex items-baseline gap-1">
              {destination.originalPrice && destination.originalPrice > destination.price && (
                <span className="text-xs text-gray-400 line-through">${destination.originalPrice}</span>
              )}
              <span className="text-lg font-bold text-emerald-600">${destination.price}</span>
              <span className="text-xs text-gray-500">/person</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
