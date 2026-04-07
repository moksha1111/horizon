import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronDownIcon, MapPinIcon, GlobeAltIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useInView from '../hooks/useInView';
import DestinationCard from '../components/DestinationCard';
import Spinner from '../components/Spinner';
import api from '../utils/axios';

const categoryImages = {
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
  city: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
  countryside: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
  desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
  island: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
  arctic: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
};

const categoryIcons = {
  beach: '\u{1F3D6}\u{FE0F}', mountain: '\u{1F3D4}\u{FE0F}', city: '\u{1F3D9}\u{FE0F}',
  countryside: '\u{1F33F}', desert: '\u{1F3DC}\u{FE0F}', island: '\u{1F3DD}\u{FE0F}',
  forest: '\u{1F332}', arctic: '\u2744\uFE0F',
};

const testimonials = [
  { name: 'Sarah Mitchell', location: 'New York, USA', rating: 5, quote: 'Horizon transformed our honeymoon into a fairy-tale experience. Every detail was perfect, from the secluded villa in Santorini to the private sunset cruise.' },
  { name: 'James Rodriguez', location: 'London, UK', rating: 5, quote: 'I have traveled with many agencies but nothing compares to the level of service and curation Horizon provides. The Patagonia trek was life-changing.' },
  { name: 'Akiko Tanaka', location: 'Tokyo, Japan', rating: 5, quote: 'The attention to cultural authenticity sets Horizon apart. Our Morocco trip felt genuine and immersive, not like a tourist package at all.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchCat, setSearchCat] = useState('');

  const [featRef, featVis] = useInView();
  const [catRef, catVis] = useInView();
  const [howRef, howVis] = useInView();
  const [testRef, testVis] = useInView();
  const [ctaRef, ctaVis] = useInView();
  const [journalRef, journalVis] = useInView();

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, catRes, journalRes] = await Promise.allSettled([
          api.get('/destinations/featured'),
          api.get('/destinations/categories'),
          api.get('/journals?limit=3'),
        ]);
        if (featRes.status === 'fulfilled') setFeatured(featRes.value.data?.destinations || featRes.value.data || []);
        if (catRes.status === 'fulfilled') setCategories(catRes.value.data || []);
        if (journalRes.status === 'fulfilled') setJournals(journalRes.value.data?.journals || journalRes.value.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (searchCat) params.set('category', searchCat);
    navigate(`/destinations?${params.toString()}`);
  };

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-emerald-300 text-sm font-semibold tracking-[0.3em] uppercase mb-6">Explore the World</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Your Next Adventure<br />Awaits
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-light">
            Discover breathtaking destinations, curated experiences, and unforgettable journeys crafted for the modern explorer.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where do you want to go?"
                className="bg-transparent text-white placeholder-white/50 outline-none w-full py-3 text-sm"
              />
            </div>
            <select
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              className="bg-white/10 text-white border-0 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
            >
              <option value="" className="text-gray-900">All Categories</option>
              {Object.keys(categoryImages).map((c) => (
                <option key={c} value={c} className="text-gray-900 capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
              Explore
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { val: '500+', label: 'Destinations' },
                { val: '50K+', label: 'Travelers' },
                { val: '98%', label: 'Satisfaction' },
                { val: '24/7', label: 'Support' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl py-4 px-3 text-center">
                  <p className="text-white font-bold text-xl">{s.val}</p>
                  <p className="text-white/70 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDownIcon className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section ref={featRef} className={`py-24 px-4 bg-white fade-up ${featVis ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-sm font-semibold tracking-wider uppercase mb-3">Curated for You</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Featured Destinations</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Handpicked experiences for the modern explorer</p>
          </div>
          {loading ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 6).map((d) => (
                <DestinationCard key={d._id} destination={d} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/destinations" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group">
              View All Destinations
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section ref={catRef} className={`py-24 px-4 bg-stone-50 fade-up ${catVis ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-sm font-semibold tracking-wider uppercase mb-3">Browse by Type</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Explore by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(categories.length > 0 ? categories : Object.keys(categoryImages).map(c => ({ _id: c, count: 0 }))).map((cat) => {
              const name = cat._id || cat.name;
              return (
                <Link
                  key={name}
                  to={`/destinations?category=${name}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden"
                >
                  <img
                    src={categoryImages[name] || categoryImages.beach}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-2xl mb-1 block">{categoryIcons[name] || ''}</span>
                    <h3 className="text-white font-display font-semibold text-lg capitalize">{name}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{cat.count || 0} destinations</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section ref={howRef} className={`py-24 px-4 bg-white fade-up ${howVis ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-sm font-semibold tracking-wider uppercase mb-3">Simple Process</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: <GlobeAltIcon className="w-7 h-7" />, title: 'Discover', desc: 'Browse through our curated collection of extraordinary destinations around the globe.' },
              { num: '02', icon: <ShieldCheckIcon className="w-7 h-7" />, title: 'Book', desc: 'Reserve your spot with our secure booking system and flexible payment options.' },
              { num: '03', icon: <ClockIcon className="w-7 h-7" />, title: 'Experience', desc: 'Create memories that last a lifetime with our premium travel experiences.' },
            ].map((step) => (
              <div key={step.num} className="relative bg-stone-50 rounded-3xl p-8 text-center group hover:bg-emerald-600 transition-all duration-500">
                <div className="absolute top-6 right-6 font-display text-4xl font-bold text-emerald-100 group-hover:text-white/20 transition-colors">
                  {step.num}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mx-auto mb-6 transition-all">
                  {step.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 group-hover:text-white transition-colors mb-3">{step.title}</h3>
                <p className="text-gray-500 group-hover:text-white/80 text-sm leading-relaxed transition-colors">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section ref={testRef} className={`py-24 px-4 bg-gray-950 fade-up ${testVis ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">What Our Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-900 rounded-3xl p-8 relative">
                <span className="absolute top-4 right-6 font-display text-6xl text-emerald-600/20">&ldquo;</span>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section ref={ctaRef} className={`py-24 px-4 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 fade-up ${ctaVis ? 'visible' : ''}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-emerald-100/80 text-lg mb-10">Join thousands of travelers who have discovered their perfect getaway with Horizon.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/destinations" className="bg-white text-emerald-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-stone-50 transition-colors">
              Explore Destinations
            </Link>
            <Link to="/register" className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Start Planning
            </Link>
          </div>
        </div>
      </section>

      {/* ============ JOURNALS ============ */}
      <section ref={journalRef} className={`py-24 px-4 bg-white fade-up ${journalVis ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-sm font-semibold tracking-wider uppercase mb-3">From the Blog</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Travel Stories</h2>
          </div>
          {journals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {journals.map((j) => (
                <Link key={j._id} to={`/journals/${j._id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-all">
                    {j.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img src={j.coverImage} alt={j.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{j.title}</h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{j.excerpt || j.content?.substring(0, 120)}</p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                        <span>{j.author?.name}</span>
                        <span>&middot;</span>
                        <span>{j.readTime || '5 min read'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : !loading && (
            <p className="text-center text-gray-400">No stories yet. Be the first to share your journey.</p>
          )}
          <div className="text-center mt-12">
            <Link to="/journals" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group">
              Read More Stories
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
