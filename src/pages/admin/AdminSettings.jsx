import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea, Select } from '../../components/common/FormControls';
import {
  Clock,
  Tag,
  Sparkles,
  Plus,
  Save,
} from 'lucide-react';

export const AdminSettings = () => {
  const { toast } = useToast();

  const [slaPolicies, setSlaPolicies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cannedResponses, setCannedResponses] = useState([]);

  // Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Macro Modal
  const [isMacroModalOpen, setIsMacroModalOpen] = useState(false);
  const [newMacroTitle, setNewMacroTitle] = useState('');
  const [newMacroCat, setNewMacroCat] = useState('Technical');
  const [newMacroSnippet, setNewMacroSnippet] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const [sla, cats, macros] = await Promise.all([
        settingsService.getSlaPolicies(),
        settingsService.getCategories(),
        settingsService.getCannedResponses(),
      ]);
      setSlaPolicies(sla);
      setCategories(cats);
      setCannedResponses(macros);
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleUpdateSlaHours = (priorityId, field, value) => {
    const num = Math.max(1, parseInt(value, 10) || 1);
    setSlaPolicies((prev) =>
      prev.map((p) => (p.id === priorityId ? { ...p, [field]: num } : p))
    );
  };

  const handleSaveSla = async () => {
    await settingsService.updateSlaPolicies(slaPolicies);
    toast.success('SLA Policies Saved', 'Updated response and resolution time targets.');
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const created = await settingsService.addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim(),
    });
    setCategories((prev) => [...prev, created]);
    setNewCatName('');
    setNewCatDesc('');
    setIsCatModalOpen(false);
    toast.success('Category Added', `Category "${created.name}" created.`);
  };

  const handleAddMacro = async (e) => {
    e.preventDefault();
    if (!newMacroTitle.trim() || !newMacroSnippet.trim()) return;

    const created = await settingsService.addCannedResponse({
      title: newMacroTitle.trim(),
      category: newMacroCat,
      snippet: newMacroSnippet.trim(),
    });
    setCannedResponses((prev) => [...prev, created]);
    setNewMacroTitle('');
    setNewMacroSnippet('');
    setIsMacroModalOpen(false);
    toast.success('Macro Added', `Canned macro "${created.title}" ready for agents.`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System SLA &amp; Helpdesk Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tune guaranteed service level agreements, custom ticket taxonomies, and agent macros.
        </p>
      </div>

      {/* SLA Policies Section */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Service Level Agreement (SLA) Targets
            </h3>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveSla}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save SLA Changes
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500">
                <th className="px-4 py-2.5">Priority Tier</th>
                <th className="px-4 py-2.5">Description &amp; Criteria</th>
                <th className="px-4 py-2.5 min-w-[130px]">First Response (Hours)</th>
                <th className="px-4 py-2.5 min-w-[130px]">Target Resolution (Hours)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {slaPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900 capitalize whitespace-nowrap">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${policy.dotColor}`}
                    />
                    {policy.label}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-[11px] max-w-sm">
                    {policy.description}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="72"
                        value={policy.slaFirstResponseHours}
                        onChange={(e) =>
                          handleUpdateSlaHours(
                            policy.id,
                            'slaFirstResponseHours',
                            e.target.value
                          )
                        }
                        className="w-16 px-2 py-1 rounded border border-slate-200 text-slate-800 text-center font-bold focus:border-indigo-600 focus:outline-none"
                      />
                      <span className="text-slate-400 text-[11px]">hrs</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={policy.slaResolutionHours}
                        onChange={(e) =>
                          handleUpdateSlaHours(
                            policy.id,
                            'slaResolutionHours',
                            e.target.value
                          )
                        }
                        className="w-16 px-2 py-1 rounded border border-slate-200 text-slate-800 text-center font-bold focus:border-indigo-600 focus:outline-none"
                      />
                      <span className="text-slate-400 text-[11px]">hrs</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Categories Section */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Ticket Categories &amp; Taxonomy</h3>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCatModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-slate-800 block">
                  {cat.name}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {cat.description || 'General routing taxonomy'}
                </p>
              </div>
              <span className="font-mono text-[10px] text-slate-600 mt-2 block">
                ID: {cat.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Canned Macro Responses */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Saved Canned Macros</h3>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMacroModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Macro
          </Button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {cannedResponses.map((macro) => (
            <div key={macro.id} className="py-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{macro.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                  {macro.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 font-mono bg-slate-50 p-2 rounded border border-slate-200/70">
                {macro.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Create New Category"
        subtitle="Add a routing classification for incoming tickets."
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Category Name"
            required
            placeholder="e.g. Machine Learning & LLM APIs"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />

          <Textarea
            label="Description & Routing Hint"
            rows={3}
            placeholder="Describe what issues belong under this category..."
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsCatModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Macro Modal */}
      <Modal
        isOpen={isMacroModalOpen}
        onClose={() => setIsMacroModalOpen(false)}
        title="Create Canned Response Macro"
        subtitle="Reusable template response for agents with 1-click insertion."
      >
        <form onSubmit={handleAddMacro} className="space-y-4">
          <Input
            label="Macro Title"
            required
            placeholder="e.g. Webhook Timeout Resolution Steps"
            value={newMacroTitle}
            onChange={(e) => setNewMacroTitle(e.target.value)}
          />

          <Select
            label="Category"
            value={newMacroCat}
            onChange={(e) => setNewMacroCat(e.target.value)}
          >
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Security">Security</option>
            <option value="API">API</option>
            <option value="General">General</option>
          </Select>

          <Textarea
            label="Template Snippet Content"
            required
            rows={5}
            placeholder="Write the response text that agents will insert into tickets..."
            value={newMacroSnippet}
            onChange={(e) => setNewMacroSnippet(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsMacroModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Macro
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
