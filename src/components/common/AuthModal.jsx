import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Input } from './FormControls';
import { Button } from './Button';
import { useRole } from '../../context/RoleContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  User,
  ArrowRight,
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithCredentials, registerCustomer } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign up fields
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleQuickLogin = async (userEmail, userPassword, isNew = false) => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithCredentials(userEmail, userPassword);
      toast.success(
        isNew ? 'Logged In as New Customer' : 'Welcome Back',
        isNew
          ? 'Signed in with a clean zero-state account (all metrics set to 0).'
          : `Signed in as ${userEmail}.`
      );
      onClose();
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const user = await loginWithCredentials(email.trim(), password);
      toast.success('Signed In Successfully', `Welcome back, ${user.name}!`);
      onClose();
      if (user.role === 'customer') {
        navigate('/customer/dashboard');
      } else if (user.role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/admin/analytics');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setError('Please provide your name and email');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const newUser = await registerCustomer({
        name: regName.trim(),
        company: regCompany.trim() || 'My Company',
        email: regEmail.trim(),
        password: regPassword || 'password123',
      });
      toast.success(
        'Account Registered!',
        `Welcome ${newUser.name}. Your dashboard is initialized with all metrics set to 0.`
      );
      onClose();
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Login & Demo Credentials"
      subtitle="Sign in with demo credentials or create a brand new zero-state user."
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Quick 1-Click Credentials Cards */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Preset Demo Customer Credentials</span>
            <span className="text-[10px] text-indigo-600 font-normal">Click to quick-fill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* New Customer Zero State */}
            <button
              type="button"
              onClick={() =>
                handleQuickLogin('new.customer@zerostate.io', 'password123', true)
              }
              className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-left transition-all hover:border-teal-300 hover:shadow-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                  New Customer (All 0)
                </span>
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 mt-2 group-hover:text-teal-700">
                Alex Mercer (Novus Systems)
              </h4>
              <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                new.customer@zerostate.io
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                PW: <span className="text-slate-600 font-semibold">password123</span>
              </p>
              <div className="mt-2 text-[10px] text-teal-700 font-semibold flex items-center gap-1">
                <span>Sign in (Clean 0 Slate)</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Existing Customer (Elena) */}
            <button
              type="button"
              onClick={() =>
                handleQuickLogin('elena.vance@acmecloud.com', 'password123', false)
              }
              className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-left transition-all hover:border-indigo-300 hover:shadow-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  Active Customer
                </span>
                <User className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 mt-2 group-hover:text-indigo-700">
                Elena Vance (Acme Cloud)
              </h4>
              <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                elena.vance@acmecloud.com
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                PW: <span className="text-slate-600 font-semibold">password123</span>
              </p>
              <div className="mt-2 text-[10px] text-indigo-700 font-semibold flex items-center gap-1">
                <span>Sign in (12 Tickets)</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Tab switch: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-100">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setError('');
            }}
            className={`pb-2.5 px-3 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'signin'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setError('');
            }}
            className={`pb-2.5 px-3 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'signup'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register New Customer
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Tab 1: Manual Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleManualSignIn} className="space-y-3.5">
            <Input
              label="Work Email Address"
              type="email"
              placeholder="e.g. new.customer@zerostate.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="e.g. password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              hint="Demo accounts accept password123"
            />

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  setEmail('new.customer@zerostate.io');
                  setPassword('password123');
                }}
              >
                Autofill New User
              </Button>

              <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
                Sign In to Customer Desk
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Register New Customer Form (Zero State) */}
        {activeTab === 'signup' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200/80 text-xs text-teal-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Zero-State Customer Guarantee</strong>
                When you create a new account, all metrics (Total, Open, Pending, Resolved) are initialized to <strong>0</strong>.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                placeholder="e.g. Jordan Hayes"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
              <Input
                label="Company / Organization"
                placeholder="e.g. Apex Health Corp"
                value={regCompany}
                onChange={(e) => setRegCompany(e.target.value)}
              />
            </div>

            <Input
              label="Corporate Email Address"
              type="email"
              placeholder="e.g. jordan@apexhealth.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />

            <Input
              label="Choose Password"
              type="password"
              placeholder="e.g. password123"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              hint="You can use password123 for testing"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="md" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
                Create Account &amp; Start with 0
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
