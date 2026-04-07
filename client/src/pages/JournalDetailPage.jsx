import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HeartIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function JournalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/journals/${id}`);
        const j = data.journal || data;
        setJournal(j);
        setLikeCount(j.likes?.length || j.likesCount || 0);
        if (user && j.likes) {
          setLiked(j.likes.includes(user._id || user.id));
        }
        setComments(j.comments || []);
      } catch {
        toast.error('Story not found');
        navigate('/journals');
      }
      setLoading(false);
    };
    load();
  }, [id, user, navigate]);

  const toggleLike = async () => {
    if (!user) return toast.error('Please sign in');
    try {
      const { data } = await api.put(`/journals/${id}/like`);
      setLiked(!liked);
      setLikeCount(data.likes?.length || data.likesCount || (liked ? likeCount - 1 : likeCount + 1));
    } catch { toast.error('Failed'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/journals/${id}/comments`, { text: commentText });
      setComments((prev) => [...prev, data.comment || data]);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to comment');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="pt-24"><Spinner /></div>;
  if (!journal) return null;

  return (
    <div className="pt-20">
      {/* Cover */}
      {journal.coverImage && (
        <div className="w-full max-h-96 overflow-hidden">
          <img src={journal.coverImage} alt={journal.title} className="w-full h-96 object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/journals" className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors mb-6">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Stories
        </Link>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{journal.title}</h1>

        {/* Author bar */}
        <div className="flex items-center justify-between mt-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {journal.author?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{journal.author?.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-400">{journal.createdAt ? new Date(journal.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" />{journal.readTime || '5 min read'}</span>
            <button onClick={toggleLike} className="flex items-center gap-1 hover:text-red-500 transition-colors">
              {liked ? <HeartSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
              {likeCount}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
          {journal.content}
        </div>

        {/* Tags */}
        {journal.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
            {journal.tags.map((t) => (
              <Link key={t} to={`/journals?tag=${t}`} className="px-3 py-1.5 bg-stone-100 text-gray-600 text-xs font-medium rounded-full capitalize hover:bg-stone-200 transition-colors">
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Comments */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Comments ({comments.length})</h2>

          {user && (
            <form onSubmit={handleComment} className="mb-8 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                {user.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <button type="submit" disabled={submitting}
                  className="mt-2 bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {comments.map((c, i) => (
              <div key={c._id || i} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {c.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{c.user?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{c.text || c.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-gray-400 text-sm">No comments yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
