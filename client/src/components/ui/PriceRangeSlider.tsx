import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  label: string;
  icon?: React.ReactNode;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, onChange, label, icon }) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 100000);
    setMinValue(value);
    onChange(value, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 100000);
    setMaxValue(value);
    onChange(minValue, value);
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="flex-1 w-full px-4 py-2 flex items-center gap-3 relative">
      {icon && <div className="p-1.5 bg-brand/10 rounded-full text-brand">{icon}</div>}
      <div className="flex flex-col flex-1">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#1A1A1A] text-[13px] font-medium">
            ${(minValue / 1000).toFixed(0)}k - ${(maxValue / 1000).toFixed(0)}k
          </span>
        </div>
        
        <div className="relative h-1 w-full bg-gray-200 rounded-full mt-2">
          <div 
            className="absolute h-full bg-brand rounded-full"
            style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMinChange}
            className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 slider-thumb"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 slider-thumb"
          />
        </div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FF4D00;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-thumb::-moz-range-thumb {
          appearance: none;
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FF4D00;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;
