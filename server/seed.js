const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Destination = require('./models/Destination');
const Booking = require('./models/Booking');
const Journal = require('./models/Journal');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear all collections
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Booking.deleteMany({});
    await Journal.deleteMany({});
    console.log('All collections cleared.');

    // Create users
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@horizon.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Horizon platform administrator',
      location: 'New York, USA'
    });

    const travelerUser = await User.create({
      name: 'Alex Traveler',
      email: 'traveler@horizon.com',
      password: 'travel123',
      role: 'user',
      bio: 'Passionate explorer and travel photographer. Always chasing sunsets and collecting stories from around the world.',
      location: 'London, UK',
      joinedTrips: 7
    });

    console.log('Users created.');

    // Destinations
    const destinations = await Destination.insertMany([
      // BEACH 1
      {
        name: 'Maldives Paradise Retreat',
        country: 'Maldives',
        continent: 'Asia',
        description: 'Experience the ultimate tropical escape in the Maldives, where crystal-clear turquoise waters meet pristine white-sand beaches. Stay in luxurious overwater villas and discover vibrant coral reefs teeming with marine life. This is the quintessential beach getaway for those seeking serenity and natural beauty.',
        shortDescription: 'Luxury overwater villas surrounded by turquoise Indian Ocean waters.',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
          'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800'
        ],
        category: 'beach',
        price: 3499,
        originalPrice: 4299,
        duration: '7 days / 6 nights',
        groupSize: 8,
        difficulty: 'easy',
        highlights: ['Overwater villa accommodation', 'Snorkeling with manta rays', 'Sunset dolphin cruise', 'Private beach dinner', 'Spa treatments'],
        includes: ['Luxury accommodation', 'All meals & drinks', 'Airport transfers', 'Snorkeling equipment', 'Guided excursions'],
        excludes: ['International flights', 'Travel insurance', 'Personal expenses'],
        itinerary: [
          { day: 1, title: 'Arrival in Paradise', description: 'Seaplane transfer to the resort island, welcome cocktail and villa check-in.', activities: ['Seaplane transfer', 'Resort orientation', 'Welcome dinner'] },
          { day: 2, title: 'Ocean Adventures', description: 'Full day of water activities around the atoll.', activities: ['Snorkeling safari', 'Kayaking', 'Beach picnic'] },
          { day: 3, title: 'Marine Discovery', description: 'Explore the underwater world with guided diving and marine biology talks.', activities: ['Guided reef dive', 'Marine biology talk', 'Night fishing'] },
          { day: 4, title: 'Island Hopping', description: 'Visit neighboring islands and experience local Maldivian culture.', activities: ['Local island visit', 'Cultural tour', 'Sunset cruise'] },
          { day: 5, title: 'Relaxation Day', description: 'A day dedicated to wellness and personal exploration.', activities: ['Spa treatment', 'Yoga session', 'Private beach time'] }
        ],
        coordinates: { lat: 3.2028, lng: 73.2207 },
        rating: 4.8,
        numReviews: 24,
        featured: true,
        maxGuests: 16,
        tags: ['luxury', 'romantic', 'snorkeling', 'beach', 'honeymoon']
      },
      // BEACH 2
      {
        name: 'Zanzibar Coastal Explorer',
        country: 'Tanzania',
        continent: 'Africa',
        description: 'Discover the spice island of Zanzibar with its stunning coastline, rich history, and vibrant culture. Wander through the narrow streets of Stone Town, relax on powder-white beaches, and explore underwater worlds. A perfect blend of cultural immersion and tropical relaxation.',
        shortDescription: 'Spice island adventure combining culture, history, and pristine beaches.',
        images: [
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
        ],
        category: 'beach',
        price: 1899,
        originalPrice: 2299,
        duration: '6 days / 5 nights',
        groupSize: 12,
        difficulty: 'easy',
        highlights: ['Stone Town walking tour', 'Spice plantation visit', 'Jozani Forest red colobus monkeys', 'Snorkeling at Mnemba Atoll'],
        includes: ['Boutique hotel accommodation', 'Daily breakfast & 3 dinners', 'Local guide', 'All ground transfers'],
        excludes: ['International flights', 'Travel insurance', 'Lunches'],
        itinerary: [
          { day: 1, title: 'Welcome to Zanzibar', description: 'Arrive and settle into your beachfront hotel.', activities: ['Airport transfer', 'Beach walk', 'Welcome dinner'] },
          { day: 2, title: 'Stone Town Heritage', description: 'Explore the UNESCO World Heritage site of Stone Town.', activities: ['Walking tour', 'Slave market memorial', 'Rooftop sunset'] },
          { day: 3, title: 'Spice & Nature', description: 'Visit spice plantations and the Jozani Forest.', activities: ['Spice tour', 'Jozani Forest trek', 'Local cooking class'] },
          { day: 4, title: 'Ocean Day', description: 'Full day snorkeling and sailing adventure.', activities: ['Dhow sailing', 'Snorkeling at Mnemba', 'Sandbank picnic'] },
          { day: 5, title: 'Beach Bliss', description: 'Free day to relax or explore at your own pace.', activities: ['Beach relaxation', 'Optional kitesurfing', 'Farewell dinner'] }
        ],
        coordinates: { lat: -6.1659, lng: 39.1989 },
        rating: 4.5,
        numReviews: 18,
        featured: false,
        maxGuests: 20,
        tags: ['culture', 'beach', 'snorkeling', 'history', 'spices']
      },
      // MOUNTAIN 1
      {
        name: 'Swiss Alps Expedition',
        country: 'Switzerland',
        continent: 'Europe',
        description: 'Trek through the majestic Swiss Alps, passing through flower-filled meadows, charming alpine villages, and snow-capped peaks. This carefully crafted journey takes you along iconic trails with breathtaking panoramic views at every turn. Experience Swiss hospitality in cozy mountain huts and lakeside towns.',
        shortDescription: 'Iconic alpine trekking through meadows, villages, and snow-capped peaks.',
        images: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
          'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
          'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800'
        ],
        category: 'mountain',
        price: 2999,
        originalPrice: 3599,
        duration: '8 days / 7 nights',
        groupSize: 10,
        difficulty: 'moderate',
        highlights: ['Jungfrau region trekking', 'Eiger North Face viewpoint', 'Lake Brienz boat ride', 'Swiss chocolate tasting', 'Alpine sunrise hike'],
        includes: ['Mountain lodge accommodation', 'All meals', 'Expert mountain guide', 'Cable car passes', 'Luggage transfers'],
        excludes: ['International flights', 'Travel insurance', 'Personal hiking gear'],
        itinerary: [
          { day: 1, title: 'Arrival in Interlaken', description: 'Meet the group and gear check in the adventure capital of Switzerland.', activities: ['Airport transfer', 'Gear check', 'Group dinner'] },
          { day: 2, title: 'Grindelwald Valley', description: 'Hike through the stunning Grindelwald valley with Eiger views.', activities: ['Valley hike (12km)', 'Eiger viewpoint', 'Mountain hut dinner'] },
          { day: 3, title: 'Kleine Scheidegg', description: 'Ascend to Kleine Scheidegg with panoramic Jungfrau views.', activities: ['Alpine trail (14km)', 'Mountain lake swim', 'Photography stop'] },
          { day: 4, title: 'Lauterbrunnen Valley', description: 'Descend into the valley of 72 waterfalls.', activities: ['Waterfall trail', 'Trummelbach Falls visit', 'Village exploration'] },
          { day: 5, title: 'Schynige Platte', description: 'Ridge walk with 360-degree panoramic views of the Bernese Alps.', activities: ['Ridge hike (10km)', 'Alpine garden visit', 'Sunset viewing'] }
        ],
        coordinates: { lat: 46.6863, lng: 7.8586 },
        rating: 4.9,
        numReviews: 31,
        featured: true,
        maxGuests: 12,
        tags: ['trekking', 'alps', 'scenic', 'adventure', 'nature']
      },
      // MOUNTAIN 2
      {
        name: 'Nepal Himalaya Base Camp',
        country: 'Nepal',
        continent: 'Asia',
        description: 'Embark on the legendary trek to Annapurna Base Camp through rhododendron forests, terraced hillsides, and remote Gurung villages. Witness some of the world\'s highest peaks up close and immerse yourself in Nepali mountain culture. A life-changing adventure for serious trekkers.',
        shortDescription: 'Epic Himalayan trek to Annapurna Base Camp through remote mountain villages.',
        images: [
          'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
          'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800'
        ],
        category: 'mountain',
        price: 1799,
        originalPrice: 2199,
        duration: '12 days / 11 nights',
        groupSize: 10,
        difficulty: 'challenging',
        highlights: ['Annapurna Base Camp (4,130m)', 'Poon Hill sunrise', 'Gurung village homestay', 'Hot springs at Jhinu Danda'],
        includes: ['Teahouse accommodation', 'All meals on trek', 'Licensed guide & porters', 'Permits (ACAP & TIMS)', 'Kathmandu hotel'],
        excludes: ['International flights', 'Travel insurance', 'Personal trekking gear', 'Tips for guides'],
        itinerary: [
          { day: 1, title: 'Kathmandu Arrival', description: 'Welcome to Nepal. Explore the vibrant capital city.', activities: ['Airport pickup', 'Hotel check-in', 'Thamel exploration'] },
          { day: 2, title: 'Fly to Pokhara', description: 'Scenic flight to the lakeside city of Pokhara.', activities: ['Domestic flight', 'Phewa Lake visit', 'Trek briefing'] },
          { day: 3, title: 'Trek Begins', description: 'Drive to Nayapul and begin the trek to Tikhedhunga.', activities: ['Drive to trailhead', 'Trek to Tikhedhunga (5hrs)', 'Teahouse check-in'] },
          { day: 4, title: 'Through the Forest', description: 'Climb stone steps through dense rhododendron forests.', activities: ['Trek to Ghorepani (6hrs)', 'Forest trail', 'Mountain views'] },
          { day: 5, title: 'Poon Hill Sunrise', description: 'Pre-dawn hike to Poon Hill for a spectacular Himalayan sunrise.', activities: ['Poon Hill sunrise (3,210m)', 'Trek to Tadapani (5hrs)', 'Eagle spotting'] }
        ],
        coordinates: { lat: 28.5305, lng: 83.8778 },
        rating: 4.7,
        numReviews: 22,
        featured: true,
        maxGuests: 14,
        tags: ['trekking', 'himalaya', 'adventure', 'challenging', 'culture']
      },
      // CITY 1
      {
        name: 'Tokyo Cultural Immersion',
        country: 'Japan',
        continent: 'Asia',
        description: 'Dive into the electrifying energy of Tokyo, where ancient temples stand alongside neon-lit skyscrapers. From the serene Meiji Shrine to the buzzing streets of Shibuya, experience the unique harmony of tradition and innovation. Savor world-class cuisine, from street ramen to Michelin-starred sushi.',
        shortDescription: 'A dazzling journey through Tokyo\'s blend of ancient tradition and futuristic innovation.',
        images: [
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800'
        ],
        category: 'city',
        price: 2499,
        originalPrice: 2999,
        duration: '6 days / 5 nights',
        groupSize: 14,
        difficulty: 'easy',
        highlights: ['Shibuya Crossing experience', 'Tsukiji Outer Market food tour', 'Meiji Shrine visit', 'Day trip to Kamakura', 'Robot Restaurant show'],
        includes: ['Boutique hotel in Shinjuku', 'Daily breakfast', 'Metro pass (5 days)', 'Local guide', 'Food tour'],
        excludes: ['International flights', 'Travel insurance', 'Personal shopping'],
        itinerary: [
          { day: 1, title: 'Welcome to Tokyo', description: 'Arrive and get oriented in the world\'s largest metropolis.', activities: ['Airport express transfer', 'Shinjuku neighborhood walk', 'Izakaya welcome dinner'] },
          { day: 2, title: 'Traditional Tokyo', description: 'Explore the historic and spiritual side of the city.', activities: ['Meiji Shrine morning visit', 'Harajuku walk', 'Senso-ji Temple', 'Asakusa market'] },
          { day: 3, title: 'Food & Culture', description: 'A day dedicated to Tokyo\'s incredible food scene.', activities: ['Tsukiji food tour', 'Sushi-making class', 'Ginza district walk', 'Ramen alley dinner'] },
          { day: 4, title: 'Modern Tokyo', description: 'Experience the futuristic side of the city.', activities: ['TeamLab exhibition', 'Akihabara exploration', 'Shibuya Crossing', 'Rooftop bar'] },
          { day: 5, title: 'Day Trip to Kamakura', description: 'Visit the coastal town famous for its Great Buddha.', activities: ['Train to Kamakura', 'Great Buddha visit', 'Bamboo grove walk', 'Farewell kaiseki dinner'] }
        ],
        coordinates: { lat: 35.6762, lng: 139.6503 },
        rating: 4.8,
        numReviews: 42,
        featured: true,
        maxGuests: 16,
        tags: ['culture', 'food', 'city', 'temples', 'modern']
      },
      // CITY 2
      {
        name: 'Marrakech Medina Discovery',
        country: 'Morocco',
        continent: 'Africa',
        description: 'Lose yourself in the labyrinthine souks of Marrakech, where the air is thick with the scent of spices and the sounds of artisan workshops. Explore stunning riads, the grand Bahia Palace, and the iconic Jemaa el-Fnaa square. A sensory overload in the best possible way.',
        shortDescription: 'Navigate the enchanting souks and palaces of Morocco\'s red city.',
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800'
        ],
        category: 'city',
        price: 1299,
        originalPrice: 1599,
        duration: '5 days / 4 nights',
        groupSize: 14,
        difficulty: 'easy',
        highlights: ['Jemaa el-Fnaa at sunset', 'Bahia Palace tour', 'Souk shopping with guide', 'Atlas Mountains day trip', 'Traditional hammam'],
        includes: ['Riad accommodation', 'Daily breakfast & 2 dinners', 'Local guide', 'Atlas Mountains excursion', 'Hammam session'],
        excludes: ['International flights', 'Travel insurance', 'Souk purchases'],
        itinerary: [
          { day: 1, title: 'Arrival in the Red City', description: 'Check into a beautiful traditional riad and explore the neighborhood.', activities: ['Airport transfer', 'Riad welcome mint tea', 'Evening Jemaa el-Fnaa visit'] },
          { day: 2, title: 'Medina Treasures', description: 'Full guided tour of Marrakech\'s historic medina.', activities: ['Bahia Palace', 'Ben Youssef Madrasa', 'Souk guided tour', 'Rooftop dinner'] },
          { day: 3, title: 'Atlas Mountains', description: 'Day trip to the stunning Atlas Mountains and Berber villages.', activities: ['Mountain drive', 'Berber village visit', 'Valley hike', 'Traditional lunch'] },
          { day: 4, title: 'Art & Relaxation', description: 'Explore the artistic side of Marrakech and unwind.', activities: ['Majorelle Garden', 'YSL Museum', 'Hammam experience', 'Farewell dinner'] }
        ],
        coordinates: { lat: 31.6295, lng: -7.9811 },
        rating: 4.6,
        numReviews: 28,
        featured: false,
        maxGuests: 18,
        tags: ['culture', 'markets', 'history', 'food', 'architecture']
      },
      // COUNTRYSIDE 1
      {
        name: 'Tuscany Wine & Village Trail',
        country: 'Italy',
        continent: 'Europe',
        description: 'Wander through the rolling hills of Tuscany, where golden vineyards stretch to the horizon and medieval hilltop villages dot the landscape. Taste world-renowned wines at family estates, learn to cook authentic Tuscan dishes, and soak in the dolce vita lifestyle. A feast for all the senses.',
        shortDescription: 'Rolling hills, world-class wines, and charming medieval villages in the Italian countryside.',
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
          'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
          'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800'
        ],
        category: 'countryside',
        price: 2299,
        originalPrice: 2799,
        duration: '6 days / 5 nights',
        groupSize: 10,
        difficulty: 'easy',
        highlights: ['Chianti wine tasting', 'Cooking class with local chef', 'San Gimignano towers', 'Truffle hunting experience', 'Val d\'Orcia photography'],
        includes: ['Agriturismo accommodation', 'All meals with wine', 'Private minivan transport', 'Wine tastings at 4 estates', 'Cooking class'],
        excludes: ['International flights', 'Travel insurance', 'Wine purchases'],
        itinerary: [
          { day: 1, title: 'Benvenuti in Toscana', description: 'Arrive in Florence and transfer to your countryside agriturismo.', activities: ['Florence pickup', 'Scenic drive', 'Estate tour & welcome dinner'] },
          { day: 2, title: 'Chianti Wine Route', description: 'Explore the heart of Chianti wine country.', activities: ['Two vineyard visits', 'Wine & olive oil tasting', 'Greve in Chianti market'] },
          { day: 3, title: 'Medieval Villages', description: 'Visit the stunning hilltop towns of Tuscany.', activities: ['San Gimignano tour', 'Volterra exploration', 'Hilltop picnic lunch'] },
          { day: 4, title: 'Cook Like a Tuscan', description: 'Hands-on cooking class and truffle hunting adventure.', activities: ['Morning truffle hunt', 'Pasta-making class', 'Farm-to-table dinner'] },
          { day: 5, title: 'Val d\'Orcia', description: 'Drive through the iconic cypress-lined roads of Val d\'Orcia.', activities: ['Pienza cheese town', 'Montalcino Brunello tasting', 'Hot springs visit'] }
        ],
        coordinates: { lat: 43.3188, lng: 11.3308 },
        rating: 4.9,
        numReviews: 36,
        featured: true,
        maxGuests: 12,
        tags: ['wine', 'food', 'countryside', 'culture', 'romantic']
      },
      // COUNTRYSIDE 2
      {
        name: 'Cotswolds English Countryside',
        country: 'United Kingdom',
        continent: 'Europe',
        description: 'Step into a storybook landscape of honey-colored stone cottages, rolling green hills, and quaint village pubs in the English Cotswolds. Walk ancient footpaths through pastoral farmland, visit charming market towns, and enjoy afternoon tea in centuries-old manor houses.',
        shortDescription: 'Honey-stone villages and rolling green hills in quintessential English countryside.',
        images: [
          'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
          'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800'
        ],
        category: 'countryside',
        price: 1699,
        originalPrice: 1999,
        duration: '5 days / 4 nights',
        groupSize: 10,
        difficulty: 'easy',
        highlights: ['Bourton-on-the-Water walk', 'Castle Combe visit', 'Afternoon tea at a manor', 'Pub lunch in Bibury', 'Cotswold Way hike'],
        includes: ['Country inn accommodation', 'Full English breakfasts', 'Afternoon tea', 'Local walking guide', 'Village transfers'],
        excludes: ['Travel to/from Cotswolds', 'Travel insurance', 'Pub lunches'],
        itinerary: [
          { day: 1, title: 'Arriving in the Cotswolds', description: 'Settle into your charming country inn in the heart of the Cotswolds.', activities: ['Transfer from London', 'Village walk', 'Welcome pub dinner'] },
          { day: 2, title: 'Classic Villages', description: 'Visit the most beautiful villages in England.', activities: ['Bourton-on-the-Water', 'Stow-on-the-Wold market', 'Afternoon tea'] },
          { day: 3, title: 'Cotswold Way Walk', description: 'Hike a section of the famous Cotswold Way national trail.', activities: ['Guided countryside walk (10mi)', 'Picnic lunch', 'Broadway Tower visit'] },
          { day: 4, title: 'Castle Combe & Bibury', description: 'Explore two of England\'s prettiest villages.', activities: ['Castle Combe exploration', 'Bibury Arlington Row', 'Farewell dinner'] }
        ],
        coordinates: { lat: 51.8330, lng: -1.7833 },
        rating: 4.6,
        numReviews: 19,
        featured: false,
        maxGuests: 12,
        tags: ['walking', 'villages', 'countryside', 'history', 'relaxing']
      },
      // DESERT 1
      {
        name: 'Sahara Desert Odyssey',
        country: 'Morocco',
        continent: 'Africa',
        description: 'Journey deep into the golden dunes of the Sahara Desert for an unforgettable adventure under endless skies. Ride camels across towering sand dunes, camp under a blanket of stars, and experience the timeless hospitality of nomadic Berber tribes. The silence of the desert will transform your perspective.',
        shortDescription: 'Camel treks, starlit camps, and golden dunes in the vast Sahara.',
        images: [
          'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
          'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800',
          'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800'
        ],
        category: 'desert',
        price: 1599,
        originalPrice: 1999,
        duration: '5 days / 4 nights',
        groupSize: 12,
        difficulty: 'moderate',
        highlights: ['Erg Chebbi dune sunset', 'Overnight desert camp', 'Camel caravan trek', 'Berber drumming night', 'Todra Gorge visit'],
        includes: ['Desert camp & hotel accommodation', 'All meals', 'Camel trek', '4x4 desert transport', 'Berber guide'],
        excludes: ['International flights', 'Travel insurance', 'Personal items'],
        itinerary: [
          { day: 1, title: 'Gateway to the Desert', description: 'Depart from Marrakech through the Atlas Mountains.', activities: ['Scenic mountain drive', 'Kasbah Ait Benhaddou visit', 'Ouarzazate overnight'] },
          { day: 2, title: 'Todra Gorge', description: 'Drive through the Dades Valley to the towering Todra Gorge.', activities: ['Rose Valley stop', 'Todra Gorge hike', 'Berber village lunch'] },
          { day: 3, title: 'Into the Sahara', description: 'Arrive at the edge of the Erg Chebbi dunes and mount your camel.', activities: ['Camel caravan (2hrs)', 'Dune sunset photos', 'Desert camp dinner & drumming'] },
          { day: 4, title: 'Desert Sunrise', description: 'Wake before dawn for a spectacular Saharan sunrise over the dunes.', activities: ['Sunrise from dunes', 'Sandboarding', 'Nomad family visit', 'Return drive begins'] },
          { day: 5, title: 'Return Journey', description: 'Drive back through the mountains with stops at key viewpoints.', activities: ['Mountain pass drive', 'Roadside lunch', 'Arrival in Marrakech'] }
        ],
        coordinates: { lat: 31.1496, lng: -3.9999 },
        rating: 4.7,
        numReviews: 25,
        featured: true,
        maxGuests: 16,
        tags: ['desert', 'adventure', 'camping', 'culture', 'camels']
      },
      // DESERT 2
      {
        name: 'Wadi Rum Mars Experience',
        country: 'Jordan',
        continent: 'Asia',
        description: 'Explore the otherworldly landscape of Wadi Rum, known as the Valley of the Moon, where towering sandstone cliffs rise from red desert sands. Camp with Bedouin hosts, scale ancient rock bridges, and watch the sun paint the canyon walls in fiery hues. This is Earth at its most Martian.',
        shortDescription: 'Otherworldly red desert landscapes and Bedouin hospitality in Jordan.',
        images: [
          'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800',
          'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800'
        ],
        category: 'desert',
        price: 1399,
        originalPrice: 1699,
        duration: '4 days / 3 nights',
        groupSize: 10,
        difficulty: 'moderate',
        highlights: ['Wadi Rum jeep tour', 'Bedouin camp under stars', 'Rock bridge scramble', 'Petra day extension available', 'Desert cooking experience'],
        includes: ['Bedouin camp & hotel', 'All meals', '4x4 jeep safari', 'Bedouin guide', 'Sleeping bags & mats'],
        excludes: ['International flights', 'Travel insurance', 'Petra entrance (optional)'],
        itinerary: [
          { day: 1, title: 'Amman to Wadi Rum', description: 'Drive south through Jordan to the red desert.', activities: ['Hotel pickup', 'Desert Highway drive', 'First camp setup', 'Bedouin tea ceremony'] },
          { day: 2, title: 'Desert Exploration', description: 'Full day jeep safari through Wadi Rum\'s most iconic sites.', activities: ['Jeep tour (8hrs)', 'Rock bridge climb', 'Ancient inscriptions', 'Sunset viewpoint'] },
          { day: 3, title: 'Canyon & Stars', description: 'Hike through narrow canyons and enjoy a final night of stargazing.', activities: ['Canyon trek', 'Desert cooking class', 'Stargazing with telescope', 'Bedouin music night'] },
          { day: 4, title: 'Departure', description: 'Morning in the desert before heading back.', activities: ['Sunrise walk', 'Camp breakfast', 'Transfer to Amman'] }
        ],
        coordinates: { lat: 29.5722, lng: 35.4207 },
        rating: 4.5,
        numReviews: 16,
        featured: false,
        maxGuests: 14,
        tags: ['desert', 'adventure', 'stargazing', 'culture', 'hiking']
      },
      // ISLAND 1
      {
        name: 'Greek Island Odyssey',
        country: 'Greece',
        continent: 'Europe',
        description: 'Sail between the stunning islands of the Cyclades, from the iconic blue domes of Santorini to the windswept beauty of Mykonos and the hidden gem of Milos. Swim in volcanic hot springs, feast on fresh seafood, and watch legendary Aegean sunsets. A Mediterranean dream come to life.',
        shortDescription: 'Island-hopping through the Cyclades with iconic sunsets and Aegean blue waters.',
        images: [
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
          'https://images.unsplash.com/photo-1468746587034-766ade47c1ac?w=800'
        ],
        category: 'island',
        price: 2799,
        originalPrice: 3399,
        duration: '9 days / 8 nights',
        groupSize: 12,
        difficulty: 'easy',
        highlights: ['Santorini caldera sunset', 'Milos sea caves kayak', 'Mykonos Little Venice', 'Volcanic hot springs swim', 'Fresh seafood feasts'],
        includes: ['Boutique hotel accommodation', 'Ferry tickets between islands', 'Daily breakfast', 'Guided tours on each island', 'Airport transfers'],
        excludes: ['International flights', 'Travel insurance', 'Lunches & most dinners'],
        itinerary: [
          { day: 1, title: 'Athens Arrival', description: 'Arrive in Athens and catch an evening ferry to the islands.', activities: ['Airport pickup', 'Quick Acropolis view', 'Ferry to Milos'] },
          { day: 2, title: 'Milos Discovery', description: 'Explore the volcanic beaches and sea caves of Milos.', activities: ['Sarakiniko beach', 'Sea caves boat tour', 'Klima fishing village'] },
          { day: 3, title: 'Milos to Santorini', description: 'Ferry to the most iconic Greek island.', activities: ['Morning ferry', 'Fira check-in', 'Caldera walk', 'Sunset in Oia'] },
          { day: 4, title: 'Santorini Exploration', description: 'Discover the volcanic island\'s treasures.', activities: ['Wine tasting tour', 'Red Beach visit', 'Akrotiri ruins'] },
          { day: 5, title: 'Santorini to Mykonos', description: 'Sail to the cosmopolitan island of Mykonos.', activities: ['Ferry to Mykonos', 'Little Venice evening', 'Seaside dinner'] }
        ],
        coordinates: { lat: 36.3932, lng: 25.4615 },
        rating: 4.8,
        numReviews: 38,
        featured: true,
        maxGuests: 16,
        tags: ['islands', 'sailing', 'mediterranean', 'food', 'romantic']
      },
      // ISLAND 2
      {
        name: 'Bali Temple & Rice Terrace',
        country: 'Indonesia',
        continent: 'Asia',
        description: 'Discover the spiritual heart of Bali, from sacred water temples and lush rice terraces to volcanic peaks and hidden waterfalls. Experience traditional Balinese ceremonies, learn to surf on perfect waves, and find your inner peace in yoga sessions overlooking the jungle canopy.',
        shortDescription: 'Temples, rice terraces, and spiritual wellness on the Island of the Gods.',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
          'https://images.unsplash.com/photo-1468746587034-766ade47c1ac?w=800'
        ],
        category: 'island',
        price: 1599,
        originalPrice: 1999,
        duration: '7 days / 6 nights',
        groupSize: 14,
        difficulty: 'easy',
        highlights: ['Tegallalang rice terraces', 'Tirta Empul purification', 'Mount Batur sunrise trek', 'Ubud monkey forest', 'Balinese cooking class'],
        includes: ['Villa accommodation', 'Daily breakfast', 'Private driver & guide', 'Temple entrance fees', 'Cooking class'],
        excludes: ['International flights', 'Travel insurance', 'Spa treatments'],
        itinerary: [
          { day: 1, title: 'Welcome to Bali', description: 'Arrive in paradise and settle into your Ubud villa.', activities: ['Airport transfer', 'Villa check-in', 'Ubud market walk', 'Welcome dinner'] },
          { day: 2, title: 'Sacred Temples', description: 'Visit Bali\'s most important water temples.', activities: ['Tirta Empul purification', 'Gunung Kawi temple', 'Rice terrace walk'] },
          { day: 3, title: 'Mount Batur Sunrise', description: 'Pre-dawn trek to the volcano summit for a spectacular sunrise.', activities: ['2am departure', 'Volcano trek', 'Summit sunrise breakfast', 'Hot springs soak'] },
          { day: 4, title: 'Culture & Craft', description: 'Immerse yourself in Balinese arts and cuisine.', activities: ['Silver jewelry workshop', 'Cooking class', 'Traditional dance show'] },
          { day: 5, title: 'South Coast', description: 'Head south for beaches and the famous sea temples.', activities: ['Uluwatu Temple sunset', 'Kecak fire dance', 'Jimbaran seafood dinner'] }
        ],
        coordinates: { lat: -8.4095, lng: 115.1889 },
        rating: 4.6,
        numReviews: 29,
        featured: false,
        maxGuests: 18,
        tags: ['spiritual', 'culture', 'temples', 'nature', 'wellness']
      },
      // FOREST 1
      {
        name: 'Costa Rica Rainforest Adventure',
        country: 'Costa Rica',
        continent: 'North America',
        description: 'Immerse yourself in the incredible biodiversity of Costa Rica\'s rainforests, where howler monkeys swing through the canopy and toucans flash their colorful beaks. Zip-line through cloud forests, hike to volcanic craters, and spot sloths in their natural habitat. Pura Vida at its finest.',
        shortDescription: 'Zip-lines, wildlife spotting, and volcanic hikes in lush tropical rainforest.',
        images: [
          'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
          'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
        ],
        category: 'forest',
        price: 1999,
        originalPrice: 2499,
        duration: '7 days / 6 nights',
        groupSize: 12,
        difficulty: 'moderate',
        highlights: ['Arenal Volcano hike', 'Cloud forest zip-lining', 'Sloth sanctuary visit', 'Hot springs relaxation', 'Night jungle walk'],
        includes: ['Eco-lodge accommodation', 'All meals', 'Naturalist guide', 'All activities listed', 'National park fees'],
        excludes: ['International flights', 'Travel insurance', 'Personal gear'],
        itinerary: [
          { day: 1, title: 'San Jose to Arenal', description: 'Transfer to the Arenal Volcano region.', activities: ['Airport pickup', 'Scenic drive', 'Hot springs evening'] },
          { day: 2, title: 'Arenal Volcano', description: 'Explore the trails around the iconic volcano.', activities: ['Volcano hike', 'Hanging bridges walk', 'Wildlife spotting'] },
          { day: 3, title: 'Adventure Day', description: 'Adrenaline-fueled activities in the rainforest canopy.', activities: ['Zip-lining (12 cables)', 'Waterfall rappelling', 'River tubing'] },
          { day: 4, title: 'Monteverde Cloud Forest', description: 'Transfer to the mystical cloud forest reserve.', activities: ['Transfer to Monteverde', 'Cloud forest night walk', 'Frog pond visit'] },
          { day: 5, title: 'Cloud Forest Exploration', description: 'Full day in the misty canopy of Monteverde.', activities: ['Reserve guided hike', 'Butterfly garden', 'Coffee plantation tour'] }
        ],
        coordinates: { lat: 10.4624, lng: -84.6427 },
        rating: 4.7,
        numReviews: 33,
        featured: true,
        maxGuests: 14,
        tags: ['rainforest', 'wildlife', 'adventure', 'nature', 'eco']
      },
      // FOREST 2
      {
        name: 'Borneo Jungle Expedition',
        country: 'Malaysia',
        continent: 'Asia',
        description: 'Venture into the ancient rainforests of Borneo, one of the oldest tropical ecosystems on Earth. Track wild orangutans swinging through the canopy, cruise along jungle rivers spotting pygmy elephants, and sleep in remote jungle lodges surrounded by a symphony of wildlife sounds.',
        shortDescription: 'Track orangutans and explore ancient jungle ecosystems in wild Borneo.',
        images: [
          'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
        ],
        category: 'forest',
        price: 2399,
        originalPrice: 2899,
        duration: '8 days / 7 nights',
        groupSize: 8,
        difficulty: 'moderate',
        highlights: ['Wild orangutan tracking', 'Kinabatangan River cruise', 'Canopy walkway (40m high)', 'Pygmy elephant spotting', 'Proboscis monkey viewing'],
        includes: ['Jungle lodge accommodation', 'All meals', 'Expert wildlife guide', 'River cruises', 'National park permits'],
        excludes: ['International flights', 'Travel insurance', 'Malaria prophylaxis'],
        itinerary: [
          { day: 1, title: 'Arrive in Kota Kinabalu', description: 'Welcome to Malaysian Borneo.', activities: ['Airport transfer', 'City orientation', 'Seafood market dinner'] },
          { day: 2, title: 'Kinabalu National Park', description: 'Explore the UNESCO World Heritage rainforest.', activities: ['Park guided walk', 'Canopy walkway', 'Hot springs visit'] },
          { day: 3, title: 'Fly to Sandakan', description: 'Head to the wildlife capital of Borneo.', activities: ['Domestic flight', 'Sepilok Orangutan Centre', 'Sun bear conservation centre'] },
          { day: 4, title: 'Kinabatangan River', description: 'Cruise the jungle river teeming with wildlife.', activities: ['River transfer to lodge', 'Afternoon river cruise', 'Night safari walk'] },
          { day: 5, title: 'Deep Jungle', description: 'Full day of wildlife encounters on the river.', activities: ['Dawn river cruise', 'Oxbow lake trek', 'Sunset river cruise', 'Night spotlighting'] }
        ],
        coordinates: { lat: 5.4205, lng: 118.5965 },
        rating: 4.8,
        numReviews: 15,
        featured: false,
        maxGuests: 10,
        tags: ['wildlife', 'jungle', 'orangutans', 'nature', 'adventure']
      },
      // ARCTIC 1
      {
        name: 'Iceland Northern Lights Quest',
        country: 'Iceland',
        continent: 'Europe',
        description: 'Chase the magical aurora borealis across Iceland\'s dramatic volcanic landscapes. From thundering waterfalls and steaming geysers to glacier lagoons filled with floating icebergs, this winter expedition showcases nature\'s most spectacular light show against the world\'s most dramatic backdrop.',
        shortDescription: 'Aurora hunting across volcanic landscapes, glaciers, and geothermal wonders.',
        images: [
          'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
          'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
          'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800'
        ],
        category: 'arctic',
        price: 3299,
        originalPrice: 3999,
        duration: '6 days / 5 nights',
        groupSize: 10,
        difficulty: 'moderate',
        highlights: ['Northern Lights hunting', 'Glacier hiking on Solheimajokull', 'Jokulsarlon ice lagoon', 'Blue Lagoon soak', 'Golden Circle tour'],
        includes: ['Hotel accommodation', 'All meals', 'Expert aurora guide', 'Super jeep transport', 'Glacier equipment'],
        excludes: ['International flights', 'Travel insurance', 'Thermal clothing rental'],
        itinerary: [
          { day: 1, title: 'Reykjavik Arrival', description: 'Arrive in Iceland\'s charming capital and prepare for adventure.', activities: ['Airport transfer', 'City walk', 'Aurora briefing', 'First aurora hunt'] },
          { day: 2, title: 'Golden Circle', description: 'Visit Iceland\'s most iconic natural wonders.', activities: ['Thingvellir National Park', 'Geysir geothermal area', 'Gullfoss waterfall', 'Evening aurora hunt'] },
          { day: 3, title: 'South Coast', description: 'Drive along the dramatic southern coastline.', activities: ['Seljalandsfoss waterfall', 'Vik black sand beach', 'Reynisfjara sea stacks', 'Aurora hunt'] },
          { day: 4, title: 'Glacier World', description: 'Explore the magnificent glacier lagoon and diamond beach.', activities: ['Jokulsarlon boat tour', 'Diamond Beach walk', 'Glacier hike', 'Aurora hunt'] },
          { day: 5, title: 'Blue Lagoon Farewell', description: 'Relax in geothermal waters before heading home.', activities: ['Blue Lagoon morning', 'Reykjavik shopping', 'Farewell dinner'] }
        ],
        coordinates: { lat: 64.1466, lng: -21.9426 },
        rating: 4.9,
        numReviews: 27,
        featured: true,
        maxGuests: 12,
        tags: ['aurora', 'glacier', 'winter', 'nature', 'photography']
      },
      // ARCTIC 2
      {
        name: 'Svalbard Arctic Wilderness',
        country: 'Norway',
        continent: 'Europe',
        description: 'Journey to the top of the world in Svalbard, a remote Arctic archipelago where polar bears roam vast ice fields and glaciers calve into fjords. Experience 24-hour daylight in summer or the polar night in winter, snowmobile across frozen tundra, and witness wildlife in one of Earth\'s last true wildernesses.',
        shortDescription: 'Polar bears, glaciers, and raw Arctic wilderness at the top of the world.',
        images: [
          'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
          'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800'
        ],
        category: 'arctic',
        price: 4999,
        originalPrice: 0,
        duration: '7 days / 6 nights',
        groupSize: 8,
        difficulty: 'challenging',
        highlights: ['Polar bear safari', 'Glacier kayaking', 'Snowmobile expedition', 'Arctic fox spotting', 'Longyearbyen exploration'],
        includes: ['Arctic hotel accommodation', 'All meals', 'Armed expedition guide', 'Snowmobile & equipment', 'Survival gear'],
        excludes: ['Flights to Longyearbyen', 'Travel insurance', 'Extreme cold weather clothing rental'],
        itinerary: [
          { day: 1, title: 'Welcome to Svalbard', description: 'Arrive in Longyearbyen, the world\'s northernmost town.', activities: ['Airport transfer', 'Safety & equipment briefing', 'Longyearbyen tour', 'Welcome dinner'] },
          { day: 2, title: 'Glacier Expedition', description: 'Snowmobile to a massive glacier and explore the ice.', activities: ['Snowmobile training', 'Glacier approach', 'Ice cave exploration', 'Arctic lunch'] },
          { day: 3, title: 'Fjord Cruise', description: 'Boat expedition through Arctic fjords spotting wildlife.', activities: ['Zodiac boat cruise', 'Seabird colony visit', 'Walrus spotting', 'Glacier calving viewpoint'] },
          { day: 4, title: 'Tundra Trek', description: 'Guided hike across the Arctic tundra with armed guard.', activities: ['Tundra hike', 'Reindeer observation', 'Fossil hunting', 'Northern landscape photography'] },
          { day: 5, title: 'Free Exploration', description: 'Choose your own Arctic adventure.', activities: ['Optional dog sledding', 'Museum visits', 'Photography expedition', 'Farewell dinner'] }
        ],
        coordinates: { lat: 78.2232, lng: 15.6267 },
        rating: 4.7,
        numReviews: 9,
        featured: false,
        maxGuests: 10,
        tags: ['arctic', 'polar bears', 'expedition', 'wildlife', 'extreme']
      }
    ]);

    console.log(`${destinations.length} destinations created.`);

    // Create journals
    const journals = await Journal.insertMany([
      {
        author: travelerUser._id,
        title: 'Lost in the Medina: My Marrakech Love Story',
        content: 'The moment I stepped through the gates of Marrakech\'s medina, I knew I was somewhere extraordinary. The narrow alleyways twisted and turned like a living maze, each corner revealing a new surprise: a hidden courtyard bursting with bougainvillea, a craftsman hammering intricate patterns into brass, a spice merchant arranging pyramids of saffron and cumin. I spent three days wandering without a map, letting the city guide me. The Bahia Palace took my breath away with its painted cedar ceilings and mosaic courtyards. At sunset, I climbed to a rooftop terrace overlooking Jemaa el-Fnaa and watched as the square transformed from a sleepy afternoon market into a carnival of storytellers, musicians, and food stalls sending aromatic smoke into the pink sky. The tagine I ate that evening, slow-cooked with preserved lemons and olives, was perhaps the best meal of my life. On my last day, I took a day trip to the Atlas Mountains and sat with a Berber family who shared mint tea and stories of life in the mountains. Marrakech didn\'t just give me memories; it gave me a new way of seeing the world. The chaos that initially overwhelmed me became a symphony I learned to dance to. I left with a suitcase full of handwoven textiles and a heart full of gratitude.',
        excerpt: 'The moment I stepped through the gates of Marrakech\'s medina, I knew I was somewhere extraordinary.',
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        destination: 'Marrakech, Morocco',
        tags: ['morocco', 'culture', 'food', 'medina', 'solo travel'],
        readTime: 3,
        published: true
      },
      {
        author: travelerUser._id,
        title: 'Chasing the Northern Lights: An Arctic Dream',
        content: 'I had dreamed of seeing the northern lights since I was a child, flipping through my grandfather\'s old National Geographic magazines. Last February, I finally made it to Iceland, and the reality surpassed every expectation. Our guide, Magnus, drove us into the countryside away from Reykjavik\'s light pollution. We stood in a snow-covered field near Thingvellir, the temperature hovering around minus fifteen, when the sky began to shimmer. At first, it was a faint green glow on the horizon, easily mistaken for a cloud. Then, as if someone had turned on a cosmic projector, ribbons of emerald light began dancing across the entire sky. They twisted and pulsed, occasionally flashing pink and purple at the edges. I stood there for two hours, tears freezing on my cheeks, completely unable to look away. The next few days were equally magical. We hiked on Solheimajokull glacier, the ice creaking and groaning beneath our crampons. We visited Jokulsarlon, where icebergs the size of houses floated serenely in a glacial lagoon, some glowing an impossible electric blue. At Reynisfjara, black sand met towering basalt columns while the North Atlantic crashed against the shore with terrifying power. But nothing compared to those lights. Each evening, we would chase them again, sometimes driving for hours through snow-covered landscapes. On our last night, the aurora put on its grandest show yet, filling the sky from horizon to horizon in waves of green and violet. Iceland taught me that some things in life are worth the cold, the wait, and the long journey.',
        excerpt: 'I had dreamed of seeing the northern lights since I was a child, and last February in Iceland, reality surpassed every expectation.',
        coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        destination: 'Iceland',
        tags: ['iceland', 'northern lights', 'aurora', 'winter', 'photography'],
        readTime: 4,
        published: true
      },
      {
        author: travelerUser._id,
        title: 'Two Weeks in the Rainforest: Costa Rica Changed Me',
        content: 'I arrived in Costa Rica expecting beautiful scenery. I left two weeks later a fundamentally changed person. My journey began in Arenal, where the volcano loomed over everything like a sleeping giant. The first morning, I woke at dawn to the sound of howler monkeys roaring in the canopy above my eco-lodge. After breakfast, our naturalist guide Maria pointed out things I would never have noticed: a tiny red-eyed tree frog clinging to a leaf, a column of leaf-cutter ants carrying their green cargo along a jungle highway, a sloth barely visible high in the cecropia tree. The zip-lining through the cloud forest was exhilarating, twelve cables stretching across deep valleys filled with swirling mist. But it was the quiet moments that stayed with me: sitting by a waterfall in Monteverde as blue morpho butterflies circled overhead, watching a green sea turtle lay her eggs on the Pacific beach at Ostional, sharing stories with fellow travelers over casados at a roadside soda. The biodiversity is staggering; Costa Rica contains nearly six percent of the world\'s species in a country smaller than West Virginia. The Ticos have a saying, Pura Vida, which roughly translates to pure life or simple joy. By the end of my trip, I understood it wasn\'t just a greeting but a philosophy. Slow down. Notice the hummingbird. Taste the fresh pineapple. Let the waterfall cool your face. Pura Vida isn\'t about having less; it\'s about seeing more.',
        excerpt: 'I arrived in Costa Rica expecting beautiful scenery. I left two weeks later a fundamentally changed person.',
        coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
        destination: 'Costa Rica',
        tags: ['costa rica', 'rainforest', 'wildlife', 'eco travel', 'adventure'],
        readTime: 4,
        published: true
      }
    ]);

    console.log(`${journals.length} journals created.`);

    // Create bookings
    const bookings = await Booking.insertMany([
      {
        user: travelerUser._id,
        destination: destinations[0]._id, // Maldives
        startDate: new Date('2026-06-15'),
        guests: 2,
        totalPrice: destinations[0].price * 2,
        status: 'confirmed',
        specialRequests: 'Honeymoon package if available. Prefer overwater villa with sunset view.',
        contactPhone: '+44 7700 900123',
        contactEmail: 'traveler@horizon.com',
        isPaid: true,
        paidAt: new Date('2026-04-01')
      },
      {
        user: travelerUser._id,
        destination: destinations[4]._id, // Tokyo
        startDate: new Date('2026-09-20'),
        guests: 1,
        totalPrice: destinations[4].price,
        status: 'pending',
        specialRequests: 'Vegetarian meal preferences. Would love a sushi-making class.',
        contactPhone: '+44 7700 900123',
        contactEmail: 'traveler@horizon.com',
        isPaid: false
      }
    ]);

    console.log(`${bookings.length} bookings created.`);

    console.log('\nSeed completed successfully!');
    console.log('Admin: admin@horizon.com / admin123');
    console.log('Traveler: traveler@horizon.com / travel123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
