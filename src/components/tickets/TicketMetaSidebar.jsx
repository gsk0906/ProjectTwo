import React, { useState } from 'react';
import { Avatar } from '../common/Avatar';
import { StatusBadge, PriorityBadge, CategoryBadge, SlaBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { STATUSES, PRIORITIES } from '../../data/seedSettings';
import { SEED_USERS } from '../../data/seedUsers';
import { useRole } from '../../context/RoleContext';
import { useTickets } from '../../context/TicketContext';
import {
  Clock,
  Building,
  Mail,
  Globe,
  CheckCircle,
  Calendar,
} from 'lucide-react';

export const TicketMetaSidebar = ({ ticket }) => {
  const { role } = useRole();
  const { updateStatus, updatePriority, assignTicket } = useTickets();
  const [isUpdating, setIsUpdating] = useState(false);

  const agents = SEED_USERS.filter((u) => u.role === 'agent' || u.role === 'admin');

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await updateStatus(ticket.id, newStatus);
    setIsUpdating(false);
  };

  const handlePriorityChange = async (newPriority) => {
    setIsUpdating(true);
    await updatePriority(ticket.id, newPriority);
    setIsUpdating(false);
  };

  const handleAssigneeChange = async (agentId) => {
    setIsUpdating(true);
    await assignTicket(ticket.id, agentId);
    setIsUpdating(false);
  };

  const handleCustomerResolve = async () => {
    setIsUpdating(true);
    await updateStatus(ticket.id, 'resolved');
    setIsUpdating(false);
  };

  const isAgentOrAdmin = role === 'agent' || role === 'admin';

  return (
    <div className="space-y-5 text-xs">
      {/* SLA Status Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            SLA Countdown
          </span>
          <SlaBadge status={ticket.slaStatus} deadline={ticket.slaDeadline} />
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1.5">
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Resolution Target:</span>
            <span className="font-medium text-slate-700">
              {new Date(ticket.slaDeadline).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                ticket.slaStatus === 'breached'
                  ? 'bg-rose-500 w-full'
                  : ticket.slaStatus === 'warning'
                  ? 'bg-amber-500 w-3/4 animate-pulse'
                  : 'bg-emerald-500 w-1/3'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Ticket Properties Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-4">
        <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
          Ticket Properties
        </h4>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-slate-500 font-medium">Status</label>
          {isAgentOrAdmin ? (
            <select
              value={ticket.status}
              disabled={isUpdating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:border-indigo-600 focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          ) : (
            <div>
              <StatusBadge status={ticket.status} />
            </div>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="text-slate-500 font-medium">Priority</label>
          {isAgentOrAdmin ? (
            <select
              value={ticket.priority}
              disabled={isUpdating}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:border-indigo-600 focus:outline-none"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} Priority
                </option>
              ))}
            </select>
          ) : (
            <div>
              <PriorityBadge priority={ticket.priority} />
            </div>
          )}
        </div>

        {/* Assignee */}
        <div className="space-y-1.5">
          <label className="text-slate-500 font-medium">Assigned Specialist</label>
          {isAgentOrAdmin ? (
            <select
              value={ticket.assignedAgentId || 'unassigned'}
              disabled={isUpdating}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:border-indigo-600 focus:outline-none"
            >
              <option value="unassigned">-- Unassigned Queue --</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.title})
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <Avatar
                src={ticket.assignedAgentAvatar}
                name={ticket.assignedAgentName || 'Support Desk'}
                size="xs"
              />
              <span className="font-medium text-slate-800">
                {ticket.assignedAgentName || 'Assigned to Support Desk'}
              </span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-slate-500 font-medium">Category</label>
          <div>
            <CategoryBadge categoryId={ticket.category} />
          </div>
        </div>

        {/* Reference ID */}
        {ticket.referenceId && (
          <div className="space-y-1 border-t border-slate-100 pt-3">
            <span className="text-[11px] text-slate-400">External Reference ID</span>
            <div className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200/80">
              {ticket.referenceId}
            </div>
          </div>
        )}

        {/* Customer Resolve action */}
        {role === 'customer' && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCustomerResolve}
              isLoading={isUpdating}
              className="w-full justify-center !text-emerald-700 !border-emerald-200 hover:!bg-emerald-50"
              leftIcon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
            >
              Mark Ticket as Resolved
            </Button>
          </div>
        )}
      </div>

      {/* Customer 360 Info Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
          Customer 360
        </h4>

        <div className="flex items-center gap-3">
          <Avatar
            src={ticket.customerAvatar}
            name={ticket.customerName}
            size="md"
          />
          <div>
            <h5 className="font-semibold text-slate-900 text-xs">
              {ticket.customerName}
            </h5>
            <p className="text-[11px] text-slate-500">{ticket.customerCompany}</p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{ticket.customerEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Tier: Enterprise Platinum</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Local Time: PST (UTC-8)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Customer since Jan 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};
