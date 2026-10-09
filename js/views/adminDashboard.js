// Admin Dashboard matching Flutter DashboardTab Screenshot exactly
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderAdminDashboard(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const user = Auth.getUser();
  const userName = user?.fullName || user?.name || 'Administrator';
  const shops = await Store.getShops();
  const allEntries = await Store.getEntries();
  const activeShops = shops.filter(s => s.isActive);
  const nowTime = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

  // Compute live stats directly from real API entries
  const nonDeleted = allEntries;
  const uniqueCustomerKeys = new Set(nonDeleted.map(e => (e.mobileNumber || e.customerName || '').trim()).filter(Boolean));
  const totalCustomers = uniqueCustomerKeys.size;
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
          <button id="dash-profile-btn" class="header-icon-btn" title="Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button id="dash-logout-btn" class="header-icon-btn" title="Sign Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Stat: Total Customers -->
    <div style="padding: 24px 22px 6px;">
      <div style="display: flex; align-items: baseline; gap: 12px;">
        <span style="font-family: var(--font-condensed); font-size: 64px; font-weight: 700; color: var(--text-main); line-height: 0.85; letter-spacing: -0.02em;">
          ${totalCustomers}
        </span>
        <span style="font-size: 15px; font-weight: 500; color: var(--text-sub);">total customers</span>
      </div>
      <div style="font-family: var(--font-condensed); font-size: 14px; font-weight: 700; color: var(--accent-rust); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 6px;">
        ACROSS ALL SHOPS
      </div>
    </div>

    <!-- 3-Stat Bar: PENDING / OVERDUE / COMPLETED -->
    <div class="stat-row-3">
      <div class="stat-item" id="stat-pending" style="cursor:pointer;">
        <div class="stat-num">${pendingCount}</div>
        <div class="stat-label">PENDING</div>
      </div>
      <div class="stat-item" id="stat-overdue" style="cursor:pointer;">
        <div class="stat-num">${overdueCount}</div>
        <div class="stat-label">OVERDUE</div>
      </div>
      <div class="stat-item" id="stat-completed" style="cursor:pointer;">
        <div class="stat-num">${completedCount}</div>
        <div class="stat-label">COMPLETED</div>
      </div>
    </div>

    <!-- Quick Tools: Tyre Master + Car Master side by side -->
    <div style="padding: 12px 20px 0; display: flex; gap: 10px;">
      <!-- Tyre Master Card -->
      <div id="tool-tyre-master" style="flex:1; display:flex; align-items:center; gap:10px; padding:12px 14px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; cursor:pointer;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rust)" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:4px;">
            <span style="font-size:14px; font-weight:700; color:var(--text-main);">Tyre Master</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Sizes & brands</div>
        </div>
      </div>
      <!-- Car Master Card -->
      <div id="tool-car-master" style="flex:1; display:flex; align-items:center; gap:10px; padding:12px 14px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; cursor:pointer;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rust)" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H6c-.7 0-1.3.3-1.8.7C3.3 8.6 2 10 2 10s-2.7.6-4.5 1.1C-3.3 11.3-4 12.1-4 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:4px;">
            <span style="font-size:14px; font-weight:700; color:var(--text-main);">Car Master</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Brands &</div>
        </div>
      </div>
    </div>

    <!-- Targets Card (full width) -->
    <div style="padding: 10px 20px 0;">
      <div id="tool-targets" style="display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; cursor:pointer;">
        <div style="width:36px; height:36px; border-radius:10px; background:rgba(193,68,14,0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rust)" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:14.5px; font-weight:700; color:var(--text-main);">Targets</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Monthly targets, goals & shop daily sales</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>

    <!-- Section: Load by shop -->
    <div style="display:flex; justify-content:space-between; align-items:center; padding:18px 20px 10px;">
      <span style="font-size:16px; font-weight:700; color:var(--text-main);">Load by shop</span>
      <button id="dash-manage-link" style="font-size:13px; font-weight:600; color:var(--accent-steel); background:none; border:none; cursor:pointer;">Manage</button>
    </div>

    <!-- Shop Bars -->
    <div id="shop-bars" style="padding: 0 20px 40px; display: flex; flex-direction: column; gap: 14px;"></div>
  `;

  // Render Shop Bars
  const barsEl = container.querySelector('#shop-bars');
  if (shopPendingData.length === 0) {
    barsEl.innerHTML = `<div style="text-align:center; padding:16px 0; color:var(--text-muted); font-size:13px;">No workshop branches found</div>`;
  } else {
    shopPendingData.forEach(shop => {
      const fraction = shop.pending > 0 ? Math.min(1, Math.max(0.08, shop.pending / maxPending)) : 0;
      const barEl = document.createElement('div');
      barEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
          <span style="font-size:13.5px; font-weight:600; color:var(--text-main);">${shop.name}</span>
          <span style="font-size:12px; font-weight:500; color:var(--text-muted);">${shop.pending} pending</span>
        </div>
        <div style="width:100%; height:5px; background:var(--border-color); border-radius:3px; overflow:hidden;">
          <div style="width:${shop.pending > 0 ? (fraction * 100) + '%' : '14px'}; height:100%; background:var(--accent-steel); border-radius:3px; transition:width 0.4s ease;"></div>
        </div>
      `;
      barsEl.appendChild(barEl);
    });
  }

  // Event listeners
  container.querySelector('#dash-profile-btn')?.addEventListener('click', () => router.navigate('/profile'));
  container.querySelector('#dash-logout-btn')?.addEventListener('click', async () => {
    if (confirm('Sign out?')) { await Auth.logout(); router.navigate('/login'); }
  });
  container.querySelector('#stat-pending')?.addEventListener('click', () => router.navigate('/entries?filter=Pending'));
  container.querySelector('#stat-overdue')?.addEventListener('click', () => router.navigate('/entries?filter=Overdue'));
  container.querySelector('#stat-completed')?.addEventListener('click', () => router.navigate('/entries?filter=Completed'));
  container.querySelector('#tool-tyre-master')?.addEventListener('click', () => router.navigate('/tyre-master'));
  container.querySelector('#tool-car-master')?.addEventListener('click', () => router.navigate('/car-master'));
  container.querySelector('#tool-targets')?.addEventListener('click', () => router.navigate('/targets'));
  container.querySelector('#dash-manage-link')?.addEventListener('click', () => router.navigate('/manage'));

  return container;
}
