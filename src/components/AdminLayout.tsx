import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building, CreditCard, Mail, LogOut, Shield, Wallet, Menu, X } from 'lucide-react';

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
  const [open, setOpen] = useState(false);

  const logout = () => { localStorage.removeItem('sb_token'); navigate('/login'); };

  const sidebarContent = (
    <>
      <div className="h-14 flex items-center justify-between px-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm tracking-tight">Blankonta Admin</span>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 w-full transition-colors min-h-[44px]">
          <LogOut className="w-4 h-4" /> Deconnexion
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm text-white tracking-tight">Blankonta Admin</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-2 text-slate-400 hover:text-white rounded-lg" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />}

      {/* Sidebar — desktop: static, mobile: drawer */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-screen flex-shrink-0 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {sidebarContent}
      </aside>

      <main className="flex-1 overflow-y-auto p-4 pt-18 md:pt-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
