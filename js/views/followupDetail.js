// Follow-up Detail Screen matching Flutter FollowupDetailScreen
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderFollowupDetail(router, params) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const entryId = params.id;
  const entry = await Store.getEntryById(entryId);

  if (!entry) {
    container.innerHTML = `
      <header class="sub-header">
        <button class="back-btn" onclick="history.back()">${UI.icons.back(18)}</button>
        <div class="sub-header-title">Follow-up Detail</div>
      </header>
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p>Entry not found or was removed.</p>
      </div>
    `;
    return container;
  }

  const isCompleted = entry.status === 'COMPLETED' || entry.status === 'WON';
  const isUnfit = entry.fitStatus === 'NOT_FIT' || entry.status === 'LOST';

  container.innerHTML = `
    <!-- SubHeader with Back Button -->
    <header class="sub-header">
      <button id="detail-back-btn" class="back-btn" title="Back">
        ${UI.icons.back(18)}
      </button>
      <div class="sub-header-content">
        <div class="sub-header-title">${entry.customerName}</div>
        <div class="sub-header-context">${entry.shopName || 'Workshop'} • ${entry.vehicleNumber || 'Vehicle'}</div>
      </div>
      <span class="status-badge ${isUnfit ? 'unfit' : (isCompleted ? 'done' : (entry.isOverdue ? 'overdue' : 'pending'))}">
        ${isUnfit ? 'NOT FITTED' : (isCompleted ? 'COMPLETED' : (entry.isOverdue ? 'OVERDUE' : 'PENDING'))}
      </span>
    </header>

    <div style="padding: 16px 20px 30px;">
      <!-- Customer Contact Card -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
          <div>
            <div style="font-family: var(--font-condensed); font-size: 18px; font-weight: 700; color: var(--text-main);">${entry.customerName}</div>
            <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">📞 ${entry.mobileNumber}</div>
          </div>
          <!-- Quick Call & WA -->
          <div style="display: flex; gap: 8px;">
            <a href="tel:${entry.mobileNumber}" class="quick-action-btn call" style="width:38px; height:38px;" title="Call">
              ${UI.icons.phone(18)}
            </a>
            <a href="https://wa.me/91${entry.mobileNumber}?text=Hi%20${encodeURIComponent(entry.customerName)},%20greeting%20from%20${encodeURIComponent(entry.shopName || 'Tyros')}" target="_blank" class="quick-action-btn whatsapp" style="width:38px; height:38px;" title="WhatsApp">
              ${UI.icons.whatsapp(18)}
            </a>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 10px; border-top: 1px dashed var(--row-divider); font-size: 12px;">
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Plate Number</span>
            <div style="font-weight:600; color:var(--text-main); margin-top:2px;">${entry.vehicleNumber || 'Not specified'}</div>
          </div>
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Vehicle Details</span>
            <div style="font-weight:600; color:var(--text-main); margin-top:2px;">${entry.vehicleDetails || '4-Wheeler'}</div>
          </div>
        </div>
      </div>

      <!-- Tyre Quote & Rates Card -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 14px;">
        <div style="font-family: var(--font-condensed); font-size: 14px; font-weight: 700; text-transform: uppercase; color: var(--text-main); margin-bottom: 10px;">
          Quoted Specification & Price
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-bottom: 10px;">
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Tyre Size</span>
            <div style="font-weight:600; margin-top:2px;">${entry.tyreSize || 'Standard'}</div>
          </div>
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Brand / Pattern</span>
            <div style="font-weight:600; margin-top:2px;">${entry.tyreBrand || 'Any'}</div>
          </div>
        </div>

        ${entry.quoteOptions && entry.quoteOptions.length > 0 ? `
          <div style="background: var(--bg-paper); border-radius: 8px; padding: 10px; margin-top: 8px;">
            ${entry.quoteOptions.map((opt, i) => `
              <div style="display:flex; justify-content:space-between; font-size: 12px; padding: 4px 0; ${i > 0 ? 'border-top: 1px solid var(--border-color);' : ''}">
                <span>${opt.tyreModel || 'Option ' + (i+1)} ${opt.quantity ? `(${opt.quantity}x)` : ''}</span>
                <strong style="color:var(--accent-rust);">${opt.price ? UI.formatCurrency(opt.price * (opt.quantity || 1)) : 'Quoted'}</strong>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--row-divider);">
          <span style="font-size: 12px; color: var(--text-muted);">Total Quoted Estimate:</span>
          <span style="font-family: var(--font-condensed); font-size: 20px; font-weight: 700; color: var(--text-main);">${UI.formatCurrency(entry.amount || 0)}</span>
        </div>
      </div>

      <!-- Follow-up Schedule Banner -->
      <div style="background: #FDF9F0; border: 1px solid #EFE0C2; border-radius: 12px; padding: 14px 16px; margin-bottom: 18px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8A5A24;">Next Follow-Up Call</div>
        <div style="font-family: var(--font-condensed); font-size: 18px; font-weight: 700; color: var(--text-main); margin-top: 2px;">
          📅 ${UI.formatDate(entry.followUpDate, 'relative')}
        </div>
        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
          ${entry.remarks ? `"${entry.remarks}"` : 'No remarks noted yet.'}
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${!isCompleted && !isUnfit ? `
          <!-- Complete / Won -->
          <button id="action-won-btn" class="btn-primary-cta" style="margin: 0; background: var(--status-done);">
            ✓ Mark as Won / Fitted
          </button>

          <!-- Reschedule -->
          <button id="action-reschedule-btn" class="btn-dark-cta" style="margin: 0;">
            📅 Reschedule Follow-up
          </button>

          <!-- Mark Unfit -->
          <button id="action-unfit-btn" class="util-btn" style="width: 100%; justify-content: center; padding: 11px; border-color: var(--danger-border); color: var(--status-overdue); background: var(--danger-bg); font-size: 13px;">
            ✕ Mark as Not Fitted / Lost
          </button>
        ` : ''}

        <!-- Generate / View Bill -->
        <button id="action-bill-btn" class="btn-dark-cta" style="margin: 0; background: var(--accent-steel);">
          📄 View / Generate Bill & Invoice
        </button>
      </div>
    </div>
  `;

  // Attach handlers
  container.querySelector('#detail-back-btn')?.addEventListener('click', () => router.back());

  // Mark Won Modal
  container.querySelector('#action-won-btn')?.addEventListener('click', () => {
    UI.showModal(`
      <h3 class="sheet-title">Complete Follow-up</h3>
      <p class="sheet-sub">Mark tyre sale as completed and record in shop metrics.</p>

      <div class="form-group" style="margin: 0 0 14px;">
        <label class="form-label">Final Sale Remarks</label>
        <textarea id="won-remarks" class="form-textarea" rows="2" placeholder="e.g. 4 Bridgestone tyres fitted + alignment free"></textarea>
      </div>

      <div class="sheet-actions">
        <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
        <button id="confirm-won-btn" class="btn-primary-cta" style="margin:0; background:var(--status-done);">Confirm Completed</button>
      </div>
    `, {
      onMounted(sheet) {
        sheet.querySelector('#confirm-won-btn').addEventListener('click', async () => {
          const rem = sheet.querySelector('#won-remarks').value;
          await Store.completeEntry(entry.id, rem);
          UI.hideModal();
          UI.showToast('Enquiry marked as Completed!', 'success');
          router.navigate(`/employee/entry/${entry.id}`);
        });
      }
    });
  });

  // Reschedule Modal
  container.querySelector('#action-reschedule-btn')?.addEventListener('click', () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    nextWeek.setHours(11, 30, 0, 0);

    UI.showModal(`
      <h3 class="sheet-title">Reschedule Follow-up</h3>
      <p class="sheet-sub">Pick next date & time to call customer again.</p>

      <div class="form-group" style="margin: 0 0 14px;">
        <label class="form-label">New Follow-up Date & Time</label>
        <input type="datetime-local" id="reschedule-date" class="form-input" value="${nextWeek.toISOString().slice(0, 16)}">
      </div>

      <div class="form-group" style="margin: 0 0 14px;">
        <label class="form-label">Call Reason / Follow-up Notes</label>
        <input type="text" id="reschedule-remarks" class="form-input" placeholder="e.g. Customer busy, call on weekend">
      </div>

      <div class="sheet-actions">
        <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
        <button id="confirm-reschedule-btn" class="btn-primary-cta" style="margin:0;">Update Schedule</button>
      </div>
    `, {
      onMounted(sheet) {
        sheet.querySelector('#confirm-reschedule-btn').addEventListener('click', async () => {
          const dateVal = sheet.querySelector('#reschedule-date').value;
          const rem = sheet.querySelector('#reschedule-remarks').value;
          await Store.rescheduleEntry(entry.id, new Date(dateVal).toISOString(), rem);
          UI.hideModal();
          UI.showToast('Follow-up rescheduled successfully', 'success');
          router.navigate(`/employee/entry/${entry.id}`);
        });
      }
    });
  });

  // Mark Unfit Modal
  container.querySelector('#action-unfit-btn')?.addEventListener('click', () => {
    UI.showModal(`
      <h3 class="sheet-title" style="color: var(--status-overdue);">Mark as Not Fitted</h3>
      <p class="sheet-sub">Record why this sale was lost to help optimize pricing.</p>

      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">Loss Reason</label>
        <select id="unfit-reason" class="form-select">
          <option value="Customer bought from another dealer">Purchased from competitor</option>
          <option value="Price too high / Budget issue">Price too high / Budget issue</option>
          <option value="Stock / Brand not available">Desired Tyre brand/size not in stock</option>
          <option value="Postponed tyre change">Postponed tyre change</option>
          <option value="Customer unreachable after 3+ calls">Customer unreachable</option>
        </select>
      </div>

      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">Competitor / Outside Shop Name</label>
        <input type="text" id="unfit-shop" class="form-input" placeholder="e.g. Speed Tyres / Reliance Auto">
      </div>

      <div class="form-row-2" style="margin: 0 0 14px;">
        <div class="form-group">
          <label class="form-label">Location / Area</label>
          <input type="text" id="unfit-loc" class="form-input" placeholder="e.g. Mogappair">
        </div>
        <div class="form-group">
          <label class="form-label">Competitor Rate ₹</label>
          <input type="number" id="unfit-amount" class="form-input" placeholder="e.g. 24000">
        </div>
      </div>

      <div class="sheet-actions">
        <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
        <button id="confirm-unfit-btn" class="btn-primary-cta" style="margin:0; background:var(--status-overdue);">Confirm Lost</button>
      </div>
    `, {
      onMounted(sheet) {
        sheet.querySelector('#confirm-unfit-btn').addEventListener('click', async () => {
          const reason = sheet.querySelector('#unfit-reason').value;
          const outsideShopName = sheet.querySelector('#unfit-shop').value;
          const outsideShopLocation = sheet.querySelector('#unfit-loc').value;
          const outsideShopAmount = parseFloat(sheet.querySelector('#unfit-amount').value) || null;

          await Store.unfitEntry(entry.id, {
            unfitReason: reason,
            outsideShopName,
            outsideShopLocation,
            outsideShopAmount
          });

          UI.hideModal();
          UI.showToast('Enquiry marked as Not Fitted', 'info');
          router.navigate(`/employee/unfit`);
        });
      }
    });
  });

  // Billing Invoice CTA
  container.querySelector('#action-bill-btn')?.addEventListener('click', () => {
    router.navigate(`/employee/billing/${entry.id}`);
  });

  return container;
}
