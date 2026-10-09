// Admin Profile Screen matching Flutter ProfileScreen exactly
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { Config } from '../config.js';
import { ApiClient } from '../api.js';
import { UI } from '../ui.js';

export async function renderProfile(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const user = Auth.getUser();
  const userName = user?.fullName || user?.name || 'Bharath';
  const userPhone = user?.phone || '9876543203';
  const userRole = (user?.role || 'ADMIN').toUpperCase();
  const shops = await Store.getShops();
  const activeShopsCount = shops.filter(s => s.isActive).length;

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD';

  container.innerHTML = `
    <!-- Header -->
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title">${userName}</div>
          <div class="header-subtitle">System Administrator • Tyros Network</div>
        </div>
        <div class="header-actions">
          <button id="header-logout-btn" class="header-add-btn" style="background: rgba(220,38,38,0.2); border-color: rgba(220,38,38,0.4); color: #FCA5A5;">
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <div style="padding: 20px 20px 50px;">
      <!-- User Hero Card (Matching Flutter ProfileScreen) -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px 20px; text-align: center; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <!-- Avatar Circle -->
        <div style="width: 72px; height: 72px; border-radius: 50%; background: #22201E; color: #F3EFE7; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; font-family: var(--font-condensed); font-size: 26px; font-weight: 700; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
          ${initials}
        </div>

        <!-- Name -->
        <div style="font-family: var(--font-condensed); font-size: 22px; font-weight: 700; color: var(--text-main); line-height: 1.2;">
          ${userName}
        </div>

        <!-- Role Badge -->
        <div style="margin: 8px 0 12px;">
          <span style="font-family: var(--font-condensed); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 12px; border-radius: 20px; border: 1px solid rgba(193,68,14,0.3); color: var(--accent-rust); background: rgba(193,68,14,0.08);">
            ${userRole}
          </span>
        </div>

        <!-- Phone -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; color: var(--text-sub); font-weight: 500;">
          <span>📞</span>
          <a href="tel:${userPhone}" style="color: var(--text-main); text-decoration: none; font-weight: 600;">
            ${userPhone}
          </a>
        </div>
      </div>

      <!-- Administrative Oversight Section (Matching Flutter ProfileScreen) -->
      <div style="margin-bottom: 8px; padding-left: 2px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted);">
          ADMINISTRATIVE OVERSIGHT
        </span>
      </div>

      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
        <!-- Row 1: Branches Managed -->
        <div style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--row-divider);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px;">🏪</span>
            <span style="font-size: 13.5px; color: var(--text-main); font-weight: 500;">Branches Managed</span>
          </div>
          <strong style="font-size: 13.5px; color: var(--text-main); font-weight: 700;">${activeShopsCount} Active Branches</strong>
        </div>

        <!-- Row 2: Access Level -->
        <div style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px;">🛡️</span>
            <span style="font-size: 13.5px; color: var(--text-main); font-weight: 500;">Access Level</span>
          </div>
          <strong style="font-size: 13.5px; color: var(--status-done); font-weight: 700;">Full System Access</strong>
        </div>
      </div>

      <!-- Sign Out Button -->
      <button id="admin-logout-btn" class="btn-dark-cta" style="margin: 0; width: 100%; background: #B23A2E; padding: 14px; border-radius: 8px;">
        Sign Out of Admin Portal
      </button>
    </div>
  `;

  // Attach Logout Handlers
  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await Auth.logout();
      router.navigate('/login');
    }
  };

  container.querySelector('#admin-logout-btn')?.addEventListener('click', handleLogout);
  container.querySelector('#header-logout-btn')?.addEventListener('click', handleLogout);

  return container;
}
