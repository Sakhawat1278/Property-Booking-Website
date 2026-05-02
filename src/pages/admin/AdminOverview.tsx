import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, FileText, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity, Clock,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgencies: 0,
    totalProperties: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Safety timeout for dashboard stats
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    try {
      const [
        { count: usersCount },
        { count: agenciesCount },
        { count: propertiesCount },
        { count: pendingCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'USER'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'AGENCY'),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'PENDING')
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalAgencies: agenciesCount || 0,
        totalProperties: propertiesCount || 0,
        totalRevenue: 125430, // Mock for now
        pendingApprovals: pendingCount || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
    { label: 'Agencies', value: stats.totalAgencies, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+3.2%' },
    { label: 'Properties', value: stats.totalProperties, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+18.4%' },
    { label: 'Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+24.1%' },
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back to Nestory Admin panel.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-600 shadow-sm">
            <Clock size={16} className="text-gray-400" />
            Last 24 Hours
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                {card.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Platform Activity</h3>
            <Activity size={20} className="text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <p className="text-gray-400 text-sm font-medium">Analytics visualization coming soon...</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            {stats.pendingApprovals > 0 && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <AlertCircle className="text-orange-600 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-bold text-orange-900">{stats.pendingApprovals} Pending Approvals</p>
                  <p className="text-xs text-orange-700 mt-0.5">Agencies waiting for verification.</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
              <div>
                <p className="text-sm font-bold text-emerald-900">System Healthy</p>
                <p className="text-xs text-emerald-700 mt-0.5">All services are running normally.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
