import React from 'react';
import { 
  BarChart3, Activity, Users, MousePointer2, TrendingUp, 
  ArrowUpRight, Globe, PieChart, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

const AgencyAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 font-poppins animate-in fade-in duration-500">
      <div>
        <h1 className="text-[20px] font-bold text-black">Performance Analytics</h1>
        <p className="text-[12px] text-black/60 mt-0.5">Track how your properties are performing and monitor your growth metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Listing Views', value: '8,420', change: '+12.5%', icon: <MousePointer2 size={16} /> },
          { label: 'Avg. Inquiries', value: '4.2', change: '+5.1%', icon: <Activity size={16} /> },
          { label: 'Conversion Rate', value: '2.8%', change: '+0.2%', icon: <TrendingUp size={16} /> },
          { label: 'Total Sales', value: '12', change: '+2', icon: <Building2 size={16} /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-emerald-500">{stat.icon}</div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-bold text-black/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-[24px] font-bold text-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-xl border border-gray-200">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[15px] font-bold text-black">Inquiry Volume (Last 7 Days)</h3>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-black/40">SALE</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-200" />
                    <span className="text-[10px] font-bold text-black/40">RENTAL</span>
                 </div>
              </div>
           </div>
           <div className="flex items-end justify-between h-[200px] gap-2">
              {[65, 45, 75, 55, 90, 60, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="w-full flex flex-col gap-0.5 items-center">
                      <motion.div 
                        initial={{ height: 0 }} animate={{ height: h }}
                        className="w-full max-w-[32px] bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-t-md transition-all relative overflow-hidden"
                      >
                         <div className="absolute bottom-0 left-0 right-0 bg-emerald-600 h-1/3" />
                      </motion.div>
                   </div>
                   <span className="text-[10px] font-bold text-black/40 uppercase tracking-tighter">Day {i+1}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-xl border border-gray-200 flex flex-col">
           <h3 className="text-[15px] font-bold text-black mb-6">Property Distribution</h3>
           <div className="flex-1 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full border-[10px] border-emerald-50 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-[10px] border-emerald-600 border-t-transparent border-l-transparent" />
                 <div className="text-center">
                    <p className="text-[20px] font-bold text-black">72%</p>
                    <p className="text-[9px] font-bold text-black/40 uppercase">Sale</p>
                 </div>
              </div>
           </div>
           <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center text-[12px] font-bold text-black">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>For Sale Listings</span>
                 </div>
                 <span>18</span>
              </div>
              <div className="flex justify-between items-center text-[12px] font-bold text-black">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-200" />
                    <span>For Rent Listings</span>
                 </div>
                 <span>7</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyAnalytics;
