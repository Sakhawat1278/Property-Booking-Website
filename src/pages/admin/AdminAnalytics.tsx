import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Building2, MousePointer2, 
  Globe, BarChart3, PieChart, Activity, Loader2
} from 'lucide-react';


const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    activeListings: 0,
    totalRevenue: 0,
    inquiryRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const { count: uCount } = await 
      const { count: pCount } = await 
      const { data: bData } = await 
      
      const revenue = bData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;
      const viewings = bData?.filter(b => b.type === 'VIEWING').length || 0;
      
      setData({
        totalUsers: uCount || 0,
        activeListings: pCount || 0,
        totalRevenue: revenue,
        inquiryRate: bData?.length ? Math.round((viewings / bData.length) * 100) : 0
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-poppins text-black animate-in fade-in duration-500">
      <div>
        <h1 className="text-[20px] font-bold text-black uppercase tracking-tight">System Analytics</h1>
        <p className="text-[12px] text-black font-medium opacity-60 mt-0.5">Real-time performance indicators and platform growth metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Registered Users', value: data.totalUsers.toLocaleString(), change: 'Total Profiles', icon: <Users size={16} /> },
          { label: 'Active Listings', value: data.activeListings.toLocaleString(), change: 'For Sale/Rent', icon: <Building2 size={16} /> },
          { label: 'Total Volume', value: `$${data.totalRevenue.toLocaleString()}`, change: 'Gross Transacted', icon: <TrendingUp size={16} /> },
          { label: 'Inquiry Rate', value: `${data.inquiryRate}%`, change: 'Conversion to Viewing', icon: <Activity size={16} /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-black">{stat.icon}</div>
              <span className="text-[10px] font-bold text-black bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">Live</span>
            </div>
            <p className="text-[11px] font-bold text-black opacity-40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-[28px] font-bold text-black">{stat.value}</h3>
            <p className="text-[10px] font-bold text-black opacity-60 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-bold text-black uppercase tracking-tight">Growth Trajectory</h3>
            <BarChart3 size={18} className="text-black" />
          </div>
          <div className="h-[200px] flex items-end justify-between gap-2">
             {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
               <div key={i} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg relative group overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-black transition-all group-hover:bg-indigo-600"
                  />
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
               <span key={d} className="text-[10px] font-bold text-black opacity-40 uppercase">{d}</span>
             ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-bold text-black uppercase tracking-tight">Inventory Distribution</h3>
            <PieChart size={18} className="text-black" />
          </div>
          <div className="flex items-center justify-center h-[200px]">
             <div className="relative w-40 h-40 rounded-full border-[10px] border-gray-100 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[10px] border-black border-t-transparent border-l-transparent" style={{ transform: 'rotate(45deg)' }} />
                <div className="text-center">
                   <p className="text-[20px] font-bold text-black">Live</p>
                   <p className="text-[9px] text-black font-bold uppercase opacity-40">Database</p>
                </div>
             </div>
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex justify-between items-center text-[12px] font-bold text-black">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-black" />
                   <span>Real Estate Listings</span>
                </div>
                <span>{data.activeListings}</span>
             </div>
             <div className="flex justify-between items-center text-[12px] font-bold text-black opacity-40">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-gray-300" />
                   <span>Other Assets</span>
                </div>
                <span>0</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
