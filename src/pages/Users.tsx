import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import { Loader2, Ban, RotateCw, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    adminApi.getUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleBan = async (user: any) => {
    if (!confirm(`Bannir ${user.email} ?`)) return;
    try {
      await adminApi.banUser(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: 'banned' } : u));
      toast.success(`${user.email} banni`);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleUnban = async (user: any) => {
    try {
      await adminApi.unbanUser(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: 'accountant' } : u));
      toast.success(`${user.email} retabli`);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleReset = async (user: any) => {
    if (!confirm(`Envoyer un email de reset a ${user.email} ?`)) return;
    try {
      const res = await adminApi.resetPassword(user.id);
      toast.success(res.message);
    } catch (err: any) { toast.error(err.message); }
  };

  const filtered = users.filter(u =>
    !filter || u.email?.toLowerCase().includes(filter.toLowerCase()) || u.full_name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} comptes enregistres</p>
        </div>
        <input type="text" placeholder="Rechercher..." value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Utilisateur</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Organisation</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{user.full_name || 'Sans nom'}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                    user.role === 'banned' ? 'bg-red-100 text-red-700' :
                    user.is_superadmin ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {user.is_superadmin && <ShieldCheck className="w-3 h-3" />}
                    {user.is_superadmin ? 'Superadmin' : user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.organizations?.name || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleReset(user)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Reset mot de passe">
                      <Mail className="w-4 h-4" />
                    </button>
                    {user.role === 'banned' ? (
                      <button onClick={() => handleUnban(user)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Retablir">
                        <RotateCw className="w-4 h-4" />
                      </button>
                    ) : !user.is_superadmin && (
                      <button onClick={() => handleBan(user)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Bannir">
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
