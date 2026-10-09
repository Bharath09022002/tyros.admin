// Global API & App Configuration
// Matches ApiConfig & ApiEndpoints from Flutter TyreApp

const DEFAULT_SERVER_URL = 'https://tyre-7c07.onrender.com';
const API_PREFIX = '/api/v1';

export const Config = {
  defaultServerUrl: DEFAULT_SERVER_URL,
  apiPrefix: API_PREFIX,

  // Get active server URL (supports user override in localStorage)
  getServerUrl() {
    return localStorage.getItem('tyros_custom_server_url') || DEFAULT_SERVER_URL;
  },

  setServerUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem('tyros_custom_server_url', url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem('tyros_custom_server_url');
    }
  },

  getBaseUrl() {
    const server = this.getServerUrl();
    return `${server}${API_PREFIX}`;
  },

  // Central Catalog of API Endpoints
  endpoints: {
    health: '/health',
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',

    // Employee
    employeeShops: '/employee/shops',
    employeeBannerSummary: '/employee/banner-summary',
    employeeCheckDuplicate: '/employee/check-duplicate',
    employeeEnquiries: '/employee/enquiries',
    employeePending: '/employee/pending',
    employeeCompleted: '/employee/completed',
    employeeUnfit: '/employee/unfit',
    employeeSearch: '/employee/search',
    employeeTyreSizes: '/employee/tyre-sizes',
    employeeTyreBrands: '/employee/tyre-brands',
    employeeTyreProducts: '/employee/tyre-products',
    employeeCarBrands: '/employee/car-brands',
    employeeCarModels: '/employee/car-models',
    employeeTargetDashboard: '/employee/target-dashboard',

    // Daily reports
    dailyReports: '/daily-reports',

    // Admin
    adminDashboard: '/admin/dashboard',
    adminEnquiries: '/admin/enquiries',
    adminShops: '/admin/shops',
    adminUsers: '/admin/users',
    adminTyreSizes: '/admin/tyre-sizes',
    adminTyreBrands: '/admin/tyre-brands',
    adminTyreProducts: '/admin/tyre-products',
    adminExportCsv: '/admin/export/csv',
    adminShopsWithEmployees: '/admin/shops-with-employees',

    // Parameterized
    employeeEnquiryById: (id) => `/employee/enquiries/${id}`,
    adminEnquiryReassign: (id) => `/admin/enquiries/${id}/reassign`,
    adminEnquiryDelete: (id) => `/admin/enquiries/${id}`,
    adminShopById: (id) => `/admin/shops/${id}`,
    adminShopActivate: (id) => `/admin/shops/${id}/activate`,
    adminShopDeactivate: (id) => `/admin/shops/${id}/deactivate`,
    adminUserById: (id) => `/admin/users/${id}`,
    adminUserResetPassword: (id) => `/admin/users/${id}/reset-password`,
    adminUserActivate: (id) => `/admin/users/${id}/activate`,
    adminUserDeactivate: (id) => `/admin/users/${id}/deactivate`,
  },

  // Network info for Apple Mobile access via WiFi
  async getLocalNetworkInfo() {
    try {
      const res = await fetch('/api/local-info');
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
    return { primaryIp: window.location.hostname || '192.168.1.4', port: window.location.port || 3000 };
  }
};
