import { SEED_USERS } from '../data/seedUsers';

const STORAGE_KEY = 'resolvehq_users_v1';
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw);
  } catch (_e) {
    return SEED_USERS;
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed saving users to storage:', err);
  }
};

export const userService = {
  async getUsers() {
    await delay(80);
    return getStoredUsers();
  },

  async getAgents() {
    await delay(60);
    const users = getStoredUsers();
    return users.filter((u) => u.role === 'agent' || u.role === 'admin');
  },

  async getUserById(id) {
    await delay(50);
    const users = getStoredUsers();
    return users.find((u) => u.id === id) || null;
  },

  async createUser(userInput) {
    await delay(200);
    const users = getStoredUsers();
    const newUser = {
      id: `user_${Date.now()}`,
      name: userInput.name,
      email: userInput.email,
      role: userInput.role || 'agent',
      title: userInput.title || 'Support Engineer',
      department: userInput.department || 'Technical Support',
      avatar: userInput.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      initials: userInput.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
      status: 'online',
      activeTicketsCount: 0,
      resolvedTicketsCount: 0,
      csat: 5.0,
      avgResponseMinutes: 15,
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
  },

  async updateUser(id, updates) {
    await delay(120);
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
  }
};
