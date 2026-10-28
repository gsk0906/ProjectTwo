import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../../context/TicketContext';
import { TicketTimeline } from '../../components/tickets/TicketTimeline';
import { TicketReplyComposer } from '../../components/tickets/TicketReplyComposer';
import { TicketMetaSidebar } from '../../components/tickets/TicketMetaSidebar';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export const CustomerTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, addReply } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Ticket not found</h2>
        <p className="text-xs text-slate-500">
          The requested ticket ID does not exist or has been archived.
        </p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/customer/tickets')}>
          Back to Tickets
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

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/customer/tickets')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Tickets
        </Button>

        <div className="flex items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Main Grid: Thread on Left, Meta on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Title, Thread, Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-bold">
              <span>{ticket.id}</span>
              <span className="text-slate-300">•</span>
              <CategoryBadge categoryId={ticket.category} size="xs" />
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {ticket.subject}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 border-t border-slate-100">
              <span>
                Created by {ticket.customerName} on{' '}
                {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Chronological Conversation Timeline */}
          <TicketTimeline
            messages={ticket.messages || []}
            timeline={ticket.timeline || []}
          />

          {/* Reply Composer */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Post a Response
            </h3>
            <TicketReplyComposer
              onSendReply={handleSendReply}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Right 1 Col: Meta & Customer 360 */}
        <div className="lg:col-span-1">
          <TicketMetaSidebar ticket={ticket} />
        </div>
      </div>
    </div>
  );
};
