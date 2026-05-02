import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Users, Building2, MousePointer2, 
  Globe, Clock, BarChart3, PieChart, Activity
} from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 font-poppins animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black">Platform Analytics</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Deep dive into traffic, property performance, and user behavior metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Page Views', value: '42,850', change: '+18%', up: true, icon: <MousePointer2 size={16} /> },
          { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', up: true, icon: <Activity size={16} /> },
          { label: 'Unique Visitors', value: '12,400', change: '-2%', up: false, icon: <Users size={16} /> },
          { label: 'Avg. Time on Site', value: '4m 12s', change: '+10%', up: true, icon: <Clock size={16} /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-black">{stat.icon}</div>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-[28px] font-bold text-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-bold text-black">Traffic Sources</h3>
            <Globe size={18} className="text-black" />
          </div>
          <div className="space-y-6">
            {[
              { source: 'Direct Traffic', value: '45%', color: 'bg-indigo-600' },
              { source: 'Organic Search', value: '30%', color: 'bg-indigo-400' },
              { source: 'Social Media', value: '15%', color: 'bg-indigo-200' },
              { source: 'Referral', value: '10%', color: 'bg-indigo-100' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[13px] font-bold text-black">
                  <span>{item.source}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: item.value }}
                    transition={{ delay: 0.2 * i, duration: 1 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-bold text-black">Property Category Popularity</h3>
            <PieChart size={18} className="text-black" />
          </div>
          <div className="flex items-center justify-center h-[240px]">
             {/* Simple visual representation of a donut chart */}
             <div className="relative w-48 h-48 rounded-full border-[12px] border-indigo-50 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[12px] border-indigo-600 border-t-transparent border-l-transparent" style={{ transform: 'rotate(45deg)' }} />
                <div className="absolute inset-0 rounded-full border-[12px] border-indigo-400 border-b-transparent border-r-transparent" style={{ transform: 'rotate(-45deg)' }} />
                <div className="text-center">
                   <p className="text-[24px] font-bold text-black">84%</p>
                   <p className="text-[10px] text-black font-bold uppercase">Occupancy</p>
                </div>
             </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-[12px] font-bold text-black">Residential</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-[12px] font-bold text-black">Commercial</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
