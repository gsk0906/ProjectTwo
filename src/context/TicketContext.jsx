import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ticketService } from '../services/ticketService';
import { useRole } from './RoleContext';
import { useToast } from './ToastContext';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const { currentUser } = useRole();
  const { toast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Derived stats and counters
  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    resolved: tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length,
    unassigned: tickets.filter((t) => !t.assignedAgentId).length,
    assignedToMe: tickets.filter((t) => t.assignedAgentId === currentUser?.id).length,
    overdue: tickets.filter((t) => t.slaStatus === 'breached').length,
    atRisk: tickets.filter((t) => t.slaStatus === 'warning').length,
    customerOpen: tickets.filter((t) => t.customerId === currentUser?.id && t.status !== 'resolved' && t.status !== 'closed').length,
    customerPending: tickets.filter((t) => t.customerId === currentUser?.id && t.status === 'pending').length,
    customerResolved: tickets.filter((t) => t.customerId === currentUser?.id && (t.status === 'resolved' || t.status === 'closed')).length,
    customerTotal: tickets.filter((t) => t.customerId === currentUser?.id).length,
  };

  const createTicket = async (ticketData) => {
    try {
      const created = await ticketService.createTicket(ticketData);
      setTickets((prev) => [created, ...prev]);
      toast.success('Ticket Submitted Successfully', `Ticket ${created.id} is now registered in our queue.`);
      return created;
    } catch (err) {
      toast.error('Failed to create ticket', err.message);
      throw err;
    }
  };

  const addReply = async (ticketId, replyData) => {
    try {
      const updated = await ticketService.addReply(ticketId, replyData);
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      if (replyData.isInternalNote) {
        toast.info('Internal Note Added', 'Only ResolveHQ team members can view this note.');
      } else {
        toast.success('Reply Sent', 'Your response has been published to the ticket thread.');
      }
      return updated;
    } catch (err) {
      toast.error('Failed to send reply', err.message);
      throw err;
    }
  };

  const updateStatus = async (ticketId, newStatus) => {
    try {
      const updated = await ticketService.updateTicketStatus(ticketId, newStatus, currentUser?.name || 'User');
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      toast.success('Status Updated', `Ticket marked as ${newStatus.toUpperCase()}`);
      return updated;
    } catch (err) {
      toast.error('Failed to update status', err.message);
      throw err;
    }
  };

  const updatePriority = async (ticketId, newPriority) => {
    try {
      const updated = await ticketService.updateTicketPriority(ticketId, newPriority, currentUser?.name || 'User');
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      toast.info('Priority Changed', `Ticket priority set to ${newPriority.toUpperCase()}`);
      return updated;
    } catch (err) {
      toast.error('Failed to update priority', err.message);
      throw err;
    }
  };

  const assignTicket = async (ticketId, agentId) => {
    try {
      const updated = await ticketService.assignTicket(ticketId, agentId, currentUser?.name || 'User');
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      const assigneeName = updated.assignedAgentName || 'Unassigned';
      toast.info('Assignment Updated', `Ticket ${ticketId} is now assigned to ${assigneeName}`);
      return updated;
    } catch (err) {
      toast.error('Failed to reassign ticket', err.message);
      throw err;
    }
  };

  const bulkUpdate = async (params) => {
    try {
      const updatedList = await ticketService.bulkUpdate({
        ...params,
        authorName: currentUser?.name || 'Admin',
      });
      setTickets(updatedList);
      toast.success('Bulk Actions Applied', `Updated ${params.ticketIds.length} tickets successfully.`);
      return updatedList;
    } catch (err) {
      toast.error('Bulk update failed', err.message);
      throw err;
    }
  };

  const resetAllData = async () => {
    try {
      const defaultTickets = await ticketService.resetData();
      setTickets(defaultTickets);
      toast.info('Data Reset', 'Demo database restored to default seed state.');
    } catch (err) {
      toast.error('Reset failed', err.message);
    }
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        loading,
        error,
        counts,
        refreshTickets: fetchTickets,
        createTicket,
        addReply,
        updateStatus,
        updatePriority,
        assignTicket,
        bulkUpdate,
        resetAllData,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
