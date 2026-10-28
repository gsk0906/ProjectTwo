import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  User,
  Inbox,
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useRole } from '../../context/RoleContext';
import { useTickets } from '../../context/TicketContext';
import { Button } from '../common/Button';
import { KeyRound } from 'lucide-react';

export const Sidebar = ({ onCloseMobile, onOpenCreateTicket, onOpenAuthModal }) => {
  const { role } = useRole();
  const { counts } = useTickets();

  // Navigation schema per role
  const getNavLinks = () => {
    if (role === 'customer') {
      return [
        {
          to: '/customer/dashboard',
          label: 'Overview',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          to: '/customer/tickets',
          label: 'My Tickets',
          icon: Ticket,
          badge: counts.customerOpen > 0 ? counts.customerOpen : null,
          badgeColor: 'bg-indigo-50 text-indigo-700',
        },
        {
          to: '/customer/profile',
          label: 'Account & Plan',
          icon: User,
          badge: null,
        },
      ];
    }

    if (role === 'agent') {
      return [
        {
          to: '/agent/dashboard',
          label: 'Agent Workspace',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          to: '/agent/queue',
          label: 'Ticket Queue',
          icon: Inbox,
          badge: counts.open > 0 ? counts.open : null,
          badgeColor: 'bg-indigo-50 text-indigo-700 font-bold',
        },
      ];
    }

    // Admin
    return [
      {
        to: '/admin/analytics',
        label: 'Analytics Suite',
        icon: BarChart3,
        badge: null,
      },
      {
        to: '/admin/tickets',
        label: 'All Tickets',
        icon: Ticket,
        badge: counts.total,
        badgeColor: 'bg-slate-100 text-slate-700',
      },
      {
        to: '/admin/team',
        label: 'Team & Workload',
        icon: Users,
        badge: null,
      },
      {
        to: '/admin/settings',
        label: 'SLAs & Categories',
        icon: Settings,
        badge: null,
      },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64 select-none">
      {/* Top Brand Logo */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Logo size="md" showTagline={false} />
      </div>

      {/* Role Context Pill */}
      <div className="px-4 pt-4 pb-2">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                role === 'customer'
                  ? 'bg-emerald-500'
                  : role === 'agent'
                  ? 'bg-indigo-500'
                  : 'bg-purple-500'
              }`}
            />
            <span className="text-xs font-semibold text-slate-800 capitalize">
              {role === 'customer'
                ? 'Customer Portal'
                : role === 'agent'
                ? 'Support Agent'
                : 'Manager / Admin'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-slate-200/80">
            {role}
          </span>
        </div>
      </div>

      {/* Customer Quick CTA */}
      {role === 'customer' && (
        <div className="px-4 py-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (onOpenCreateTicket) onOpenCreateTicket();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full shadow-xs justify-center font-semibold"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create Ticket
          </Button>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-600 px-3 py-1">
          Navigation
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== null && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md ${
                        link.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Quick SLA / Status Widget for Agent/Admin */}
        {(role === 'agent' || role === 'admin') && (
          <div className="pt-5 px-1">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-600 px-2 py-1">
              Queue Health
            </div>
            <div className="mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Unassigned
                </span>
                <span className="font-semibold text-slate-800">{counts.unassigned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  SLA At Risk (&lt;2h)
                </span>
                <span className="font-semibold text-amber-700">{counts.atRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  SLA Breached
                </span>
                <span className="font-semibold text-rose-700">{counts.overdue}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info / SLA Guarantee */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all"
        >
          <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
          <span>Switch User / Login</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            99.9% SLA Guaranteed
          </span>
          <span className="font-mono text-[10px] text-slate-600">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};
