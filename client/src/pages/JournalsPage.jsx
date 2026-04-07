import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HeartIcon, ClockIcon } from '@heroicons/react/24/outline';
import api from '../utils/axios';
import Spinner from '../components/Spinner';

export default function JournalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const [allTags, setAllTags] = useState([]);
  const limit = 6;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', limit);
      if (activeTag) params.set('tag', activeTag);
      try {
        const { data } = await api.get(`/journals?${params.toString()}`);
        setJournals(data.journals || data || []);
        setTotal(data.total || (data.journals || data || []).length);
        if (data.tags) setAllTags(data.tags);
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, [page, activeTag]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTag) params.set('tag', activeTag);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [activeTag, page, setSearchParams]);

  // Collect tags from journals if API doesn't return them
  useEffect(() => {
    if (allTags.length === 0 && journals.length > 0) {
      const tags = new Set();
      journals.forEach((j) => j.tags?.forEach((t) => tags.add(t)));
      setAllTags([...tags]);
    }
  }, [journals, allTags]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 sm:h-72 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600"
          alt="Travel stories"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative z-10 text-center px-4 pt-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">Travel Stories</h1>
          <p className="text-white/70 mt-3 max-w-lg mx-auto">Inspiring tales from travelers around the world</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setActiveTag(''); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!activeTag ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'}`}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => { setActiveTag(t); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeTag === t ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? <Spinner /> : (
          <>
            {journals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {journals.map((j) => (
                  <Link key={j._id} to={`/journals/${j._id}`} className="group block">
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                      {j.coverImage && (
                        <div className="aspect-video overflow-hidden">
                          <img src={j.coverImage} alt={j.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6">
                        {j.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {j.tags.slice(0, 3).map((t) => (
                              <span key={t} className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full capitalize">{t}</span>
                            ))}
                          </div>
                        )}
                        <h3 className="font-display text-xl font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">{j.title}</h3>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{j.excerpt || j.content?.substring(0, 160)}</p>
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                              {j.author?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{j.author?.name || 'Anonymous'}</p>
                              <p className="text-xs text-gray-400">{j.createdAt ? new Date(j.createdAt).toLocaleDateString() : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{j.readTime || '5 min'}</span>
                            <span className="flex items-center gap-1"><HeartIcon className="w-3.5 h-3.5" />{j.likes?.length || j.likesCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No stories found.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-100 disabled:opacity-40 transition-colors">Previous</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${page === i + 1 ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-stone-100'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-100 disabled:opacity-40 transition-colors">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
