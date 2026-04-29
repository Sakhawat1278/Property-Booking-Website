import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Maximize2, Bed, Bath, Share2, Heart, ChevronLeft, 
  ArrowUpRight, ShieldCheck, GraduationCap, TrendingUp, Zap, 
  FileText, Calendar, Info
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PropertyDetailsFooter from '../components/PropertyDetailsFooter';

const SimpleSlick = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/properties/${slug}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        navigate('/properties');
      }
    };
    if (slug) fetchProperty();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  const gallery = property.imageGallery ? property.imageGallery.split(',') : [property.primaryImage];

  return (
    <div className="min-h-screen bg-white font-poppins text-[#1A1A1A]">
      <Navbar />
      
      <main className="pt-[88px] px-2 max-w-[1600px] mx-auto pb-32">
        <div className="px-6 md:px-12 flex flex-col gap-12">
          
          {/* Header Section - Thin & Slick */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-12 border-b border-gray-100 pb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">{property.status.replace('_', ' ')}</span>
                 <div className="w-1 h-1 bg-gray-300 rounded-full" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Ref: {property.id?.slice(0,8) || 'NSTR-001'}</span>
              </div>
              <h1 className="text-[42px] md:text-[56px] font-light tracking-tight leading-none uppercase">
                {property.title}
              </h1>
              <div className="flex items-center gap-6 text-[13px] text-gray-500 font-light">
                 <div className="flex items-center gap-2">
                    <MapPin size={14} strokeWidth={1.5} />
                    {property.address}, {property.city}
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={14} strokeWidth={1.5} className="text-brand" />
                    Verified Listing
                 </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
               <span className="text-[32px] md:text-[48px] font-light tracking-tighter">
                  ${property.price?.toLocaleString()}
               </span>
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Total Asset Value</span>
            </div>
          </div>

          {/* Minimal Gallery Grid */}
          <div className="grid grid-cols-12 gap-2 h-[600px]">
             <div className="col-span-12 md:col-span-8 h-full rounded-[24px] overflow-hidden group relative">
                <img src={gallery[0]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </div>
             <div className="hidden md:flex col-span-4 flex-col gap-2 h-full">
                <div className="flex-1 rounded-[24px] overflow-hidden">
                   <img src={gallery[1] || gallery[0]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="flex-1 rounded-[24px] overflow-hidden">
                   <img src={gallery[2] || gallery[0]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
             </div>
          </div>

          {/* Minimal Spec Line */}
          <div className="flex flex-wrap items-center gap-x-16 gap-y-6 py-8 border-b border-gray-100">
             {[
               { icon: Bed, label: 'Suites', val: property.bedrooms },
               { icon: Bath, label: 'Bathrooms', val: property.bathrooms },
               { icon: Maximize2, label: 'Square Ft', val: property.totalArea },
               { icon: Calendar, label: 'Year Built', val: property.yearBuilt || 2024 },
               { icon: TrendingUp, label: 'ROI', val: `${property.estimatedROI || '8.5'}%` }
             ].map((spec, i) => (
                <div key={i} className="flex items-center gap-4">
                   <spec.icon size={18} strokeWidth={1} className="text-gray-400" />
                   <div className="flex flex-col">
                      <span className="text-[13px] font-medium uppercase tracking-widest">{spec.val}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{spec.label}</span>
                   </div>
                </div>
             ))}
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 pt-12">
             
             {/* Description & Narrative */}
             <div className="lg:col-span-7 flex flex-col gap-16">
                <div className="flex flex-col gap-8">
                   <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] text-gray-400">The Description</h2>
                   <p className="text-[18px] font-light leading-relaxed text-gray-600 max-w-2xl">
                      {property.description || "A clean expression of modern architecture. This residence emphasizes openness, natural light, and a seamless connection between internal and external spaces. Every detail has been curated to provide a calm, minimalist sanctuary."}
                   </p>
                </div>

                <div className="flex flex-col gap-8">
                   <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] text-gray-400">Features</h2>
                   <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                      {[...(property.internalAmenities?.split(',') || []), ...(property.externalAmenities?.split(',') || [])].slice(0, 8).map((item, i) => (
                         <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 group hover:border-brand transition-all">
                            <span className="text-[14px] font-light text-gray-500 group-hover:text-black">{item}</span>
                            <div className="w-1 h-1 bg-gray-200 rounded-full group-hover:bg-brand" />
                         </div>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col gap-8">
                   <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] text-gray-400">Proximity Matrix</h2>
                   <div className="flex flex-col gap-2">
                      {[
                        { name: 'Elite Academy', type: 'Education', dist: '0.8km' },
                        { name: 'City Central Station', type: 'Transport', dist: '1.2km' },
                        { name: 'Royal Health Care', type: 'Health', dist: '2.5km' }
                      ].map((loc, i) => (
                         <div key={i} className="flex items-center justify-between p-6 rounded-2xl hover:bg-gray-50 transition-all cursor-default">
                            <div className="flex items-center gap-6">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">0{i+1}</span>
                               <div className="flex flex-col">
                                  <span className="text-[15px] font-medium">{loc.name}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{loc.type}</span>
                               </div>
                            </div>
                            <span className="text-[12px] font-light text-gray-400">{loc.dist}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Sidebar - Slick Action */}
             <div className="lg:col-span-5">
                <div className="sticky top-32 flex flex-col gap-12">
                   <div className="flex flex-col gap-10 p-12 border border-gray-100 rounded-[32px] hover:border-gray-200 transition-all">
                      <div className="flex flex-col gap-2">
                         <h3 className="text-[24px] font-light uppercase tracking-widest">Inquiry</h3>
                         <p className="text-[12px] font-light text-gray-400">Start the acquisition process by submitting your interest.</p>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                         <div className="flex flex-col gap-1">
                            <input type="text" placeholder="Identity" className="w-full py-4 border-b border-gray-100 outline-none focus:border-brand transition-all text-[14px] font-light" />
                         </div>
                         <div className="flex flex-col gap-1">
                            <input type="email" placeholder="Communication" className="w-full py-4 border-b border-gray-100 outline-none focus:border-brand transition-all text-[14px] font-light" />
                         </div>
                         
                         <motion.button 
                           whileTap={{ scale: 0.98 }}
                           className="w-full mt-6 py-6 bg-black text-white text-[12px] font-bold uppercase tracking-[0.4em] rounded-xl hover:bg-brand transition-all duration-500"
                         >
                            Initialize Request
                         </motion.button>

                         <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
                            <div className="flex items-center gap-2 cursor-pointer hover:text-black transition-all">
                               <Share2 size={12} /> Share Asset
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition-all">
                               <Heart size={12} /> Save for Later
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Legal / Data Note */}
                   <div className="px-8 flex gap-4">
                      <Info size={16} className="text-gray-300 mt-1" />
                      <p className="text-[11px] font-light text-gray-400 leading-relaxed">
                         All transactions are encrypted and verified. By initiating a request, you agree to our digital protocol and data handling standards.
                      </p>
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

export default SimpleSlick;
