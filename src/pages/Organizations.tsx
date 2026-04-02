import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Loader2, Users, FileText, Building } from 'lucide-react';
import { toast } from 'sonner';

export function OrganizationsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getOrganizations(), adminApi.getPlans()])
      .then(([o, p]) => { setOrgs(o); setPlans(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChangePlan = async (org: any, newPlanId: string) => {
    try {
      const updated = await adminApi.updateOrganization(org.id, { plan_id: newPlanId });
      setOrgs(prev => prev.map(o => o.id === org.id ? { ...o, ...updated } : o));
      toast.success(`Plan mis a jour pour ${org.name}`);
    } catch (err: any) { toast.error(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organisations</h1>
        <p className="text-gray-500 text-sm mt-1">{orgs.length} cabinets enregistres</p>
      </div>

      <div className="grid gap-4">
        {orgs.map(org => (
          <div key={org.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {org.logo_url ? (
                  <img src={org.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{org.name}</h3>
                  <p className="text-xs text-gray-500">Code : {org.join_key} | Cree le {new Date(org.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <select value={org.plan_id} onChange={e => handleChangePlan(org, e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none">
                {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({(p.price_cents / 100).toFixed(0)} EUR)</option>)}
              </select>
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{org.userCount}</span> membres
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Building className="w-4 h-4 text-purple-500" />
                <span className="font-semibold">{org.clientCount}</span> clients
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{org.reportCount}</span> rapports
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
