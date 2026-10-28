import React, { useState } from 'react';
import {
  Send,
  Lock,
  MessageSquare,
  Sparkles,
  Paperclip,
  Bold,
  Italic,
  Code,
  List,
  Link as LinkIcon,
  X,
  FileText,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useRole } from '../../context/RoleContext';
import { CANNED_RESPONSES } from '../../data/seedSettings';

export const TicketReplyComposer = ({ onSendReply, isSubmitting = false }) => {
  const { role, currentUser } = useRole();
  const [activeTab, setActiveTab] = useState('public'); // 'public' | 'internal'
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showMacros, setShowMacros] = useState(false);

  const isInternal = activeTab === 'internal';

  const handleApplyMacro = (macro) => {
    setContent((prev) => (prev ? `${prev}\n\n${macro.snippet}` : macro.snippet));
    setShowMacros(false);
  };

  const handleInsertFormatting = (prefix, suffix = '') => {
    setContent((prev) => `${prev}${prefix}sample${suffix}`);
  };

  const handleAddSampleLog = () => {
    if (attachments.some((a) => a.name === 'diagnostic_trace.log')) return;
    setAttachments((prev) => [
      ...prev,
      { name: 'diagnostic_trace.log', size: '24.1 KB', type: 'log' },
    ]);
  };

  const handleRemoveAttachment = (name) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    onSendReply({
      content: content.trim(),
      isInternalNote: isInternal,
      attachments,
      sender: {
        id: currentUser?.id || 'anon',
        name: currentUser?.name || 'User',
        role: currentUser?.role || role,
        avatar: currentUser?.avatar || '',
      },
    });

    setContent('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-150 overflow-hidden shadow-xs ${
        isInternal
          ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-100/60'
          : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Header Tabs: Public Reply vs Internal Note (For Agents/Admins) */}
      {(role === 'agent' || role === 'admin') && (
        <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('public')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isInternal
                  ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              Public Reply
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('internal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isInternal
                  ? 'bg-amber-100/80 text-amber-900 shadow-2xs border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              Internal Note
            </button>
          </div>

          {/* Canned Responses / Macros Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMacros(!showMacros)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Insert Macro</span>
            </button>

            {showMacros && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-dropdown border border-slate-200/90 z-40 p-2 text-xs">
                <div className="px-2.5 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-600 border-b border-slate-100">
                  Canned Macro Templates
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                  {CANNED_RESPONSES.map((macro) => (
                    <button
                      key={macro.id}
                      type="button"
                      onClick={() => handleApplyMacro(macro)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors group flex flex-col"
                    >
                      <span className="font-semibold text-slate-800 group-hover:text-indigo-600">
                        {macro.title}
                      </span>
                      <span className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {macro.snippet}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-100 text-slate-400 bg-white">
        <button
          type="button"
          onClick={() => handleInsertFormatting('**', '**')}
          className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleInsertFormatting('*', '*')}
          className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleInsertFormatting('`', '`')}
          className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleInsertFormatting('\n- ')}
          className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleInsertFormatting('[Link Text](', ')')}
          className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
          title="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
        <div className="h-4 w-px bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={handleAddSampleLog}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100"
          title="Attach sample diagnostics"
        >
          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
          <span>Attach Diagnostic Log</span>
        </button>
      </div>

      {/* Main Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isInternal
            ? 'Write an internal note for agents and managers (never visible to customer)...'
            : role === 'customer'
            ? 'Type your message or response to support engineering...'
            : 'Write a public response to the customer (email notification will be dispatched)...'
        }
        rows={4}
        className={`w-full p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-y border-none ${
          isInternal ? 'bg-transparent' : 'bg-white'
        }`}
      />

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <span
              key={att.name}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-800 border border-slate-200"
            >
              <FileText className="w-3 h-3 text-indigo-600" />
              <span className="font-mono text-[11px]">{att.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(att.name)}
                className="hover:text-rose-600 p-0.5 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-t text-xs ${
          isInternal ? 'border-amber-200/80 bg-amber-100/30' : 'border-slate-100 bg-slate-50/70'
        }`}
      >
        <span className="text-slate-600 text-[11px] hidden sm:inline">
          Pro-tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono shadow-2xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono shadow-2xs">Enter</kbd> to send
        </span>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={isInternal ? 'primary' : 'primary'}
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            isLoading={isSubmitting}
            className={isInternal ? '!bg-amber-600 hover:!bg-amber-700 text-white' : ''}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            {isInternal ? 'Add Internal Note' : 'Send Reply'}
          </Button>
        </div>
      </div>
    </div>
  );
};
