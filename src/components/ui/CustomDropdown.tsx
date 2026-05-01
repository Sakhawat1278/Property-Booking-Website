import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  icon?: React.ReactNode;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 200) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
    setIsOpen(!isOpen);
  };


  const itemVariants = {
    hidden: { opacity: 0, y: -4 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex-1 w-full h-11 px-4 flex items-center justify-between relative group cursor-pointer select-none" ref={dropdownRef} onClick={toggleDropdown}>
      <span className="text-[#1A1A1A] text-[13px] font-medium tracking-tight">
        {selectedOption.label}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={14} className="text-gray-400 group-hover:text-brand transition-colors" />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === 'bottom' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropdownPosition === 'bottom' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute left-0 w-full min-w-[200px] bg-white rounded-xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 z-[9999] overflow-hidden ${
              dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <div className="py-1 max-h-[280px] overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <motion.div
                  key={option.value}
                  variants={itemVariants}
                  className={`px-4 py-2 text-[13px] cursor-pointer transition-all duration-150 ${
                    value === option.value 
                      ? 'bg-brand/5 text-brand font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-brand'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
