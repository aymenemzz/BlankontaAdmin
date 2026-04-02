import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { StatCard } from '../components/StatCard';
import { Loader2 } from 'lucide-react';

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (!stats) return <p className="text-red-500">Erreur de chargement</p>;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la plateforme Blankonta</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Utilisateurs" value={stats.totalUsers} color="blue" />
        <StatCard label="Organisations" value={stats.totalOrgs} color="purple" />
        <StatCard label="Clients" value={stats.totalClients} color="slate" />
        <StatCard label="Rapports" value={stats.totalReports} sub={`${stats.reportsThisWeek} cette semaine`} color="green" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Leads total" value={stats.totalLeads} color="orange" />
        <StatCard label="Leads non traites" value={stats.newLeads} color="red" sub="En attente de contact" />
        <StatCard label="MRR estime" value={`${stats.mrr.toFixed(0)} EUR`} color="green" sub="Revenus mensuels recurrents" />
      </div>

      {stats.planDistribution && Object.keys(stats.planDistribution).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Repartition des plans</h2>
          <div className="space-y-3">
            {Object.entries(stats.planDistribution).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{plan}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(((count as number) / stats.totalOrgs) * 100, 100)}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">{count as number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
