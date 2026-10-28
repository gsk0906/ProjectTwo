import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, RotateCcw, User, Shield, Sparkles, KeyRound } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useTickets } from '../../context/TicketContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Avatar } from '../common/Avatar';
import { DEMO_ROLES } from '../../data/seedUsers';

export const Header = ({ onOpenMobileMenu, onOpenAuthModal }) => {
  const { role, currentUser, switchRole } = useRole();
  const { resetAllData } = useTickets();
  const navigate = useNavigate();

  const handleRoleChange = (newRoleKey) => {
    switchRole(newRoleKey);
    if (newRoleKey === 'customer' || newRoleKey === 'customer_new') {
      navigate('/customer/dashboard');
    } else if (newRoleKey === 'agent') {
      navigate('/agent/dashboard');
    } else {
      navigate('/admin/analytics');
    }
  };

  const getRoleIcon = (key) => {
    switch (key) {
      case 'customer':
        return <User className="w-3.5 h-3.5" />;
      case 'customer_new':
        return <Sparkles className="w-3.5 h-3.5 text-teal-600" />;
      case 'agent':
        return <Shield className="w-3.5 h-3.5" />;
      case 'admin':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return null;
    }
  };

  const isRoleActive = (roleKey) => {
    if (roleKey === 'customer_new') {
      return role === 'customer' && (currentUser?.id === 'user_cust_new' || currentUser?.isNewUser);
    }
    if (roleKey === 'customer') {
      return role === 'customer' && currentUser?.id !== 'user_cust_new' && !currentUser?.isNewUser;
    }
    return role === roleKey;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Context breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
            {role.toUpperCase()} WORKSPACE
          </span>
          <span>•</span>
          <span className="text-slate-700 font-semibold truncate max-w-xs">
            {role === 'customer'
              ? `${currentUser?.company || 'Enterprise Customer'}`
              : role === 'agent'
              ? `${currentUser?.title || 'Support Engineer'}`
              : 'Enterprise Operations Command'}
          </span>
          {currentUser?.isNewUser && (
            <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-bold text-[10px] border border-teal-200">
              New User (All 0)
            </span>
          )}
        </div>
      </div>

      {/* Center: Demo Mode Role Switcher */}
      <div className="flex items-center">
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="hidden md:inline-flex text-[10px] font-bold tracking-wider uppercase text-slate-600 px-2 select-none">
            Demo Mode:
          </span>
          <div className="flex items-center gap-1">
            {Object.keys(DEMO_ROLES).map((roleKey) => {
              const meta = DEMO_ROLES[roleKey];
              const active = isRoleActive(roleKey);
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleChange(roleKey)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 select-none ${
                    active
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`Switch to ${meta.label} (${meta.sublabel})`}
                >
                  <span>{getRoleIcon(roleKey)}</span>
                  <span>{meta.label.split(' ')[0]}</span>
                  {roleKey === 'customer_new' && (
                    <span className="text-[10px] font-extrabold text-teal-600 bg-teal-50 px-1 rounded">
                      0
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Login Credentials, Reset Data, Notifications & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Customer Login / Credentials button */}
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all shadow-2xs"
          title="Open Customer Login Credentials"
        >
          <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Sign In / Credentials</span>
        </button>

        {/* Reset Demo Data button */}
        <button
          type="button"
          onClick={resetAllData}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
          title="Reset sample tickets to clean seed state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset</span>
        </button>

        {/* Notifications Bell */}
        <NotificationDropdown />

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Card */}
        <div
          onClick={onOpenAuthModal}
          className="flex items-center gap-2.5 pl-1 cursor-pointer hover:opacity-85 transition-opacity"
          title="Click to switch account or sign in"
        >
          <Avatar
            src={currentUser?.avatar}
            name={currentUser?.name}
            status={currentUser?.status || 'online'}
            size="sm"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser?.name}
            </span>
            <span className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
              {currentUser?.title || currentUser?.company || 'Enterprise'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
