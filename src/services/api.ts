const API = '/api';

const headers = () => {
  const token = localStorage.getItem('sb_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers() });
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('sb_token');
    window.location.href = '/login';
    throw new Error('Non autorise');
  }
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur');
  return res.json();
}

async function post<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: headers(), body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur');
  return res.json();
}

async function put<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API}${path}`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur');
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${API}${path}`, { method: 'DELETE', headers: headers() });
  if (!res.ok) throw new Error((await res.json()).error || 'Erreur');
}

export const adminApi = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Identifiants incorrects');
    return res.json();
  },

  // Stats
  getStats: () => get<any>('/admin/stats'),

  // Users
  getUsers: () => get<any[]>('/admin/users'),
  banUser: (id: string) => post<any>(`/admin/users/${id}/ban`),
  unbanUser: (id: string) => post<any>(`/admin/users/${id}/unban`),
  resetPassword: (id: string) => post<any>(`/admin/users/${id}/reset-password`),

  // Organizations
  getOrganizations: () => get<any[]>('/admin/organizations'),
  updateOrganization: (id: string, data: any) => put<any>(`/admin/organizations/${id}`, data),
  deleteOrganization: (id: string) => del(`/admin/organizations/${id}`),

  // Plans
  getPlans: () => get<any[]>('/admin/plans'),
  createPlan: (data: any) => post<any>('/admin/plans', data),
  updatePlan: (id: string, data: any) => put<any>(`/admin/plans/${id}`, data),

  // Settings
  getSettings: () => get<any>('/admin/settings'),
  updateSettings: (data: any) => put<any>('/admin/settings', data),

  // Leads
  getLeads: () => get<any[]>('/admin/leads'),
  updateLead: (id: number, data: any) => put<any>(`/admin/leads/${id}`, data),
  deleteLead: (id: number) => del(`/admin/leads/${id}`),
  inviteLead: (id: number) => post<any>(`/admin/leads/${id}/invite`),
};
