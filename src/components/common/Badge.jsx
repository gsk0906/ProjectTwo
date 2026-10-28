import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2, Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const configs = {
    open: {
      label: 'Open',
      bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dot: 'bg-blue-500',
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      dot: 'bg-indigo-500 animate-pulse',
    },
    pending: {
      label: 'Pending Customer',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    closed: {
      label: 'Closed',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
    },
  };

  const config = configs[status] || configs.open;
  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full whitespace-nowrap transition-colors ${
        config.bg
      } ${isXs ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'} ${className}`}
    >
      <span className={`rounded-full shrink-0 ${config.dot} ${isXs ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority, size = 'sm', showIcon = true, className = '' }) => {
  const configs = {
    urgent: {
      label: 'Urgent',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      icon: Flame,
      iconColor: 'text-rose-600',
    },
    high: {
      label: 'High',
      bg: 'bg-orange-50 text-orange-700 border-orange-200/80',
      icon: ArrowUp,
      iconColor: 'text-orange-600',
    },
    medium: {
      label: 'Medium',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      icon: Minus,
      iconColor: 'text-amber-600',
    },
    low: {
      label: 'Low',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: ArrowDown,
      iconColor: 'text-slate-500',
    },
  };

  const config = configs[priority] || configs.medium;
  const Icon = config.icon;
  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-md whitespace-nowrap ${
        config.bg
      } ${isXs ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'} ${className}`}
    >
      {showIcon && <Icon className={`${isXs ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${config.iconColor} shrink-0`} />}
      {config.label}
    </span>
  );
};

export const CategoryBadge = ({ categoryId, size = 'sm', className = '' }) => {
  const map = {
    cat_technical: { name: 'Technical Support', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60' },
    cat_billing: { name: 'Billing & Invoicing', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    cat_security: { name: 'Account & Security', color: 'bg-purple-50 text-purple-700 border-purple-200/60' },
    cat_integrations: { name: 'Integrations & API', color: 'bg-blue-50 text-blue-700 border-blue-200/60' },
    cat_feature: { name: 'Feature Request', color: 'bg-amber-50 text-amber-700 border-amber-200/60' },
    cat_data: { name: 'Data & Privacy', color: 'bg-rose-50 text-rose-700 border-rose-200/60' },
  };

  const item = map[categoryId] || { name: 'General', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md whitespace-nowrap ${
        item.color
      } ${isXs ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'} ${className}`}
    >
      {item.name}
    </span>
  );
};

export const SlaBadge = ({ status }) => {
  if (status === 'met') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        SLA Met
      </span>
    );
  }

  if (status === 'breached') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 animate-pulse">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        SLA Breached
      </span>
    );
  }

  if (status === 'warning') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        SLA At Risk (&lt;45m)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <Clock className="w-3 h-3 text-slate-400" />
      SLA On Track
    </span>
  );
};
