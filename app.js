// Tyros Admin Portal - Master Application Entry Point
import { Router } from './js/router.js';
import { Auth } from './js/auth.js';
import { ApiClient } from './js/api.js';
import { UI } from './js/ui.js';

import { renderLogin } from './js/views/login.js';
import { renderAdminDashboard } from './js/views/adminDashboard.js';
import { renderAllEntries } from './js/views/allEntries.js';
import { renderEntryDetail } from './js/views/entryDetail.js';
import { renderAdminReports } from './js/views/adminReports.js';
import { renderManage } from './js/views/manage.js';
import { renderProfile } from './js/views/profile.js';
import { renderTyreMaster } from './js/views/tyreMaster.js';
import { renderCarMaster } from './js/views/carMaster.js';
import { renderTargets } from './js/views/targets.js';

document.addEventListener('DOMContentLoaded', async () => {
  const router = new Router();

  // Register Pure Admin Routes
  router.addRoute('/login', renderLogin);
  router.addRoute('/dashboard', renderAdminDashboard);
  router.addRoute('/entries', renderAllEntries);
  router.addRoute('/entry/:id', renderEntryDetail);
  router.addRoute('/reports', renderAdminReports);
  router.addRoute('/manage', renderManage);
  router.addRoute('/profile', renderProfile);
  router.addRoute('/tyre-master', renderTyreMaster);
  router.addRoute('/car-master', renderCarMaster);
  router.addRoute('/targets', renderTargets);

  // Bottom Navigation Click Handlers
  document.querySelectorAll('#bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.dataset.route;
      router.navigate(route);
    });
  });

  // Handle Unauthorized 401 Event
  window.addEventListener('tyros:unauthorized', () => {
    UI.showToast('Session expired. Please log in again.', 'info');
    router.navigate('/login');
  });

  // Handle Auth Changes
  window.addEventListener('tyros:authChanged', (e) => {
    if (!e.detail.user) {
      router.navigate('/login');
    }
  });

  // Background Wakeup for Render Server
  setupServerWakeup();

  // Initialize Route
  await router.handleRouting();

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('[SW] Service worker registration skipped:', err.message);
    });
  }
});

function setupServerWakeup() {
  const banner = document.getElementById('server-banner');

  ApiClient.onServerStatusChange((status) => {
    if (status === 'connecting') {
      if (banner) {
        banner.className = 'active';
        banner.innerHTML = `
          <span>⏳ Connecting to cloud backend (waking up server)...</span>
          <span style="font-size:10.5px; opacity:0.8;">Local data active</span>
        `;
      }
    } else {
      if (banner) {
        banner.className = '';
      }
    }
  });

  // Trigger silent wakeup
  ApiClient.wakeServer();
}
