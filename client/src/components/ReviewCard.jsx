import { StarIcon } from '@heroicons/react/24/solid';

export default function ReviewCard({ review }) {
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm shrink-0">
          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</h4>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} />
            ))}
          </div>
          {review.title && <p className="font-medium text-gray-800 text-sm mt-2">{review.title}</p>}
          <p className="text-gray-600 text-sm mt-1 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
