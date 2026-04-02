import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Loader2, Trash2, CheckCircle, Clock, UserCheck, Mail } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  nouveau: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700', icon: Clock },
  contacte: { label: 'Contacte', color: 'bg-orange-100 text-orange-700', icon: Mail },
  converti: { label: 'Converti', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getLeads().then(setLeads).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (lead: any, status: string) => {
    try {
      const updated = await adminApi.updateLead(lead.id, { status });
      setLeads(prev => prev.map(l => l.id === lead.id ? updated : l));
      toast.success(`Statut mis a jour`);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (lead: any) => {
    if (!confirm(`Supprimer le lead ${lead.prenom} ${lead.nom} ?`)) return;
    try {
      await adminApi.deleteLead(lead.id);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
      toast.success('Lead supprime');
    } catch (err: any) { toast.error(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads & Demandes de demo</h1>
        <p className="text-gray-500 text-sm mt-1">{leads.length} demandes enregistrees</p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucun lead pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Poste</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => {
                const st = statusConfig[lead.status] || statusConfig.nouveau;
                const StIcon = st.icon;
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{lead.prenom} {lead.nom}</div>
                      <div className="text-xs text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.poste || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(lead.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">
                      <select value={lead.status || 'nouveau'} onChange={e => handleStatus(lead, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer outline-none ${st.color}`}>
                        <option value="nouveau">Nouveau</option>
                        <option value="contacte">Contacte</option>
                        <option value="converti">Converti</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(lead)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
