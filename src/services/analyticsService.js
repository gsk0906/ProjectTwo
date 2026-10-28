import { ticketService } from './ticketService';
import { CATEGORIES } from '../data/seedSettings';

export const analyticsService = {
  async getMetrics() {
    const tickets = await ticketService.getTickets();

    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'open').length;
    const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
    const pending = tickets.filter((t) => t.status === 'pending').length;
    const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

    // SLA calculations
    const breached = tickets.filter((t) => t.slaStatus === 'breached').length;
    const atRisk = tickets.filter((t) => t.slaStatus === 'warning').length;
    const slaComplianceRate = total > 0 ? (((total - breached) / total) * 100).toFixed(1) : 100;

    // Status distribution for Donut Chart
    const statusData = [
      { name: 'Open', value: open, color: '#3b82f6' },
      { name: 'In Progress', value: inProgress, color: '#6366f1' },
      { name: 'Pending Customer', value: pending, color: '#f59e0b' },
      { name: 'Resolved', value: resolved, color: '#10b981' },
    ];

    // Priority breakdown for Bar Chart
    const urgentCount = tickets.filter((t) => t.priority === 'urgent').length;
    const highCount = tickets.filter((t) => t.priority === 'high').length;
    const mediumCount = tickets.filter((t) => t.priority === 'medium').length;
    const lowCount = tickets.filter((t) => t.priority === 'low').length;

    const priorityData = [
      { name: 'Urgent', count: urgentCount, fill: '#ef4444' },
      { name: 'High', count: highCount, fill: '#f97316' },
      { name: 'Medium', count: mediumCount, fill: '#f59e0b' },
      { name: 'Low', count: lowCount, fill: '#94a3b8' },
    ];

    // Category distribution
    const categoryData = CATEGORIES.map((cat) => {
      const count = tickets.filter((t) => t.category === cat.id).length;
      return {
        name: cat.name,
        count,
        id: cat.id,
      };
    });

    // 7-day inflow vs resolved volume trend
    const volumeTrend = [
      { day: 'Mon', created: 8, resolved: 6, slaMet: 98 },
      { day: 'Tue', created: 14, resolved: 11, slaMet: 96 },
      { day: 'Wed', created: 19, resolved: 18, slaMet: 97 },
      { day: 'Thu', created: 12, resolved: 15, slaMet: 99 },
      { day: 'Fri', created: 22, resolved: 19, slaMet: 95 },
      { day: 'Sat', created: 6, resolved: 8, slaMet: 100 },
      { day: 'Sun', created: 5, resolved: 7, slaMet: 100 },
    ];

    // CSAT breakdown
    const csatData = [
      { rating: '5 Stars (Exceptional)', percentage: 76, count: 214 },
      { rating: '4 Stars (Good)', percentage: 18, count: 52 },
      { rating: '3 Stars (Acceptable)', percentage: 4, count: 12 },
      { rating: '2 Stars (Needs Work)', percentage: 1.5, count: 4 },
      { rating: '1 Star (Unsatisfied)', percentage: 0.5, count: 1 },
    ];

    return {
      kpis: {
        totalTickets: total,
        openTickets: open,
        inProgressTickets: inProgress,
        pendingTickets: pending,
        resolvedTickets: resolved,
        breachedTickets: breached,
        atRiskTickets: atRisk,
        slaComplianceRate: Number(slaComplianceRate),
        avgFirstResponseMinutes: 18,
        avgResolutionHours: 3.4,
        csatScore: 4.88,
        csatPercent: 94.2,
      },
      statusData,
      priorityData,
      categoryData,
      volumeTrend,
      csatData,
    };
  }
};
