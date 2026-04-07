import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-display font-bold text-2xl tracking-widest text-white">
              HORIZON
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Discover the world's most extraordinary places. We curate premium travel experiences for the modern explorer.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              {['Twitter', 'Instagram', 'Facebook', 'YouTube'].map((s) => (
                <a key={s} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all text-xs font-medium">
                  {s.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-6">Destinations</h4>
            <ul className="space-y-3">
              {['Beach', 'Mountain', 'City', 'Island'].map((item) => (
                <li key={item}>
                  <Link to={`/destinations?category=${item.toLowerCase()}`} className="text-sm hover:text-emerald-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-6">Company</h4>
            <ul className="space-y-3">
              {['About', 'Contact', 'Careers', 'Blog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-emerald-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-6">Support</h4>
            <ul className="space-y-3">
              {['FAQ', 'Terms of Service', 'Privacy Policy', 'Help Center'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-emerald-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Horizon. All rights reserved.</p>
          <p className="text-xs text-gray-600">Crafted with care for extraordinary journeys.</p>
        </div>
      </div>
    </footer>
  );
}
