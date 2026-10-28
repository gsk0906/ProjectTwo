import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../../context/TicketContext';
import { useRole } from '../../context/RoleContext';
import { TicketTable } from '../../components/tickets/TicketTable';
import { Button } from '../../components/common/Button';
import {
  Inbox,
  UserCheck,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AgentDashboard = () => {
  const { tickets, loading, counts } = useTickets();
  const { currentUser } = useRole();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('assigned_to_me'); // 'assigned_to_me' | 'unassigned' | 'at_risk' | 'overdue'

  const agentId = currentUser?.id || 'user_agent_alex';

  // Filter queue based on active tab
  const getTabTickets = () => {
    switch (activeTab) {
      case 'assigned_to_me':
        return tickets.filter((t) => t.assignedAgentId === agentId && t.status !== 'resolved' && t.status !== 'closed');
      case 'unassigned':
        return tickets.filter((t) => !t.assignedAgentId);
      case 'at_risk':
        return tickets.filter((t) => t.slaStatus === 'warning');
      case 'overdue':
        return tickets.filter((t) => t.slaStatus === 'breached');
      default:
        return tickets;
    }
  };

  const currentTabTickets = getTabTickets();

  const kpis = [
    {
      id: 'assigned_to_me',
      label: 'Assigned to Me',
      value: counts.assignedToMe,
      subtext: 'Active tickets in your queue',
      icon: UserCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'unassigned',
      label: 'Unassigned Queue',
      value: counts.unassigned,
      subtext: 'Awaiting triage & pickup',
      icon: Inbox,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      id: 'at_risk',
      label: 'SLA At Risk (< 2h)',
      value: counts.atRisk,
      subtext: 'Nearing breach window',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      id: 'overdue',
      label: 'Overdue / Breached',
      value: counts.overdue,
      subtext: 'Requires immediate escalation',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Shift Productivity Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Shift Active • On-Call
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Support Engineering Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <strong className="text-slate-800">{currentUser?.name}</strong> ({currentUser?.title}).
          </p>
        </div>

        {/* Shift Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">4.95</span>
              <span className="text-slate-500 text-[11px] block">Personal CSAT</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">14 min</span>
              <span className="text-slate-500 text-[11px] block">Avg Response</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <div className="text-xs">
              <span className="font-bold text-slate-900">142</span>
              <span className="text-slate-500 text-[11px] block">Resolved MTD</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isSelected = activeTab === kpi.id;

          return (
            <div
              key={kpi.id}
              onClick={() => setActiveTab(kpi.id)}
              className={`rounded-xl border p-5 shadow-xs transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-lg border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {kpi.value}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">{kpi.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Queue View with Tab Switcher */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('assigned_to_me')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none whitespace-nowrap ${
                activeTab === 'assigned_to_me'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Assigned to Me ({counts.assignedToMe})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unassigned')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none whitespace-nowrap ${
                activeTab === 'unassigned'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Unassigned Queue ({counts.unassigned})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('at_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none whitespace-nowrap ${
                activeTab === 'at_risk'
                  ? 'bg-white text-amber-700 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              SLA At Risk ({counts.atRisk})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none whitespace-nowrap ${
                activeTab === 'overdue'
                  ? 'bg-white text-rose-700 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Overdue ({counts.overdue})
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/agent/queue')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Full Queue Manager
          </Button>
        </div>

        {/* Table */}
        <TicketTable
          tickets={currentTabTickets}
          loading={loading}
          emptyTitle="No tickets in this view"
          emptyDescription="Great job! There are currently no tickets matching this queue filter."
        />
      </div>
    </div>
  );
};
