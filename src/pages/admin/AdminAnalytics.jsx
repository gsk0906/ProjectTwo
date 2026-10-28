import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { useTickets } from '../../context/TicketContext';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  Star,
  Inbox,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const AdminAnalytics = () => {
  const { tickets } = useTickets();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const metrics = await analyticsService.getMetrics();
      setData(metrics);
      setLoading(false);
    };
    loadAnalytics();
  }, [tickets]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Aggregating telemetry &amp; SLA metrics...</p>
        </div>
      </div>
    );
  }

  const { kpis, statusData, priorityData, categoryData, volumeTrend, csatData } = data;

  const kpiCards = [
    {
      title: 'Total Inflow Volume',
      value: kpis.totalTickets,
      subtext: '+14% vs last week',
      isPositive: true,
      icon: Inbox,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Avg First Response Time',
      value: `${kpis.avgFirstResponseMinutes}m`,
      subtext: '-4m faster than target',
      isPositive: true,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Avg Resolution Time',
      value: `${kpis.avgResolutionHours}h`,
      subtext: 'Within 4h enterprise SLA',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'SLA Adherence Rate',
      value: `${kpis.slaComplianceRate}%`,
      subtext: 'Target >= 95.0%',
      isPositive: Number(kpis.slaComplianceRate) >= 95,
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Customer CSAT Score',
      value: `${kpis.csatScore} / 5.0`,
      subtext: '94.2% positive ratings',
      isPositive: true,
      icon: Star,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Executive Analytics &amp; Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, response metrics, and SLA compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeRange === '7d'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeRange === '30d'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </span>
                <div className="flex items-center gap-1 mt-1 text-[11px]">
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span
                    className={
                      card.isPositive ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'
                    }
                  >
                    {card.subtext}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row 1: Volume Trend & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Volume Inflow vs Resolved Trend (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Ticket Volume Trend (Inflow vs Resolution)
              </h3>
              <p className="text-xs text-slate-500">
                Daily created tickets compared against closed resolutions.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
              Net Resolution Ratio: 1.05
            </span>
          </div>

          <div className="h-64 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  name="Created Tickets"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCreated)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved Tickets"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Queue Status Distribution
            </h3>
            <p className="text-xs text-slate-500">Live breakdown of active ticket states.</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Mini Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 text-[11px] truncate">
                  {s.name}: <strong className="text-slate-900">{s.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Row 2: Priority Breakdown & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Tickets by Priority Tier
            </h3>
            <p className="text-xs text-slate-500">
              Distribution across Urgent, High, Medium, and Low severity classifications.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Tickets" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Volume by Helpdesk Category
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown across technical, billing, security, and integrations.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Tickets" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: CSAT Customer Satisfaction Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Customer Satisfaction (CSAT) Ratings
            </h3>
            <p className="text-xs text-slate-500">
              Direct post-resolution ratings collected from customer reviews.
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
            <Star className="w-4 h-4 fill-amber-500" />
            <span>4.88 / 5.0</span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          {csatData.map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="font-medium text-slate-700">{item.rating}</span>
                <span className="text-slate-500">
                  {item.percentage}% ({item.count} reviews)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
