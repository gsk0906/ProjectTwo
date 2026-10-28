import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/FormControls';
import {
  Users,
  UserPlus,
  Star,
  Clock,
  Activity,
} from 'lucide-react';

export const AdminTeamManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // New member form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('agent');
  const [title, setTitle] = useState('Support Engineer');
  const [department, setDepartment] = useState('Technical Support');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await userService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus =
      user.status === 'online' ? 'busy' : user.status === 'busy' ? 'offline' : 'online';
    await userService.updateUser(user.id, { status: nextStatus });
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    toast.info('Status Updated', `${user.name} is now marked ${nextStatus.toUpperCase()}`);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      setIsSubmitting(true);
      const newUser = await userService.createUser({
        name: name.trim(),
        email: email.trim(),
        role,
        title,
        department,
      });

      setUsers((prev) => [...prev, newUser]);
      toast.success('Team Member Added', `${newUser.name} added as ${newUser.title}.`);
      setName('');
      setEmail('');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to add member', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const agents = users.filter((u) => u.role === 'agent' || u.role === 'admin');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Team &amp; Workload Capacity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage support staff, shifts, ticket allocation capacity, and individual performance.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Add Team Member
        </Button>
      </div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Specialists
            </span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 font-extrabold text-2xl text-slate-900">
            {agents.length} On Roster
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Active Load
            </span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 font-extrabold text-2xl text-slate-900">
            5.8 / Agent
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Response Time
            </span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-extrabold text-2xl text-slate-900">
            13.5 min
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Team CSAT Average
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 font-extrabold text-2xl text-slate-900">
            4.94 / 5.0
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Support Staff &amp; Roles</h3>
          <span className="text-xs text-slate-500">
            Click status pill to toggle Online / Busy / Offline
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role &amp; Department</th>
                <th className="px-4 py-3 min-w-[140px]">Workload (Active)</th>
                <th className="px-4 py-3">Resolved MTD</th>
                <th className="px-4 py-3">Avg Response</th>
                <th className="px-4 py-3">CSAT Rating</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {agents.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  {/* Member Name */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={member.avatar}
                        name={member.name}
                        status={member.status}
                        size="md"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-slate-800 block">
                      {member.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {member.department}
                    </span>
                  </td>

                  {/* Workload Progress Bar */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-800">
                          {member.activeTicketsCount || 5} active
                        </span>
                        <span className="text-slate-400">Cap: 10</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{
                            width: `${Math.min(
                              ((member.activeTicketsCount || 5) / 10) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Resolved */}
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-800">
                    {member.resolvedTicketsCount || 120} tickets
                  </td>

                  {/* Response */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {member.avgResponseMinutes || 15} mins
                  </td>

                  {/* CSAT */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{member.csat || 4.9}</span>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(member)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        member.status === 'online'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : member.status === 'busy'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'online'
                            ? 'bg-emerald-500'
                            : member.status === 'busy'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="capitalize">{member.status || 'online'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Support Specialist"
        subtitle="Provision access to the ResolveHQ support and escalation console."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Jordan Cole"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Corporate Email Address"
            type="email"
            required
            placeholder="e.g. jordan.cole@resolvehq.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Console Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="agent">Support Specialist (Agent)</option>
              <option value="admin">Operations Lead (Admin)</option>
            </Select>

            <Input
              label="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <Select
            label="Department / Tier"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="Technical Support">Technical Support</option>
            <option value="Tier 3 Escalations">Tier 3 Escalations</option>
            <option value="Integrations & API">Integrations &amp; API</option>
            <option value="Finance & Billing">Finance &amp; Billing</option>
            <option value="AppSec & Compliance">AppSec &amp; Compliance</option>
          </Select>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Provision Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
