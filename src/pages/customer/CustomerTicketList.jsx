import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTickets } from '../../context/TicketContext';
import { useRole } from '../../context/RoleContext';
import { TicketTable } from '../../components/tickets/TicketTable';
import { Button } from '../../components/common/Button';
import { STATUSES, PRIORITIES } from '../../data/seedSettings';
import { Search, PlusCircle, RotateCcw } from 'lucide-react';

export const CustomerTicketList = () => {
  const { tickets, loading } = useTickets();
  const { currentUser } = useRole();
  const { openCreateTicketModal } = useOutletContext() || {};

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Customer tickets filter
  const customerTickets = useMemo(() => {
    return tickets.filter(
      (t) => t.customerId === (currentUser?.id || 'user_cust_elena')
    );
  }, [tickets, currentUser]);

  // Apply filters & search
  const filteredTickets = useMemo(() => {
    return customerTickets
      .filter((t) => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matches =
            t.id.toLowerCase().includes(q) ||
            t.subject.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
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
  }, [customerTickets, search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  };

  const isFiltered =
    search || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Support Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track, reply to, and manage all your organization's service requests.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateTicketModal}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Create Ticket
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, subject, keyword..."
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
                {p.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="priority">Sort: Highest Priority</option>
            <option value="updated">Sort: Recently Updated</option>
          </select>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredTickets.length}</strong> of{' '}
            {customerTickets.length} tickets
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

      {/* Ticket Table */}
      <TicketTable
        tickets={filteredTickets}
        loading={loading}
        emptyTitle="No tickets found matching your filter"
        emptyDescription="Try clearing your search query or setting the status/priority filters back to 'All'."
      />
    </div>
  );
};
