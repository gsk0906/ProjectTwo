import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../../context/TicketContext';
import { useRole } from '../../context/RoleContext';
import { TicketTimeline } from '../../components/tickets/TicketTimeline';
import { TicketReplyComposer } from '../../components/tickets/TicketReplyComposer';
import { TicketMetaSidebar } from '../../components/tickets/TicketMetaSidebar';
import { StatusBadge, PriorityBadge, CategoryBadge, SlaBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ArrowLeft, UserCheck, CheckCircle2 } from 'lucide-react';

export const AgentTicketWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, addReply, assignTicket, updateStatus } = useTickets();
  const { currentUser } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Ticket not found</h2>
        <p className="text-xs text-slate-500">
          The requested ticket ID does not exist or has been archived.
        </p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/agent/queue')}>
          Back to Ticket Queue
        </Button>
      </div>
    );
  }

  const handleSendReply = async (replyData) => {
    setIsSubmitting(true);
    try {
      await addReply(ticket.id, replyData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignToMe = async () => {
    if (currentUser) {
      await assignTicket(ticket.id, currentUser.id);
    }
  };

  const handleQuickResolve = async () => {
    await updateStatus(ticket.id, 'resolved');
  };

  return (
    <div className="space-y-6">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/agent/queue')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Queue
          </Button>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {ticket.id}
            </span>
            <StatusBadge status={ticket.status} size="xs" />
            <PriorityBadge priority={ticket.priority} size="xs" />
          </div>
        </div>

        {/* Quick Agent Actions */}
        <div className="flex items-center gap-2">
          {ticket.assignedAgentId !== currentUser?.id && (
            <Button
              variant="secondary"
              size="xs"
              onClick={handleAssignToMe}
              leftIcon={<UserCheck className="w-3.5 h-3.5 text-indigo-600" />}
            >
              Assign to Me
            </Button>
          )}

          {ticket.status !== 'resolved' && (
            <Button
              variant="secondary"
              size="xs"
              onClick={handleQuickResolve}
              className="!text-emerald-700 !border-emerald-200 hover:!bg-emerald-50"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Resolve Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Workspace Thread on Left, Meta/Customer 360 on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ticket Header, Conversation Thread, Dual Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info Banner */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <CategoryBadge categoryId={ticket.category} size="xs" />
              <SlaBadge status={ticket.slaStatus} deadline={ticket.slaDeadline} />
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {ticket.subject}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-100">
              <span>
                Reported by <strong className="text-slate-700">{ticket.customerName}</strong> ({ticket.customerCompany})
              </span>
              <span>•</span>
              <span>
                {new Date(ticket.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Conversation Thread */}
          <TicketTimeline
            messages={ticket.messages || []}
            timeline={ticket.timeline || []}
          />

          {/* Dual Public/Internal Composer with Canned Responses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Compose Response or Internal Note
              </h3>
            </div>
            <TicketReplyComposer
              onSendReply={handleSendReply}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Right 1 Col: Customer 360, SLA Details & Properties */}
        <div className="lg:col-span-1">
          <TicketMetaSidebar ticket={ticket} />
        </div>
      </div>
    </div>
  );
};
