import React, { createContext, useContext, useState } from 'react';
import { DEMO_ROLES, SEED_USERS } from '../data/seedUsers';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('resolvehq_active_role') || 'customer';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUserId = localStorage.getItem('resolvehq_active_user_id');
    const matched = savedUserId ? SEED_USERS.find((u) => u.id === savedUserId) : null;
    return matched || SEED_USERS.find((u) => u.id === DEMO_ROLES[role]?.defaultUserId) || SEED_USERS[0];
  });

  const switchRole = (newRoleKey) => {
    if (newRoleKey === 'customer_new') {
      setRole('customer');
      localStorage.setItem('resolvehq_active_role', 'customer');
      const newUser = SEED_USERS.find((u) => u.id === 'user_cust_new');
      if (newUser) {
        setCurrentUser(newUser);
        localStorage.setItem('resolvehq_active_user_id', newUser.id);
      }
      return;
    }

    if (!DEMO_ROLES[newRoleKey]) return;
    setRole(newRoleKey);
    localStorage.setItem('resolvehq_active_role', newRoleKey);

    const defaultUserId = DEMO_ROLES[newRoleKey].defaultUserId;
    const user = SEED_USERS.find((u) => u.id === defaultUserId) || SEED_USERS[0];
    setCurrentUser(user);
    localStorage.setItem('resolvehq_active_user_id', user.id);
  };

  const switchUser = (userId) => {
    const user = SEED_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('resolvehq_active_user_id', user.id);
      if (user.role !== role) {
        setRole(user.role);
        localStorage.setItem('resolvehq_active_role', user.role);
      }
    }
  };

  const loginWithCredentials = async (email, password) => {
    const matched = SEED_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!matched) {
      throw new Error('No user account found matching this email address.');
    }

    if (matched.password && matched.password !== password) {
      throw new Error('Invalid password. Demo password is "password123".');
    }

    setCurrentUser(matched);
    setRole(matched.role);
    localStorage.setItem('resolvehq_active_user_id', matched.id);
    localStorage.setItem('resolvehq_active_role', matched.role);
    return matched;
  };

  const registerCustomer = async ({ name, company, email, password }) => {
    const newId = `user_cust_reg_${Date.now()}`;
    const newCustomer = {
      id: newId,
      name,
      email,
      password: password || 'password123',
      role: 'customer',
      title: 'Customer Administrator',
      company: company || 'My Organization',
      plan: 'Enterprise Starter',
      seats: 10,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      initials: name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'CU',
      timezone: 'UTC',
      customerSince: 'Just now (Brand New User)',
      totalTickets: 0,
      isNewUser: true,
    };

    SEED_USERS.push(newCustomer);
    setCurrentUser(newCustomer);
    setRole('customer');
    localStorage.setItem('resolvehq_active_user_id', newId);
    localStorage.setItem('resolvehq_active_role', 'customer');
    return newCustomer;
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        currentUser,
        switchRole,
        switchUser,
        loginWithCredentials,
        registerCustomer,
        roleMeta: DEMO_ROLES[role] || DEMO_ROLES.customer,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
