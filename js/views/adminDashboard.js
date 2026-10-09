// Admin Dashboard matching Flutter DashboardTab Screenshot exactly
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderAdminDashboard(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const user = Auth.getUser();
  const userName = user?.fullName || user?.name || 'Bharath';
  const shops = await Store.getShops();
  const allEntries = await Store.getEntries();
  const activeShops = shops.filter(s => s.isActive);
  const nowTime = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

  // Compute stats exactly matching Flutter screenshot
  const nonDeleted = allEntries;
  const totalCustomers = nonDeleted.length;
  const pendingCount = nonDeleted.filter(e => e.status === 'PENDING' && e.fitStatus === 'FIT' && !e.isOverdue).length;
  const overdueCount = nonDeleted.filter(e => e.isOverdue).length;
  const completedCount = nonDeleted.filter(e => e.status === 'COMPLETED' && e.fitStatus === 'FIT').length;

  // Shop pending counts for Load by shop section
  const shopPendingData = activeShops.map(shop => {
    const pending = nonDeleted.filter(e => e.shopId === shop.id && e.status === 'PENDING' && e.fitStatus === 'FIT' && !e.isOverdue).length;
    return { name: shop.name, pending, id: shop.id };
  });
  const maxPending = Math.max(1, ...shopPendingData.map(s => s.pending));

  container.innerHTML = `
    <!-- Dark Header matching Flutter AppHeader -->
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title">${userName}</div>
          <div class="header-subtitle">${activeShops.length} shops · updated ${nowTime}</div>
        </div>
        <div class="header-actions">
          <button id="dash-profile-btn" class="header-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button id="dash-logout-btn" class="header-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Stat: Total Customers -->
    <div style="padding: 24px 22px 4px;">
      <div style="display: flex; align-items: baseline; gap: 12px;">
        <span style="font-family: var(--font-condensed); font-size: 58px; font-weight: 700; color: var(--text-main); line-height: 0.85; letter-spacing: -0.02em;">
          ${totalCustomers}
        </span>
        <span style="font-size: 14px; font-weight: 500; color: var(--text-sub);">total customers</span>
      </div>
      <div style="font-family: var(--font-condensed); font-size: 14px; font-weight: 600; color: var(--accent-rust); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 4px;">
        ACROSS ALL SHOPS
      </div>
    </div>

    <!-- 3-Stat Bar: Pending / Overdue / Completed -->
    <div class="stat-row-3">
      <div class="stat-item" id="stat-pending" style="cursor:pointer;">
        <div class="stat-num">${pendingCount}</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-item" id="stat-overdue" style="cursor:pointer;">
        <div class="stat-num" style="color: var(--status-overdue);">${overdueCount}</div>
        <div class="stat-label">Overdue</div>
      </div>
      <div class="stat-item" id="stat-completed" style="cursor:pointer;">
        <div class="stat-num done">${completedCount}</div>
        <div class="stat-label">Completed</div>
      </div>
    </div>

    <!-- Quick Tools: Tyre Master + Car Master side by side -->
    <div style="padding: 12px 22px 0; display: flex; gap: 10px;">
      <!-- Tyre Master Card -->
      <div id="tool-tyre-master" class="dash-tool-card" style="flex:1; display:flex; align-items:center; gap:8px; padding:12px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:10px; cursor:pointer;">
        <span style="color: var(--accent-rust); font-size: 20px;">🔧</span>
        <div style="flex:1; min-width:0;">
          <div style="font-size:14px; font-weight:700; color:var(--text-main);">Tyre Master</div>
          <div style="font-size:10px; color:var(--text-muted);">Sizes & brands</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <!-- Car Master Card -->
      <div id="tool-car-master" class="dash-tool-card" style="flex:1; display:flex; align-items:center; gap:8px; padding:12px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:10px; cursor:pointer;">
        <span style="color: var(--accent-rust); font-size: 20px;">🚗</span>
        <div style="flex:1; min-width:0;">
          <div style="font-size:14px; font-weight:700; color:var(--text-main);">Car Master</div>
          <div style="font-size:10px; color:var(--text-muted);">Brands & models</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>

    <!-- Targets Card (full width) -->
    <div style="padding: 8px 22px 0;">
      <div id="tool-targets" style="display:flex; align-items:center; gap:10px; padding:12px 14px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:10px; cursor:pointer;">
        <div style="width:34px; height:34px; border-radius:8px; background:rgba(193,68,14,0.1); display:flex; align-items:center; justify-content:center;">
          <span style="font-size:20px;">🎯</span>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:14px; font-weight:700; color:var(--text-main);">Targets</div>
          <div style="font-size:10px; color:var(--text-muted);">Monthly targets, goals & shop daily sales</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>

    <!-- Section: Load by shop -->
    <div class="section-head">
      <span class="title">Load by shop</span>
      <button id="dash-manage-link" class="action-link">Manage</button>
    </div>

    <!-- Shop Bars -->
    <div id="shop-bars" style="padding: 0 22px 40px; display: flex; flex-direction: column; gap: 14px;"></div>
  `;

  // Render Shop Bars
  const barsEl = container.querySelector('#shop-bars');
  shopPendingData.forEach(shop => {
    const fraction = Math.max(0.05, shop.pending / (maxPending * 1.2));
    const barEl = document.createElement('div');
    barEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-size:13.5px; font-weight:600; color:var(--text-main);">${shop.name}</span>
        <span style="font-size:12px; font-weight:500; color:var(--text-muted);">${shop.pending} pending</span>
      </div>
      <div style="width:100%; height:5px; background:var(--border-color); border-radius:3px; overflow:hidden;">
        <div style="width:${fraction * 100}%; height:100%; background:var(--accent-steel); border-radius:3px; transition:width 0.4s ease;"></div>
      </div>
    `;
    barsEl.appendChild(barEl);
  });

  // Event listeners
  container.querySelector('#dash-profile-btn')?.addEventListener('click', () => router.navigate('/profile'));
  container.querySelector('#dash-logout-btn')?.addEventListener('click', async () => {
    if (confirm('Sign out?')) { await Auth.logout(); router.navigate('/login'); }
  });
  container.querySelector('#stat-pending')?.addEventListener('click', () => router.navigate('/entries?filter=Pending'));
  container.querySelector('#stat-overdue')?.addEventListener('click', () => router.navigate('/entries?filter=Overdue'));
  container.querySelector('#stat-completed')?.addEventListener('click', () => router.navigate('/entries?filter=Completed'));
  container.querySelector('#tool-tyre-master')?.addEventListener('click', () => router.navigate('/manage'));
  container.querySelector('#tool-car-master')?.addEventListener('click', () => router.navigate('/manage'));
  container.querySelector('#tool-targets')?.addEventListener('click', () => router.navigate('/reports'));
  container.querySelector('#dash-manage-link')?.addEventListener('click', () => router.navigate('/manage'));

  return container;
}
