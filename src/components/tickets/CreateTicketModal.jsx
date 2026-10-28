import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormControls';
import { Button } from '../common/Button';
import { CATEGORIES, PRIORITIES } from '../../data/seedSettings';
import { useTickets } from '../../context/TicketContext';
import { useRole } from '../../context/RoleContext';
import { Paperclip, X, Clock } from 'lucide-react';

export const CreateTicketModal = ({ isOpen, onClose }) => {
  const { createTicket } = useTickets();
  const { currentUser, role } = useRole();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('cat_technical');
  const [priority, setPriority] = useState('medium');
  const [referenceId, setReferenceId] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const selectedPriorityObj = PRIORITIES.find((p) => p.id === priority) || PRIORITIES[2];

  const handleAddSampleAttachment = (fileName, size, type) => {
    if (attachments.some((a) => a.name === fileName)) return;
    setAttachments((prev) => [...prev, { name: fileName, size, type }]);
  };

  const handleRemoveAttachment = (name) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  const validate = () => {
    const errs = {};
    if (!subject.trim()) errs.subject = 'Subject is required';
    if (!description.trim()) errs.description = 'Please provide details describing the issue';
    else if (description.trim().length < 20)
      errs.description = 'Please describe the problem in at least 20 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const newTicket = await createTicket({
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority,
        referenceId: referenceId.trim() || undefined,
        attachments,
        customerId: currentUser?.id || 'user_cust_elena',
        customerName: currentUser?.name || 'Customer User',
        customerEmail: currentUser?.email || 'customer@company.com',
        customerCompany: currentUser?.company || 'Enterprise Org',
        customerAvatar: currentUser?.avatar || '',
      });

      // Reset form
      setSubject('');
      setDescription('');
      setCategory('cat_technical');
      setPriority('medium');
      setReferenceId('');
      setAttachments([]);
      setErrors({});
      onClose();

      // Navigate to created ticket
      if (role === 'customer') {
        navigate(`/customer/tickets/${newTicket.id}`);
      } else if (role === 'agent') {
        navigate(`/agent/ticket/${newTicket.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Support Ticket"
      subtitle="Submit an issue directly to our dedicated engineering and support desks."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <Input
          label="Issue Subject / Summary"
          required
          placeholder="e.g. SAML 2.0 SSO federation failing with HTTP 403"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          error={errors.subject}
        />

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Select
            label="Priority Level"
            required
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} (First response &lt; {p.slaFirstResponseHours}h)
              </option>
            ))}
          </Select>
        </div>

        {/* Priority SLA banner */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800">
              Guaranteed SLA Target: {selectedPriorityObj.label} Priority
            </span>
            <p className="mt-0.5 text-slate-500">
              First response within <strong className="text-slate-700">{selectedPriorityObj.slaFirstResponseHours} hour(s)</strong>, resolution target within <strong className="text-slate-700">{selectedPriorityObj.slaResolutionHours} hours</strong>.
            </p>
          </div>
        </div>

        {/* Description */}
        <Textarea
          label="Detailed Description"
          required
          rows={4}
          placeholder="Include error codes, reproduction steps, affected user emails, or request payload samples..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />

        {/* Optional Reference ID */}
        <Input
          label="Reference / Invoice / Incident ID (Optional)"
          placeholder="e.g. INV-2026-904, OKTA-AUDIT-22"
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
        />

        {/* Attachments Section */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Attachments &amp; Diagnostics (Optional)
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => handleAddSampleAttachment('system-error-trace.log', '18.4 KB', 'log')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              + Add Sample Log
            </button>
            <button
              type="button"
              onClick={() => handleAddSampleAttachment('screen-capture-error.png', '420 KB', 'image')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              + Add Screenshot
            </button>
          </div>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {attachments.map((att) => (
                <span
                  key={att.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-indigo-50 text-indigo-800 border border-indigo-200"
                >
                  <Paperclip className="w-3 h-3 text-indigo-600" />
                  <span className="font-mono text-[11px]">{att.name}</span>
                  <span className="text-[10px] text-indigo-500">({att.size})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.name)}
                    className="hover:text-rose-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Submit Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
