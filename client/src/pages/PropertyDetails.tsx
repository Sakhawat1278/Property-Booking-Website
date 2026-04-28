import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Share, Heart, MapPin, Bed, Bath, Maximize2, 
  Star, Home, ArrowUpRight, CheckCircle2, Phone, Mail,
  ShieldCheck, GraduationCap, Ruler, Info, DollarSign,
  Key, Wallet, Sofa, Zap, PawPrint, Clock, TrendingUp, FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PropertyDetailsFooter from '../components/PropertyDetailsFooter';

const PropertyDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/properties/${slug}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        navigate('/properties');
      }
    };

    if (slug) {
      fetchProperty();
    }
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
        <p className="text-[12px] font-medium text-gray-400 tracking-widest uppercase">Syncing Deep Data...</p>
      </div>
    );
  }

  const gallery = property.imageGallery ? property.imageGallery.split(',') : [property.primaryImage];
  const isSale = property.status === 'FOR_SALE' || property.status === 'OFF_PLAN';

  return (
    <div className="min-h-screen bg-white font-poppins selection:bg-brand selection:text-white">
      <Navbar />
      
      <main className="pt-[88px] px-2 pb-32">
        
        {/* Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
           <div className="md:col-span-8 aspect-[16/10] overflow-hidden rounded-[24px] group cursor-pointer relative">
              <img src={gallery[activeImage]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={property.title} />
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md text-white text-[12px] font-bold rounded-full border border-white/20">
                 Perspective {activeImage + 1} / {gallery.length}
              </div>
           </div>
           <div className="md:col-span-4 flex flex-col gap-4">
              {gallery.slice(1, 3).map((img: string, i: number) => (
                 <div key={i} onClick={() => setActiveImage(i + 1)} className="flex-1 aspect-[16/10] overflow-hidden rounded-[24px] cursor-pointer group relative">
                    <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`Gallery ${i + 1}`} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                 </div>
              ))}
              <div className="flex-1 bg-[#1A1A1A] rounded-[24px] flex flex-col items-center justify-center text-white gap-2 cursor-pointer hover:bg-brand transition-all">
                 <Maximize2 size={24} />
                 <span className="text-[11px] font-bold uppercase tracking-widest">Full Gallery</span>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           
           {/* Left Column: Details */}
           <div className="lg:col-span-8 flex flex-col gap-16">
              
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-12">
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isSale ? 'bg-brand text-white' : 'bg-blue-600 text-white'}`}>
                          {property.status.replace('_', ' ')}
                       </span>
                       {property.isVerified && (
                          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                             <ShieldCheck size={12} /> Verified
                          </div>
                       )}
                    </div>
                    <h1 className="text-[48px] font-bold text-[#1A1A1A] leading-tight tracking-tight">{property.title}</h1>
                    <div className="flex items-center gap-8 text-gray-500 text-[15px]">
                       <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-brand" />
                          {property.address}, {property.city}
                       </div>
                       <div className="flex items-center gap-2">
                          <Star size={18} className="text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-[#1A1A1A]">{property.rating || '5.0'}</span>
                          <span className="text-gray-300 font-medium">({property.reviewsCount || '12'} reviews)</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right flex flex-col gap-1">
                    <span className="text-[42px] font-bold text-[#1A1A1A] tracking-tighter">${property.price?.toLocaleString()}</span>
                    <p className="text-[12px] text-gray-400 uppercase tracking-[0.3em] font-black">{isSale ? 'Total Value' : `Per ${property.rentFrequency || 'Month'}`}</p>
                 </div>
              </div>

              {/* Conditional Financial Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8FAFC] p-10 rounded-[32px]">
                 <div className="flex flex-col gap-6">
                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <DollarSign size={16} /> Financial Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-y-6">
                       {isSale ? (
                          <>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Service Charges</span>
                                <span className="text-[18px] font-bold text-[#1A1A1A]">${property.serviceCharges?.toLocaleString() || '4,200'}<span className="text-[12px] text-gray-400 font-medium italic">/yr</span></span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Property Tax</span>
                                <span className="text-[18px] font-bold text-[#1A1A1A]">${property.propertyTax?.toLocaleString() || '1,850'}<span className="text-[12px] text-gray-400 font-medium italic">/yr</span></span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Ownership</span>
                                <span className="text-[18px] font-bold text-[#1A1A1A]">{property.ownershipType || 'Freehold'}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Monthly Mortgage</span>
                                <span className="text-[18px] font-bold text-brand">From ${property.mortgageEstimate?.toLocaleString() || '3,450'}</span>
                             </div>
                          </>
                       ) : (
                          <>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Security Deposit</span>
                                <span className="text-[18px] font-bold text-[#1A1A1A]">${property.securityDeposit?.toLocaleString() || '12,000'}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Furnishing</span>
                                <span className="text-[18px] font-bold text-[#1A1A1A]">{property.furnishingStatus || 'Fully Furnished'}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Utilities</span>
                                <span className="text-[18px] font-bold text-[#1A1A1A]">{property.utilitiesIncluded ? 'Included' : 'Not Included'}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Min. Lease</span>
                                <span className="text-[18px] font-bold text-[#1A1A1A]">{property.minLeaseTerm || '12 Months'}</span>
                             </div>
                          </>
                       )}
                    </div>
                 </div>
                 <div className="flex flex-col gap-6 border-l border-gray-200 pl-10">
                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp size={16} /> Market Insights
                    </h3>
                    <div className="grid grid-cols-2 gap-y-6">
                       <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Estimated ROI</span>
                          <span className="text-[18px] font-bold text-brand">{property.estimatedROI || '8.5'}%</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Neighborhood Safety</span>
                          <span className="text-[18px] font-bold text-[#1A1A1A]">{property.neighborhoodSafety || '9.8'}<span className="text-[12px] text-gray-400 font-medium">/10</span></span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Energy Rating</span>
                          <div className="flex items-center gap-2">
                             <Zap size={16} className="text-yellow-500" />
                             <span className="text-[18px] font-bold text-[#1A1A1A]">{property.energyRating || 'A+'}</span>
                          </div>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] text-gray-400 font-bold uppercase mb-1">Pet Policy</span>
                          <div className="flex items-center gap-2">
                             <PawPrint size={16} className="text-gray-400" />
                             <span className="text-[18px] font-bold text-[#1A1A1A]">{property.petPolicy || 'Allowed'}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Description & Technical Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                 <div className="md:col-span-7 flex flex-col gap-6">
                    <h2 className="text-[22px] font-bold text-[#1A1A1A]">Property Narrative</h2>
                    <p className="text-[16px] text-gray-500 leading-relaxed">
                       {property.description || "Experience unparalleled luxury in this masterfully designed property. Every detail, from the hand-selected finishes to the state-of-the-art smart systems, has been curated for the discerning occupant. The expansive living areas flow seamlessly into private outdoor sanctuaries, offering a rare balance of urban energy and serene tranquility."}
                    </p>
                 </div>
                 <div className="md:col-span-5 border border-gray-100 rounded-3xl p-8 flex flex-col gap-6">
                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Ruler size={16} /> Dimensions
                    </h3>
                    <div className="flex flex-col gap-4">
                       <div className="flex justify-between items-center py-2 border-b border-gray-50 text-[14px]">
                          <span className="text-gray-400 font-medium">Primary Suite</span>
                          <span className="text-[#1A1A1A] font-bold">450 sqft</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-gray-50 text-[14px]">
                          <span className="text-gray-400 font-medium">Living Volume</span>
                          <span className="text-[#1A1A1A] font-bold">1,200 sqft</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-gray-50 text-[14px]">
                          <span className="text-gray-400 font-medium">Gourmet Kitchen</span>
                          <span className="text-[#1A1A1A] font-bold">320 sqft</span>
                       </div>
                       <div className="flex justify-between items-center py-2 text-[14px]">
                          <span className="text-gray-400 font-medium">Outdoor Terrace</span>
                          <span className="text-[#1A1A1A] font-bold">280 sqft</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Nearby Education & Schools */}
              <div className="flex flex-col gap-8">
                 <h2 className="text-[22px] font-bold text-[#1A1A1A] flex items-center gap-3">
                    <GraduationCap size={24} className="text-brand" /> Education & Proximity
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Elite International School', dist: '0.8 km', rating: '9.4' },
                      { name: 'Modern Science Academy', dist: '1.2 km', rating: '9.1' },
                      { name: 'Greenwood Primary', dist: '2.4 km', rating: '8.8' },
                      { name: 'Westside High', dist: '3.1 km', rating: '9.0' }
                    ].map((school, i) => (
                       <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl flex justify-between items-center hover:border-brand/30 hover:shadow-lg hover:shadow-gray-100 transition-all cursor-default">
                          <div className="flex flex-col">
                             <span className="text-[15px] font-bold text-[#1A1A1A]">{school.name}</span>
                             <span className="text-[12px] text-gray-400 font-medium flex items-center gap-1"><MapPin size={10} /> {school.dist}</span>
                          </div>
                          <div className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-[11px] font-black">{school.rating}</div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Amenities Grid */}
              <div className="flex flex-col gap-8">
                 <h2 className="text-[22px] font-bold text-[#1A1A1A]">Curated Amenities</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...(property.internalAmenities?.split(',') || []), ...(property.externalAmenities?.split(',') || [])].map((amenity, i) => (
                       <div key={i} className="p-5 border border-gray-50 rounded-2xl flex items-center gap-3 text-[14px] text-gray-600 font-medium hover:bg-gray-50 transition-all">
                          <CheckCircle2 size={16} className="text-brand" /> {amenity}
                       </div>
                    ))}
                 </div>
              </div>

           </div>

           {/* Right Column: Inquiry Form */}
           <div className="lg:col-span-4">
              <div className="sticky top-28 flex flex-col gap-8">
                 
                 {/* Main Action Card */}
                 <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-2xl shadow-gray-100/50 flex flex-col gap-10">
                    <div className="flex items-center gap-5 pb-8 border-b border-gray-100">
                       <img src={property.owner?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} className="w-20 h-20 rounded-3xl object-cover" alt="Agent" />
                       <div className="flex flex-col">
                          <h3 className="text-[20px] font-bold text-[#1A1A1A]">{property.owner?.name || "Daniel Morgan"}</h3>
                          <span className="text-[12px] text-brand font-black uppercase tracking-widest">Senior Partner</span>
                       </div>
                    </div>

                    <div className="flex flex-col gap-6">
                       <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Full Name</label>
                          <input type="text" placeholder="Johnathan Miller" className="w-full px-6 h-14 bg-gray-50 border border-transparent rounded-2xl focus:border-brand/30 outline-none transition-all text-[14px] font-medium" />
                       </div>
                       <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input type="email" placeholder="john@address.com" className="w-full px-6 h-14 bg-gray-50 border border-transparent rounded-2xl focus:border-brand/30 outline-none transition-all text-[14px] font-medium" />
                       </div>
                       <button className="w-full h-18 bg-[#1A1A1A] text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-4 py-5 shadow-xl shadow-black/10">
                          Initialize Protocol <ArrowUpRight size={22} />
                       </button>
                       <div className="flex gap-2">
                          <button className="flex-1 h-14 border border-gray-100 rounded-2xl text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                             <Phone size={14} /> Call Agent
                          </button>
                          <button className="flex-1 h-14 border border-gray-100 rounded-2xl text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                             <Mail size={14} /> Email Office
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Asset Downloads */}
                 <div className="flex flex-col gap-4">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-4">Documentation</h4>
                    <div className="flex flex-col gap-3">
                       <button className="flex items-center justify-between p-6 bg-gray-50 rounded-[28px] hover:bg-gray-100 transition-all group">
                          <div className="flex items-center gap-4">
                             <FileText className="text-brand" size={20} />
                             <span className="text-[14px] font-bold">Property Brochure</span>
                          </div>
                          <ArrowUpRight size={18} className="text-gray-300 group-hover:text-brand" />
                       </button>
                       <button className="flex items-center justify-between p-6 bg-gray-50 rounded-[28px] hover:bg-gray-100 transition-all group">
                          <div className="flex items-center gap-4">
                             <Home className="text-brand" size={20} />
                             <span className="text-[14px] font-bold">Full Floorplans (PDF)</span>
                          </div>
                          <ArrowUpRight size={18} className="text-gray-300 group-hover:text-brand" />
                       </button>
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </main>

      <PropertyDetailsFooter />
    </div>
  );
};

export default PropertyDetails;
