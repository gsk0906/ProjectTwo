import React from 'react';
import { Avatar } from '../common/Avatar';
import { Lock, FileText, Download } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export const TicketTimeline = ({ messages = [], timeline = [] }) => {
  const { role } = useRole();

  // Combine messages and system audit logs into a unified chronological feed
  const feedItems = [
    ...messages.map((m) => ({ ...m, feedType: 'message' })),
    ...timeline.map((t) => ({ ...t, feedType: 'system' })),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {feedItems.map((item) => {
        // Render System Event Log
        if (item.feedType === 'system') {
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 text-xs text-slate-500 py-1 px-4 my-2"
            >
              <div className="h-px flex-1 bg-slate-200/70" />
              <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>{item.description}</span>
                <span className="text-slate-400">• {formatTimestamp(item.createdAt)}</span>
              </div>
              <div className="h-px flex-1 bg-slate-200/70" />
            </div>
          );
        }

        // Customer cannot see internal notes
        if (item.isInternalNote && role === 'customer') {
          return null;
        }

        const isInternal = item.isInternalNote;
        const isAgent = item.senderRole === 'agent' || item.senderRole === 'admin';

        return (
          <div
            key={item.id}
            className={`rounded-xl border transition-all duration-150 ${
              isInternal
                ? 'bg-amber-50/60 border-amber-200/90 shadow-2xs'
                : isAgent
                ? 'bg-white border-slate-200/90 shadow-xs'
                : 'bg-white border-slate-200/80 shadow-xs'
            }`}
          >
            {/* Message Header */}
            <div
              className={`flex items-center justify-between px-4 py-3 border-b text-xs ${
                isInternal
                  ? 'border-amber-200/60 bg-amber-100/40 text-amber-900'
                  : 'border-slate-100 bg-slate-50/50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={item.senderAvatar}
                  name={item.senderName}
                  size="sm"
                />
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900">
                    {item.senderName}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      isAgent
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.senderRole}
                  </span>
                  {isInternal && (
                    <span className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                      <Lock className="w-2.5 h-2.5" />
                      Internal Note (Private)
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[11px] text-slate-400">
                {formatTimestamp(item.createdAt)}
              </span>
            </div>

            {/* Message Content */}
            <div className="p-4 sm:p-5 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
              {item.content}
            </div>

            {/* Attachments Section */}
            {item.attachments && item.attachments.length > 0 && (
              <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
                {item.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-medium text-slate-800">{att.name}</span>
                    <span className="text-[10px] text-slate-400">({att.size})</span>
                    <Download className="w-3.5 h-3.5 text-slate-400 ml-1 hover:text-slate-700" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
