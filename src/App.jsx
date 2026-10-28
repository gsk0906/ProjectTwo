import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import { ToastProvider } from './context/ToastContext';
import { TicketProvider } from './context/TicketContext';
import { AppLayout } from './components/layout/AppLayout';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerTicketList } from './pages/customer/CustomerTicketList';
import { CustomerTicketDetail } from './pages/customer/CustomerTicketDetail';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Agent Pages
import { AgentDashboard } from './pages/agent/AgentDashboard';
import { AgentTicketQueue } from './pages/agent/AgentTicketQueue';
import { AgentTicketWorkspace } from './pages/agent/AgentTicketWorkspace';

// Admin Pages
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminAllTickets } from './pages/admin/AdminAllTickets';
import { AdminTeamManagement } from './pages/admin/AdminTeamManagement';
import { AdminSettings } from './pages/admin/AdminSettings';

// Helper component to redirect root "/" to the active role's dashboard
const RootRedirect = () => {
  const { role } = useRole();
  if (role === 'customer') return <Navigate to="/customer/dashboard" replace />;
  if (role === 'agent') return <Navigate to="/agent/dashboard" replace />;
  return <Navigate to="/admin/analytics" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <ToastProvider>
          <TicketProvider>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                {/* Index Redirect based on role */}
                <Route index element={<RootRedirect />} />

                {/* Customer Routes */}
                <Route path="customer/dashboard" element={<CustomerDashboard />} />
                <Route path="customer/tickets" element={<CustomerTicketList />} />
                <Route path="customer/tickets/:id" element={<CustomerTicketDetail />} />
                <Route path="customer/profile" element={<CustomerProfile />} />

                {/* Agent Routes */}
                <Route path="agent/dashboard" element={<AgentDashboard />} />
                <Route path="agent/queue" element={<AgentTicketQueue />} />
                <Route path="agent/ticket/:id" element={<AgentTicketWorkspace />} />

                {/* Admin Routes */}
                <Route path="admin/analytics" element={<AdminAnalytics />} />
                <Route path="admin/tickets" element={<AdminAllTickets />} />
                <Route path="admin/team" element={<AdminTeamManagement />} />
                <Route path="admin/settings" element={<AdminSettings />} />

                {/* Fallback */}
                <Route path="*" element={<RootRedirect />} />
              </Route>
            </Routes>
          </TicketProvider>
        </ToastProvider>
      </RoleProvider>
    </BrowserRouter>
  );
}
