import { SEED_TICKETS } from '../data/seedTickets';
import { SEED_USERS } from '../data/seedUsers';

const STORAGE_KEY = 'resolvehq_tickets_v1';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredTickets = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TICKETS));
      return SEED_TICKETS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading tickets from storage:', e);
    return SEED_TICKETS;
  }
};

const saveTickets = (tickets) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Failed saving tickets to storage:', e);
  }
};

export const ticketService = {
  async getTickets(params = {}) {
    await delay(120);
    const {
      role,
      userId,
      status,
      priority,
      category,
      search,
      assignedTo,
      sort = 'newest',
    } = params;

    let tickets = getStoredTickets();

    // Role-specific filtering if requested
    if (role === 'customer' && userId) {
      tickets = tickets.filter((t) => t.customerId === userId);
    } else if (role === 'agent' && assignedTo === 'me' && userId) {
      tickets = tickets.filter((t) => t.assignedAgentId === userId);
    } else if (assignedTo === 'unassigned') {
      tickets = tickets.filter((t) => !t.assignedAgentId);
    } else if (assignedTo && assignedTo !== 'all' && assignedTo !== 'me') {
      tickets = tickets.filter((t) => t.assignedAgentId === assignedTo);
    }

    // Status filter
    if (status && status !== 'all') {
      tickets = tickets.filter((t) => t.status === status);
    }

    // Priority filter
    if (priority && priority !== 'all') {
      tickets = tickets.filter((t) => t.priority === priority);
    }

    // Category filter
    if (category && category !== 'all') {
      tickets = tickets.filter((t) => t.category === category);
    }

    // Text search (subject, id, description, customer name)
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      tickets = tickets.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          (t.referenceId && t.referenceId.toLowerCase().includes(q))
      );
    }

    // Sorting
    tickets.sort((a, b) => {
      if (sort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sort === 'priority') {
        const order = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      if (sort === 'updated') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      // default: newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return [...tickets];
  },

  async getTicketById(id) {
    await delay(100);
    const tickets = getStoredTickets();
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) throw new Error(`Ticket with ID ${id} not found.`);
    return { ...ticket };
  },

  async createTicket(ticketInput) {
    await delay(250);
    const tickets = getStoredTickets();
    
    // Generate next ticket ID
    const highestNum = tickets.reduce((max, t) => {
      const match = t.id.match(/RHQ-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 1042);
    const nextId = `RHQ-${highestNum + 1}`;

    const now = new Date().toISOString();
    
    // SLA calculation based on priority
    let slaHours = 8;
    if (ticketInput.priority === 'urgent') slaHours = 4;
    else if (ticketInput.priority === 'high') slaHours = 8;
    else if (ticketInput.priority === 'medium') slaHours = 24;
    else slaHours = 48;

    const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    const newTicket = {
      id: nextId,
      subject: ticketInput.subject,
      description: ticketInput.description,
      category: ticketInput.category || 'cat_technical',
      priority: ticketInput.priority || 'medium',
      status: 'open',
      customerId: ticketInput.customerId,
      customerName: ticketInput.customerName,
      customerEmail: ticketInput.customerEmail,
      customerCompany: ticketInput.customerCompany || 'Enterprise Org',
      customerAvatar: ticketInput.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assignedAgentId: null,
      assignedAgentName: null,
      assignedAgentAvatar: null,
      createdAt: now,
      updatedAt: now,
      slaDeadline,
      slaStatus: 'healthy',
      referenceId: ticketInput.referenceId || null,
      tags: ticketInput.tags || ['web-portal'],
      messages: [
        {
          id: `msg_${nextId}_1`,
          senderId: ticketInput.customerId,
          senderName: ticketInput.customerName,
          senderRole: 'customer',
          senderAvatar: ticketInput.customerAvatar,
          content: ticketInput.description,
          createdAt: now,
          isInternalNote: false,
          attachments: ticketInput.attachments || [],
        }
      ],
      timeline: [
        {
          id: `tl_${Date.now()}_1`,
          type: 'created',
          description: `Ticket created with ${ticketInput.priority.toUpperCase()} priority`,
          createdAt: now,
          author: ticketInput.customerName,
        }
      ]
    };

    tickets.unshift(newTicket);
    saveTickets(tickets);
    return newTicket;
  },

  async addReply(ticketId, { sender, content, isInternalNote = false, attachments = [] }) {
    await delay(150);
    const tickets = getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const ticket = tickets[index];
    const now = new Date().toISOString();

    const newMsg = {
      id: `msg_${ticketId}_${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      senderAvatar: sender.avatar,
      content,
      createdAt: now,
      isInternalNote: Boolean(isInternalNote),
      attachments,
    };

    ticket.messages.push(newMsg);
    ticket.updatedAt = now;

    // Auto-update ticket status when agent replies publicly or customer replies
    if (sender.role === 'agent' && !isInternalNote) {
      if (ticket.status === 'open' || ticket.status === 'in_progress') {
        ticket.status = 'pending';
        ticket.timeline.push({
          id: `tl_${Date.now()}_status`,
          type: 'status_change',
          description: `Status changed to Pending Customer following public reply`,
          createdAt: now,
          author: sender.name,
        });
      }
    } else if (sender.role === 'customer' && ticket.status === 'pending') {
      ticket.status = 'in_progress';
      ticket.timeline.push({
        id: `tl_${Date.now()}_status`,
        type: 'status_change',
        description: `Status returned to In Progress following customer response`,
        createdAt: now,
        author: sender.name,
      });
    }

    if (isInternalNote) {
      ticket.timeline.push({
        id: `tl_${Date.now()}_note`,
        type: 'note_added',
        description: `Internal investigation note added by ${sender.name}`,
        createdAt: now,
        author: sender.name,
      });
    }

    tickets[index] = ticket;
    saveTickets(tickets);
    return ticket;
  },

  async updateTicketStatus(ticketId, newStatus, authorName = 'System') {
    await delay(120);
    const tickets = getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const ticket = tickets[index];
    const oldStatus = ticket.status;
    const now = new Date().toISOString();

    ticket.status = newStatus;
    ticket.updatedAt = now;

    ticket.timeline.push({
      id: `tl_${Date.now()}_status`,
      type: 'status_change',
      description: `Status changed from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}`,
      createdAt: now,
      author: authorName,
    });

    if (newStatus === 'resolved' || newStatus === 'closed') {
      ticket.slaStatus = 'met';
    }

    tickets[index] = ticket;
    saveTickets(tickets);
    return ticket;
  },

  async updateTicketPriority(ticketId, newPriority, authorName = 'System') {
    await delay(120);
    const tickets = getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const ticket = tickets[index];
    const oldPriority = ticket.priority;
    const now = new Date().toISOString();

    ticket.priority = newPriority;
    ticket.updatedAt = now;

    ticket.timeline.push({
      id: `tl_${Date.now()}_priority`,
      type: 'priority_change',
      description: `Priority updated from ${oldPriority.toUpperCase()} to ${newPriority.toUpperCase()}`,
      createdAt: now,
      author: authorName,
    });

    tickets[index] = ticket;
    saveTickets(tickets);
    return ticket;
  },

  async assignTicket(ticketId, agentId, authorName = 'System') {
    await delay(120);
    const tickets = getStoredTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    const ticket = tickets[index];
    const now = new Date().toISOString();

    if (!agentId || agentId === 'unassigned') {
      ticket.assignedAgentId = null;
      ticket.assignedAgentName = null;
      ticket.assignedAgentAvatar = null;
      ticket.timeline.push({
        id: `tl_${Date.now()}_assign`,
        type: 'assignment',
        description: `Ticket unassigned`,
        createdAt: now,
        author: authorName,
      });
    } else {
      const agent = SEED_USERS.find((u) => u.id === agentId);
      ticket.assignedAgentId = agent ? agent.id : agentId;
      ticket.assignedAgentName = agent ? agent.name : 'Agent';
      ticket.assignedAgentAvatar = agent ? agent.avatar : null;
      ticket.timeline.push({
        id: `tl_${Date.now()}_assign`,
        type: 'assignment',
        description: `Assigned to ${ticket.assignedAgentName}`,
        createdAt: now,
        author: authorName,
      });
      // If was open and unassigned, move to in_progress
      if (ticket.status === 'open') {
        ticket.status = 'in_progress';
      }
    }

    ticket.updatedAt = now;
    tickets[index] = ticket;
    saveTickets(tickets);
    return ticket;
  },

  async bulkUpdate({ ticketIds, status, priority, assignedAgentId, authorName = 'Admin' }) {
    await delay(200);
    const tickets = getStoredTickets();
    const now = new Date().toISOString();

    const updated = tickets.map((t) => {
      if (!ticketIds.includes(t.id)) return t;

      const ticketCopy = { ...t, updatedAt: now };

      if (status) {
        ticketCopy.status = status;
        ticketCopy.timeline.push({
          id: `tl_${Date.now()}_bulk_st`,
          type: 'status_change',
          description: `Bulk update: status set to ${status}`,
          createdAt: now,
          author: authorName,
        });
      }

      if (priority) {
        ticketCopy.priority = priority;
        ticketCopy.timeline.push({
          id: `tl_${Date.now()}_bulk_pr`,
          type: 'priority_change',
          description: `Bulk update: priority set to ${priority}`,
          createdAt: now,
          author: authorName,
        });
      }

      if (assignedAgentId) {
        if (assignedAgentId === 'unassigned') {
          ticketCopy.assignedAgentId = null;
          ticketCopy.assignedAgentName = null;
          ticketCopy.assignedAgentAvatar = null;
        } else {
          const agent = SEED_USERS.find((u) => u.id === assignedAgentId);
          ticketCopy.assignedAgentId = agent ? agent.id : assignedAgentId;
          ticketCopy.assignedAgentName = agent ? agent.name : 'Agent';
          ticketCopy.assignedAgentAvatar = agent ? agent.avatar : null;
        }
        ticketCopy.timeline.push({
          id: `tl_${Date.now()}_bulk_as`,
          type: 'assignment',
          description: `Bulk update: reassigned to ${ticketCopy.assignedAgentName || 'Unassigned'}`,
          createdAt: now,
          author: authorName,
        });
      }

      return ticketCopy;
    });

    saveTickets(updated);
    return updated;
  },

  async resetData() {
    await delay(150);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TICKETS));
    return SEED_TICKETS;
  }
};
