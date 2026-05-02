import React, { useState, useEffect } from 'react';
import { 
  Home, Users, MessageSquare, TrendingUp, 
  ArrowUpRight, Clock, ChevronRight,
  Eye, MousePointer2, Contact2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AgencyOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeListings: 0,
    totalViews: 1254,
    totalInquiries: 0,
    responseRate: '98%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAgencyStats();
    }
  }, [user]);

  const fetchAgencyStats = async () => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    try {
      const [
        { count: propertiesCount },
        { count: inquiriesCount }
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('owner_id', user?.id),
        supabase.from('bookings').select('*, properties!inner(owner_id)', { count: 'exact', head: true }).eq('properties.owner_id', user?.id).eq('type', 'VIEWING')
      ]);

      setStats(prev => ({
        ...prev,
        activeListings: propertiesCount || 0,
        totalInquiries: inquiriesCount || 0
      }));
    } catch (error) {
      console.error('Error fetching agency stats:', error);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const metrics = [
    { label: 'Active Listings', value: stats.activeListings, icon: Home, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
    { label: 'Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+5' },
    { label: 'Click Rate', value: '4.2%', icon: MousePointer2, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+0.8%' },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
         <div className="h-8 w-48 bg-gray-200 rounded-lg" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
         </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-8 font-poppins">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Agency Performance</h1>
          <p className="text-gray-500 text-sm">Real-time insights for your property portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-600 shadow-sm">
            <Clock size={16} className="text-gray-400" />
            Last 30 Days
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${metric.bg} ${metric.color} group-hover:scale-110 transition-transform`}>
                <metric.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                {metric.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{metric.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Inquiry Volume</h3>
              <TrendingUp size={20} className="text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <p className="text-gray-400 text-sm font-medium">Trend analytics coming soon...</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Recent Leads</h3>
            <button className="text-xs font-bold text-[#FF4D00] hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {stats.totalInquiries === 0 ? (
              <div className="text-center py-8">
                <Contact2 size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No recent leads found.</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">You have {stats.totalInquiries} inquiries to review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyOverview;
