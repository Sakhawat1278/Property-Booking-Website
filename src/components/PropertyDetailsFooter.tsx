import React from 'react';
import { Home } from 'lucide-react';

const PropertyDetailsFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 font-poppins">
      <div className="w-full px-8">
        
        {/* Top Section: Logo & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Logo & Address */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
                <Home size={20} />
              </div>
              <span className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">Realnest</span>
            </div>
            
            <div className="text-[14px] text-gray-500 leading-relaxed max-w-[280px]">
              RealNest Real Estate LLC<br />
              Office 903, The Binary Tower by<br />
              Omniyat<br />
              Business Bay, Dubai, UAE
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* SELL A HOME */}
            <div className="flex flex-col gap-5">
              <h3 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider">Sell a Home</h3>
              <ul className="flex flex-col gap-3">
                {['Request an offer', 'Pricing', 'Reviews', 'Store'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[14px] text-gray-500 hover:text-brand transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* BUY, RENT AND SELL */}
            <div className="flex flex-col gap-5">
              <h3 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider">Buy, Rent and Sell</h3>
              <ul className="flex flex-col gap-3">
                {['Buy and sell properties', 'Rent home', 'Agency & Developer program'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[14px] text-gray-500 hover:text-brand transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ABOUT */}
            <div className="flex flex-col gap-5">
              <h3 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider">About</h3>
              <ul className="flex flex-col gap-3">
                {['Company', 'How it works', 'Contact', 'Investors'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[14px] text-gray-500 hover:text-brand transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100">
          <p className="text-[13px] text-gray-500 font-medium">
            ©2025 Realnest. All rights reserved
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand/10 hover:text-brand transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand/10 hover:text-brand transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand/10 hover:text-brand transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand/10 hover:text-brand transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PropertyDetailsFooter;
