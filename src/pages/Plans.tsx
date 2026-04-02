import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Loader2, Plus, Save, X, ToggleLeft, ToggleRight, Sparkles, Palette, Users, Building, FileText, Infinity } from 'lucide-react';
import { toast } from 'sonner';

function LimitInput({ label, icon: Icon, value, onChange, unlimited }: {
  label: string; icon: any; value: number; onChange: (v: number) => void; unlimited: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-sm text-gray-700 w-32">{label}</span>
      {unlimited ? (
        <span className="text-sm font-semibold text-blue-600 flex items-center gap-1"><Infinity className="w-4 h-4" /> Illimite</span>
      ) : (
        <input type="number" min={0} value={value} onChange={e => onChange(Number(e.target.value))}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center font-mono outline-none focus:ring-2 focus:ring-blue-500" />
      )}
    </div>
  );
}

function FeatureToggle({ label, icon: Icon, enabled, onChange }: {
  label: string; icon: any; enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!enabled)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${enabled ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
      <Icon className="w-4 h-4" />
      {label}
      {enabled ? <ToggleRight className="w-5 h-5 ml-auto text-blue-600" /> : <ToggleLeft className="w-5 h-5 ml-auto" />}
    </button>
  );
}

interface PlanForm {
  id: string;
  name: string;
  price_cents: number;
  max_users: number; max_users_unlimited: boolean;
  max_clients: number; max_clients_unlimited: boolean;
  max_reports: number; max_reports_unlimited: boolean;
  ai_enabled: boolean;
  whitelabel_enabled: boolean;
}

const defaultForm: PlanForm = {
  id: '', name: '', price_cents: 0,
  max_users: 1, max_users_unlimited: false,
  max_clients: 1, max_clients_unlimited: false,
  max_reports: 5, max_reports_unlimited: false,
  ai_enabled: false, whitelabel_enabled: false,
};

function formToApi(f: PlanForm) {
  return {
    id: f.id, name: f.name, price_cents: f.price_cents,
    limits: {
      max_users: f.max_users_unlimited ? -1 : f.max_users,
      max_clients: f.max_clients_unlimited ? -1 : f.max_clients,
      max_reports: f.max_reports_unlimited ? -1 : f.max_reports,
      ai_enabled: f.ai_enabled,
      whitelabel_enabled: f.whitelabel_enabled,
    },
  };
}

function apiToForm(p: any): PlanForm {
  const l = p.limits || {};
  return {
    id: p.id, name: p.name, price_cents: p.price_cents,
    max_users: l.max_users === -1 ? 999 : (l.max_users || 1),
    max_users_unlimited: l.max_users === -1,
    max_clients: l.max_clients === -1 ? 999 : (l.max_clients || 1),
    max_clients_unlimited: l.max_clients === -1,
    max_reports: l.max_reports === -1 ? 999 : (l.max_reports || 5),
    max_reports_unlimited: l.max_reports === -1,
    ai_enabled: l.ai_enabled !== false,
    whitelabel_enabled: l.whitelabel_enabled === true,
  };
}

