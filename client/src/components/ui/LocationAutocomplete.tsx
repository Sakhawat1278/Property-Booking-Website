import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface LocationAutocompleteProps {
  onLocationSelect: (location: string) => void;
  variant?: 'default' | 'hero';
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ onLocationSelect, variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`);
        const data = await res.json();
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (suggestion: any) => {
    const displayName = suggestion.display_name;
    setQuery(displayName);
    setIsOpen(false);
    onLocationSelect(displayName);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        {variant === 'default' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          </div>
        )}
        <input 
          type="text"
          placeholder="Search city, area..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === '') onLocationSelect('');
          }}
          className={variant === 'hero' 
            ? "bg-transparent text-[#1A1A1A] placeholder:text-gray-300 outline-none text-[15px] font-medium w-full"
            : "w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-medium focus:outline-none focus:border-brand focus:bg-white transition-all placeholder:font-normal placeholder:text-gray-400"
          }
        />
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute z-50 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2 ${
              variant === 'hero' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex gap-3 items-start group border-b border-gray-50 last:border-0"
              >
                <div className="mt-0.5 text-gray-400 group-hover:text-brand transition-colors"><MapPin size={14} /></div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-[#1A1A1A] line-clamp-1">{suggestion.display_name.split(',')[0]}</span>
                  <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{suggestion.display_name.split(',').slice(1).join(',').trim()}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Assuming Framer Motion is available
import { motion, AnimatePresence } from 'framer-motion';

export default LocationAutocomplete;
