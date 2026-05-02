import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Target, Calendar, TrendingUp, ChevronRight, 
  Loader2, MessageSquare, Clock, CheckCircle2, User
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AgencyOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myProperties: 0,
    totalLeads: 0,
    activeBookings: 0,
    revenue: 0
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAgencyData();
    }
  }, [user]);

  const fetchAgencyData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats for this specific agency
      const { data: props } = await 
      const { data: leads } = await 
      const { data: bookings } = await 

      setStats({
        myProperties: props?.length || 0,
        totalLeads: leads?.length || 0,
        activeBookings: bookings?.length || 0,
        revenue: bookings?.reduce((acc: number, curr: any) => acc + (curr.total_amount || 0), 0) || 0
      });

      // Recent leads for this agency
      const { data: rLeads } = await supabase
        .from('bookings')
        .select('*, properties!inner(title)')
        .eq('properties.owner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(4);
      
      setRecentLeads(rLeads || []);

    } catch (err: any) {
      console.error('Agency fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && stats.myProperties === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black">Agency Dashboard</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Welcome back! Here's what's happening with your properties today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Properties', value: stats.myProperties, icon: <Building2 size={16} />, color: 'emerald' },
          { label: 'New Leads', value: stats.totalLeads, icon: <Target size={16} />, color: 'blue' },
          { label: 'Total Bookings', value: stats.activeBookings, icon: <Calendar size={16} />, color: 'orange' },
          { label: 'Total Earnings', value: `$${stats.revenue.toLocaleString()}`, icon: <TrendingUp size={16} />, color: 'indigo' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-8 h-8 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600 flex items-center justify-center`}>
                {kpi.icon}
              </div>
              <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Real-time</span>
            </div>
            <h3 className="text-[24px] font-bold text-black">{kpi.value}</h3>
            <p className="text-[12px] font-bold text-black/40 uppercase tracking-wider mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-black">Recent Inquiries & Leads</h2>
            <Link to="/agency/leads" className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-black shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-[13px] font-bold text-black truncate">{lead.guest_name}</p>
                    <span className="text-[10px] text-black/40 font-bold">{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[12px] text-black/60 truncate">Inquired about <span className="font-bold text-black">{lead.properties?.title}</span></p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                  lead.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="p-12 text-center text-black/30">
                <MessageSquare size={32} className="mx-auto mb-3 opacity-10" />
                <p className="text-[13px] font-bold">No recent leads found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-black rounded-xl p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-[18px] font-bold mb-2">Publish New Listing</h3>
                <p className="text-white/60 text-[12px] mb-6 leading-relaxed">Reach thousands of potential buyers by listing your next property today.</p>
                <Link to="/agency/properties/new">
                  <button className="h-10 px-6 bg-white text-black rounded-lg text-[13px] font-bold hover:bg-emerald-50 transition-all flex items-center gap-2">
                    Get Started <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
              <Building2 size={120} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform duration-700" />
           </div>

           <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-[14px] font-bold text-black mb-4">System Notifications</h3>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                       <p className="text-[12px] font-bold text-black">New View Scheduled</p>
                       <p className="text-[11px] text-black/60">A viewing for Sunset Villa has been confirmed for tomorrow.</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div>
                       <p className="text-[12px] font-bold text-black">Payout Processed</p>
                       <p className="text-[11px] text-black/60">Your rental earnings for March have been transferred.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

export default AgencyOverview;