function PlanEditor({ initial, onSave, onCancel, isNew }: {
  initial: PlanForm; onSave: (f: PlanForm) => Promise<void>; onCancel: () => void; isNew: boolean;
}) {
  const [f, setF] = useState<PlanForm>(initial);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(f); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-200 p-6 space-y-5 shadow-sm">
      <h3 className="font-bold text-gray-900">{isNew ? 'Creer un plan' : `Modifier : ${f.name}`}</h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">ID (slug)</label>
          <input type="text" value={f.id} onChange={e => setF({...f, id: e.target.value})} required disabled={!isNew}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" placeholder="pro" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Nom</label>
          <input type="text" value={f.name} onChange={e => setF({...f, name: e.target.value})} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Plan Pro" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Prix / mois (centimes)</label>
          <div className="flex items-center gap-2">
            <input type="number" value={f.price_cents} onChange={e => setF({...f, price_cents: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-xs text-gray-400 whitespace-nowrap">= {(f.price_cents / 100).toFixed(2)} EUR</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Limites</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <LimitInput label="Utilisateurs" icon={Users} value={f.max_users} onChange={v => setF({...f, max_users: v})} unlimited={f.max_users_unlimited} />
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer pl-7">
              <input type="checkbox" checked={f.max_users_unlimited} onChange={e => setF({...f, max_users_unlimited: e.target.checked})} className="rounded" />
              Illimite
            </label>
          </div>
          <div className="space-y-1">
            <LimitInput label="Clients" icon={Building} value={f.max_clients} onChange={v => setF({...f, max_clients: v})} unlimited={f.max_clients_unlimited} />
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer pl-7">
              <input type="checkbox" checked={f.max_clients_unlimited} onChange={e => setF({...f, max_clients_unlimited: e.target.checked})} className="rounded" />
              Illimite
            </label>
          </div>
          <div className="space-y-1">
            <LimitInput label="Rapports" icon={FileText} value={f.max_reports} onChange={v => setF({...f, max_reports: v})} unlimited={f.max_reports_unlimited} />
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer pl-7">
              <input type="checkbox" checked={f.max_reports_unlimited} onChange={e => setF({...f, max_reports_unlimited: e.target.checked})} className="rounded" />
              Illimite
            </label>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Fonctionnalites</h4>
        <div className="grid grid-cols-2 gap-3">
          <FeatureToggle label="Agent IA" icon={Sparkles} enabled={f.ai_enabled} onChange={v => setF({...f, ai_enabled: v})} />
          <FeatureToggle label="Marque blanche" icon={Palette} enabled={f.whitelabel_enabled} onChange={v => setF({...f, whitelabel_enabled: v})} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? 'Creer' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}

export function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getPlans().then(setPlans).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (f: PlanForm) => {
    try {
      const data = await adminApi.createPlan(formToApi(f));
      setPlans(prev => [...prev, data]);
      setShowCreate(false);
      toast.success('Plan cree');
    } catch (err: any) { toast.error(err.message); }
  };

  const handleUpdate = async (f: PlanForm) => {
    try {
      const payload = formToApi(f);
      const data = await adminApi.updatePlan(f.id, { name: payload.name, price_cents: payload.price_cents, limits: payload.limits });
      setPlans(prev => prev.map(p => p.id === f.id ? data : p));
      setEditingId(null);
      toast.success('Plan mis a jour');
    } catch (err: any) { toast.error(err.message); }
  };

  const toggleActive = async (plan: any) => {
    try {
      const updated = await adminApi.updatePlan(plan.id, { is_active: !plan.is_active });
      setPlans(prev => prev.map(p => p.id === plan.id ? updated : p));
      toast.success(`${plan.name} ${updated.is_active ? 'active' : 'desactive'}`);
    } catch (err: any) { toast.error(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans & Tarifs</h1>
          <p className="text-gray-500 text-sm mt-1">{plans.length} plans configures — les changements se refletent automatiquement dans l'app et la LP</p>
        </div>
        {!showCreate && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Nouveau plan
          </button>
        )}
      </div>

      {showCreate && (
        <PlanEditor initial={defaultForm} onSave={handleCreate} onCancel={() => setShowCreate(false)} isNew />
      )}

      <div className="space-y-4">
        {plans.map(plan => editingId === plan.id ? (
          <PlanEditor key={plan.id} initial={apiToForm(plan)} onSave={handleUpdate} onCancel={() => setEditingId(null)} isNew={false} />
        ) : (
          <div key={plan.id} className={`bg-white rounded-xl border p-5 ${plan.is_active ? 'border-gray-200' : 'border-red-200 bg-red-50/30'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{plan.id}</span>
                  {!plan.is_active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Inactif</span>}
                </div>
                <p className="text-2xl font-black text-gray-900 mt-1">{(plan.price_cents / 100).toFixed(0)} EUR<span className="text-sm font-normal text-gray-400">/mois</span></p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingId(plan.id)} className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium">Modifier</button>
                <button onClick={() => toggleActive(plan)} className={`p-2 rounded-lg transition-colors ${plan.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {plan.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 flex-wrap">
              <span className="text-xs text-gray-500"><Users className="w-3.5 h-3.5 inline mr-1" />{plan.limits?.max_users === -1 ? 'Illimite' : plan.limits?.max_users || '?'} users</span>
              <span className="text-xs text-gray-500"><Building className="w-3.5 h-3.5 inline mr-1" />{plan.limits?.max_clients === -1 ? 'Illimite' : plan.limits?.max_clients || '?'} clients</span>
              <span className="text-xs text-gray-500"><FileText className="w-3.5 h-3.5 inline mr-1" />{plan.limits?.max_reports === -1 ? 'Illimite' : plan.limits?.max_reports || '?'} rapports</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${plan.limits?.ai_enabled !== false ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                <Sparkles className="w-3 h-3 inline mr-0.5" />IA {plan.limits?.ai_enabled !== false ? 'ON' : 'OFF'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${plan.limits?.whitelabel_enabled ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                <Palette className="w-3 h-3 inline mr-0.5" />Marque blanche {plan.limits?.whitelabel_enabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
