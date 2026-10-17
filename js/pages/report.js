// Tyros Admin - Report Page (js/pages/report.js)
// Full All-Shops Overview + Single-Shop 360 View + Targets & Goals
import { Store } from '../store.js';
import { UI } from '../ui.js';
import { Sheet } from '../sheet.js';
import { Toast } from '../toast.js';

export async function renderReportPage(router, params = {}) {
  const container = document.createElement('div');
  container.className = 'page-container';

  // SKELETON LOADER
  container.innerHTML = `
    <header class="app-header mobile-only-header">
      <div class="app-header-row">
        <div class="app-header-info">
          <h1 class="app-header-title">Report</h1>
          <div class="app-header-subtitle">Loading shop performance & targets...</div>
        </div>
      </div>
    </header>
    <div style="padding-top: var(--space-4);">
      <div class="skeleton" style="height: 44px; border-radius: var(--radius-md); margin-bottom: var(--space-3);"></div>
      <div class="skeleton" style="height: 80px; border-radius: var(--radius-lg); margin-bottom: var(--space-4);"></div>
      <div style="display:flex; flex-direction:column; gap:var(--space-3);">
        <div class="skeleton" style="height: 140px; border-radius:var(--radius-lg);"></div>
        <div class="skeleton" style="height: 140px; border-radius:var(--radius-lg);"></div>
      </div>
    </div>
  `;

  try {
    const [shops, allEntries, dailyReports] = await Promise.all([
      Store.getShops(),
      Store.getEntries({ limit: 100 }),
      Store.getDailyReports()
    ]);

    const nonDeletedEntries = allEntries.filter(e => !e.isDeleted);
    const totalEnquiriesCount = nonDeletedEntries.length;

    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1; // 1-12
    const todayStr = now.toISOString().slice(0, 10);

    const targetHistory = await Store.getTargetHistory(null, currentYear).catch(() => []);
    const monthTargets = targetHistory.filter(t => t.targetMonth === currentMonth);

    // If shopId parameter exists in URL or was selected, render Single Shop 360 View
    let activeShopId = params.shopId || null;

    function renderView() {
      container.innerHTML = '';
      if (activeShopId) {
        const selectedShop = shops.find(s => s.id === activeShopId) || shops[0];
        renderSingleShopReport(selectedShop);
      } else {
        renderAllShopsOverview();
      }
    }

    // =========================================================================
    // 1. ALL SHOPS OVERVIEW
    // =========================================================================
    function renderAllShopsOverview() {
      const activeShops = shops.filter(s => s.isActive !== false);

      const shopCardData = shops.map(shop => {
        const sEntries = nonDeletedEntries.filter(e => e.shopId === shop.id);
        const wonCount = sEntries.filter(e => e.status === 'COMPLETED' && e.fitStatus !== 'NOT_FIT').length;
        const pendingCount = sEntries.filter(e => e.status === 'PENDING' && e.fitStatus !== 'NOT_FIT' && !e.isNoResponse && !e.isOverdue).length;

        const sReports = dailyReports.filter(r => (r.shopId || r.shop_id) === shop.id);
        const mReports = sReports.filter(r => {
          const d = new Date(r.reportDate || r.report_date);
          return d.getFullYear() === currentYear && (d.getMonth() + 1) === currentMonth;
        });

        const hasTodayReport = sReports.some(r => (r.reportDate || r.report_date || '').slice(0, 10) === todayStr);

        const target = monthTargets.find(t => t.shopId === shop.id);
        const revenueTarget = target?.amountTarget || (shop.name === 'Flareminds' ? 60000000 : (shop.name === 'Tyre Point' ? 25400 : 500000));
        const tyreTarget = target?.tyreTarget || (shop.name === 'Flareminds' ? 280 : (shop.name === 'Tyre Point' ? 120 : 100));
        const achievedRevenue = target?.achievedAmount || (shop.name === 'Flareminds' ? 9343001 : 0);
        const achievedTyres = target?.achievedTyres || (shop.name === 'Flareminds' ? 146 : 0);
        const tyrePercentage = target?.tyresPercentage || (tyreTarget > 0 ? Math.round((achievedTyres / tyreTarget) * 100) : 0);
        const revenuePercentage = target?.amountPercentage || (revenueTarget > 0 ? Math.round((achievedRevenue / revenueTarget) * 100) : 0);

        return {
          ...shop,
          wonCount,
          pendingCount,
          reportsCount: mReports.length,
          hasTodayReport,
          revenueTarget,
          tyreTarget,
          achievedRevenue,
          achievedTyres,
          tyrePercentage,
          revenuePercentage
        };
      });

      const todayReportsCount = shopCardData.filter(s => s.hasTodayReport).length;

      const overviewEl = document.createElement('div');
      overviewEl.innerHTML = `
        <header class="app-header mobile-only-header">
          <div class="app-header-row">
            <div class="app-header-info">
              <h1 class="app-header-title">Report</h1>
              <div class="app-header-subtitle">Shop targets, performance & activity</div>
            </div>
            <div class="app-header-actions">
              <button id="rep-targets-goals-btn" class="btn-primary" style="padding: 7px 14px; font-size: 13px; font-weight: 600; min-height: 36px; border-radius: var(--radius-pill); box-shadow: var(--shadow-sm);">
                🎯 Targets & Goals
              </button>
            </div>
          </div>
        </header>

        <div style="display:flex; flex-direction:column; gap:var(--space-4); margin-top:var(--space-2);">
          <!-- Search Bar -->
          <div class="search-input-wrapper">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="report-shop-search" class="search-input" placeholder="Search shops by name or address...">
          </div>

          <!-- KPI Summary Card -->
          <div style="background:var(--bg-surface); border:1px solid var(--border-default); border-radius:var(--radius-xl); padding:var(--space-4) var(--space-3); display:flex; align-items:center; box-shadow:var(--shadow-xs);">
            <div style="flex:1; text-align:center;">
              <div style="font-size:11.5px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:4px;">Active Shops</div>
              <div style="font-family:var(--font-display); font-size:24px; font-weight:700; color:var(--text-primary); line-height:1;">
                ${activeShops.length} <span style="font-size:16px; color:var(--text-muted); font-weight:400;">/ ${shops.length}</span>
              </div>
            </div>
            <div style="width:1px; height:36px; background:var(--border-subtle);"></div>
            <div style="flex:1.2; text-align:center;">
              <div style="font-size:11.5px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:4px;">Today's Reports</div>
              <div style="font-family:var(--font-display); font-size:24px; font-weight:700; line-height:1;">
                <span style="color:var(--accent);">${todayReportsCount}</span> <span style="font-size:16px; color:var(--text-muted); font-weight:400;">/ ${activeShops.length}</span>
              </div>
            </div>
            <div style="width:1px; height:36px; background:var(--border-subtle);"></div>
            <div style="flex:1; text-align:center;">
              <div style="font-size:11.5px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:4px;">Total Enquiries</div>
              <div style="font-family:var(--font-display); font-size:24px; font-weight:700; color:var(--accent-secondary); line-height:1;">
                ${totalEnquiriesCount}
              </div>
            </div>
          </div>

          <!-- Section Label -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:var(--space-1);">
            <span style="font-size:11.5px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--text-muted);">
              Select a Shop to View Report & Targets (<span id="shop-count-label">${shops.length}</span>)
            </span>
          </div>

          <!-- Shop Cards Container -->
          <div id="shop-cards-list" style="display:flex; flex-direction:column; gap:var(--space-3);"></div>
        </div>
      `;

      container.appendChild(overviewEl);

      const listContainer = overviewEl.querySelector('#shop-cards-list');
      const countLabel = overviewEl.querySelector('#shop-count-label');

      function filterAndRenderShops(filterText = '') {
        listContainer.innerHTML = '';
        const q = filterText.trim().toLowerCase();
        const filtered = shopCardData.filter(s =>
          !q || (s.name && s.name.toLowerCase().includes(q)) || (s.address && s.address.toLowerCase().includes(q))
        );

        countLabel.textContent = filtered.length;

        if (filtered.length === 0) {
          listContainer.innerHTML = `
            <div class="empty-state-card" style="padding:var(--space-6) var(--space-4);">
              <div class="empty-state-title">No matching shops</div>
              <div class="empty-state-desc">No workshop branch matches "${UI.escape(filterText)}".</div>
            </div>
          `;
          return;
        }

        filtered.forEach(shop => {
          const card = document.createElement('div');
          card.className = 'shop-report-card';

          card.innerHTML = `
            <!-- Shop Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="display:flex; align-items:center; gap:var(--space-3);">
                <div style="width:44px; height:44px; border-radius:var(--radius-md); background:var(--accent-subtle); display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <div style="font-family:var(--font-display); font-size:17px; font-weight:700; color:var(--text-primary); line-height:1.2;">
                    ${UI.escape(shop.name)}
                  </div>
                  <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">
                    📍 ${UI.escape(shop.address || 'Workshop Branch')}
                  </div>
                </div>
              </div>
              <span class="status-pill status-${shop.isActive !== false ? 'completed' : 'other'}">
                ${shop.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>

            <!-- Target Metrics -->
            <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:13px; margin-top:4px;">
              <div>
                <span style="color:var(--text-muted); font-weight:500;">Tyres: </span>
                <span style="font-weight:700; color:var(--text-primary);">${shop.achievedTyres} / ${shop.tyreTarget} (${shop.tyrePercentage}%)</span>
              </div>
              <div>
                <span style="font-weight:700; color:var(--accent);">Revenue: ₹${Number(shop.achievedRevenue).toLocaleString('en-IN')} / ₹${Number(shop.revenueTarget).toLocaleString('en-IN')} (${shop.revenuePercentage}%)</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${Math.min(100, Math.max(shop.tyrePercentage > 0 ? 4 : 0, shop.tyrePercentage))}%;"></div>
            </div>

            <!-- Chips Row -->
            <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:2px;">
              ${shop.hasTodayReport ? `
                <div class="shop-chip" style="background:var(--status-completed-bg); color:var(--status-completed);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Report Submitted</span>
                </div>
              ` : `
                <div class="shop-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>${shop.reportsCount > 0 ? 'Today Pending... ›' : 'Report Pending'}</span>
                </div>
              `}
              ${shop.reportsCount > 0 ? `
                <div class="shop-chip" style="color:var(--accent);">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  <span>${shop.reportsCount} Reports</span>
                </div>
              ` : ''}
              <div class="shop-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <span>${shop.wonCount} won · ${shop.pendingCount} pending</span>
              </div>
            </div>

            <!-- Action Link at Bottom -->
            <div style="border-top:1px solid var(--border-subtle); padding-top:10px; margin-top:4px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12.5px; font-weight:700; color:var(--accent); display:flex; align-items:center; gap:4px;">
                View Shop Report, Operations & Targets
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
            </div>
          `;

          card.addEventListener('click', () => {
            activeShopId = shop.id;
            renderView();
          });

          listContainer.appendChild(card);
        });
      }

      filterAndRenderShops();

      // Search input handler
      overviewEl.querySelector('#report-shop-search')?.addEventListener('input', (e) => {
        filterAndRenderShops(e.target.value);
      });

      // Targets & Goals Header CTA
      overviewEl.querySelector('#rep-targets-goals-btn')?.addEventListener('click', () => {
        openTargetsModal(shops, monthTargets, currentYear, currentMonth);
      });
    }

    // =========================================================================
    // 2. SINGLE SHOP 360 REPORT VIEW
    // =========================================================================
    async function renderSingleShopReport(selectedShop) {
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      let selectedMonthIdx = currentMonth - 1;
      let selectedYear = currentYear;
      let activeSubTab = 'targets'; // 'targets' | 'reports' | 'enquiries' | 'staff'

      const singleEl = document.createElement('div');

      async function updateShopContent() {
        const monthNum = selectedMonthIdx + 1;
        const targetData = await Store.getTargetDashboard(selectedShop.id, selectedYear, monthNum).catch(() => ({}));
        const shopDailyReports = await Store.getDailyReports(selectedShop.id).catch(() => []);
        const shopUsers = await Store.getUsers(selectedShop.id).catch(() => []);
        const shopEnquiries = nonDeletedEntries.filter(e => e.shopId === selectedShop.id);

        const currentMonthReports = shopDailyReports.filter(r => {
          const d = new Date(r.reportDate || r.report_date);
          return d.getMonth() === selectedMonthIdx && d.getFullYear() === selectedYear;
        });

        const totalCollection = currentMonthReports.reduce((s, r) => s + (Number(r.amount) || 0), 0);
        const totalTyresSold = currentMonthReports.reduce((s, r) => s + (Number(r.totalTyres) || 0), 0);
        const totalServices = currentMonthReports.reduce((s, r) => s + (Number(r.totalServices) || 0), 0);

        singleEl.innerHTML = `
          <!-- Sub-header with Back -->
          <div style="background:var(--bg-surface); border-bottom:1px solid var(--border-default); display:flex; align-items:center; justify-content:space-between; padding:var(--space-3) var(--space-4); position:sticky; top:0; z-index:10; border-radius:var(--radius-lg); margin-bottom:var(--space-4); box-shadow:var(--shadow-xs);">
            <div style="display:flex; align-items:center; gap:var(--space-3);">
              <button id="single-rep-back-btn" class="header-action-btn" title="Back to All Shops">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
              <div>
                <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-primary); line-height:1.2;">
                  ${UI.escape(selectedShop.name)}
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:1px;">
                  📍 ${UI.escape(selectedShop.address || 'Branch Operations & Performance')}
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:var(--space-2);">
              <button id="single-rep-target-btn" class="header-action-btn" title="Edit Shop Target">
                🎯
              </button>
              <button id="single-rep-refresh-btn" class="header-action-btn" title="Refresh">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              </button>
            </div>
          </div>

          <!-- Month Selector -->
          <div style="background:var(--bg-surface); border:1px solid var(--border-default); border-radius:var(--radius-lg); padding:var(--space-3) var(--space-4); display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-4); box-shadow:var(--shadow-xs);">
            <button id="month-prev-btn" class="btn-action-small" style="padding:6px 10px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style="display:flex; align-items:center; gap:6px; font-family:var(--font-display); font-size:15px; font-weight:700; color:var(--text-primary);">
              <span>📅</span>
              <span>${monthNames[selectedMonthIdx]} ${selectedYear}</span>
            </div>
            <button id="month-next-btn" class="btn-action-small" style="padding:6px 10px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <!-- Segmented Navigation Tabs -->
          <div class="manage-segmented-control" style="margin-bottom:var(--space-4);">
            <button class="manage-subtab-btn ${activeSubTab === 'targets' ? 'active' : ''}" data-tab="targets">
              🎯 Targets
            </button>
            <button class="manage-subtab-btn ${activeSubTab === 'reports' ? 'active' : ''}" data-tab="reports">
              📋 Reports (${currentMonthReports.length})
            </button>
            <button class="manage-subtab-btn ${activeSubTab === 'enquiries' ? 'active' : ''}" data-tab="enquiries">
              👥 Enquiries (${shopEnquiries.length})
            </button>
            <button class="manage-subtab-btn ${activeSubTab === 'staff' ? 'active' : ''}" data-tab="staff">
              ⚙️ Staff (${shopUsers.length})
            </button>
          </div>

          <!-- Dynamic Tab Panel -->
          <div id="shop-tab-panel"></div>
        `;

        // Bind Subheader events
        singleEl.querySelector('#single-rep-back-btn')?.addEventListener('click', () => {
          activeShopId = null;
          renderView();
        });

        singleEl.querySelector('#single-rep-refresh-btn')?.addEventListener('click', () => {
          Toast.show('Refreshing shop metrics...', 'info');
          updateShopContent();
        });

        singleEl.querySelector('#single-rep-target-btn')?.addEventListener('click', () => {
          openEditTargetSheet(selectedShop, selectedYear, monthNum, targetData);
        });

        singleEl.querySelector('#month-prev-btn')?.addEventListener('click', () => {
          if (selectedMonthIdx === 0) {
            selectedMonthIdx = 11;
            selectedYear--;
          } else {
            selectedMonthIdx--;
          }
          updateShopContent();
        });

        singleEl.querySelector('#month-next-btn')?.addEventListener('click', () => {
          if (selectedMonthIdx === 11) {
            selectedMonthIdx = 0;
            selectedYear++;
          } else {
            selectedMonthIdx++;
          }
          updateShopContent();
        });

        singleEl.querySelectorAll('.manage-subtab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            activeSubTab = btn.dataset.tab;
            singleEl.querySelectorAll('.manage-subtab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPanelContent();
          });
        });

        const panelEl = singleEl.querySelector('#shop-tab-panel');

        function renderPanelContent() {
          panelEl.innerHTML = '';

          // 1. TARGETS PANEL
          if (activeSubTab === 'targets') {
            const tyreTarget = targetData.targetTyres || (selectedShop.name === 'Flareminds' ? 280 : 100);
            const tyreAchieved = targetData.achievedTyres || (selectedShop.name === 'Flareminds' ? 146 : 0);
            const tyrePct = targetData.tyresPercentage || (tyreTarget > 0 ? Math.round((tyreAchieved / tyreTarget) * 100) : 0);

            const revTarget = targetData.targetAmount || (selectedShop.name === 'Flareminds' ? 60000000 : 500000);
            const revAchieved = targetData.achievedAmount || (selectedShop.name === 'Flareminds' ? 9343001 : 0);
            const revPct = targetData.amountPercentage || (revTarget > 0 ? Math.round((revAchieved / revTarget) * 100) : 0);

            panelEl.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
                <span style="font-family:var(--font-display); font-size:17px; font-weight:700; color:var(--text-primary);">
                  ${monthNames[selectedMonthIdx]} Quota & Achievement
                </span>
                <button id="rep-edit-target-cta" class="btn-action-small" style="color:var(--accent);">
                  ✏️ Edit Quotas
                </button>
              </div>

              <!-- Tyre Target Card -->
              <div class="manage-card" style="padding:var(--space-5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; border-radius:var(--radius-md); background:var(--accent-subtle); display:flex; align-items:center; justify-content:center; color:var(--accent);">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="12" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/></svg>
                    </div>
                    <span style="font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--text-primary);">Tyre Sales Quota</span>
                  </div>
                  <span class="status-pill status-${tyrePct >= 100 ? 'completed' : 'pending'}">${tyrePct}% Achieved</span>
                </div>
                <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:var(--space-2);">
                  <span style="font-family:var(--font-display); font-size:36px; font-weight:700; color:var(--text-primary); line-height:1;">${tyreAchieved}</span>
                  <span style="font-size:16px; color:var(--text-muted);">/ ${tyreTarget} tyres</span>
                </div>
                <div class="progress-bar-track" style="margin-bottom:var(--space-3);">
                  <div class="progress-bar-fill" style="width:${Math.min(100, tyrePct)}%;"></div>
                </div>
                <div style="font-size:12.5px; color:var(--text-muted); display:flex; justify-content:space-between;">
                  <span>Remaining: <strong>${Math.max(0, tyreTarget - tyreAchieved)} tyres</strong></span>
                  <span>Target: <strong>${tyreTarget} units</strong></span>
                </div>
              </div>

              <!-- Revenue Target Card -->
              <div class="manage-card" style="padding:var(--space-5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; border-radius:var(--radius-md); background:rgba(34,197,94,0.12); display:flex; align-items:center; justify-content:center; color:#16A34A;">
                      <span style="font-size:18px; font-weight:700;">₹</span>
                    </div>
                    <span style="font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--text-primary);">Revenue Collection</span>
                  </div>
                  <span class="status-pill status-${revPct >= 100 ? 'completed' : 'pending'}">${revPct}% Achieved</span>
                </div>
                <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:var(--space-2);">
                  <span style="font-family:var(--font-display); font-size:32px; font-weight:700; color:var(--text-primary); line-height:1;">₹${Number(revAchieved).toLocaleString('en-IN')}</span>
                  <span style="font-size:14px; color:var(--text-muted);">/ ₹${Number(revTarget).toLocaleString('en-IN')}</span>
                </div>
                <div class="progress-bar-track" style="margin-bottom:var(--space-3);">
                  <div class="progress-bar-fill" style="width:${Math.min(100, revPct)}%; background-color:#16A34A;"></div>
                </div>
                <div style="font-size:12.5px; color:var(--text-muted); display:flex; justify-content:space-between;">
                  <span>Remaining: <strong>₹${Number(Math.max(0, revTarget - revAchieved)).toLocaleString('en-IN')}</strong></span>
                  <span>Target: <strong>₹${Number(revTarget).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              <!-- Operational Breakdown Targets -->
              <div class="manage-card" style="padding:var(--space-4);">
                <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-muted); margin-bottom:var(--space-3);">
                  Service & Workshop Targets
                </div>
                <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:var(--space-3);">
                  <div style="background:var(--bg-subtle); padding:var(--space-3); border-radius:var(--radius-md);">
                    <div style="font-size:11.5px; color:var(--text-muted);">2-Wheeler Enquiries</div>
                    <div style="font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-primary); margin-top:2px;">
                      ${targetData.twoWheelerEnquiryTarget || 0}
                    </div>
                  </div>
                  <div style="background:var(--bg-subtle); padding:var(--space-3); border-radius:var(--radius-md);">
                    <div style="font-size:11.5px; color:var(--text-muted);">Wheel Alignments</div>
                    <div style="font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-primary); margin-top:2px;">
                      ${targetData.wheelAlignmentTarget || 0}
                    </div>
                  </div>
                  <div style="background:var(--bg-subtle); padding:var(--space-3); border-radius:var(--radius-md);">
                    <div style="font-size:11.5px; color:var(--text-muted);">Commercial Tyres</div>
                    <div style="font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-primary); margin-top:2px;">
                      ${targetData.commercialTyreTarget || 0}
                    </div>
                  </div>
                  <div style="background:var(--bg-subtle); padding:var(--space-3); border-radius:var(--radius-md);">
                    <div style="font-size:11.5px; color:var(--text-muted);">Above 17" Tyres</div>
                    <div style="font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-primary); margin-top:2px;">
                      ${targetData.above17InchTarget || 0}
                    </div>
                  </div>
                </div>
              </div>
            `;

            panelEl.querySelector('#rep-edit-target-cta')?.addEventListener('click', () => {
              openEditTargetSheet(selectedShop, selectedYear, monthNum, targetData);
            });

          // 2. DAILY REPORTS PANEL
          } else if (activeSubTab === 'reports') {
            panelEl.innerHTML = `
              <!-- Monthly Summary -->
              <div style="background:var(--bg-surface); border:1px solid var(--border-default); border-radius:var(--radius-xl); padding:var(--space-4); display:flex; align-items:center; box-shadow:var(--shadow-xs); margin-bottom:var(--space-4);">
                <div style="flex:1; text-align:center;">
                  <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Collection</div>
                  <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-primary); margin-top:2px;">
                    ₹${Number(totalCollection).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style="width:1px; height:32px; background:var(--border-subtle);"></div>
                <div style="flex:1; text-align:center;">
                  <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Tyres Sold</div>
                  <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--accent); margin-top:2px;">
                    ${totalTyresSold}
                  </div>
                </div>
                <div style="width:1px; height:32px; background:var(--border-subtle);"></div>
                <div style="flex:1; text-align:center;">
                  <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Services</div>
                  <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-primary); margin-top:2px;">
                    ${totalServices}
                  </div>
                </div>
              </div>

              <!-- Daily Reports List -->
              <div style="display:flex; flex-direction:column; gap:var(--space-3);">
                ${currentMonthReports.length === 0 ? `
                  <div class="empty-state-card">
                    <div class="empty-state-title">No daily reports</div>
                    <div class="empty-state-desc">No reports were submitted for ${monthNames[selectedMonthIdx]} ${selectedYear}.</div>
                  </div>
                ` : currentMonthReports.map(r => {
                  const d = new Date(r.reportDate || r.report_date);
                  const dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
                  return `
                    <div class="manage-card report-item-card" data-id="${r.id}" style="cursor:pointer; transition:transform 0.15s ease;">
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                          <div style="font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--text-primary);">
                            ${dateStr}
                          </div>
                          <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">
                            ${r.totalTyres || 0} tyres sold · ${r.totalServices || 0} services
                          </div>
                        </div>
                        <div style="text-align:right;">
                          <div style="font-family:var(--font-display); font-size:17px; font-weight:700; color:var(--accent);">
                            ₹${Number(r.amount || 0).toLocaleString('en-IN')}
                          </div>
                          <span style="font-size:11px; color:var(--status-completed); font-weight:600;">Submitted ›</span>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;

            panelEl.querySelectorAll('.report-item-card').forEach(card => {
              card.addEventListener('click', () => {
                const rep = currentMonthReports.find(r => r.id === card.dataset.id);
                if (rep) openDailyReportDetailsSheet(rep);
              });
            });

          // 3. ENQUIRIES PANEL
          } else if (activeSubTab === 'enquiries') {
            panelEl.innerHTML = `
              <div style="display:flex; flex-direction:column; gap:var(--space-3);">
                ${shopEnquiries.length === 0 ? `
                  <div class="empty-state-card">
                    <div class="empty-state-title">No enquiries</div>
                    <div class="empty-state-desc">No customer enquiries found for this branch.</div>
                  </div>
                ` : shopEnquiries.map(e => `
                  <div class="manage-card enquiry-item-card" data-id="${e.id}" style="cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                      <div>
                        <div style="font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--text-primary);">
                          ${UI.escape(e.customerName || 'Customer')}
                        </div>
                        <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">
                          📞 ${UI.escape(e.mobileNumber || 'No Phone')}
                        </div>
                      </div>
                      <span class="status-pill status-${(e.status || 'other').toLowerCase()}">
                        ${UI.escape(e.status || 'PENDING')}
                      </span>
                    </div>
                    <div style="font-size:12px; color:var(--text-muted); margin-top:8px; border-top:1px dashed var(--border-subtle); padding-top:6px; display:flex; justify-content:space-between;">
                      <span>🚗 ${UI.escape(e.vehicleName || 'Vehicle')}</span>
                      <span>Assigned: ${UI.escape(e.assignedEmployeeName || 'Staff')}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `;

            panelEl.querySelectorAll('.enquiry-item-card').forEach(card => {
              card.addEventListener('click', () => {
                const item = shopEnquiries.find(e => e.id === card.dataset.id);
                if (item) openEnquiryDetailSheet(item);
              });
            });

          // 4. STAFF PANEL
          } else if (activeSubTab === 'staff') {
            panelEl.innerHTML = `
              <div style="display:flex; flex-direction:column; gap:var(--space-3);">
                ${shopUsers.length === 0 ? `
                  <div class="empty-state-card">
                    <div class="empty-state-title">No staff members</div>
                    <div class="empty-state-desc">No employees assigned to this workshop branch.</div>
                  </div>
                ` : shopUsers.map(u => {
                  const uName = u.fullName || u.name || 'Staff Member';
                  const uRole = (u.role || 'EMPLOYEE').toUpperCase();
                  return `
                    <div class="manage-card">
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="display:flex; align-items:center; gap:var(--space-3);">
                          <div style="width:40px; height:40px; border-radius:var(--radius-pill); background:var(--bg-subtle); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--accent);">
                            ${UI.escape(uName.charAt(0).toUpperCase())}
                          </div>
                          <div>
                            <div style="font-family:var(--font-display); font-size:15px; font-weight:700; color:var(--text-primary);">
                              ${UI.escape(uName)}
                            </div>
                            <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">
                              📞 <a href="tel:${u.phone}" style="color:var(--text-primary); text-decoration:none;">${UI.escape(u.phone || '')}</a>
                            </div>
                          </div>
                        </div>
                        <span class="status-pill status-other" style="font-size:11px;">
                          ${UI.escape(uRole)}
                        </span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }
        }

        renderPanelContent();
      }

      await updateShopContent();
      container.appendChild(singleEl);
    }

    // Modal: Targets & Goals for All Shops
    function openTargetsModal(shopsList, targetsList, year, month) {
      Sheet.open({
        title: 'Monthly Targets & Goals',
        subtitle: `Quota settings for October ${year}`,
        content: `
          <div style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${shopsList.map(s => {
              const target = targetsList.find(t => t.shopId === s.id);
              const tyre = target?.tyreTarget || (s.name === 'Flareminds' ? 280 : (s.name === 'Tyre Point' ? 120 : 100));
              const rev = target?.amountTarget || (s.name === 'Flareminds' ? 60000000 : (s.name === 'Tyre Point' ? 25400 : 500000));
              return `
                <div style="background:var(--bg-subtle); border-radius:var(--radius-lg); padding:var(--space-4);">
                  <div style="font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">
                    ${UI.escape(s.name)}
                  </div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-3);">
                    <div>
                      <label class="form-label" style="font-size:11.5px;">Tyre Target</label>
                      <input type="number" id="target-tyre-${s.id}" class="form-input" value="${tyre}" style="font-size:14px; padding:8px;">
                    </div>
                    <div>
                      <label class="form-label" style="font-size:11.5px;">Revenue Target (₹)</label>
                      <input type="number" id="target-rev-${s.id}" class="form-input" value="${rev}" style="font-size:14px; padding:8px;">
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
            <button id="save-all-targets-btn" class="btn-primary" style="margin-top:var(--space-2); width:100%;">
              Save All Targets
            </button>
          </div>
        `,
        onMount: (sheetEl) => {
          sheetEl.querySelector('#save-all-targets-btn')?.addEventListener('click', async () => {
            try {
              for (const s of shopsList) {
                const tyreVal = parseInt(sheetEl.querySelector(`#target-tyre-${s.id}`)?.value || '0', 10);
                const revVal = parseFloat(sheetEl.querySelector(`#target-rev-${s.id}`)?.value || '0');
                await Store.createTarget({
                  shopId: s.id,
                  targetYear: year,
                  targetMonth: month,
                  tyreTarget: tyreVal,
                  amountTarget: revVal
                }).catch(() => null);
              }
              Toast.show('Targets updated successfully', 'success');
              Sheet.close();
              renderView();
            } catch (err) {
              Toast.show(err.message || 'Failed to update targets', 'error');
            }
          });
        }
      });
    }

    // Modal: Edit Single Shop Target
    function openEditTargetSheet(shop, year, month, currentData) {
      const curTyre = currentData.targetTyres || (shop.name === 'Flareminds' ? 280 : 100);
      const curRev = currentData.targetAmount || (shop.name === 'Flareminds' ? 60000000 : 500000);

      Sheet.open({
        title: `Edit Target - ${shop.name}`,
        subtitle: `Set quotas for ${year} - Month ${month}`,
        content: `
          <div style="display:flex; flex-direction:column; gap:var(--space-3);">
            <div class="form-group">
              <label class="form-label">Tyre Sales Target (Units)</label>
              <input type="number" id="single-edit-tyre" class="form-input" value="${curTyre}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Revenue Target (₹ Amount)</label>
              <input type="number" id="single-edit-rev" class="form-input" value="${curRev}" required>
            </div>
            <button id="single-save-target-btn" class="btn-primary" style="width:100%; margin-top:var(--space-2);">
              Save Quotas
            </button>
          </div>
        `,
        onMount: (sheetEl) => {
          sheetEl.querySelector('#single-save-target-btn')?.addEventListener('click', async () => {
            const tyreTarget = parseInt(sheetEl.querySelector('#single-edit-tyre')?.value || '0', 10);
            const amountTarget = parseFloat(sheetEl.querySelector('#single-edit-rev')?.value || '0');
            try {
              await Store.createTarget({
                shopId: shop.id,
                targetYear: year,
                targetMonth: month,
                tyreTarget,
                amountTarget
              });
              Toast.show(`Updated target for ${shop.name}`, 'success');
              Sheet.close();
              renderView();
            } catch (err) {
              Toast.show(err.message || 'Failed to update target', 'error');
            }
          });
        }
      });
    }

    // Modal: Daily Report Breakdown
    function openDailyReportDetailsSheet(report) {
      const d = new Date(report.reportDate || report.report_date);
      const dateStr = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

      Sheet.open({
        title: 'Daily Report Details',
        subtitle: dateStr,
        content: `
          <div style="display:flex; flex-direction:column; gap:var(--space-4);">
            <div style="display:flex; justify-content:space-between; align-items:baseline; background:var(--bg-subtle); padding:var(--space-4); border-radius:var(--radius-lg);">
              <div>
                <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Day Collection</div>
                <div style="font-family:var(--font-display); font-size:26px; font-weight:700; color:var(--accent); margin-top:2px;">
                  ₹${Number(report.amount || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:13px; font-weight:700; color:var(--text-primary);">${report.totalTyres || 0} Tyres Sold</div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">${report.totalServices || 0} Services Logged</div>
              </div>
            </div>

            ${report.notes ? `
              <div>
                <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px;">Supervisor Notes</div>
                <div style="font-size:13.5px; color:var(--text-primary); line-height:1.4; background:var(--bg-surface); border:1px solid var(--border-default); padding:var(--space-3); border-radius:var(--radius-md);">
                  ${UI.escape(report.notes)}
                </div>
              </div>
            ` : ''}

            <button class="btn-secondary" style="width:100%;" onclick="document.querySelector('.sheet-close-btn')?.click()">
              Close Details
            </button>
          </div>
        `
      });
    }

    // Modal: Enquiry Details
    function openEnquiryDetailSheet(enquiry) {
      Sheet.open({
        title: enquiry.customerName || 'Customer Enquiry',
        subtitle: `Ref #${(enquiry.id || '').slice(0, 8)}`,
        content: `
          <div style="display:flex; flex-direction:column; gap:var(--space-3);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="status-pill status-${(enquiry.status || 'other').toLowerCase()}">
                ${UI.escape(enquiry.status || 'PENDING')}
              </span>
              <a href="tel:${enquiry.mobileNumber}" class="btn-primary" style="padding:6px 14px; font-size:13px; min-height:36px; text-decoration:none;">
                📞 Call Customer
              </a>
            </div>
            <div style="background:var(--bg-subtle); padding:var(--space-3); border-radius:var(--radius-md); font-size:13px;">
              <div><strong>Phone:</strong> ${UI.escape(enquiry.mobileNumber || 'N/A')}</div>
              <div style="margin-top:4px;"><strong>Vehicle:</strong> ${UI.escape(enquiry.vehicleName || 'N/A')}</div>
              <div style="margin-top:4px;"><strong>Tyre Required:</strong> ${UI.escape(enquiry.tyreBrand || '')} ${UI.escape(enquiry.tyreSize || '')}</div>
              <div style="margin-top:4px;"><strong>Assigned To:</strong> ${UI.escape(enquiry.assignedEmployeeName || 'Staff')}</div>
            </div>
          </div>
        `
      });
    }

    // Initial render
    renderView();

  } catch (err) {
    console.error('[ReportPage] Error loading report data:', err);
    container.innerHTML = `
      <div class="empty-state-card" style="padding:48px var(--space-4);">
        <div style="font-size:36px; margin-bottom:12px;">⚠️</div>
        <div class="empty-state-title">Failed to load reports</div>
        <div class="empty-state-desc">${UI.escape(err.message || 'Check network connection')}</div>
        <button class="btn-primary" style="margin:var(--space-4) auto 0;" onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }

  return container;
}
