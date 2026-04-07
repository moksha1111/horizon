import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export default function JournalWritePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [destination, setDestination] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (editId) {
      const load = async () => {
        try {
          const { data } = await api.get(`/journals/${editId}`);
          const j = data.journal || data;
          setTitle(j.title || '');
          setCoverImage(j.coverImage || '');
          setContent(j.content || '');
          setDestination(j.destination?._id || j.destination || '');
          setTags(j.tags?.join(', ') || '');
        } catch {
          toast.error('Journal not found');
          navigate('/journals');
        }
      };
      load();
    }
  }, [user, editId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return toast.error('Title and content are required');
    }
    setSaving(true);
    const payload = {
      title,
      coverImage,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (destination) payload.destination = destination;

    try {
      if (editId) {
        await api.put(`/journals/${editId}`, payload);
        toast.success('Story updated!');
        navigate(`/journals/${editId}`);
      } else {
        const { data } = await api.post('/journals', payload);
        toast.success('Story published!');
        navigate(`/journals/${data.journal?._id || data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
    setSaving(false);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">{editId ? 'Edit Story' : 'Write a Story'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your story title..."
              className="w-full text-2xl font-display font-semibold text-gray-900 placeholder-gray-300 border-0 border-b-2 border-gray-100 focus:border-emerald-500 outline-none pb-3 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {coverImage && (
              <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your travel experience..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none min-h-[300px] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination ID (optional)</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination ID if related"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="adventure, europe, hiking"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button type="submit" disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : (editId ? 'Update Story' : 'Publish Story')}
          </button>
        </form>
      </div>
    </div>
  );
}
