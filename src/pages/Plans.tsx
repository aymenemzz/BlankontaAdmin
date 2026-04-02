import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Loader2, Plus, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

export function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', price_cents: 0, max_users: 1, max_clients: 1 });

  useEffect(() => {
    adminApi.getPlans().then(setPlans).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await adminApi.createPlan({
        id: form.id, name: form.name, price_cents: form.price_cents,
        limits: { max_users: form.max_users, max_clients: form.max_clients }
      });
      setPlans(prev => [...prev, data]);
      setShowCreate(false);
      setForm({ id: '', name: '', price_cents: 0, max_users: 1, max_clients: 1 });
      toast.success('Plan cree');
    } catch (err: any) { toast.error(err.message); }
  };

  const toggleActive = async (plan: any) => {
    try {
      const updated = await adminApi.updatePlan(plan.id, { is_active: !plan.is_active });
      setPlans(prev => prev.map(p => p.id === plan.id ? updated : p));
      toast.success(`${plan.name} ${updated.is_active ? 'active' : 'desactive'}`);
    } catch (err: any) { toast.error(err.message); }
  };

  const handlePriceChange = async (plan: any, newPrice: number) => {
    try {
      const updated = await adminApi.updatePlan(plan.id, { price_cents: newPrice });
      setPlans(prev => prev.map(p => p.id === plan.id ? updated : p));
      toast.success('Prix mis a jour');
    } catch (err: any) { toast.error(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans & Tarifs</h1>
          <p className="text-gray-500 text-sm mt-1">{plans.length} plans configures</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreate ? 'Annuler' : 'Nouveau plan'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Creer un plan</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
              <input type="text" value={form.id} onChange={e => setForm({...form, id: e.target.value})} required placeholder="pro" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Plan Pro" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (centimes EUR)</label>
              <input type="number" value={form.price_cents} onChange={e => setForm({...form, price_cents: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max utilisateurs</label>
              <input type="number" value={form.max_users} onChange={e => setForm({...form, max_users: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              <Save className="w-4 h-4" /> Creer
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white rounded-xl border p-5 flex items-center justify-between ${plan.is_active ? 'border-gray-200' : 'border-red-200 bg-red-50/30'}`}>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
                <span className="text-xs font-mono text-gray-400">({plan.id})</span>
                {!plan.is_active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Inactif</span>}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Max {plan.limits?.max_users || '?'} users | Max {plan.limits?.max_clients || '?'} clients
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <input type="number" value={plan.price_cents} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  onBlur={e => { const v = Number(e.target.value); if (v !== plan.price_cents) handlePriceChange(plan, v); }}
                  onChange={e => setPlans(prev => prev.map(p => p.id === plan.id ? {...p, price_cents: Number(e.target.value)} : p))} />
                <p className="text-xs text-gray-400 mt-0.5">{(plan.price_cents / 100).toFixed(2)} EUR/mois</p>
              </div>
              <button onClick={() => toggleActive(plan)} className={`p-2 rounded-lg transition-colors ${plan.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={plan.is_active ? 'Desactiver' : 'Activer'}>
                {plan.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
