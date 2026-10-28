import React, { useState, useMemo } from 'react';
import { useTickets } from '../../context/TicketContext';
import { useRole } from '../../context/RoleContext';
import { TicketTable } from '../../components/tickets/TicketTable';
import { Button } from '../../components/common/Button';
import { STATUSES, PRIORITIES } from '../../data/seedSettings';
import { SEED_USERS } from '../../data/seedUsers';
import {
  Search,
  RotateCcw,
  UserCheck,
  X,
} from 'lucide-react';

export const AgentTicketQueue = () => {
  const { tickets, loading, bulkUpdate } = useTickets();
  const { currentUser } = useRole();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const agents = SEED_USERS.filter((u) => u.role === 'agent' || u.role === 'admin');

  // Filter & sort logic
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

        if (assigneeFilter === 'unassigned') {
          if (t.assignedAgentId) return false;
        } else if (assigneeFilter === 'me') {
          if (t.assignedAgentId !== currentUser?.id) return false;
        } else if (assigneeFilter !== 'all') {
          if (t.assignedAgentId !== assigneeFilter) return false;
        }

        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matches =
            t.id.toLowerCase().includes(q) ||
            t.subject.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.customerName.toLowerCase().includes(q) ||
            t.customerCompany.toLowerCase().includes(q) ||
            (t.referenceId && t.referenceId.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'priority') {
          const order = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (order[b.priority] || 0) - (order[a.priority] || 0);
        }
        if (sortBy === 'updated') {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter, assigneeFilter, sortBy, currentUser]);

  const handleToggleSelectTicket = (id) => {
    setSelectedTicketIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedTicketIds.length === filteredTickets.length) {
      setSelectedTicketIds([]);
    } else {
      setSelectedTicketIds(filteredTickets.map((t) => t.id));
    }
  };

  const handleBulkAssignToMe = async () => {
    setIsBulkUpdating(true);
    await bulkUpdate({
      ticketIds: selectedTicketIds,
      assignedAgentId: currentUser?.id,
    });
    setSelectedTicketIds([]);
    setIsBulkUpdating(false);
  };

  const handleBulkStatusChange = async (newStatus) => {
    setIsBulkUpdating(true);
    await bulkUpdate({
      ticketIds: selectedTicketIds,
      status: newStatus,
    });
    setSelectedTicketIds([]);
    setIsBulkUpdating(false);
  };

  const handleBulkPriorityChange = async (newPriority) => {
    setIsBulkUpdating(true);
    await bulkUpdate({
      ticketIds: selectedTicketIds,
      priority: newPriority,
    });
    setSelectedTicketIds([]);
    setIsBulkUpdating(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setAssigneeFilter('all');
    setSortBy('newest');
  };

  const isFiltered =
    search ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all' ||
    assigneeFilter !== 'all';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Support Ticket Queue
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Triage, prioritize, and manage the live queue across all enterprise accounts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, company, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} Priority
              </option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Assignees</option>
            <option value="me">Assigned to Me</option>
            <option value="unassigned">Unassigned Only</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="priority">Sort: Highest Priority</option>
            <option value="updated">Sort: Recently Updated</option>
          </select>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredTickets.length}</strong> of{' '}
            {tickets.length} total tickets
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Floating Sticky Bulk Actions Bar */}
      {selectedTicketIds.length > 0 && (
        <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 text-white rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
              {selectedTicketIds.length}
            </span>
            <span className="text-xs font-semibold">tickets selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              onClick={handleBulkAssignToMe}
              isLoading={isBulkUpdating}
              leftIcon={<UserCheck className="w-3.5 h-3.5 text-indigo-600" />}
              className="!bg-slate-800 !text-white !border-slate-700 hover:!bg-slate-700"
            >
              Assign to Me
            </Button>

            <select
              onChange={(e) => {
                if (e.target.value) handleBulkStatusChange(e.target.value);
              }}
              defaultValue=""
              className="text-xs py-1 px-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none"
            >
              <option value="" disabled>
                Change Status...
              </option>
              <option value="in_progress">Set In Progress</option>
              <option value="pending">Set Pending Customer</option>
              <option value="resolved">Set Resolved</option>
            </select>

            <select
              onChange={(e) => {
                if (e.target.value) handleBulkPriorityChange(e.target.value);
              }}
              defaultValue=""
              className="text-xs py-1 px-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none"
            >
              <option value="" disabled>
                Set Priority...
              </option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              type="button"
              onClick={() => setSelectedTicketIds([])}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              title="Deselect all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Ticket Table */}
      <TicketTable
        tickets={filteredTickets}
        loading={loading}
        showSelect={true}
        selectedTicketIds={selectedTicketIds}
        onToggleSelectTicket={handleToggleSelectTicket}
        onToggleSelectAll={handleToggleSelectAll}
        emptyTitle="No tickets match this filter"
        emptyDescription="Try clearing filters or search terms."
      />
    </div>
  );
};
