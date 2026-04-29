import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from 'date-fns';

interface CustomDatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  label: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDatePicker = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If space below is less than 350px (calendar height + buffer), open upwards
      if (spaceBelow < 350) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
    setIsOpen(!isOpen);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
          <ChevronLeft size={18} />
        </button>
        <span className="text-[15px] font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day.toString()}
            className={`h-9 flex items-center justify-center text-[13px] cursor-pointer rounded-full transition-all
              ${!isSameMonth(day, monthStart) ? 'text-gray-300' : isSameDay(day, selectedDate) ? 'bg-brand text-white font-bold' : 'text-gray-600 hover:bg-brand/10 hover:text-brand'}
            `}
            onClick={() => {
              onChange(cloneDay);
              setIsOpen(false);
            }}
          >
            <span>{format(day, 'd')}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="px-2 pb-4">{rows}</div>;
  };

  return (
    <div className="flex-1 w-full px-4 flex items-center gap-3 relative" ref={dropdownRef}>
      <CalendarIcon size={14} className="text-gray-400 flex-shrink-0" />
      <div className="flex flex-col flex-1 cursor-pointer" onClick={toggleDatePicker}>
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-[#1A1A1A] text-[15px] font-medium">
          {format(selectedDate, 'MMM dd, yyyy')}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === 'bottom' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropdownPosition === 'bottom' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute left-0 mt-2 w-[280px] bg-white rounded-2xl shadow-[0_20px_50_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden ${
              dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {renderHeader()}
            <div className="p-2">
              {renderDays()}
              {renderCells()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDatePicker;
