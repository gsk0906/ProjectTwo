import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import {
  Mail,
  Key,
  Bell,
  Check,
  CreditCard,
  Copy,
} from 'lucide-react';

export const CustomerProfile = () => {
  const { currentUser } = useRole();
  const { toast } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [slaAlerts, setSlaAlerts] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText('rhq_live_9a8f2190c883e18a0029b4');
    setIsCopied(true);
    toast.success('API Key Copied', 'Copied production API key to clipboard.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSavePreferences = () => {
    toast.success('Settings Saved', 'Your notification preferences have been updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Organization &amp; Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your enterprise customer identity, contact information, and support channels.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar
            src={currentUser?.avatar}
            name={currentUser?.name}
            size="xl"
            status="online"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {currentUser?.name || 'Elena Vance'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Enterprise Contact
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser?.title || 'VP of Product Infrastructure'} • {currentUser?.company || 'Acme Cloud Inc.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5" />
              <span>{currentUser?.email || 'elena.vance@acmecloud.com'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Plan Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Enterprise Service Plan</h3>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            Enterprise Platinum Tier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 block text-[11px]">Seat Allocation</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {currentUser?.seats || 25} Provisioned Seats
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">SCIM 2.0 active</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 block text-[11px]">Guaranteed First Response</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              &lt; 1 Hour Target
            </span>
            <span className="text-[10px] text-indigo-600 font-medium">24/7/365 On-call</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-slate-400 block text-[11px]">Uptime SLA Commitment</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              99.99% Availability
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Financial credits backed</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-800">Email Updates on Ticket Replies</p>
              <p className="text-slate-500 text-[11px]">
                Receive instant email notifications whenever an engineer posts a public response.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-800">Real-time In-App Notifications</p>
              <p className="text-slate-500 text-[11px]">
                Show notification badge in the header bell when ticket status changes.
              </p>
            </div>
            <input
              type="checkbox"
              checked={inAppAlerts}
              onChange={(e) => setInAppAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-800">SLA At-Risk Early Warning Alerts</p>
              <p className="text-slate-500 text-[11px]">
                Alert our escalation managers if any P0/P1 ticket approaches within 45 minutes of deadline.
              </p>
            </div>
            <input
              type="checkbox"
              checked={slaAlerts}
              onChange={(e) => setSlaAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer h-4 w-4"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Integration API Tokens */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Key className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">API Credentials &amp; Webhooks</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-500 font-medium block mb-1">
              Live API Key (REST / GraphQL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="rhq_live_9a8f2190c883e18a0029b4****************"
                className="w-full bg-slate-50 font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-700"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyKey}
                leftIcon={isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
