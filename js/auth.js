// Authentication & Session Management matching Flutter AuthProvider
import { ApiClient } from './api.js';
import { Store } from './store.js';

class AuthManager {
  constructor() {
    this.userKey = 'tyros_auth_user';
    this.shopKey = 'tyros_active_shop_id';
    this.currentUser = null;
    this.activeShopId = null;
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(this.userKey);
      if (stored) {
        this.currentUser = JSON.parse(stored);
        if (this.currentUser.name === 'Arun Kumar') {
          this.currentUser.name = 'Bharath';
          this.currentUser.fullName = 'Bharath';
          localStorage.setItem(this.userKey, JSON.stringify(this.currentUser));
        }
      } else {
        this.currentUser = {
          id: 'user-admin',
          name: 'Bharath',
          fullName: 'Bharath',
          phone: '9876543203',
          role: 'admin',
          assignedShopIds: ['shop-flare', 'shop-point', 'shop-bharath', 'shop-pk']
        };
        localStorage.setItem(this.userKey, JSON.stringify(this.currentUser));
        ApiClient.setToken('demo-jwt-admin');
      }
      this.activeShopId = localStorage.getItem(this.shopKey) || 'shop-flare';
    } catch (_) {
      this.clearSession();
    }
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser?.role?.toLowerCase() === 'admin';
  }

  isEmployee() {
    return this.currentUser?.role?.toLowerCase() === 'employee';
  }

  getUser() {
    return this.currentUser;
  }

  getActiveShopId() {
    return this.activeShopId || 'shop-1';
  }

  setActiveShopId(shopId) {
    this.activeShopId = shopId;
    localStorage.setItem(this.shopKey, shopId);
    window.dispatchEvent(new CustomEvent('tyros:shopChanged', { detail: { shopId } }));
  }

  async login(phone, password) {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanPass = password.trim();

    // 1. Attempt Real Backend API Authentication
    try {
      const res = await ApiClient.post('/auth/login', {
        phone: cleanPhone,
        password: cleanPass
      }, { skipAuth: true });

      const data = res?.data || res;
      if (data && (data.token || res.token)) {
        const token = data.token || res.token;
        const user = data.user || data;

        ApiClient.setToken(token);
        this.setSession(user);
        return { success: true, user, isDemo: false };
      }
    } catch (apiError) {
      console.warn('[Auth] Remote login rejected or timed out:', apiError.message);
    }

    // 2. Demo Seed Credentials Fallback (so app is 100% testable right away)
    const seedUsers = await Store.getUsers();
    const matchedUser = seedUsers.find(u => u.phone === cleanPhone);

    if (matchedUser) {
      // Allow 'password123', 'admin123', '12345678', or any password for demo
      ApiClient.setToken(`demo-jwt-${Date.now()}`);
      this.setSession(matchedUser);
      return { success: true, user: matchedUser, isDemo: true };
    }

    throw new Error('Invalid phone number or password. Please check your credentials.');
  }

  setSession(user) {
    this.currentUser = {
      ...user,
      role: (user.role || 'employee').toLowerCase(),
      assignedShopIds: user.assignedShopIds || user.shopIds || ['shop-1']
    };

    const activeShop = this.currentUser.role === 'admin'
      ? null
      : (this.currentUser.assignedShopIds[0] || 'shop-1');

    this.activeShopId = activeShop;
    localStorage.setItem(this.userKey, JSON.stringify(this.currentUser));
    if (activeShop) {
      localStorage.setItem(this.shopKey, activeShop);
    }

    window.dispatchEvent(new CustomEvent('tyros:authChanged', { detail: { user: this.currentUser } }));
  }

  async logout() {
    try {
      await ApiClient.post('/auth/logout');
    } catch (_) {}

    this.clearSession();
    window.dispatchEvent(new CustomEvent('tyros:authChanged', { detail: { user: null } }));
  }

  clearSession() {
    this.currentUser = null;
    this.activeShopId = null;
    ApiClient.clearToken();
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.shopKey);
  }
}

export const Auth = new AuthManager();
