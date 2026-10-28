import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, AlertTriangle, MessageSquare, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEED_NOTIFICATIONS } from '../../data/seedNotifications';
import { useRole } from '../../context/RoleContext';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { role } = useRole();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsOpen(false);

    // Route to appropriate view depending on role
    if (role === 'customer') {
      navigate(`/customer/tickets/${notif.ticketId}`);
    } else if (role === 'agent') {
      navigate(`/agent/ticket/${notif.ticketId}`);
    } else {
      navigate(`/admin/tickets`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'sla_breach':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'sla_warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5 stroke-[1.8]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in-50">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-dropdown border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-3 p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !notif.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {notif.ticketId} • Just now
                    </span>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
            <span className="text-[11px] text-slate-500">
              Live updates delivered via simulated WebSocket
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
