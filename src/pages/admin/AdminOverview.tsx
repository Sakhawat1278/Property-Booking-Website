import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, DollarSign, MessageSquare, 
  ArrowRight, MoreHorizontal, Calendar, TrendingUp, Search, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    sale: 0,
    rent: 0,
    verified: 0,
    bookings: 0
  });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Realtime subscription for live dashboard updates
    const channel = supabase
      .channel('admin-dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        fetchDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all properties for basic stats
      const { data: allProps, error: propsError } = await supabase
        .from('properties')
        .select('status, isVerified');
      
      if (propsError) throw propsError;

      // Fetch bookings count
      const { count: bookingsCount, error: bError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      const total = allProps?.length || 0;
      const sale = allProps?.filter(p => p.status === 'FOR_SALE').length || 0;
      const rent = allProps?.filter(p => p.status === 'FOR_RENT').length || 0;
      const verified = allProps?.filter(p => p.isVerified).length || 0;

      setStats({ total, sale, rent, verified, bookings: bookingsCount || 0 });

      // Fetch 5 most recent
      const { data: recent, error: recentError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentError) throw recentError;
      setRecentProperties(recent || []);

    } catch (err: any) {
      console.error('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    { 
      label: 'Total Properties', 
      value: stats.total.toString(), 
      icon: <Building2 size={16} />, 
      change: `${stats.verified} verified listings`
    },
    { 
      label: 'For Sale', 
      value: stats.sale.toString(), 
      icon: <DollarSign size={16} />, 
      change: 'Ownership opportunities'
    },
    { 
      label: 'For Rent', 
      value: stats.rent.toString(), 
      icon: <Calendar size={16} />, 
      change: 'Available for lease'
    },
    { 
      label: 'New Inquiries', 
      value: stats.bookings.toString(), 
      icon: <MessageSquare size={16} />, 
      change: 'Active requests'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-[#1A1A1A]">{kpi.label}</span>
              <div className="text-[#1A1A1A]">{kpi.icon}</div>
            </div>
            <span className="text-[28px] font-bold text-[#1A1A1A] leading-none mb-2">{kpi.value}</span>
            <span className="text-[12px] font-medium text-gray-500 mt-auto">{kpi.change}</span>
          </motion.div>
        ))}
      </div>

      {/* Recent Properties Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-gray-500" />
            <h2 className="text-[14px] font-bold text-[#1A1A1A]">Recent Property Listings</h2>
          </div>
          <Link to="/admin/properties" className="text-[13px] text-brand font-bold flex items-center gap-1 hover:text-brand-dark transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Property</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentProperties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={p.primaryImage} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="text-[13px] font-bold text-[#1A1A1A] truncate max-w-[180px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      p.status === 'FOR_SALE' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {p.status === 'FOR_SALE' ? 'Sale' : 'Rent'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-[#1A1A1A]">${p.price?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-gray-500 font-medium">{p.city}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/properties/edit/${p.id}`} className="text-gray-400 hover:text-brand transition-colors inline-block">
                      <MoreHorizontal size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
