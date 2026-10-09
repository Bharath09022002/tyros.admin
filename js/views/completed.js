// Completed Follow-ups Tab matching Flutter CompletedFollowupsTab
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderCompleted(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shopId = Auth.getActiveShopId();
  const shop = await Store.getShopById(shopId);
  const shopName = shop?.name || 'Store';

  const allEntries = await Store.getEntries(shopId);
  const completedEntries = allEntries.filter(e => (e.status === 'COMPLETED' || e.status === 'WON') && e.fitStatus === 'FIT');
  const totalRevenue = completedEntries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  container.innerHTML = `
    <!-- Header -->
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title">Completed Orders</div>
          <div class="header-subtitle">${shopName} • ${completedEntries.length} won • ${UI.formatCurrency(totalRevenue)}</div>
        </div>
      </div>
    </header>

    <!-- List -->
    <div id="completed-list" style="margin-top: 10px;"></div>
  `;

  const listEl = container.querySelector('#completed-list');

  if (completedEntries.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
        <div style="font-size: 15px; font-weight: 600; color: var(--text-main);">No completed orders yet</div>
        <div style="font-size: 12px; margin-top: 4px;">Orders marked as "Won / Fitted" will appear here.</div>
      </div>
    `;
  } else {
    completedEntries.forEach((entry, idx) => {
      if (idx > 0) {
        const divider = document.createElement('div');
        divider.className = 'status-row-divider';
        listEl.appendChild(divider);
      }

      const row = document.createElement('div');
      row.className = 'status-row done';
      row.innerHTML = `
        <div class="status-row-info">
          <div class="status-row-name">${entry.customerName}</div>
          <div class="status-row-sub">
            <span style="font-weight: 600; color: var(--text-main);">${entry.vehicleNumber || 'Vehicle'}</span>
            <span>•</span>
            <span>${entry.vehicleDetails || entry.tyreBrand || 'Tyres'}</span>
          </div>
          <div style="font-size: 11px; margin-top: 3px; color: var(--text-sub);">
            ${entry.quantity ? `${entry.quantity} Tyres • ` : ''}
            <strong style="color: var(--status-done); font-size: 12px;">${UI.formatCurrency(entry.amount || 0)}</strong>
          </div>
        </div>

        <button class="util-btn view-bill-btn" style="background: rgba(46,125,50,0.1); border-color: var(--status-done); color: var(--status-done);">
          📄 Bill
        </button>

        <span class="status-badge done">
          DONE
        </span>
      `;

      row.querySelector('.status-row-info').addEventListener('click', () => {
        router.navigate(`/employee/entry/${entry.id}`);
      });

      row.querySelector('.view-bill-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        router.navigate(`/employee/billing/${entry.id}`);
      });

      listEl.appendChild(row);
    });
  }

  return container;
}
