import { CATEGORIES, PRIORITIES, CANNED_RESPONSES } from '../data/seedSettings';

const SLA_KEY = 'resolvehq_sla_v1';
const CAT_KEY = 'resolvehq_categories_v1';
const MACRO_KEY = 'resolvehq_macros_v1';

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsService = {
  async getSlaPolicies() {
    await delay(60);
    const raw = localStorage.getItem(SLA_KEY);
    return raw ? JSON.parse(raw) : PRIORITIES;
  },

  async updateSlaPolicies(policies) {
    await delay(150);
    localStorage.setItem(SLA_KEY, JSON.stringify(policies));
    return policies;
  },

  async getCategories() {
    await delay(50);
    const raw = localStorage.getItem(CAT_KEY);
    return raw ? JSON.parse(raw) : CATEGORIES;
  },

  async addCategory(cat) {
    await delay(120);
    const categories = await this.getCategories();
    const newCat = {
      id: `cat_${Date.now()}`,
      name: cat.name,
      description: cat.description || '',
      color: cat.color || 'indigo',
    };
    categories.push(newCat);
    localStorage.setItem(CAT_KEY, JSON.stringify(categories));
    return newCat;
  },

  async getCannedResponses() {
    await delay(50);
    const raw = localStorage.getItem(MACRO_KEY);
    return raw ? JSON.parse(raw) : CANNED_RESPONSES;
  },

  async addCannedResponse(macro) {
    await delay(120);
    const macros = await this.getCannedResponses();
    const newMacro = {
      id: `macro_${Date.now()}`,
      title: macro.title,
      category: macro.category || 'General',
      snippet: macro.snippet,
    };
    macros.push(newMacro);
    localStorage.setItem(MACRO_KEY, JSON.stringify(macros));
    return newMacro;
  }
};
