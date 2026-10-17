// Tyros Admin - Profile Page (js/pages/profile.js)
import { Auth } from '../auth.js';
import { UI } from '../ui.js';
import { Sheet } from '../sheet.js';

export function renderProfilePage(router) {
  const container = document.createElement('div');
  container.className = 'page-container';

  const user = Auth.getUser();
  const userName = user?.fullName || user?.name || 'Admin User';
  const userPhone = user?.phone || '9999999999';
  const userRole = (user?.role || 'ADMIN').toUpperCase();
  const currentTheme = UI.getTheme();

  container.innerHTML = `
    <header class="app-header mobile-only-header">
      <div class="app-header-row">
        <div class="app-header-info">
          <h1 class="app-header-title">Profile & Settings</h1>
          <div class="app-header-subtitle">Account settings and preferences</div>
        </div>
      </div>
    </header>

    <div style="display:flex; flex-direction:column; gap:var(--space-4); margin-top:var(--space-2);">
      <!-- User Profile Card -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-default); border-radius:var(--radius-lg); padding:var(--space-5); box-shadow:var(--shadow-sm); display:flex; align-items:center; gap:var(--space-4);">
        <div style="width:52px; height:52px; border-radius:var(--radius-pill); background:var(--accent-subtle); color:var(--accent); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:24px; font-weight:700; flex-shrink:0;">
          ${UI.escape(userName.charAt(0).toUpperCase())}
        </div>
        <div style="flex:1; min-width:0;">
          <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-primary); line-height:1.2;">
            ${UI.escape(userName)}
          </div>
          <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">📞 ${UI.escape(userPhone)}</div>
        </div>
        <span style="font-size:11px; font-weight:700; background:rgba(31,27,24,0.08); color:var(--text-primary); padding:3px 9px; border-radius:var(--radius-pill); text-transform:uppercase;">
          ${UI.escape(userRole)}
        </span>
      </div>

      <!-- Appearance Preference Card -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-default); border-radius:var(--radius-lg); padding:var(--space-5); box-shadow:var(--shadow-sm);">
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-muted); margin-bottom:var(--space-3);">
          Appearance
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600; color:var(--text-primary); font-size:15px;">Dark Theme</div>
            <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">High contrast warm charcoal palette</div>
          </div>
          <button id="profile-theme-btn" class="btn-secondary" style="min-height:38px; padding:6px 14px; font-size:13px;">
            ${currentTheme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
          </button>
        </div>
      </div>

      <!-- Sign Out Button -->
      <div style="margin-top:var(--space-4);">
        <button id="profile-logout-btn" class="btn-secondary" style="width:100%; color:var(--status-overdue); border-color:rgba(220,38,38,0.25);">
          Sign Out of Account
        </button>
      </div>
    </div>
  `;

  // Theme switch
  const themeBtn = container.querySelector('#profile-theme-btn');
  themeBtn?.addEventListener('click', () => {
    const nextTheme = UI.toggleTheme();
    themeBtn.textContent = nextTheme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark';
  });

  // Logout with confirmation
  container.querySelector('#profile-logout-btn')?.addEventListener('click', () => {
    Sheet.confirm({
      title: 'Sign Out',
      message: 'Are you sure you want to log out of your session?',
      confirmText: 'Sign Out',
      danger: true,
      onConfirm: () => {
        Auth.logout();
      }
    });
  });

  return container;
}
