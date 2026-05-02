import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, DollarSign, MessageSquare, 
  ArrowRight, MoreHorizontal, Calendar, TrendingUp, Search, Loader2,
  UserCheck, CreditCard, MousePointer2, Clock, CheckCircle2, ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    inquiries: 0,
    agents: 0,
    revenue: 12430
  });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel('admin-dashboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchDashboardData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const { data: allProps } = await supabase.from('properties').select('id');
      const { count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
      const { count: agentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'AGENCY');

      setStats({
        total: allProps?.length || 0,
        inquiries: bookingsCount || 0,
        agents: agentsCount || 0,
        revenue: 12430 // Static for demo as requested by image
      });

      const { data: recent } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      setRecentProperties(recent || []);

      // Mock inquiries based on bookings
      const { data: bData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      setRecentInquiries(bData || []);

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
      icon: <Building2 size={18} className="text-gray-400" />, 
      change: '23 added this month',
      color: 'bg-white'
    },
    { 
      label: 'New Inquiries', 
      value: stats.inquiries.toString(), 
      icon: <MessageSquare size={18} className="text-gray-400" />, 
      change: '9 unresolved',
      color: 'bg-white'
    },
    { 
      label: 'Active Agents', 
      value: stats.agents.toString(), 
      icon: <UserCheck size={18} className="text-gray-400" />, 
      change: '2 new this week',
      color: 'bg-white'
    },
    { 
      label: 'Revenue This Month', 
      value: `$${stats.revenue.toLocaleString()}`, 
      icon: <CreditCard size={18} className="text-gray-400" />, 
      change: '8 successful transactions',
      color: 'bg-white'
    },
  ];

  if (loading && recentProperties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-gray-500">{kpi.label}</span>
              <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-brand/5 group-hover:text-brand transition-colors">
                {kpi.icon}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-[32px] font-bold text-[#1A1A1A] tracking-tight">{kpi.value}</h3>
              <p className="text-[12px] font-medium text-gray-400">{kpi.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-brand" />
            <h2 className="text-[16px] font-bold text-[#1A1A1A]">Recent Property Listings</h2>
          </div>
          <Link to="/admin/properties" className="text-[13px] text-brand font-bold flex items-center gap-1 group">
            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Property</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Agent</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Created</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentProperties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-4">
                    <span className="text-[14px] font-bold text-[#1A1A1A]">{p.title}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[13px] text-gray-500 font-medium">{p.city}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[14px] font-bold text-[#1A1A1A]">${p.price?.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      p.status === 'FOR_SALE' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {p.status === 'FOR_SALE' ? 'Active' : 'Rent'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-brand uppercase">
                        {p.ownerName?.charAt(0) || 'A'}
                      </div>
                      <span className="text-[13px] font-medium text-gray-600">{p.ownerName || 'Admin Agent'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[13px] text-gray-400 font-medium">
                      {new Date(p.created_at).toISOString().split('T')[0]}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-[#1A1A1A] transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom Grid: Inquiries & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-brand" />
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Recent Inquiries</h2>
            </div>
            <Link to="/admin/bookings" className="text-[13px] text-brand font-bold flex items-center gap-1 group">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6">
            {recentInquiries.map((iq, i) => (
              <div key={iq.id} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <Clock size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-bold text-[#1A1A1A]">New Viewing Request</span>
                    <span className="text-[11px] text-gray-400 font-medium">10:59 AM</span>
                  </div>
                  <p className="text-[13px] text-gray-500 font-medium truncate mb-2">For: {iq.property_title || 'Mountain Retreat'}</p>
                  <p className="text-[12px] text-gray-400 leading-relaxed italic">"I would like to schedule a viewing this weekend..."</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-md uppercase tracking-wider">New</span>
                  </div>
                </div>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <MessageSquare size={40} className="mx-auto mb-4 opacity-10" />
                <p className="text-[14px] font-medium">No recent inquiries found.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Performance Metrics (Chart) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-brand" />
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Performance Metrics</h2>
            </div>
            <button className="text-[13px] text-brand font-bold flex items-center gap-1 group">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative h-[300px] flex items-end justify-between gap-4 px-4 pt-8">
            {/* Simple Y-Axis */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-300 font-bold pr-4">
              <span>2000</span>
              <span>1500</span>
              <span>1000</span>
              <span>500</span>
              <span>0</span>
            </div>

            {/* Bar Chart Bars */}
            {[
              { m: 'Jan', v: 1200, h: '60%' },
              { m: 'Feb', v: 1400, h: '70%' },
              { m: 'Mar', v: 1300, h: '65%', active: true },
              { m: 'Apr', v: 1600, h: '80%' },
              { m: 'May', v: 1800, h: '90%' },
              { m: 'Jun', v: 1900, h: '95%' },
              { m: 'Jul', v: 2000, h: '100%' },
              { m: 'Aug', v: 1500, h: '75%' },
            ].map((bar) => (
              <div key={bar.m} className="flex-1 flex flex-col items-center gap-3 group relative">
                <div className="w-full relative flex items-end justify-center min-h-[200px]">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: bar.h }}
                    transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ${
                      bar.active ? 'bg-brand shadow-lg shadow-brand/30' : 'bg-brand/10 group-hover:bg-brand/20'
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${bar.v.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[11px] font-bold mb-1 ${bar.active ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>{bar.m}</span>
                  <span className="text-[10px] text-gray-300 font-bold">{bar.v}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
