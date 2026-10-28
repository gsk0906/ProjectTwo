import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge, SlaBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { EmptyState } from '../common/EmptyState';
import { TableSkeleton } from '../common/Skeleton';
import { useRole } from '../../context/RoleContext';
import { MessageSquare, Paperclip, UserX } from 'lucide-react';

export const TicketTable = ({
  tickets = [],
  loading = false,
  selectedTicketIds = [],
  onToggleSelectTicket,
  onToggleSelectAll,
  showSelect = false,
  emptyTitle = 'No tickets found',
  emptyDescription = 'Try adjusting your search criteria or filter presets.',
}) => {
  const navigate = useNavigate();
  const { role } = useRole();

  const handleRowClick = (ticketId) => {
    if (role === 'customer') {
      navigate(`/customer/tickets/${ticketId}`);
    } else if (role === 'agent') {
      navigate(`/agent/ticket/${ticketId}`);
    } else {
      // admin can view in agent workspace or dedicated inspector
      navigate(`/agent/ticket/${ticketId}`);
    }
  };

  const isAllSelected =
    tickets.length > 0 && selectedTicketIds.length === tickets.length;

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  if (loading) {
    return <TableSkeleton rows={7} cols={6} />;
  }

  if (tickets.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {showSelect && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                </th>
              )}
              <th className="px-4 py-3 min-w-[90px]">Ticket ID</th>
              <th className="px-4 py-3 min-w-[260px]">Subject &amp; Details</th>
              <th className="px-4 py-3 min-w-[120px]">Status</th>
              <th className="px-4 py-3 min-w-[100px]">Priority</th>
              <th className="px-4 py-3 min-w-[150px]">Customer</th>
              <th className="px-4 py-3 min-w-[140px]">Assignee</th>
              <th className="px-4 py-3 min-w-[110px]">SLA Target</th>
              <th className="px-4 py-3 text-right min-w-[90px]">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {tickets.map((ticket) => {
              const isSelected = selectedTicketIds.includes(ticket.id);
              const hasAttachments = ticket.messages?.some(
                (m) => m.attachments && m.attachments.length > 0
              );
              const messageCount = ticket.messages?.length || 1;

              return (
                <tr
                  key={ticket.id}
                  onClick={() => handleRowClick(ticket.id)}
                  className={`group cursor-pointer transition-colors duration-100 hover:bg-slate-50/80 ${
                    isSelected ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  {showSelect && (
                    <td
                      className="px-4 py-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectTicket(ticket.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                      />
                    </td>
                  )}

                  {/* ID */}
                  <td className="px-4 py-3 font-mono font-semibold text-indigo-600 whitespace-nowrap">
                    {ticket.id}
                  </td>

                  {/* Subject & Preview */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {ticket.subject}
                        </span>
                        {hasAttachments && (
                          <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
                        )}
                        {messageCount > 1 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 font-medium">
                            <MessageSquare className="w-2.5 h-2.5" />
                            {messageCount}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {ticket.description}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={ticket.status} size="xs" />
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <PriorityBadge priority={ticket.priority} size="xs" />
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={ticket.customerAvatar}
                        name={ticket.customerName}
                        size="xs"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-medium text-slate-800">
                          {ticket.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ticket.customerCompany}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {ticket.assignedAgentName ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={ticket.assignedAgentAvatar}
                          name={ticket.assignedAgentName}
                          size="xs"
                        />
                        <span className="text-xs text-slate-700 font-medium truncate max-w-[110px]">
                          {ticket.assignedAgentName}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 italic">
                        <UserX className="w-3 h-3" />
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* SLA */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <SlaBadge status={ticket.slaStatus} deadline={ticket.slaDeadline} />
                  </td>

                  {/* Updated */}
                  <td className="px-4 py-3 text-right text-[11px] text-slate-400 whitespace-nowrap">
                    {formatRelativeTime(ticket.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
