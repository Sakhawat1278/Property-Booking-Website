import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowUpRight, Home as HomeIcon, BarChart3, ShieldCheck, Key, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomDropdown from '../components/ui/CustomDropdown';
import PriceRangeSlider from '../components/ui/PriceRangeSlider';
import CustomDatePicker from '../components/ui/CustomDatePicker';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [propertyType, setPropertyType] = useState('luxury-villa');
  const [, setPriceRange] = useState([500000, 5000000]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const featuredProperties = properties.slice(0, 5);

  const propertyOptions = [
    { label: 'Luxury Villa', value: 'luxury-villa' },
    { label: 'Modern Apartment', value: 'modern-apartment' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Penthouse', value: 'penthouse' },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins selection:bg-brand selection:text-white">
      <Navbar />
      
      {/* Main Hero Container - Uniform 8px Frame */}
      <main className="pt-[88px] px-2 flex flex-col gap-2">
        {/* Wrapper to prevent clipping while keeping section overflow hidden */}
        <div className="relative">
          <section className="relative h-[calc(100vh-96px)] w-full rounded-[24px] overflow-hidden flex items-center px-8">
            {/* Background Video with Image Fallback */}
            <div className="absolute inset-0 z-0 bg-[#1A1A1A]">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                className="w-full h-full object-cover opacity-40"
                alt="Fallback"
              />
              <video
                src="/hero-bg.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-100"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

              {/* Hero Content */}
              <div className="relative z-10 max-w-4xl">
                <motion.h1 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-white text-[64px] font-semibold leading-[1.1] tracking-tight mb-8"
                >
                  Explore Exclusive Property <br />
                  Deals with Up to <span className="text-brand">40%</span> <br />
                  Discounts
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-white/80 text-[18px] font-light max-w-2xl leading-relaxed mb-12"
                >
                  Uncover top-tier homes at reduced rates. Your dream property awaits, priced to sell. Don't miss out on smart savings.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-wrap items-center gap-6"
                >
                  <motion.button
                    whileHover="hover"
                    className="group relative flex items-center gap-4 bg-brand text-white pl-6 pr-1 h-10 rounded-full overflow-hidden"
                  >
                    <span className="text-[14px] font-normal">Explore Now</span>
                    <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={16} strokeWidth={2} />
                    </div>
                    
                    {/* Subtle Shine Effect */}
                    <motion.div
                      variants={{
                        hover: { x: '100%' }
                      }}
                      initial={{ x: '-100%' }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </motion.button>
                </motion.div>
              </div>
          </section>

          {/* Floating Interactive Search Bar - Outside overflow-hidden section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-full max-w-6xl z-20 px-8"
          >
            <div className="bg-white p-2 pr-6 rounded-2xl md:rounded-full border border-gray-100 flex flex-col md:flex-row items-center gap-2">
              {/* Location Search */}
              <div className="flex-1 w-full px-6 py-3 flex items-center gap-3 border-r border-gray-100 last:border-r-0">
                <div className="p-2 bg-brand/10 rounded-full text-brand">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Location</span>
                  <input 
                    type="text" 
                    placeholder="Search city, area..." 
                    className="bg-transparent text-[#1A1A1A] placeholder:text-gray-300 outline-none text-[15px] font-medium w-full"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="flex-1 border-r border-gray-100 last:border-r-0">
                <CustomDropdown 
                  label="Type"
                  value={propertyType}
                  options={propertyOptions}
                  onChange={setPropertyType}
                  icon={<HomeIcon size={18} />}
                />
              </div>

              {/* Budget Range */}
              <div className="flex-1 border-r border-gray-100 last:border-r-0">
                <PriceRangeSlider 
                  label="Budget"
                  min={100000}
                  max={10000000}
                  onChange={(min, max) => setPriceRange([min, max])}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                />
              </div>

              {/* Date Picker */}
              <div className="flex-1 border-r border-gray-100 last:border-r-0">
                <CustomDatePicker 
                  label="Available From"
                  selectedDate={selectedDate}
                  onChange={setSelectedDate}
                />
              </div>

              {/* Search Button */}
              <motion.button 
                whileHover="hover"
                className="group relative flex items-center gap-4 bg-brand text-white pl-6 pr-1 h-10 rounded-full overflow-hidden"
              >
                <span className="text-[14px] font-normal">Find Property</span>
                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={16} strokeWidth={2} />
                </div>
                
                {/* Subtle Shine Effect */}
                <motion.div
                  variants={{
                    hover: { x: '100%' }
                  }}
                  initial={{ x: '-100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <div className="h-12" />

      {/* Services Section */}
      <section className="w-full px-8 py-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 border border-brand/20 rounded-[32px] bg-brand/[0.03] hover:bg-brand/[0.06] transition-all duration-500"
          >
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-3">Growth Area Research</h3>
            <p className="text-gray-500 text-[14px] leading-relaxed">Identifying high-potential regions with maximum capital appreciation for your portfolio.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 border border-brand/20 rounded-[32px] bg-brand/[0.03] hover:bg-brand/[0.06] transition-all duration-500"
          >
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white mb-6">
              <Key size={24} />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-3">Market Insights</h3>
            <p className="text-gray-500 text-[14px] leading-relaxed">Real-time data and expert analysis to help you make informed investment decisions.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 border border-brand/20 rounded-[32px] bg-brand/[0.03] hover:bg-brand/[0.06] transition-all duration-500"
          >
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-3">Risk-Free Investments</h3>
            <p className="text-gray-500 text-[14px] leading-relaxed">Secure and verified properties with guaranteed legal clarity and structural integrity.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-8 border border-brand/20 rounded-[32px] bg-brand/[0.03] hover:bg-brand/[0.06] transition-all duration-500"
          >
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white mb-6">
              <HomeIcon size={24} />
            </div>
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-3">Property Management</h3>
            <p className="text-gray-500 text-[14px] leading-relaxed">End-to-end management services to maintain and grow your real estate assets.</p>
          </motion.div>
        </div>
      </section>

      <section className="w-full px-8 py-12 bg-white overflow-hidden">
        <div className="w-full">
          <div className="flex flex-col items-center text-center gap-8 mb-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1A1A1A] leading-tight tracking-tighter">
                Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">Properties.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
                <p className="text-[14px] font-medium tracking-wide">Loading Elite Properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="col-span-full text-center py-24 text-gray-400">
                <p className="text-[14px] font-medium tracking-wide">No properties found.</p>
              </div>
            ) : (
              featuredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Explore Luxury Locations Section */}
      <section className="w-full px-8 py-12 bg-[#E8EDF2] overflow-hidden">
        <div className="w-full">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1A1A1A] leading-tight tracking-tighter">
              Explore Luxury <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">Locations.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location 1: Manhattan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[40px] border border-white p-2 hover:border-brand/30 transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-[350px] rounded-[32px] overflow-hidden mb-5">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  src="/locations/manhattan.png" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-brand rounded-full">
                  <span className="text-white font-bold text-[10px] uppercase tracking-wider">124 Properties</span>
                </div>
              </div>
              
              <div className="px-4 pb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-[24px] font-black text-[#1A1A1A] leading-none mb-2 group-hover:text-brand transition-colors">Manhattan</h3>
                  <p className="text-gray-400 text-[13px] font-normal uppercase tracking-widest">New York, USA</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#1A1A1A] group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.div>

            {/* Location 2: Malibu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group bg-white rounded-[40px] border border-white p-2 hover:border-brand/30 transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-[350px] rounded-[32px] overflow-hidden mb-5">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  src="/locations/malibu.png" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-brand rounded-full">
                  <span className="text-white font-bold text-[10px] uppercase tracking-wider">86 Properties</span>
                </div>
              </div>
              
              <div className="px-4 pb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-[24px] font-black text-[#1A1A1A] leading-none mb-2 group-hover:text-brand transition-colors">Malibu</h3>
                  <p className="text-gray-400 text-[13px] font-normal uppercase tracking-widest">California, USA</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#1A1A1A] group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.div>

            {/* Location 3: Bali */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group bg-white rounded-[40px] border border-white p-2 hover:border-brand/30 transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-[350px] rounded-[32px] overflow-hidden mb-5">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  src="/locations/bali.png" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-brand rounded-full">
                  <span className="text-white font-bold text-[10px] uppercase tracking-wider">210 Properties</span>
                </div>
              </div>
              
              <div className="px-4 pb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-[24px] font-black text-[#1A1A1A] leading-none mb-2 group-hover:text-brand transition-colors">Bali</h3>
                  <p className="text-gray-400 text-[13px] font-normal uppercase tracking-widest">Ubud, Indonesia</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#1A1A1A] group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.div>

            {/* Location 4: Dubai */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group bg-white rounded-[40px] border border-white p-2 hover:border-brand/30 transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-[350px] rounded-[32px] overflow-hidden mb-5">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  src="/locations/dubai.png" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-brand rounded-full">
                  <span className="text-white font-bold text-[10px] uppercase tracking-wider">156 Properties</span>
                </div>
              </div>
              
              <div className="px-4 pb-4 flex justify-between items-end">
                <div>
                  <h3 className="text-[24px] font-black text-[#1A1A1A] leading-none mb-2 group-hover:text-brand transition-colors">Dubai</h3>
                  <p className="text-gray-400 text-[13px] font-normal uppercase tracking-widest">Marina, UAE</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#1A1A1A] group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* The Investor's Voice Section */}
      <section className="w-full px-8 py-12 bg-[#F8FAFC] overflow-hidden">
        <div className="w-full">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-[32px] lg:text-[40px] font-bold text-[#1A1A1A] leading-tight tracking-tighter">
              The Investor's <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">Voice.</span>
            </h2>
          </div>

          <div className="relative flex overflow-hidden py-4">
            <motion.div 
              animate={{
                x: [0, -1920],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-6 whitespace-nowrap"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  {/* Testimonial Card 1 */}
                  <div className="w-[400px] bg-white rounded-[48px] p-10 flex flex-col justify-between border border-gray-50 flex-shrink-0">
                    <div>
                      <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-8">
                        <Quote size={20} fill="currentColor" />
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed mb-10 whitespace-normal">
                        The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of common and <span className="text-brand font-bold">challenging</span> words.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                        <img src="/avatars/avatar1.png" className="w-full h-full object-cover" alt="Sarah Jenkins" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-[#1A1A1A]">Sarah Jenkins</h4>
                        <p className="text-gray-400 text-[11px]">portfolio_genie_92</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Card 2 */}
                  <div className="w-[400px] bg-white rounded-[48px] p-10 flex flex-col justify-between border border-gray-50 flex-shrink-0">
                    <div>
                      <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-8">
                        <Quote size={20} fill="currentColor" />
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed mb-10 whitespace-normal">
                        The insights provided are truly elite. I've been able to scale my portfolio <span className="text-brand font-bold">exponentially</span> thanks to the off-market data provided.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                        <img src="/avatars/avatar2.png" className="w-full h-full object-cover" alt="Marcus Thorne" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-[#1A1A1A]">Marcus Thorne</h4>
                        <p className="text-gray-400 text-[11px]">market_mogul_88</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Card 3 */}
                  <div className="w-[400px] bg-white rounded-[48px] p-10 flex flex-col justify-between border border-gray-50 flex-shrink-0">
                    <div>
                      <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-8">
                        <Quote size={20} fill="currentColor" />
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed mb-10 whitespace-normal">
                        A very smooth and professional experience. The interface is intuitive and the property selection is <span className="text-brand font-bold">curated</span> for excellence.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                        <img src="/avatars/avatar3.png" className="w-full h-full object-cover" alt="Elena Rossi" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-[#1A1A1A]">Elena Rossi</h4>
                        <p className="text-gray-400 text-[11px]">lifestyle_elite_77</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Card 4 */}
                  <div className="w-[400px] bg-white rounded-[48px] p-10 flex flex-col justify-between border border-gray-50 flex-shrink-0">
                    <div>
                      <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-8">
                        <Quote size={20} fill="currentColor" />
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed mb-10 whitespace-normal">
                        The legal support and verification process is what made me choose Nestory. It's <span className="text-brand font-bold">secure</span> and highly transparent.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                        <div className="w-full h-full bg-gradient-to-br from-brand/20 to-brand-dark/20 flex items-center justify-center text-brand font-black text-[14px]">AK</div>
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-[#1A1A1A]">Ahmad Khan</h4>
                        <p className="text-gray-400 text-[11px]">global_investor_44</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Card 5 */}
                  <div className="w-[400px] bg-white rounded-[48px] p-10 flex flex-col justify-between border border-gray-100 flex-shrink-0">
                    <div>
                      <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-8">
                        <Quote size={20} fill="currentColor" />
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed mb-10 whitespace-normal">
                        I've found my dream home in Malibu within weeks. The matching algorithm is <span className="text-brand font-bold">fantastic</span> for busy professionals.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                        <div className="w-full h-full bg-gradient-to-br from-brand/20 to-brand-dark/20 flex items-center justify-center text-brand font-black text-[14px]">NJ</div>
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-[#1A1A1A]">Noel Jensen</h4>
                        <p className="text-gray-400 text-[11px]">modern_living_22</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ultra Minimal CTA Section */}
      <section className="w-full px-8 py-16 bg-white overflow-hidden">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-black rounded-[32px] overflow-hidden"
          >
            {/* Top Vignette Gradient */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 py-20 lg:py-28 flex flex-col items-center text-center px-6">
              <h2 className="text-[32px] lg:text-[48px] font-medium text-white leading-tight mb-4">
                Ready to transform your <span className="text-white/60">investment?</span>
              </h2>
              <p className="text-[16px] lg:text-[18px] text-gray-400 font-normal leading-relaxed mb-10 max-w-xl">
                Join thousands of data-driven professionals who are creating beautiful visualizations in minutes.
              </p>
              
              <motion.button
                whileHover="shineHover"
                className="group relative flex items-center gap-5 bg-brand text-white pl-8 pr-1.5 h-14 rounded-full overflow-hidden"
              >
                <span className="text-[16px] font-normal">Start for free</span>
                <div className="w-11 h-11 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={20} strokeWidth={2} />
                </div>
                
                {/* Subtle Shine Effect */}
                <motion.div
                  variants={{
                    shineHover: { x: '100%' }
                  }}
                  initial={{ x: '-100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Massive Brand Footer */}
      <Footer />
    </div>
  );
};

export default Home;
