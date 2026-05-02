import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Loader2, UserCheck, CreditCard, ChevronRight,
  Target, Calendar, TrendingUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    inquiries: 0,
    agents: 0,
    revenue: 0
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchDashboardData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Real Counts
      const { count: propsCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
      const { count: inquiriesCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('type', 'VIEWING');
      const { count: agentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'AGENCY');
      
      // 2. Fetch Total Revenue (Sum of confirmed bookings)
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'CONFIRMED');
      
      const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

      setStats({
        total: propsCount || 0, 
        inquiries: inquiriesCount || 0,
        agents: agentsCount || 0,
        revenue: totalRevenue
      });

      // 3. Fetch Recent Properties
      const { data: recent } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentProperties(recent || []);

      // 4. Fetch Recent Inquiries (VIEWING requests)
      const { data: inquiries } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (title)
        `)
        .eq('type', 'VIEWING')
        .order('created_at', { ascending: false })
        .limit(4);
      
      setRecentInquiries(inquiries || []);

    } catch (err: any) {
      console.error('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    { 
      label: 'Total Properties', 
      value: stats.total.toLocaleString(), 
      icon: <Building2 size={16} />, 
      change: 'Live Database Count',
    },
    { 
      label: 'New Leads', 
      value: stats.inquiries.toString(), 
      icon: <Target size={16} />, 
      change: 'Pending Viewings',
    },
    { 
      label: 'Active Agents', 
      value: stats.agents.toString(), 
      icon: <UserCheck size={16} />, 
      change: 'Verified Partners',
    },
    { 
      label: 'Gross Revenue', 
      value: `$${stats.revenue.toLocaleString()}`, 
      icon: <CreditCard size={16} />, 
      change: 'Confirmed Bookings',
    },
  ];

  if (loading && recentProperties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins text-black animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-bold text-black/40 uppercase tracking-widest">{kpi.label}</span>
              <div className="text-black">{kpi.icon}</div>
            </div>
            <h3 className="text-[28px] font-bold text-black leading-none mb-2">{kpi.value}</h3>
            <p className="text-[11px] font-bold text-black uppercase opacity-40">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-[14px] font-bold text-black uppercase tracking-tight">Recent Listings</h2>
            <Link to="/admin/properties" className="text-[11px] text-black font-bold flex items-center gap-1 hover:underline">
              Full Portfolio <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Property</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Pricing</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Partner</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                         <p className="text-[13px] font-bold text-black">{p.title}</p>
                         <p className="text-[11px] text-black font-medium opacity-50">{p.city}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-bold text-black">${p.price?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[12px] text-black font-bold">{p.ownerName || 'Nestory'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                         p.status === 'FOR_SALE' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'
                       }`}>
                         {p.status?.replace('_', ' ')}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-[14px] font-bold text-black uppercase tracking-tight">Active Leads</h2>
          </div>
          <div className="p-4 space-y-4">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-gray-200 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                      <Target size={14} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-black">{inquiry.guest_name}</p>
                      <p className="text-[10px] font-bold text-black opacity-40 uppercase">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-black bg-white border border-gray-200 px-1.5 py-0.5 rounded">NEW</span>
                </div>
                <p className="text-[11px] font-bold text-black line-clamp-1 mb-1">Interested in {inquiry.properties?.title}</p>
                <Link to="/admin/bookings" className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View full request <ArrowRight size={10} />
                </Link>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <div className="py-10 text-center text-black/20">
                <Target size={24} className="mx-auto mb-2 opacity-10" />
                <p className="text-[12px] font-bold">No active inquiries</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
