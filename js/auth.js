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
      const token = ApiClient.getToken();

      // If token was the old auto-seeded dummy token, clear it so user starts at login
      if (token === 'demo-jwt-admin') {
        this.clearSession();
        return;
      }

      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        this.currentUser = null;
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

    if (!cleanPhone || cleanPhone.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }
    if (!cleanPass) {
      throw new Error('Please enter your password.');
    }

    // Direct Live Backend Authentication
    try {
      const res = await ApiClient.post('/auth/login', {
        phone: cleanPhone,
        password: cleanPass
      }, { skipAuth: true });

      const data = res?.data || res;
      const token = data?.token || res?.token;
      const user = data?.user || res?.user || data;

      if (token && user) {
        ApiClient.setToken(token);
        this.setSession(user);
        return { success: true, user, token };
      }

      throw new Error(res?.message || 'Login failed. Invalid response from server.');
    } catch (apiError) {
      const msg = apiError?.data?.message || apiError?.message || 'Invalid phone number or password.';
      throw new Error(msg);
    }
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
