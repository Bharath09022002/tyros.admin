// Unfit / Not Fitted Follow-ups Tab matching Flutter UnfitFollowupsTab
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderUnfit(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shopId = Auth.getActiveShopId();
  const shop = await Store.getShopById(shopId);
  const shopName = shop?.name || 'Store';

  const allEntries = await Store.getEntries(shopId);
  const unfitEntries = allEntries.filter(e => e.fitStatus === 'NOT_FIT' || e.status === 'LOST');

  container.innerHTML = `
    <!-- Header -->
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title">Not Fitted Follow-ups</div>
          <div class="header-subtitle">${shopName} • ${unfitEntries.length} lost enquiries</div>
        </div>
      </div>
    </header>

    <div class="notice-warn-card" style="margin-top: 14px;">
      <span class="icon">${UI.icons.crossCircle(16)}</span>
      <span class="text">Tracks enquiries where customer purchased elsewhere or cancelled, including competitor details for analytics.</span>
    </div>

    <!-- List -->
    <div id="unfit-list" style="margin-top: 12px;"></div>
  `;

  const listEl = container.querySelector('#unfit-list');

  if (unfitEntries.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
        <div style="font-size: 15px; font-weight: 600; color: var(--text-main);">No lost enquiries</div>
        <div style="font-size: 12px; margin-top: 4px;">Enquiries marked as "Not Fitted" will appear here.</div>
      </div>
    `;
  } else {
    unfitEntries.forEach((entry, idx) => {
      if (idx > 0) {
        const divider = document.createElement('div');
        divider.className = 'status-row-divider';
        listEl.appendChild(divider);
      }

      const row = document.createElement('div');
      row.className = 'status-row unfit';
      row.innerHTML = `
        <div class="status-row-info">
          <div class="status-row-name">${entry.customerName}</div>
          <div class="status-row-sub">
            <span>${entry.vehicleNumber || entry.vehicleDetails || 'Vehicle'}</span>
            <span>•</span>
            <span style="color: var(--status-overdue);">${entry.unfitReason || 'Fitted elsewhere'}</span>
          </div>
          ${entry.outsideShopName ? `
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">
              📍 Competitor: <strong>${entry.outsideShopName}</strong> ${entry.outsideShopLocation ? `(${entry.outsideShopLocation})` : ''}
              ${entry.outsideShopAmount ? `• Quote: ${UI.formatCurrency(entry.outsideShopAmount)}` : ''}
            </div>
          ` : ''}
        </div>

        <span class="status-badge unfit">
          NOT FITTED
        </span>
      `;

      row.addEventListener('click', () => {
        router.navigate(`/employee/entry/${entry.id}`);
      });

      listEl.appendChild(row);
    });
  }

  return container;
}
