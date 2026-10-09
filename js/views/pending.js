// Pending Follow-ups Tab matching Flutter PendingFollowupsTab
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderPending(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shopId = Auth.getActiveShopId();
  const shop = await Store.getShopById(shopId);
  const shopName = shop?.name || 'Store';

  const allEntries = await Store.getEntries(shopId);
  const pendingEntries = allEntries.filter(e => (e.status || 'PENDING') === 'PENDING' && (e.fitStatus || 'FIT') === 'FIT');

  container.innerHTML = `
    <!-- Header -->
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title">Pending Follow-ups</div>
          <div class="header-subtitle">${shopName} • ${pendingEntries.length} active</div>
        </div>
        <div class="header-actions">
          <button id="pending-add-btn" class="header-add-btn">
            ${UI.icons.plus(14)} New
          </button>
        </div>
      </div>
    </header>

    <!-- Search Bar -->
    <div style="padding: 12px 20px 4px;">
      <div style="position: relative;">
        <span style="position: absolute; left: 12px; top: 10px; color: var(--text-muted);">${UI.icons.search(16)}</span>
        <input type="text" id="pending-search-input" class="form-input" placeholder="Search customer, vehicle, phone..." style="padding-left: 36px; border-radius: 20px;">
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="filter-chips-row">
      <button class="filter-chip active" data-filter="all">All (${pendingEntries.length})</button>
      <button class="filter-chip" data-filter="overdue">Overdue (${pendingEntries.filter(e => e.isOverdue).length})</button>
      <button class="filter-chip" data-filter="today">Due Today (${pendingEntries.filter(e => e.isDueToday).length})</button>
      <button class="filter-chip" data-filter="upcoming">Upcoming</button>
    </div>

    <!-- List -->
    <div id="pending-list" style="margin-top: 6px;"></div>
  `;

  const listEl = container.querySelector('#pending-list');
  const searchInput = container.querySelector('#pending-search-input');
  let currentFilter = 'all';

  function renderList() {
    listEl.innerHTML = '';
    const query = searchInput.value.trim().toLowerCase();

    const filtered = pendingEntries.filter(e => {
      // Filter tab
      if (currentFilter === 'overdue' && !e.isOverdue) return false;
      if (currentFilter === 'today' && !e.isDueToday) return false;
      if (currentFilter === 'upcoming' && (e.isOverdue || e.isDueToday)) return false;

      // Query
      if (query) {
        const text = `${e.customerName} ${e.mobileNumber} ${e.vehicleNumber} ${e.vehicleDetails} ${e.tyreBrand}`.toLowerCase();
        return text.includes(query);
      }
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="color: var(--status-done); margin-bottom: 8px;">${UI.icons.checkCircle(38)}</div>
          <div style="font-size: 15px; font-weight: 600; color: var(--text-main);">No matching follow-ups</div>
          <div style="font-size: 12px; margin-top: 4px;">Everything caught up or try another search.</div>
        </div>
      `;
      return;
    }

    filtered.forEach((entry, idx) => {
      if (idx > 0) {
        const divider = document.createElement('div');
        divider.className = 'status-row-divider';
        listEl.appendChild(divider);
      }

      const row = document.createElement('div');
      row.className = `status-row ${entry.isOverdue ? 'overdue' : (entry.isDueToday ? 'pending' : '')}`;
      row.innerHTML = `
        <div class="status-row-info">
          <div class="status-row-name">${entry.customerName}</div>
          <div class="status-row-sub">
            <span style="font-weight: 600; color: var(--text-main);">${entry.vehicleNumber || 'No plate'}</span>
            <span>•</span>
            <span>${entry.vehicleDetails || entry.tyreBrand || 'Tyres'}</span>
          </div>
          <div style="font-size: 11px; margin-top: 3px; color: ${entry.isOverdue ? 'var(--status-overdue)' : 'var(--text-sub)'};">
            📅 ${UI.formatDate(entry.followUpDate, 'relative')}
            ${entry.amount ? ` • <strong style="color:var(--text-main)">${UI.formatCurrency(entry.amount)}</strong>` : ''}
          </div>
        </div>

        <div class="row-quick-actions">
          <a href="tel:${entry.mobileNumber}" class="quick-action-btn call" title="Call">
            ${UI.icons.phone(14)}
          </a>
          <a href="https://wa.me/91${entry.mobileNumber}?text=Hi%20${encodeURIComponent(entry.customerName)},%20regarding%20your%20tyre%20enquiry%20at%20${encodeURIComponent(shopName)}" target="_blank" class="quick-action-btn whatsapp" title="WhatsApp">
            ${UI.icons.whatsapp(14)}
          </a>
        </div>

        <span class="status-badge ${entry.isOverdue ? 'overdue' : 'pending'}">
          ${entry.isOverdue ? 'OVERDUE' : 'PENDING'}
        </span>
      `;

      row.querySelector('.status-row-info').addEventListener('click', () => {
        router.navigate(`/employee/entry/${entry.id}`);
      });

      listEl.appendChild(row);
    });
  }

  // Event handlers
  searchInput.addEventListener('input', renderList);

  container.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderList();
    });
  });

  container.querySelector('#pending-add-btn')?.addEventListener('click', () => router.navigate('/employee/add-enquiry'));

  renderList();
  return container;
}
