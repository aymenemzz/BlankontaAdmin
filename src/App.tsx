import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { UsersPage } from './pages/Users';
import { OrganizationsPage } from './pages/Organizations';
import { PlansPage } from './pages/Plans';
import { LeadsPage } from './pages/Leads';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('sb_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/organizations" element={<OrganizationsPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/leads" element={<LeadsPage />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
