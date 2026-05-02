import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, ArrowUpRight, Building2, Download,
  TrendingUp, Activity, CheckCircle2
} from 'lucide-react';

interface Transaction {
  id: string;
  property_title: string;
  buyer_name: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: string;
  type: 'SALE' | 'RENTAL';
}

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 142000,
    pendingPayouts: 12500,
    completedDeals: 48
  });

  useEffect(() => {
    // Local state management for transactions
  }, []);

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">Financial Overview</h1>
          <p className="text-[13px] text-black/40 font-medium">Monitor all platform revenue and payouts</p>
        </div>
        <button className="h-10 px-6 bg-white border border-gray-200 rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-[12px] font-bold text-black/40 uppercase tracking-widest">Total Revenue</span>
          </div>
          <h3 className="text-[28px] font-bold text-black leading-none mb-1">${stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-[11px] font-bold text-emerald-600">+12.5% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <span className="text-[12px] font-bold text-black/40 uppercase tracking-widest">Pending Payouts</span>
          </div>
          <h3 className="text-[28px] font-bold text-black leading-none mb-1">${stats.pendingPayouts.toLocaleString()}</h3>
          <p className="text-[11px] font-bold text-black opacity-40">Ready for distribution</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[12px] font-bold text-black/40 uppercase tracking-widest">Completed Deals</span>
          </div>
          <h3 className="text-[28px] font-bold text-black leading-none mb-1">{stats.completedDeals}</h3>
          <p className="text-[11px] font-bold text-black opacity-40">Verified transactions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-[14px] font-bold text-black uppercase tracking-tight">Recent Activity</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-center">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-black/40 text-[13px] font-medium">
                    No recent transactions to display
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center text-black">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-black">{tx.property_title}</p>
                          <p className="text-[11px] text-black/40 font-medium">Buyer: {tx.buyer_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-bold text-black">${tx.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[11px] font-bold text-black uppercase opacity-60">{tx.type}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold uppercase tracking-widest">
                         {tx.status}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
