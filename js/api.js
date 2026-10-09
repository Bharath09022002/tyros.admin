// Centralized API Client matching ApiClient from Flutter TyreApp
import { Config } from './config.js';

class ApiClientClass {
  constructor() {
    this.tokenKey = 'tyros_auth_jwt_token';
    this.isServerAwake = false;
    this.serverStatusListeners = [];
  }

  getToken() {
    return localStorage.getItem(this.tokenKey) || '';
  }

  isDemoToken(token = null) {
    const t = token !== null ? token : this.getToken();
    return !t || t.startsWith('demo-') || t.startsWith('mock-');
  }

  hasRealBackendToken() {
    const t = this.getToken();
    return !!t && !t.startsWith('demo-') && !t.startsWith('mock-');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  onServerStatusChange(callback) {
    this.serverStatusListeners.push(callback);
  }

  notifyServerStatus(status, message) {
    this.serverStatusListeners.forEach(cb => cb(status, message));
  }

  // Fire background GET /health to wake the Render server if sleeping
  async wakeServer() {
    const healthUrl = `${Config.getServerUrl()}/health`;
    this.notifyServerStatus('connecting', 'Connecting to backend server...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 65000); // 65s for cold start

      const res = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.isServerAwake = true;
        this.notifyServerStatus('online', 'Connected to backend server');
        return true;
      }
    } catch (err) {
      console.warn('[ApiClient] Wakeup ping failed or still waking:', err.message);
    }

    this.notifyServerStatus('offline', 'Backend server sleeping or unreachable');
    return false;
  }

  // Core Request Helper with Authorization, Timeout & Retry
  async request(path, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    let url;

    if (path.startsWith('http://') || path.startsWith('https://')) {
      url = path;
    } else if (path === '/health' || path === 'health') {
      url = `${Config.getServerUrl()}/health`;
    } else {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      url = `${Config.getBaseUrl()}${cleanPath}`;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (!options.skipAuth && this.isDemoToken(token)) {
      // Local demo session - avoid spamming remote backend with invalid tokens
      const err = new Error('DEMO_SESSION_LOCAL_ONLY');
      err.status = 401;
      err.isDemo = true;
      throw err;
    }

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const timeoutMs = options.timeout || 60000;

    const executeFetch = async () => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          method,
          headers,
          signal: controller.signal
        });
        clearTimeout(id);

        if (response.status === 401 && !url.includes('/auth/login')) {
          if (this.hasRealBackendToken()) {
            console.warn('[ApiClient] 401 Unauthorized received. Clearing session.');
            this.clearToken();
            if (!this._unauthorizedDebounce) {
              this._unauthorizedDebounce = true;
              setTimeout(() => { this._unauthorizedDebounce = false; }, 4000);
              window.dispatchEvent(new CustomEvent('tyros:unauthorized'));
            }
          }
        }

        const contentType = response.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          const errMsg = (data && typeof data === 'object')
            ? (data.message || data.error || `HTTP error ${response.status}`)
            : data || `HTTP error ${response.status}`;
          const err = new Error(errMsg);
          err.status = response.status;
          err.data = data;
          throw err;
        }

        return data;
      } catch (err) {
        clearTimeout(id);
        throw err;
      }
    };

    // Safe Retry for network GET requests (never retry 401, 403, 404, or demo session)
    try {
      return await executeFetch();
    } catch (err) {
      const isAuthOrClientError = err.status === 401 || err.status === 403 || err.status === 404 || err.message === 'DEMO_SESSION_LOCAL_ONLY';
      if (method === 'GET' && !options.retried && !isAuthOrClientError) {
        console.warn(`[ApiClient] GET ${url} failed. Retrying once...`, err.message);
        return await this.request(path, { ...options, retried: true });
      }
      throw err;
    }
  }

  get(path, queryParams = {}, options = {}) {
    let url = path;
    const cleanParams = Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== null && v !== '');
    if (cleanParams.length > 0) {
      const qs = new URLSearchParams(cleanParams).toString();
      url += (url.includes('?') ? '&' : '?') + qs;
    }
    return this.request(url, { ...options, method: 'GET' });
  }

  post(path, data = {}, options = {}) {
    return this.request(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  patch(path, data = {}, options = {}) {
    return this.request(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  put(path, data = {}, options = {}) {
    return this.request(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(path, data = {}, options = {}) {
    return this.request(path, {
      ...options,
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  }
}

export const ApiClient = new ApiClientClass();
