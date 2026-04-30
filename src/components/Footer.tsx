import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full px-8 pt-20 pb-32 bg-[#F2F2F2] overflow-hidden">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-4">
          {/* Newsletter and Socials */}
          <div className="max-w-md">
            <h4 className="text-[15px] font-bold text-[#1A1A1A] mb-6">Join our newsletter to stay up to date on the latest news and updates.</h4>
            <div className="relative flex items-center mb-6">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full h-14 bg-white rounded-full px-8 text-[14px] outline-none border border-transparent focus:border-brand transition-all"
              />
              <button className="absolute right-1.5 px-8 h-11 bg-[#0A2633] text-white text-[14px] font-bold rounded-full hover:bg-[#061922] transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mb-8">By subscribing, you agree to our Privacy Policy and consent to receive updates from us.</p>
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand cursor-pointer transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand cursor-pointer transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </div>
              <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand cursor-pointer transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </div>
              <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand cursor-pointer transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24 pl-12 lg:pl-20">
            <div className="flex flex-col gap-6">
              <h4 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider">Sitemap</h4>
              <ul className="flex flex-col gap-4 text-gray-500 text-[14px] font-normal">
                <li className="hover:text-brand cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Space design</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Customer Stories</li>
                <li className="hover:text-brand cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider">Partners</h4>
              <ul className="flex flex-col gap-4 text-gray-500 text-[14px] font-normal">
                <li className="hover:text-brand cursor-pointer transition-colors">Architects</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Co-Working</li>
                <li className="hover:text-brand cursor-pointer transition-colors text-brand">Real Estate</li>
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider">Services</h4>
              <ul className="flex flex-col gap-4 text-gray-500 text-[14px] font-normal">
                <li className="hover:text-brand cursor-pointer transition-colors">Portfolio Growth</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Asset Management</li>
                <li className="hover:text-brand cursor-pointer transition-colors">Legal Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Massive Logo Section */}
        <div className="relative pt-0 select-none flex justify-center">
          <h1 className="text-[clamp(80px,18vw,300px)] font-black text-brand leading-[0.8] tracking-tighter flex items-start">
            nestory
            <span className="text-[clamp(20px,4vw,60px)] font-bold border-2 border-brand rounded-full w-[1.2em] h-[1.2em] flex items-center justify-center ml-2 mt-[0.1em]">R</span>
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
