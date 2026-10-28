import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTickets } from '../../context/TicketContext';
import { useRole } from '../../context/RoleContext';
import { Button } from '../../components/common/Button';
import { TicketTable } from '../../components/tickets/TicketTable';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { tickets, loading, counts } = useTickets();
  const { currentUser } = useRole();
  const navigate = useNavigate();
  const { openCreateTicketModal } = useOutletContext() || {};

  // Filter tickets belonging to this customer
  const customerTickets = tickets.filter(
    (t) => t.customerId === (currentUser?.id || 'user_cust_elena')
  );

  const recentTickets = customerTickets.slice(0, 5);

  const stats = [
    {
      label: 'Total Tickets',
      value: counts.customerTotal,
      icon: Ticket,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Open / Active',
      value: counts.customerOpen,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Awaiting Your Response',
      value: counts.customerPending,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Resolved',
      value: counts.customerResolved,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enterprise Priority Support Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {currentUser?.name?.split(' ')[0] || 'Customer'}.
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {counts.customerTotal === 0 ? (
              <span>
                Your customer portal is active and initialized. <strong>All ticket counters are currently set to 0.</strong> Click below to submit your first service ticket and test real-time SLA tracking!
              </span>
            ) : (
              <span>
                Need technical assistance, billing inquiry, or architecture review? Our dedicated engineering team is on standby with guaranteed 1-hour first responses.
              </span>
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={openCreateTicketModal}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              {counts.customerTotal === 0 ? 'Create Your First Ticket' : 'Create New Ticket'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/customer/tickets')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View My Tickets ({counts.customerTotal})
            </Button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-gradient-to-br from-indigo-100/50 to-indigo-50/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Tickets
            </h2>
            <p className="text-xs text-slate-500">
              Your latest submitted support issues and conversation updates.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customer/tickets')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            See all ({customerTickets.length})
          </Button>
        </div>

        <TicketTable
          tickets={recentTickets}
          loading={loading}
          emptyTitle="No tickets yet (Zero State)"
          emptyDescription="Everything is clean and currently set to 0. Click 'Create Your First Ticket' above to submit an issue and experience the full resolution workflow."
        />
      </div>

      {/* Quick Self-Serve Knowledge Hints */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Frequently Referenced Solutions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
            <h4 className="text-xs font-semibold text-slate-800">
              Okta &amp; Azure SAML Setup
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Step-by-step metadata verification, ACS URL configuration, and certificate thumbprints.
            </p>
            <span className="text-[10px] text-indigo-600 font-semibold mt-2 inline-flex items-center gap-1">
              Read guide <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
            <h4 className="text-xs font-semibold text-slate-800">
              Webhook Verification &amp; Retries
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Validating HMAC-SHA256 signatures, handling timeouts, and replay queue configurations.
            </p>
            <span className="text-[10px] text-indigo-600 font-semibold mt-2 inline-flex items-center gap-1">
              Read guide <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
            <h4 className="text-xs font-semibold text-slate-800">
              Enterprise Seat Licensing
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Reconciling active vs pending invitations, SCIM provisioning, and VAT reverse-charge rules.
            </p>
            <span className="text-[10px] text-indigo-600 font-semibold mt-2 inline-flex items-center gap-1">
              Read guide <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
