// Tyros Admin - Configuration (js/config.js)
// Base URL configured as a single constant
export const API_BASE_URL = 'https://api.flaremindstech.com/tyros/api/v1';

export const Config = {
  apiBaseUrl: API_BASE_URL,
  appName: 'Tyros Admin',
  appVersion: '2.0.0',
  requestTimeoutMs: 12000,
  maxGetRetries: 2,
  refreshIntervalMs: 60000 // 60s auto-refresh when tab is visible
};
