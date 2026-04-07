import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import DestinationCard from '../components/DestinationCard';
import Spinner from '../components/Spinner';
import api from '../utils/axios';

const categories = ['all', 'beach', 'mountain', 'city', 'countryside', 'desert', 'island', 'forest', 'arctic'];
const continents = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'];
const difficulties = ['All', 'Easy', 'Moderate', 'Challenging', 'Expert'];

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [continent, setContinent] = useState(searchParams.get('continent') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const limit = 9;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'all') params.set('category', category);
      if (continent && continent !== 'All') params.set('continent', continent);
      if (difficulty && difficulty !== 'All') params.set('difficulty', difficulty.toLowerCase());
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', page);
      params.set('limit', limit);

      try {
        const { data } = await api.get(`/destinations?${params.toString()}`);
        setDestinations(data.destinations || data);
        setTotal(data.total || (data.destinations || data).length);
      } catch {
        setDestinations([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [search, category, continent, difficulty, minPrice, maxPrice, page]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'all') params.set('category', category);
    if (continent !== 'All') params.set('continent', continent);
    if (difficulty !== 'All') params.set('difficulty', difficulty);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [search, category, continent, difficulty, minPrice, maxPrice, page, setSearchParams]);

  const activeFilters = [];
  if (category !== 'all') activeFilters.push({ key: 'category', label: category });
  if (continent !== 'All') activeFilters.push({ key: 'continent', label: continent });
  if (difficulty !== 'All') activeFilters.push({ key: 'difficulty', label: difficulty });
  if (minPrice) activeFilters.push({ key: 'minPrice', label: `Min $${minPrice}` });
  if (maxPrice) activeFilters.push({ key: 'maxPrice', label: `Max $${maxPrice}` });

  const clearFilter = (key) => {
    if (key === 'category') setCategory('all');
    if (key === 'continent') setContinent('All');
    if (key === 'difficulty') setDifficulty('All');
    if (key === 'minPrice') setMinPrice('');
    if (key === 'maxPrice') setMaxPrice('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600"
          alt="Destinations"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative z-10 text-center px-4 pt-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">Discover Your Dream Destination</h1>
          <p className="text-white/70 mt-3 max-w-lg mx-auto">Explore our collection of handpicked travel experiences around the world.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search destinations..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-stone-50 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-stone-50 rounded-2xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Continent</label>
              <select value={continent} onChange={(e) => { setContinent(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                {continents.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Difficulty</label>
              <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                {difficulties.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Price</label>
              <input type="number" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                placeholder="$0" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price</label>
              <input type="number" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                placeholder="$10000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                category === c
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-500 font-medium">Active filters:</span>
            {activeFilters.map((f) => (
              <span key={f.key} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium capitalize">
                {f.label}
                <button onClick={() => clearFilter(f.key)}><XMarkIcon className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">{total} destination{total !== 1 ? 's' : ''} found</p>

        {/* Grid */}
        {loading ? <Spinner /> : (
          <>
            {destinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((d) => (
                  <DestinationCard key={d._id} destination={d} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No destinations found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      page === i + 1 ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-stone-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
