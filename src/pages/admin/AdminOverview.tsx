import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, DollarSign, MessageSquare, 
  ArrowRight, MoreHorizontal, Calendar, TrendingUp
} from 'lucide-react';

const AdminOverview: React.FC = () => {
  const kpis = [
    { 
      label: 'Total Properties', 
      value: '524', 
      icon: <Building2 size={16} />, 
      change: '23 added this month'
    },
    { 
      label: 'New Inquiries', 
      value: '31', 
      icon: <MessageSquare size={16} />, 
      change: '9 unresolved'
    },
    { 
      label: 'Active Agents', 
      value: '17', 
      icon: <Users size={16} />, 
      change: '2 new this week'
    },
    { 
      label: 'Revenue This Month', 
      value: '$12,430', 
      icon: <DollarSign size={16} />, 
      change: '8 successful transactions'
    },
  ];

  const recentProperties = [
    { name: 'Skyline Apartment 12B', location: 'Manhattan', price: '$1,250,000', status: 'Active', agent: 'Emily Johnson', created: '2025-05-12' },
    { name: 'Riverside Villa', location: 'Brooklyn', price: '$950,000', status: 'Pending', agent: 'Michael Smith', created: '2025-06-15' },
    { name: 'Central Park View', location: 'Manhattan', price: '$2,100,000', status: 'Sold', agent: 'Sophia Brown', created: '2025-07-20' },
    { name: 'Downtown Loft', location: 'SoHo', price: '$875,000', status: 'Active', agent: 'Liam Davis', created: '2025-08-25' },
  ];

  const inquiries = [
    { name: 'Recent Inquiries', status: 'New', time: '10:59AM', prop: 'Sunset Villa', msg: 'I would like to schedule a viewing this weekend.', iconColor: 'text-brand', bgColor: 'bg-brand/10' },
    { name: 'Michael Chen', status: 'Followed Up', time: '10:59AM', prop: 'City Loft', msg: 'Is the price negotiable? I am very interested.', iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { name: 'Jessica Williams', status: 'New', time: '10:59AM', prop: 'Mountain Retreat', msg: 'I would like to schedule a viewing this weekend.', iconColor: 'text-green-500', bgColor: 'bg-green-50' },
  ];

  const chartData = [
    { month: 'January', val1: 40, label: '1200' },
    { month: 'February', val1: 30, label: '1400' },
    { month: 'March', val1: 85, label: '1300', active: true },
    { month: 'April', val1: 45, label: '1600' },
    { month: 'May', val1: 55, label: '1800' },
    { month: 'June', val1: 55, label: '1900' },
    { month: 'July', val1: 55, label: '2000' },
    { month: 'August', val1: 55, label: '2000' },
  ];

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
          <button className="text-[13px] text-brand font-bold flex items-center gap-1 hover:text-brand-dark transition-colors">
            View All <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Property</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Location</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Price</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Agent</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Created</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentProperties.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-semibold text-[#1A1A1A]">{p.name}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#1A1A1A]">{p.location}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#1A1A1A]">{p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${
                      p.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-100' :
                      p.status === 'Pending' ? 'bg-gray-100 text-gray-500 border border-gray-200' :
                      'bg-blue-50 text-blue-500 border border-blue-100'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#1A1A1A]">{p.agent}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#1A1A1A]">{p.created}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded text-[#1A1A1A] transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <h2 className="text-[14px] font-bold text-[#1A1A1A]">Recent Inquiries</h2>
            </div>
            <button className="text-[13px] text-brand font-bold flex items-center gap-1 hover:text-brand-dark transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="p-6 space-y-6 flex-1">
            {inquiries.map((inq, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${inq.bgColor} ${inq.iconColor}`}>
                  <Calendar size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#1A1A1A]">{inq.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        inq.status === 'New' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">{inq.time}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#1A1A1A] mb-0.5">For: {inq.prop}</p>
                  <p className="text-[13px] text-gray-500 truncate">{inq.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-gray-500" />
              <h2 className="text-[14px] font-bold text-[#1A1A1A]">Performance Metrics</h2>
            </div>
            <button className="text-[13px] text-brand font-bold flex items-center gap-1 hover:text-brand-dark transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          
          {/* CSS Bar Chart */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Y-axis labels */}
            <div className="flex-1 relative min-h-[240px]">
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-10 z-0">
                <div className="w-full flex items-center gap-4"><span className="w-8 text-right">2000</span><div className="flex-1 h-px bg-gray-50" /></div>
                <div className="w-full flex items-center gap-4"><span className="w-8 text-right">1500</span><div className="flex-1 h-px bg-gray-50" /></div>
                <div className="w-full flex items-center gap-4"><span className="w-8 text-right">1000</span><div className="flex-1 h-px bg-gray-50" /></div>
                <div className="w-full flex items-center gap-4"><span className="w-8 text-right">500</span><div className="flex-1 h-px bg-gray-50" /></div>
                <div className="w-full flex items-center gap-4"><span className="w-8 text-right">0</span><div className="flex-1 h-px bg-gray-50" /></div>
              </div>

              {/* Bars */}
              <div className="absolute inset-0 left-12 bottom-10 flex items-end justify-between px-2 z-10">
                {chartData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center w-full group relative h-[calc(100%-8px)]">
                    {/* Tooltip / Active state highlight */}
                    {d.active && (
                      <div className="absolute -inset-x-2 -inset-y-3 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-50 rounded-2xl -z-10 pointer-events-none" />
                    )}
                    
                    <div className="w-10 rounded-t-xl transition-all duration-500 overflow-hidden relative mt-auto" style={{ height: `${d.val1}%` }}>
                       <div className={`absolute inset-0 ${d.active ? 'bg-brand' : 'bg-brand/10 group-hover:bg-brand/20'}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-12 right-0 flex items-center justify-between px-2">
                {chartData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center w-full">
                    <span className={`text-[11px] font-bold mt-2 ${d.active ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>{d.month}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
