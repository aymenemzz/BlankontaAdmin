import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building, CreditCard, Mail, LogOut, Shield, Wallet } from 'lucide-react';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Utilisateurs' },
  { to: '/organizations', icon: Building, label: 'Organisations' },
  { to: '/plans', icon: CreditCard, label: 'Plans' },
  { to: '/leads', icon: Mail, label: 'Leads' },
  { to: '/stripe', icon: Wallet, label: 'Stripe' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = () => { localStorage.removeItem('sb_token'); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-white/10 gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm tracking-tight">Blankonta Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Deconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
