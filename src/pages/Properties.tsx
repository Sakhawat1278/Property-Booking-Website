import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home as HomeIcon, Building2, Landmark, Tent, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PriceRangeSlider from '../components/ui/PriceRangeSlider';
import CustomDropdown from '../components/ui/CustomDropdown';
import LocationAutocomplete from '../components/ui/LocationAutocomplete';
import PropertyCard from '../components/PropertyCard';

const IconChevronDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

import { properties as localProperties } from '../data/properties';
import { supabase } from '../lib/supabase';

const Properties = () => {
  const [searchParams] = useSearchParams();
  
  // Extract parameters passed from Home page search bar
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('type') || searchParams.get('category') || 'All';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [filters, setFilters] = useState({
    location: initialLocation,
    status: 'All',
    category: initialCategory,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    minArea: '',
    maxArea: '',
    bedrooms: 'Any',
    bathrooms: 'Any',
    parkingSpaces: 'Any',
    minROI: '',
    verifiedOnly: false
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      console.error('Error fetching properties:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const numberOptions = [
    { label: 'Any', value: 'Any' },
    ...Array.from({ length: 30 }, (_, i) => ({ label: `${i + 1}+`, value: `${i + 1}+` }))
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProperties = properties.filter(p => {
    // 0. Location Filter (Global Search)
    if (filters.location !== '') {
      const searchLoc = filters.location.toLowerCase();
      const propLoc = `${p.city || ''} ${p.country || ''} ${p.neighborhood || ''}`.toLowerCase();
      
      // Check if property city is inside the search result (e.g., "Tokyo" in "Tokyo, Japan")
      // OR check if the search result is inside the property location
      const isMatch = searchLoc.includes(p.city?.toLowerCase() || 'XX') || propLoc.includes(searchLoc);
      if (!isMatch) return false;
    }

    // 1. Status Filter
    if (filters.status !== 'All') {
      if (filters.status === 'For Sale' && p.status !== 'FOR_SALE') return false;
      if (filters.status === 'For Rent' && p.status !== 'FOR_RENT') return false;
      if (filters.status === 'Sold' && p.status !== 'SOLD') return false;
    }
    
    // 2. Category Filter
    if (filters.category !== 'All' && p.category !== filters.category.toUpperCase()) {
      return false;
    }
    
    // 3. Price Filter
    const propertyPrice = Number(p.price) || 0;
    if (filters.minPrice !== '' && propertyPrice < Number(filters.minPrice)) return false;
    if (filters.maxPrice !== '' && propertyPrice > Number(filters.maxPrice)) return false;

    // 4. Area Filter
    const propertyArea = Number(p.totalArea) || 0;
    if (filters.minArea !== '' && propertyArea < Number(filters.minArea)) return false;
    if (filters.maxArea !== '' && propertyArea > Number(filters.maxArea)) return false;
    
    // 5. Bedrooms Filter
    if (filters.bedrooms !== 'Any') {
      const bedsRequired = parseInt(filters.bedrooms);
      const propertyBeds = p.bedrooms || 0;
      if (propertyBeds < bedsRequired) return false;
    }

    // 6. Bathrooms Filter
    if (filters.bathrooms !== 'Any') {
      const bathsRequired = parseInt(filters.bathrooms);
      const propertyBaths = p.bathrooms || 0;
      if (propertyBaths < bathsRequired) return false;
    }

    // 7. Parking Spaces Filter
    if (filters.parkingSpaces !== 'Any') {
      const parkingRequired = parseInt(filters.parkingSpaces);
      const propertyParking = p.parkingSpaces || 0;
      if (propertyParking < parkingRequired) return false;
    }

    // 8. Minimum ROI Filter
    if (filters.minROI !== '') {
      const minROI = Number(filters.minROI);
      const propertyROI = p.estimatedROI || 0;
      if (propertyROI < minROI) return false;
    }

    // 9. Verified Only Filter
    if (filters.verifiedOnly && !p.isVerified) return false;
    
    return true;
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Shared filter panel content
  const FilterContent = () => (
    <div className="flex flex-col gap-5 p-4">
      {/* Location Search */}
      <div>
        <h3 className="text-[12px] font-bold text-[#1A1A1A] mb-1.5">Location</h3>
        <LocationAutocomplete 
          onLocationSelect={(loc) => setFilters({ ...filters, location: loc })} 
        />
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-[12px] font-bold text-[#1A1A1A] mb-1.5">Listing Status</h3>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'For Sale', 'For Rent', 'Sold'].map(status => (
            <button
              key={status}
              onClick={() => setFilters({ ...filters, status })}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                filters.status === status
                ? 'bg-brand text-white'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-[12px] font-bold text-[#1A1A1A] mb-1.5">Property Type</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'All', icon: <HomeIcon size={14} /> },
            { id: 'Residential', icon: <HomeIcon size={14} /> },
            { id: 'Commercial', icon: <Building2 size={14} /> },
            { id: 'Luxury', icon: <Landmark size={14} /> },
            { id: 'Vacation', icon: <Tent size={14} /> }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilters({ ...filters, category: cat.id })}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                filters.category === cat.id 
                ? 'border-brand bg-brand/5 text-brand' 
                : 'border-gray-200 bg-white text-gray-500 hover:border-brand/30 hover:bg-gray-50'
              }`}
            >
              <div className="mb-0.5">{cat.icon}</div>
              <span className="text-[10px] font-semibold">{cat.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <PriceRangeSlider 
            min={0} 
            max={10000000} 
            label="Price Range" 
            onChange={(min, max) => setFilters({ ...filters, minPrice: min.toString(), maxPrice: max.toString() })} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-[12px] font-bold text-[#1A1A1A] mb-1.5">Bedrooms</h3>
          <div className="border border-gray-200 rounded-full bg-gray-50">
            <CustomDropdown options={numberOptions} value={filters.bedrooms} onChange={(val) => setFilters({ ...filters, bedrooms: val })} label="" />
          </div>
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-[#1A1A1A] mb-1.5">Bathrooms</h3>
          <div className="border border-gray-200 rounded-full bg-gray-50">
            <CustomDropdown options={numberOptions} value={filters.bathrooms} onChange={(val) => setFilters({ ...filters, bathrooms: val })} label="" />
          </div>
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-[#1A1A1A] mb-1.5">Parking Spaces</h3>
          <div className="border border-gray-200 rounded-full bg-gray-50">
            <CustomDropdown options={numberOptions} value={filters.parkingSpaces} onChange={(val) => setFilters({ ...filters, parkingSpaces: val })} label="" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[12px] font-bold text-[#1A1A1A] mb-1.5">Minimum ROI (%)</h3>
        <div className="relative w-full">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">%</span>
          <input 
            type="number"
            placeholder="e.g. 5"
            value={filters.minROI}
            onChange={(e) => setFilters({ ...filters, minROI: e.target.value })}
            className="w-full h-8 pl-4 pr-7 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-medium focus:outline-none focus:border-brand focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <label className="flex items-center justify-between cursor-pointer group">
          <div>
            <h3 className="text-[12px] font-bold text-[#1A1A1A]">Verified</h3>
            <p className="text-[10px] text-gray-400 leading-tight">Verified listings only</p>
          </div>
          <div className={`w-8 h-5 rounded-full p-0.5 transition-colors duration-300 ${filters.verifiedOnly ? 'bg-brand' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${filters.verifiedOnly ? 'translate-x-3' : 'translate-x-0'}`} />
          </div>
          <input type="checkbox" className="hidden" checked={filters.verifiedOnly} onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })} />
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-poppins flex flex-col">
      <Navbar />
      

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-white z-50 lg:hidden flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
                <span className="text-[15px] font-bold text-[#1A1A1A]">Filters</span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FilterContent />
              </div>
              <div className="p-4 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full h-11 bg-brand text-white rounded-full text-[14px] font-semibold"
                >
                  Show {filteredProperties.length} Properties
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="flex flex-row flex-1 pt-16 lg:pt-20">
        
        {/* Desktop Sidebar — hidden on mobile */}
        <aside className="hidden lg:flex lg:w-[260px] bg-white border-r border-gray-200 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto flex-col shrink-0 custom-scrollbar z-40">
          <FilterContent />
        </aside>
        
        {/* Main Content (Grid) */}
        <main className="flex-1 p-4 lg:p-8 w-full pt-0 lg:pt-4">
          
          {/* Mobile Filter Bar (Sticky within main) */}
          <div className="lg:hidden sticky top-16 -mx-4 mb-4 px-4 py-2 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-gray-500">{filteredProperties.length} properties found</p>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 h-8 bg-[#1A1A1A] text-white rounded-full text-[12px] font-medium shadow-sm"
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>
          
          {/* Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
                <p className="text-[14px] font-medium tracking-wide">Loading Elite Properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <p className="text-[14px] font-medium tracking-wide">No properties found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
            {filteredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between pb-12 mt-8 border-t border-gray-100 pt-8">
          <p className="text-[14px] text-gray-400 font-medium">Showing 1 - {filteredProperties.length} properties</p>
          
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all rotate-180">
              <IconChevronDown />
            </button>
            <button className="w-10 h-10 rounded-xl bg-brand text-white text-[14px] font-bold">1</button>
            <button className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
              <IconChevronDown />
            </button>
          </div>
        </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Properties;
