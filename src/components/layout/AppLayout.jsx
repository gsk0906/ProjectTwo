import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CreateTicketModal } from '../tickets/CreateTicketModal';
import { AuthModal } from '../common/AuthModal';
import { X } from 'lucide-react';

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          onOpenCreateTicket={() => setCreateTicketOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-72 z-50 bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              onCloseMobile={() => setMobileMenuOpen(false)}
              onOpenCreateTicket={() => {
                setMobileMenuOpen(false);
                setCreateTicketOpen(true);
              }}
              onOpenAuthModal={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet
              context={{
                openCreateTicketModal: () => setCreateTicketOpen(true),
                openAuthModal: () => setAuthModalOpen(true),
              }}
            />
          </div>
        </main>
      </div>

      {/* Global Create Ticket Modal */}
      <CreateTicketModal
        isOpen={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
      />

      {/* Global Customer Login & Credentials Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};
