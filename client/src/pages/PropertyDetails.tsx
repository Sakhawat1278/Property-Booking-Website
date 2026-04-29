import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Maximize2, Bed, Bath, Share2, Heart, ChevronLeft, ChevronRight,
  ArrowUpRight, ShieldCheck, TrendingUp, Sparkles, Zap, Hammer,
  Calendar, CheckCircle2, Phone, Mail, Star, X, Coffee, UtensilsCrossed,
  Droplets, Flame, Sun, Wind, ArrowLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { properties as localProperties } from '../data/properties';
import CustomDropdown from '../components/ui/CustomDropdown';
import CustomDatePicker from '../components/ui/CustomDatePicker';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/ui/AuthModal';
import CheckoutModal from '../components/ui/CheckoutModal';

const PropertyDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryTab, setGalleryTab] = useState('PREVIEW');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<'INFO' | 'VIEWING' | 'CONTACT' | 'BOOKING'>('INFO');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date(),
    timeSlot: 'MORNING',
    tourType: 'IN_PERSON',
    status: 'BROWSING',
    inquiryType: 'DETAILS',
    message: ''
  });

  // Booking State
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  // Calculations
  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));
  
  // Per Day / Per Guest Rates
  const adultNightlyRate = property?.price || 0;
  const childNightlyRate = property ? Math.round(property.price * 0.5) : 0; // Children are 50% of adult rate
  
  const totalAdultPrice = adultNightlyRate * adults * nights;
  const totalChildPrice = childNightlyRate * children * nights;
  const basePrice = totalAdultPrice + totalChildPrice;

  const cleaningFee = property ? Math.round(property.price * 0.15) : 0;
  const serviceFee = Math.round(basePrice * 0.10);
  const totalAmount = basePrice + cleaningFee + serviceFee;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const foundProperty = localProperties.find(p => p.slug === slug);
    if (foundProperty) {
      setProperty(foundProperty);
    }
    setLoading(false);
  }, [slug]);

  // Initial Scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Proceed with submission logic (API call)
    console.log('Submitting form data:', formData);
    alert('Request sent successfully!');
    setSidebarMode('INFO');
  };

  const handleBookingStart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Gallery Logic Helper
  const getActiveGallery = () => {
    if (galleryTab === 'PREVIEW') return property.imageGallery?.split(',') || [];
    if (galleryTab === 'EXTERIOR') return property.exteriorGallery || [];
    if (galleryTab === 'LIVING') return property.livingGallery || [];
    if (galleryTab === 'KITCHEN') return property.kitchenGallery || [];
    return [];
  };

  const activeGallery = getActiveGallery();
  const mainImage = activeGallery[activeImageIndex] || property.primaryImage;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % activeGallery.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + activeGallery.length) % activeGallery.length);
  };

  return (
    <div className="min-h-screen bg-white font-poppins text-[#1A1A1A]">
      <Navbar />
      
      {/* Lightbox / Full-screen View */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-[110]"
            >
              <X size={24} />
            </button>

            {/* Lightbox Nav Arrows */}
            <button 
              onClick={handlePrev}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all z-[110]"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all z-[110]"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div 
              key={`${galleryTab}-${mainImage}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              <img 
                src={mainImage} 
                className="max-w-full max-h-full object-contain shadow-2xl"
                alt={property.title}
              />
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 rounded-full text-white text-[12px] font-bold tracking-widest uppercase">
              {activeImageIndex + 1} / {activeGallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="pt-[80px] pb-8">
        {/* 1. TOP UTILITY BAR (Sticky Navigation & Actions) */}
        <div className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-md px-8 py-3 grid grid-cols-3 items-center transition-all duration-300">
          {/* Left: Go Back */}
          <div className="flex justify-start">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] hover:text-brand transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-brand transition-all duration-300 shadow-sm">
                <ChevronLeft size={16} strokeWidth={2.5} />
              </div>
              <span>Go Back</span>
            </button>
          </div>
          
          {/* Center: Location & Rating Info */}
          <div className="hidden md:flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-brand fill-brand" />
              <span className="text-[13px] font-bold">{property.rating}</span>
              <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">— {property.reviewsCount} reviews</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800">
                {property.country || 'USA'} — {property.city}
              </span>
            </div>
          </div>

          {/* Right: Quick Actions (Share & Wishlist) */}
          <div className="flex items-center justify-end gap-3">
            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-black/5 hover:bg-black text-gray-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-transparent hover:border-black shadow-sm group">
              <Share2 size={14} className="transition-transform group-hover:scale-110" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-brand border border-gray-200 hover:border-brand text-gray-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm group">
              <Heart size={14} className="transition-all group-hover:fill-white group-hover:scale-110" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA - 70/30 Sticky Architecture */}
        <div className="px-4 md:px-8 mt-0 flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column (Main Details) - 70% */}
          <div className="w-full lg:w-[70%] flex flex-col gap-4">
            
            {/* 1. HERO GALLERY SECTION */}
            <div className="flex flex-col gap-4 h-[60vh] md:h-[calc(100vh-160px)] min-h-[400px] md:min-h-[700px]">
              {/* Main Image Section */}
              <section 
                onClick={() => setIsLightboxOpen(true)}
                className="relative flex-1 rounded-[24px] overflow-hidden border border-gray-200 group/image cursor-zoom-in"
              >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${galleryTab}-${mainImage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={mainImage} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                  alt={property.title}
                />
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              {activeGallery.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all z-30 group/arrow"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all z-30 group/arrow"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Dynamic Floating Tags (Unified Frosted Glass Style) */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-20">
                {(property.yearBuilt && property.yearBuilt >= 2024) && (
                  <div className="px-3 py-1 bg-black/25 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.05em] rounded-full border border-white/10">
                    New
                  </div>
                )}
                {(property.rating && property.rating >= 4.9) && (
                  <div className="px-3 py-1 bg-black/25 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.05em] rounded-full border border-white/10">
                    Spotlight
                  </div>
                )}
                {property.status === 'OFF_PLAN' && (
                  <div className="px-3 py-1 bg-black/25 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.05em] rounded-full border border-white/10">
                    New Construction
                  </div>
                )}
                {(property.isVerified || property.ownerType === 'AGENCY' || (property.rating >= 4.9 && property.reviewsCount >= 10) || (property.yearBuilt >= 2024)) && (
                  <div className="px-3 py-1 bg-black/25 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.05em] rounded-full border border-white/10">
                    Verified
                  </div>
                )}
                {(property.estimatedROI && property.estimatedROI >= 12) && (
                  <div className="px-3 py-1 bg-black/25 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.05em] rounded-full border border-white/10">
                    High Yield
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </section>

            {/* Gallery Navigation & Grid Section */}
            <div className="mt-4 flex flex-col gap-4">
              {/* Row 1: Secondary Images Grid - Compact Width */}
              <div className="h-[120px] w-[60%] grid grid-cols-3 gap-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`${galleryTab}-${activeImageIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="contents"
                  >
                    {(() => {
                      const gridImages = [];
                      for (let i = 1; i <= 3; i++) {
                        const idx = (activeImageIndex + i) % activeGallery.length;
                        if (activeGallery[idx]) {
                          gridImages.push({ url: activeGallery[idx], index: idx });
                        }
                      }
                      const remainingCount = Math.max(0, activeGallery.length - 4);
                      
                      return gridImages.map((img, i) => (
                        <div 
                          key={i} 
                          onClick={() => setActiveImageIndex(img.index)}
                          className="relative h-full rounded-[20px] overflow-hidden border border-gray-100 group/thumb cursor-pointer"
                        >
                          <img 
                            src={img.url} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" 
                            alt={`View ${img.index + 1}`}
                          />
                          {i === 2 && remainingCount > 0 && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="text-white text-[16px] font-bold">+{remainingCount}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors duration-300" />
                        </div>
                      ));
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Row 2: Category Filter Buttons - Dynamic visibility based on content */}
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'PREVIEW', label: 'Preview', icon: Maximize2, show: (property.imageGallery || property.primaryImage) },
                  { id: 'EXTERIOR', label: 'Exterior', icon: MapPin, show: (property.exteriorGallery && property.exteriorGallery.length > 0) },
                  { id: 'LIVING', label: 'Living Room', icon: Coffee, show: (property.livingGallery && property.livingGallery.length > 0) },
                  { id: 'KITCHEN', label: 'Kitchen', icon: UtensilsCrossed, show: (property.kitchenGallery && property.kitchenGallery.length > 0) }
                ].filter(tab => tab.show).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setGalleryTab(tab.id);
                      setActiveImageIndex(0);
                    }}
                    className={`flex items-center justify-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      galleryTab === tab.id 
                        ? 'bg-brand text-white' 
                        : 'bg-black/5 hover:bg-black/10 text-gray-500 border border-black/5'
                    }`}
                  >
                    <tab.icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

            {/* 2. FULL DETAILS / NARRATIVE SECTION */}
            <section className="pt-12 pb-10">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <h2 className="text-[24px] font-semibold tracking-tight leading-none text-[#1A1A1A]">Full Details</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <p className="text-[17px] text-gray-600 leading-[1.8] font-normal text-justify">
                      {isExpanded || !property.description || property.description.split(' ').length <= 100
                        ? property.description
                        : `${property.description.split(' ').slice(0, 100).join(' ')}...`}
                    </p>
                    
                    {property.description && property.description.split(' ').length > 100 && (
                      <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-4 flex items-center gap-2 text-[11px] font-bold text-brand uppercase tracking-[0.2em] hover:opacity-70 transition-all group"
                      >
                        <span>{isExpanded ? 'View Less' : 'View More'}</span>
                        <ChevronRight size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                      </button>
                    )}
                  </div>

                  {/* Secondary Details / Specs summary if needed */}
                  <div className="grid grid-cols-3 gap-10 pt-4 mt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Listing Type</span>
                      <span className="text-[14px] font-bold text-[#1A1A1A]">{property.status?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Property Category</span>
                      <span className="text-[14px] font-bold text-[#1A1A1A]">{property.category}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Year Built</span>
                      <span className="text-[14px] font-bold text-[#1A1A1A]">{property.yearBuilt || '2024'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. AMENITIES SECTION */}
            <section className="pb-10">
              <div className="flex flex-col gap-2">
                {/* Section Header */}
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-[24px] font-semibold tracking-tight leading-none text-[#1A1A1A]">Luxury Amenities</h2>
                  </div>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category: Interior Sophistication */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-col bg-gray-50/50 rounded-2xl p-8 border border-gray-300 hover:border-brand transition-all duration-700"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-brand">
                          <Sparkles size={22} />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-[18px] font-bold text-[#1A1A1A]">Interior Luxury</h3>
                          <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Refined Living Spaces</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-7 min-h-[120px]">
                      {property.internalAmenities ? (
                        property.internalAmenities.split(',').map((amenity: string, i: number) => {
                          const cleanName = amenity.trim();
                          // Mapping logic for icons/subs
                          const meta: any = {
                            'Smart Home': { icon: Zap, sub: 'Control systems' },
                            'High Security': { icon: ShieldCheck, sub: 'Biometric access' },
                            'Floor Heating': { icon: TrendingUp, sub: 'Climate control' },
                            'High Ceilings': { icon: Maximize2, sub: '12ft Clearance' },
                            'Wine Cellar': { icon: Coffee, sub: 'Temperature zone' },
                            'Walk-in Closet': { icon: Maximize2, sub: 'Custom shelving' }
                          }[cleanName] || { icon: CheckCircle2, sub: 'Luxury Feature' };

                          return (
                            <div key={i} className="flex items-start gap-4 group/item">
                              <div className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-gray-400 group-hover/item:text-brand transition-colors">
                                <meta.icon size={16} />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[13px] font-bold text-[#1A1A1A]">{cleanName}</span>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{meta.sub}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center bg-white/40 rounded-xl border border-dashed border-gray-400">
                          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Not Yet Specified</span>
                          <span className="text-[10px] text-gray-300 font-medium px-8 mt-1 leading-relaxed">The property owner has not selected specific interior amenities for this listing.</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Category: Building & Wellness */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="group flex flex-col bg-gray-50/50 rounded-2xl p-8 border border-gray-300 hover:border-brand transition-all duration-700"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-brand">
                          <Zap size={22} />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-[18px] font-bold text-[#1A1A1A]">Wellness & Lifestyle</h3>
                          <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Building Services</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-7 min-h-[120px]">
                      {property.externalAmenities ? (
                        property.externalAmenities.split(',').map((amenity: string, i: number) => {
                          const cleanName = amenity.trim();
                          const meta: any = {
                            'New Build': { icon: Hammer, sub: 'Completed 2024' },
                            '24/7 Concierge': { icon: ShieldCheck, sub: 'White glove service' },
                            'Private Gym': { icon: Sparkles, sub: 'Technogym equip' },
                            'Wellness Spa': { icon: Calendar, sub: 'Sauna & Steam' },
                            'Private Parking': { icon: MapPin, sub: 'Electric charging' },
                            'Secure Entry': { icon: ShieldCheck, sub: 'Encrypted fob' }
                          }[cleanName] || { icon: CheckCircle2, sub: 'External Feature' };

                          return (
                            <div key={i} className="flex items-start gap-4 group/item">
                              <div className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-gray-400 group-hover/item:text-brand transition-colors">
                                <meta.icon size={16} />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[13px] font-bold text-[#1A1A1A]">{cleanName}</span>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{meta.sub}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center bg-white/40 rounded-xl border border-dashed border-gray-400">
                          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Not Available</span>
                          <span className="text-[10px] text-gray-300 font-medium px-8 mt-1 leading-relaxed">External and building amenities have not been added by the property owner yet.</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* 4. NEIGHBORHOOD & LOCATION SECTION */}
            <section className="pb-12">
              <div className="flex flex-col gap-2">
                {/* Accordion Header Style */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h2 className="text-[24px] font-semibold tracking-tight text-[#1A1A1A]">Neighborhood & Location</h2>
                  </div>
                </div>

                {/* Map Container */}
                <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-gray-300 relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    title="Property Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address + ', ' + property.city)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="grayscale-[0.2] contrast-[1.1] brightness-[0.95]"
                  />
                  {/* Overlay for aesthetic */}
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-2xl" />
                </div>

                {/* Local Insights Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  {[
                    { 
                      label: 'Walk Score', 
                      val: property.walkScore || 'N/A', 
                      sub: property.walkScore ? (property.walkScore > 90 ? 'Walker\'s Paradise' : 'Very Walkable') : 'Not Provided' 
                    },
                    { 
                      label: 'Transit Score', 
                      val: property.transitScore || 'N/A', 
                      sub: property.transitScore ? (property.transitScore > 80 ? 'Excellent Transit' : 'Good Transit') : 'Not Provided' 
                    },
                    { 
                      label: 'School District', 
                      val: property.nearbySchools ? 'Top Rated' : 'N/A', 
                      sub: property.nearbySchools?.split(',')[0] || 'Not Provided' 
                    },
                    { 
                      label: 'Safety Score', 
                      val: property.neighborhoodSafety || 'N/A', 
                      sub: property.neighborhoodSafety ? (property.neighborhoodSafety > 8 ? 'Very Secure' : 'Secure Area') : 'Not Provided' 
                    }
                  ].map((insight, i) => (
                    <div key={i} className="flex flex-col gap-1.5 p-4 rounded-xl border border-gray-200 bg-gray-50/30">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{insight.label}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[18px] font-bold text-[#1A1A1A]">{insight.val}</span>
                        <span className="text-[10px] font-medium text-gray-500">{insight.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. ENVIRONMENTAL RISK PROFILE SECTION */}
            <section className="pb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-[24px] font-semibold tracking-tight text-[#1A1A1A]">Environmental Risk Profile</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: 'Flood Risk', val: property.floodRisk || 0, max: 10, icon: <Droplets size={16} />, desc: 'Based on 100-year flood zone analysis' },
                    { label: 'Fire Risk', val: property.fireRisk || 0, max: 10, icon: <Flame size={16} />, desc: 'Local vegetation and historic fire activity' },
                    { label: 'Heat Risk', val: property.heatRisk || 0, max: 10, icon: <Sun size={16} />, desc: 'Extreme heat days projected per year' },
                    { label: 'Air Quality', val: property.airQuality || 0, max: 100, icon: <Wind size={16} />, desc: 'Annual average AQI for this location' }
                  ].map((risk, i) => {
                    const percentage = (risk.val / risk.max) * 100;
                    const isHigh = risk.label === 'Air Quality' ? risk.val < 50 : risk.val > 7;
                    const isLow = risk.label === 'Air Quality' ? risk.val > 80 : risk.val < 3;
                    
                    const colorClass = isLow ? 'bg-emerald-500' : isHigh ? 'bg-rose-500' : 'bg-amber-500';
                    const labelText = isLow ? 'Minimal' : isHigh ? 'High' : 'Moderate';

                    return (
                      <div key={i} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-700">
                            {risk.icon}
                            <span className="text-[13px] font-bold uppercase tracking-wider">{risk.label}</span>
                          </div>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tighter ${
                            isLow ? 'bg-emerald-50 text-emerald-600' : isHigh ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {labelText}
                          </span>
                        </div>
                        
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.2, delay: i * 0.1, ease: "circOut" }}
                            className={`h-full rounded-full ${colorClass}`}
                          />
                        </div>
                        
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                          {risk.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Sticky Info Card) - 30% */}
          <aside className="w-full lg:w-[30%] lg:sticky lg:top-[140px] self-start pb-8">
            <section className="bg-white rounded-2xl border border-gray-300 p-5 md:p-8 flex flex-col shadow-none min-h-[400px] md:min-h-[600px]">
              <AnimatePresence mode="wait">
                {sidebarMode === 'INFO' ? (
                  <motion.div 
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    {/* Dynamic Agent/Owner Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={property.ownerImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                            className="w-full h-full object-cover" 
                            alt={property.ownerName}
                          />
                        </div>
                        <div className={`absolute top-0 left-0 w-3 h-3 ${property.ownerType === 'AGENCY' ? 'bg-blue-500' : 'bg-brand'} border-2 border-white rounded-full z-10 shadow-sm`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-bold leading-tight">{property.ownerName || 'Nestory Representative'}</span>
                        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                          {property.ownerTitle || 'Luxury Advisor'}
                        </span>
                      </div>
                    </div>

                    {/* Property Core */}
                    <div className="flex flex-col gap-1 mb-6">
                      <h1 className="text-[28px] font-bold leading-tight tracking-tight">{property.title}</h1>
                      <p className="text-[13px] text-gray-400 font-medium leading-relaxed line-clamp-8">{property.description}</p>
                    </div>

                    <div className="flex flex-col gap-1 mb-6">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pricing Strategy:</span>
                      <span className="text-[32px] font-bold tracking-tight text-brand">${property.price?.toLocaleString()}</span>
                    </div>

                    {/* Compact Specs Table */}
                    <div className="flex flex-col border-t border-gray-200 mb-8">
                      {[
                        { icon: Bed, label: 'Beds', val: property.bedrooms < 10 ? `0${property.bedrooms}` : property.bedrooms },
                        { icon: Bath, label: 'Baths', val: property.bathrooms < 10 ? `0${property.bathrooms}` : property.bathrooms },
                        { icon: Maximize2, label: 'Sq Ft', val: property.totalArea?.toLocaleString() },
                        { icon: Calendar, label: 'Built', val: property.yearBuilt || '2024' }
                      ].map((spec, i) => (
                        <div key={i} className="flex justify-between items-center py-3.5 border-b border-gray-200 group hover:bg-gray-50/50 px-2 transition-all">
                          <div className="flex items-center gap-3">
                            <spec.icon size={14} className="text-[#1A1A1A]" />
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{spec.label}</span>
                          </div>
                          <span className="text-[14px] font-bold">{spec.val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dual-Action Button Row */}
                    <div className="mt-auto flex gap-2 w-full">
                      {property.status === 'FOR_RENT' ? (
                        <motion.button 
                          onClick={() => setSidebarMode('BOOKING')}
                          whileHover="hover"
                          className="group relative flex-1 h-10 bg-[#1A1A1A] hover:bg-brand text-white rounded-full flex items-center justify-between pl-4 pr-1 overflow-hidden transition-all duration-500"
                        >
                          <span className="text-[12px] font-normal z-10 whitespace-nowrap">Book Stay</span>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center z-10 transition-transform duration-300 group-hover:rotate-45">
                            <ArrowUpRight size={14} strokeWidth={2} />
                          </div>
                        </motion.button>
                      ) : (
                        <motion.button 
                          onClick={() => setSidebarMode('VIEWING')}
                          whileHover="hover"
                          className="group relative flex-1 h-10 bg-[#1A1A1A] hover:bg-brand text-white rounded-full flex items-center justify-between pl-4 pr-1 overflow-hidden transition-all duration-500"
                        >
                          <span className="text-[12px] font-normal z-10 whitespace-nowrap">Request viewing</span>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center z-10 transition-transform duration-300 group-hover:rotate-45">
                            <ArrowUpRight size={14} strokeWidth={2} />
                          </div>
                        </motion.button>
                      )}

                      <motion.button 
                        onClick={() => setSidebarMode('CONTACT')}
                        whileHover="hover"
                        className="group relative flex-1 h-10 bg-brand text-white rounded-full flex items-center justify-between pl-4 pr-1 overflow-hidden transition-all duration-500"
                      >
                        <span className="text-[12px] font-normal z-10 whitespace-nowrap">
                          {property.ownerType === 'AGENCY' ? 'Contact agency' : 'Contact owner'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center z-10 transition-transform duration-300 group-hover:rotate-45">
                          <Mail size={14} strokeWidth={2} className="text-white" />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : sidebarMode === 'BOOKING' ? (
                  <motion.div 
                    key="booking"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <h2 className="text-[20px] font-bold tracking-tight text-[#1A1A1A]">Direct Booking</h2>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{property.price?.toLocaleString()} {property.currency} / night</span>
                      </div>
                      <button 
                        onClick={() => setSidebarMode('INFO')}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1A1A] hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft size={14} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Check-in</label>
                          <div className="bg-gray-50 border border-gray-200 rounded-full h-10 flex items-center relative">
                            <CustomDatePicker 
                              selectedDate={checkIn} 
                              onChange={(date) => {
                                setCheckIn(date);
                                if (date > checkOut) setCheckOut(new Date(date.getTime() + 24 * 60 * 60 * 1000));
                              }} 
                              label="" 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Check-out</label>
                          <div className="bg-gray-50 border border-gray-200 rounded-full h-10 flex items-center relative">
                            <CustomDatePicker 
                              selectedDate={checkOut} 
                              onChange={(date) => {
                                if (date > checkIn) setCheckOut(date);
                              }} 
                              label="" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Guests */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Adults</label>
                          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-full h-10 px-3">
                            <span className="text-[12px] text-gray-400 font-medium">Age 13+</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setAdults(Math.max(1, adults - 1))} 
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#1A1A1A] hover:text-[#1A1A1A] text-gray-400 transition-colors"
                              >
                                -
                              </button>
                              <span className="text-[13px] font-bold w-3 text-center text-[#1A1A1A]">{adults}</span>
                              <button 
                                onClick={() => setAdults(adults + 1)} 
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#1A1A1A] hover:text-[#1A1A1A] text-gray-400 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Children</label>
                          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-full h-10 px-3">
                            <span className="text-[12px] text-gray-400 font-medium">Age 2-12</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setChildren(Math.max(0, children - 1))} 
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#1A1A1A] hover:text-[#1A1A1A] text-gray-400 transition-colors"
                              >
                                -
                              </button>
                              <span className="text-[13px] font-bold w-3 text-center text-[#1A1A1A]">{children}</span>
                              <button 
                                onClick={() => setChildren(children + 1)} 
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#1A1A1A] hover:text-[#1A1A1A] text-gray-400 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mt-2">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[13px] text-gray-500 font-medium">
                            ${adultNightlyRate.toLocaleString()} x {adults} {adults === 1 ? 'adult' : 'adults'} x {nights} {nights === 1 ? 'night' : 'nights'}
                          </span>
                          <span className="text-[13px] text-[#1A1A1A] font-bold">${totalAdultPrice.toLocaleString()}</span>
                        </div>
                        {children > 0 && (
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[13px] text-gray-500 font-medium">
                              ${childNightlyRate.toLocaleString()} x {children} {children === 1 ? 'child' : 'children'} x {nights} {nights === 1 ? 'night' : 'nights'}
                            </span>
                            <span className="text-[13px] text-[#1A1A1A] font-bold">${totalChildPrice.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[13px] text-gray-500 font-medium underline decoration-dotted underline-offset-4 cursor-help">Cleaning fee</span>
                          <span className="text-[13px] text-[#1A1A1A] font-bold">${cleaningFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                          <span className="text-[13px] text-gray-500 font-medium underline decoration-dotted underline-offset-4 cursor-help">Nestory service fee</span>
                          <span className="text-[13px] text-[#1A1A1A] font-bold">${serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[14px] font-bold text-[#1A1A1A]">Total</span>
                          <span className="text-[20px] font-bold text-brand">${totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-auto pt-6">
                      <motion.button 
                        onClick={handleBookingStart}
                        whileHover="shineHover"
                        className="group relative h-10 bg-brand text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-4 transition-all w-full"
                      >
                        <span className="text-[13px] font-normal w-full text-center pr-4">Proceed to Checkout</span>
                        <div className="absolute right-1 w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 scale-90">
                          <ArrowUpRight size={16} />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : sidebarMode === 'VIEWING' ? (
                  <motion.div 
                    key="viewing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <h2 className="text-[20px] font-bold tracking-tight text-[#1A1A1A]">Private Showing</h2>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Request Viewing</span>
                      </div>
                      <button 
                        onClick={() => setSidebarMode('INFO')}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1A1A] hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft size={14} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-visible pr-1 max-h-[480px] scrollbar-hide">
                      {/* Name & Email */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Alex Johnson" 
                            className="h-10 px-6 bg-gray-50 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Email</label>
                            <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="alex@example.com" 
                              className="h-10 px-6 bg-gray-50 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Phone</label>
                            <input 
                              type="tel" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="+1 234 567" 
                              className="h-10 px-6 bg-gray-50 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Date</label>
                          <div className="bg-gray-50 border border-gray-200 rounded-full h-10 flex items-center relative">
                            <CustomDatePicker 
                              selectedDate={formData.date} 
                              onChange={(date) => setFormData({...formData, date})} 
                              label="" 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Time</label>
                          <div className="bg-gray-50 border border-gray-200 rounded-full h-10 flex items-center relative">
                            <CustomDropdown 
                              label=""
                              value={formData.timeSlot}
                              onChange={(val) => setFormData({...formData, timeSlot: val})}
                              options={[
                                { label: 'Morning (9-12)', value: 'MORNING' },
                                { label: 'Afternoon (12-4)', value: 'AFTERNOON' },
                                { label: 'Evening (4-7)', value: 'EVENING' }
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Viewing Type & Status */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Tour Type</label>
                          <div className="flex h-10 bg-gray-50 border border-gray-200 rounded-full p-1">
                            <button 
                              onClick={() => setFormData({...formData, tourType: 'IN_PERSON'})}
                              className={`flex-1 rounded-full text-[10px] font-bold transition-all ${formData.tourType === 'IN_PERSON' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
                            >
                              In-Person
                            </button>
                            <button 
                              onClick={() => setFormData({...formData, tourType: 'VIRTUAL'})}
                              className={`flex-1 rounded-full text-[10px] font-bold transition-all ${formData.tourType === 'VIRTUAL' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
                            >
                              Virtual
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Status</label>
                          <div className="bg-gray-50 border border-gray-200 rounded-full h-10 flex items-center relative">
                            <CustomDropdown 
                              label=""
                              value={formData.status}
                              onChange={(val) => setFormData({...formData, status: val})}
                              options={[
                                { label: 'Just Browsing', value: 'BROWSING' },
                                { label: 'Ready to Buy', value: 'READY' },
                                { label: 'Cash Buyer', value: 'CASH' }
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Special Requests</label>
                        <textarea 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="Tell us what you'd like to focus on during the tour..." 
                          className="min-h-[70px] p-3 px-6 bg-gray-50 border border-gray-200 rounded-[20px] text-[13px] focus:outline-none focus:border-brand transition-colors resize-none placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <motion.button 
                        onClick={handleFormSubmit}
                        whileHover="shineHover"
                        className="group relative h-10 bg-brand text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-4 transition-all"
                      >
                        <span className="text-[13px] font-normal">Confirm Showing Request</span>
                        <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 scale-90">
                          <ArrowUpRight size={16} />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="contact"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <h2 className="text-[20px] font-bold tracking-tight text-[#1A1A1A]">Direct Inquiry</h2>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Contact {property.ownerType === 'AGENCY' ? 'Agency' : 'Owner'}</span>
                      </div>
                      <button 
                        onClick={() => setSidebarMode('INFO')}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1A1A] hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft size={14} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-visible pr-1 max-h-[480px] scrollbar-hide">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Full Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Alex Johnson" 
                          className="h-10 px-6 bg-gray-50 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Email</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="alex@example.com" 
                            className="h-10 px-6 bg-gray-50 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Phone</label>
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+1 234 567" 
                            className="h-10 px-6 bg-gray-50 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Inquiry Type</label>
                        <div className="bg-gray-50 border border-gray-200 rounded-full h-10 flex items-center relative">
                          <CustomDropdown 
                            label=""
                            value={formData.inquiryType}
                            onChange={(val) => setFormData({...formData, inquiryType: val})}
                            options={[
                              { label: 'Property Details', value: 'DETAILS' },
                              { label: 'Financing Options', value: 'FINANCING' },
                              { label: 'Tax & Legal', value: 'TAX' },
                              { label: 'Schedule a Call', value: 'CALL' },
                              { label: 'Other', value: 'OTHER' }
                            ]}
                            icon={<Sparkles size={14} />}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Your Message</label>
                        <textarea 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="I am interested in this property and would like to know..." 
                          className="min-h-[120px] p-4 px-6 bg-gray-50 border border-gray-200 rounded-[24px] text-[13px] focus:outline-none focus:border-brand transition-colors resize-none placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mt-auto pt-6">
                      <motion.button 
                        onClick={handleFormSubmit}
                        whileHover="shineHover"
                        className="group relative h-10 bg-brand text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-4 transition-all"
                      >
                        <span className="text-[13px] font-normal">Send Direct Inquiry</span>
                        <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 scale-90">
                          <Mail size={16} />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </aside>
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          if (sidebarMode === 'BOOKING') {
            setIsCheckoutOpen(true);
          }
        }}
      />

      {property && (
        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          amount={totalAmount}
          propertyName={property.title}
          onSuccess={() => {
            setSidebarMode('INFO');
            // Normally navigate to a trips/bookings page
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;
