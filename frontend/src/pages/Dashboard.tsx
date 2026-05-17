import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axiosInstance';
import { Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, new: 0, qualified: 0, lost: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app we'd have a /stats endpoint, but here we can just fetch all leads
        // or aggregate. For this assignment, we will do a fast aggregation if possible or just fetch all.
        const res = await api.get('/leads?limit=1000');
        const leads = res.data.data;
        
        setStats({
          total: leads.length,
          new: leads.filter((l: any) => l.status === 'New').length,
          qualified: leads.filter((l: any) => l.status === 'Qualified').length,
          lost: leads.filter((l: any) => l.status === 'Lost').length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}! 👋</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Here's what's happening with your leads today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={stats.total} icon={<Users className="text-blue-500" />} bg="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard title="New Leads" value={stats.new} icon={<TrendingUp className="text-green-500" />} bg="bg-green-50 dark:bg-green-900/20" />
        <StatCard title="Qualified" value={stats.qualified} icon={<CheckCircle className="text-purple-500" />} bg="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard title="Lost" value={stats.lost} icon={<XCircle className="text-red-500" />} bg="bg-red-50 dark:bg-red-900/20" />
      </div>
      
      {/* Recent leads could be listed here in a real app */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
           <a href="/leads/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Add New Lead</a>
           <a href="/leads" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">View All Leads</a>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4">
    <div className={`p-4 rounded-full ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
    </div>
  </div>
);
