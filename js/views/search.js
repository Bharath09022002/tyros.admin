// Customer Search Screen matching Flutter CustomerSearchTab
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderSearch(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shopId = Auth.getActiveShopId();
  const allEntries = await Store.getEntries(shopId);

  container.innerHTML = `
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title">Customer Search</div>
          <div class="header-subtitle">Search by Vehicle, Phone or Name</div>
        </div>
      </div>
    </header>

    <div style="padding: 12px 20px 6px;">
      <div style="position: relative;">
        <span style="position: absolute; left: 12px; top: 10px; color: var(--text-muted);">${UI.icons.search(16)}</span>
        <input type="text" id="cust-search-input" class="form-input" placeholder="Type vehicle plate, mobile, or name..." style="padding-left: 36px; border-radius: 20px;">
      </div>
    </div>

    <!-- Date Filter Chips -->
    <div class="filter-chips-row">
      <button class="filter-chip active" data-filter="all">All Dates</button>
      <button class="filter-chip" data-filter="today">Due Today</button>
      <button class="filter-chip" data-filter="thisWeek">This Week</button>
      <button class="filter-chip" data-filter="overdue7d">Overdue > 7d</button>
    </div>

    <div id="search-results-list" style="margin-top: 8px;"></div>
  `;

  const input = container.querySelector('#cust-search-input');
  const resultsEl = container.querySelector('#search-results-list');
  let activeFilter = 'all';

  function filterEntries() {
    const q = input.value.trim().toLowerCase();
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

    const filtered = allEntries.filter(e => {
      // Date filter
      if (activeFilter === 'today' && !e.isDueToday) return false;
      if (activeFilter === 'overdue7d') {
        const d = (e.followUpDate || '').slice(0, 10);
        if (!e.isOverdue || d >= sevenDaysAgoStr) return false;
      }

      // Query
      if (q) {
        const full = `${e.customerName} ${e.mobileNumber} ${e.vehicleNumber} ${e.vehicleDetails} ${e.tyreBrand}`.toLowerCase();
        return full.includes(q);
      }
      return true;
    });

    resultsEl.innerHTML = '';
    if (filtered.length === 0) {
      resultsEl.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="font-size: 15px; font-weight: 600; color: var(--text-main);">No matching records</div>
          <div style="font-size: 12px; margin-top: 4px;">Try searching by mobile number or registration plate.</div>
        </div>
      `;
      return;
    }

    filtered.forEach((entry, idx) => {
      if (idx > 0) {
        const div = document.createElement('div');
        div.className = 'status-row-divider';
        resultsEl.appendChild(div);
      }

      const row = document.createElement('div');
      row.className = `status-row ${entry.isOverdue ? 'overdue' : (entry.isDueToday ? 'pending' : '')}`;
      row.innerHTML = `
        <div class="status-row-info">
          <div class="status-row-name">${entry.customerName}</div>
          <div class="status-row-sub">
            <span style="font-weight: 600; color: var(--text-main);">${entry.vehicleNumber || 'No plate'}</span>
            <span>•</span>
            <span>${entry.vehicleDetails || 'Car'}</span>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
            📞 ${entry.mobileNumber} • Follow-up: ${UI.formatDate(entry.followUpDate, 'short')}
          </div>
        </div>

        <div class="row-quick-actions">
          <a href="tel:${entry.mobileNumber}" class="quick-action-btn call">${UI.icons.phone(14)}</a>
          <a href="https://wa.me/91${entry.mobileNumber}" target="_blank" class="quick-action-btn whatsapp">${UI.icons.whatsapp(14)}</a>
        </div>
      `;

      row.querySelector('.status-row-info').addEventListener('click', () => {
        router.navigate(`/employee/entry/${entry.id}`);
      });

      resultsEl.appendChild(row);
    });
  }

  input.addEventListener('input', filterEntries);
  container.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      filterEntries();
    });
  });

  filterEntries();
  return container;
}
