// Billing Screen & Store-Branded Invoice matching Flutter BillingScreen
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderBilling(router, params) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const entryId = params.id;
  const entry = await Store.getEntryById(entryId);

  if (!entry) {
    container.innerHTML = `
      <header class="sub-header">
        <button class="back-btn" onclick="history.back()">${UI.icons.back(18)}</button>
        <div class="sub-header-title">Invoice</div>
      </header>
      <div style="text-align: center; padding: 40px;">Entry not found</div>
    `;
    return container;
  }

  const shop = await Store.getShopById(entry.shopId);
  const shopName = shop?.name || entry.shopName || 'Tyros Tyre Care';
  const shopAddress = shop?.address || 'Chennai, Tamil Nadu';
  const shopPhone = shop?.phone || '9840011223';

  const invNumber = `INV-${(shopName.slice(0,2) || 'TY').toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const invDate = UI.formatDate(new Date(), 'short');

  // Pre-populate line items from entry
  const lineItems = [
    {
      description: `${entry.tyreBrand || 'Tyre'} ${entry.tyreSize || ''}`.trim() || 'New Tyres',
      qty: entry.quantity || 4,
      rate: entry.quantity && entry.amount ? Math.round(entry.amount / entry.quantity) : 7100
    },
    {
      description: 'Computerised Wheel Alignment',
      qty: 1,
      rate: 350
    },
    {
      description: 'Wheel Balancing & Weights',
      qty: entry.quantity || 4,
      rate: 150
    }
  ];

  function calcTotal() {
    return lineItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  }

  container.innerHTML = `
    <header class="sub-header">
      <button id="bill-back-btn" class="back-btn" title="Back">
        ${UI.icons.back(18)}
      </button>
      <div class="sub-header-content">
        <div class="sub-header-title">Invoice & Bill</div>
        <div class="sub-header-context">${invNumber}</div>
      </div>
      <button id="bill-print-top-btn" class="sub-header-action">Print</button>
    </header>

    <div style="padding: 10px 0 30px;">
      <!-- Store Invoice Paper Card -->
      <div class="invoice-card" id="printable-invoice">
        <div class="invoice-header">
          <div style="display:inline-block; width:36px; height:36px; background:#22201E; border-radius:8px; margin-bottom:6px; padding:6px; color:#fff;">
            ${UI.icons.tyre(24, '#F3EFE7')}
          </div>
          <div class="invoice-shop-name">${shopName}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${shopAddress} • Tel: ${shopPhone}</div>
          <div style="display: inline-block; background: #22201E; color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; margin-top: 6px;">
            Tax Invoice / Cash Receipt
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 11.5px; border-bottom: 1px dashed var(--border-color); padding-bottom: 10px; margin-bottom: 10px;">
          <div>
            <div style="color:var(--text-muted); font-size:10px; text-transform:uppercase;">Customer:</div>
            <div style="font-weight: 700; font-size: 13px; color: var(--text-main);">${entry.customerName}</div>
            <div>Mob: ${entry.mobileNumber}</div>
            <div>Veh: <strong>${entry.vehicleNumber || 'Customer Vehicle'}</strong> (${entry.vehicleDetails || 'Car'})</div>
          </div>
          <div style="text-align: right;">
            <div style="color:var(--text-muted); font-size:10px; text-transform:uppercase;">Invoice No:</div>
            <div style="font-weight: 700; font-family: var(--font-condensed); font-size: 14px;">${invNumber}</div>
            <div>Date: ${invDate}</div>
          </div>
        </div>

        <!-- Line Items Table -->
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 50%;">Item / Service</th>
              <th style="text-align: center; width: 15%;">Qty</th>
              <th style="text-align: right; width: 15%;">Rate ₹</th>
              <th style="text-align: right; width: 20%;">Total ₹</th>
            </tr>
          </thead>
          <tbody id="invoice-tbody"></tbody>
        </table>

        <!-- Totals -->
        <div style="border-top: 1px dashed var(--border-color); padding-top: 10px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
            <span style="color:var(--text-muted);">Subtotal:</span>
            <span id="bill-subtotal" style="font-weight:600;"></span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
            <span style="color:var(--text-muted);">GST (Included):</span>
            <span style="font-weight:600;">18% Included</span>
          </div>
          <div class="invoice-total-row">
            <span>Net Amount Due:</span>
            <span id="bill-grand-total" style="color:var(--accent-rust);"></span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 11px; color: var(--text-muted); border-top: 1px dashed var(--border-color); padding-top: 10px;">
          Thank you for choosing ${shopName}! Drive safe!
        </div>
      </div>

      <!-- Actions -->
      <div style="padding: 0 20px; display: flex; flex-direction: column; gap: 10px;">
        <button id="bill-print-btn" class="btn-primary-cta" style="margin: 0;">
          🖨️ Print / Save PDF Invoice
        </button>

        <a id="bill-wa-btn" href="#" target="_blank" class="btn-dark-cta" style="margin: 0; background: #16A34A; text-decoration: none;">
          ${UI.icons.whatsapp(18)} Send Invoice to Customer WhatsApp
        </a>
      </div>
    </div>
  `;

  const tbody = container.querySelector('#invoice-tbody');
  const subtotalEl = container.querySelector('#bill-subtotal');
  const grandTotalEl = container.querySelector('#bill-grand-total');

  function renderRows() {
    tbody.innerHTML = '';
    lineItems.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-weight: 500;">${item.description}</td>
        <td style="text-align: center;">${item.qty}</td>
        <td style="text-align: right;">${UI.formatCurrency(item.rate)}</td>
        <td style="text-align: right; font-weight: 600;">${UI.formatCurrency(item.qty * item.rate)}</td>
      `;
      tbody.appendChild(row);
    });

    const tot = calcTotal();
    subtotalEl.textContent = UI.formatCurrency(tot);
    grandTotalEl.textContent = UI.formatCurrency(tot);

    const waMsg = `Hi ${entry.customerName}, here is your Invoice details from ${shopName}:\n\nInvoice: ${invNumber}\nVehicle: ${entry.vehicleNumber || ''}\nTotal Amount: ${UI.formatCurrency(tot)}\n\nThank you for choosing us!`;
    container.querySelector('#bill-wa-btn').href = `https://wa.me/91${entry.mobileNumber}?text=${encodeURIComponent(waMsg)}`;
  }

  renderRows();

  container.querySelector('#bill-back-btn')?.addEventListener('click', () => router.back());
  container.querySelector('#bill-print-top-btn')?.addEventListener('click', () => window.print());
  container.querySelector('#bill-print-btn')?.addEventListener('click', () => window.print());

  return container;
}
