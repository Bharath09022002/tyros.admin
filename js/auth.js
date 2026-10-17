// Tyros Admin - Authentication Service (js/auth.js)
import { ApiClient } from './api.js';
import { Toast } from './toast.js';

const SESSION_KEY = 'tyros_admin_session';

class AuthManager {
  constructor() {
    this.token = null;
    this.user = null;
    this.init();
  }

  init() {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          this.token = parsed.token;
          this.user = parsed.user;
          ApiClient.setToken(this.token);
        }
      }
    } catch (_) {
      this.clearSession();
    }

    // Listen for unauthorized 401 event dispatched by ApiClient
    window.addEventListener('tyros:unauthorized', () => {
      this.clearSession();
      Toast.error('Session expired. Please log in again.');
      window.location.hash = '#/login';
    });
  }

  isAuthenticated() {
    return !!(this.token && this.user);
  }

  isAdmin() {
    return this.user?.role?.toUpperCase() === 'ADMIN';
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
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

    const res = await ApiClient.post('/auth/login', {
      phone: cleanPhone,
      password: cleanPass
    }, { skipAuth: true });

    // Handle token returned either as data.token or data.data.token
    const data = res?.data || res;
    const token = data?.token || data?.tokens?.accessToken || res?.token;
    const user = data?.user || res?.user || { phone: cleanPhone, fullName: 'Admin', role: 'ADMIN' };

    if (!token) {
      throw new Error(res?.message || 'Authentication succeeded but token was missing.');
    }

    this.token = token;
    this.user = user;
    ApiClient.setToken(token);

    // Save strictly to memory and sessionStorage (never localStorage / never URL)
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, user }));
    } catch (_) {}

    window.dispatchEvent(new CustomEvent('tyros:auth-changed', { detail: { user } }));
    return { user, token };
  }

  logout() {
    this.clearSession();
    window.dispatchEvent(new CustomEvent('tyros:auth-changed', { detail: { user: null } }));
    window.location.hash = '#/login';
    Toast.info('Signed out successfully.');
  }

  clearSession() {
    this.token = null;
    this.user = null;
    ApiClient.clearToken();
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  }
}

export const Auth = new AuthManager();
