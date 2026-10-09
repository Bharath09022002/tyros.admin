// Admin Entry Detail Inspector matching Flutter EntryDetailScreen
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderEntryDetail(router, params) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const entryId = params.id;
  const entry = await Store.getEntryById(entryId);
  const users = await Store.getUsers();
  const shops = await Store.getShops();

  if (!entry) {
    container.innerHTML = `
      <header class="sub-header">
        <button class="back-btn" onclick="history.back()">${UI.icons.back(18)}</button>
        <div class="sub-header-title">Entry Details</div>
      </header>
      <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
        Entry record not found or was deleted.
      </div>
    `;
    return container;
  }

  const shopMap = Object.fromEntries(shops.map(s => [s.id, s.name]));
  const branchName = shopMap[entry.shopId] || entry.shopName || 'Workshop Branch';
  const assignedStaff = users.find(u => u.id === entry.assignedToUserId);
  const staffName = assignedStaff ? (assignedStaff.fullName || assignedStaff.name) : (entry.employeeName || 'Staff Member');

  const isCompleted = entry.status === 'COMPLETED' || entry.status === 'WON';
  const isUnfit = entry.fitStatus === 'NOT_FIT' || entry.status === 'LOST';

  container.innerHTML = `
    <header class="sub-header">
      <button id="admin-detail-back" class="back-btn" title="Back">
        ${UI.icons.back(18)}
      </button>
      <div class="sub-header-content">
        <div class="sub-header-title">${entry.customerName}</div>
        <div class="sub-header-context">${branchName} • ${entry.vehicleNumber || 'Vehicle'}</div>
      </div>
      <span class="status-badge ${isUnfit ? 'unfit' : (isCompleted ? 'done' : (entry.isOverdue ? 'overdue' : 'pending'))}">
        ${isUnfit ? 'NOT FITTED' : (isCompleted ? 'COMPLETED' : (entry.isOverdue ? 'OVERDUE' : 'PENDING'))}
      </span>
    </header>

    <div style="padding: 16px 20px 50px;">
      <!-- Customer Information Card -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;">
          <div>
            <div style="font-family: var(--font-condensed); font-size: 20px; font-weight: 700; color: var(--text-main);">${entry.customerName}</div>
            <div style="font-size: 13.5px; color: var(--text-muted); margin-top: 2px;">📞 ${entry.mobileNumber}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="tel:${entry.mobileNumber}" class="quick-action-btn call" style="width:40px; height:40px;" title="Call Customer">
              ${UI.icons.phone(18)}
            </a>
            <a href="https://wa.me/91${entry.mobileNumber}?text=Hi%20${encodeURIComponent(entry.customerName)},%20calling%20from%20${encodeURIComponent(branchName)}%20regarding%20your%20tyre%20enquiry" target="_blank" class="quick-action-btn whatsapp" style="width:40px; height:40px;" title="WhatsApp">
              ${UI.icons.whatsapp(18)}
            </a>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 12px; border-top: 1px dashed var(--row-divider); font-size: 12px;">
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Registration Plate</span>
            <div style="font-weight:700; font-size: 14px; color:var(--text-main); margin-top:2px;">${entry.vehicleNumber || 'No plate'}</div>
          </div>
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Vehicle Details</span>
            <div style="font-weight:600; font-size: 13px; color:var(--text-main); margin-top:2px;">${entry.vehicleDetails || '4-Wheeler'}</div>
          </div>
        </div>
      </div>

      <!-- Workshop Branch & Staff Assignment Card -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 14px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Workshop Branch</span>
            <div style="font-weight:700; font-size: 13.5px; color:var(--text-main); margin-top:2px;">🏪 ${branchName}</div>
          </div>
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Assigned Staff</span>
            <div style="font-weight:700; font-size: 13.5px; color:var(--text-main); margin-top:2px;">👤 ${staffName}</div>
          </div>
        </div>

        <button id="admin-reassign-btn" class="util-btn" style="width:100%; justify-content:center; padding: 8px; font-weight:600; background:var(--bg-paper);">
          👤 Reassign Staff Member
        </button>
      </div>

      <!-- Tyre Quotes Breakdown -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 14px;">
        <div style="font-family: var(--font-condensed); font-size: 15px; font-weight: 700; text-transform: uppercase; color: var(--text-main); margin-bottom: 10px;">
          Tyre Quoted & Pricing
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-bottom: 10px;">
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Tyre Size</span>
            <div style="font-weight:600;">${entry.tyreSize || 'N/A'}</div>
          </div>
          <div>
            <span style="color:var(--text-muted); font-size:10.5px; text-transform:uppercase; font-weight:700;">Tyre Brand</span>
            <div style="font-weight:600;">${entry.tyreBrand || 'N/A'}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--row-divider);">
          <span style="font-size: 12px; color: var(--text-muted);">Total Quoted Amount:</span>
          <span style="font-family: var(--font-condensed); font-size: 22px; font-weight: 700; color: var(--accent-rust);">${UI.formatCurrency(entry.amount || 0)}</span>
        </div>
      </div>

      <!-- Remarks / Status -->
      <div style="background: #FDF9F0; border: 1px solid #EFE0C2; border-radius: 12px; padding: 14px 16px; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8A5A24;">Follow-Up Remarks & Status</div>
        <div style="font-size: 12.5px; color: var(--text-main); margin-top: 4px; line-height: 1.4;">
          ${entry.remarks ? `"${entry.remarks}"` : 'No remarks recorded.'}
        </div>
        ${entry.outsideShopName ? `
          <div style="font-size: 11.5px; color: var(--status-overdue); margin-top: 6px; padding-top: 6px; border-top: 1px dashed #EFE0C2;">
            📍 Lost to Competitor: <strong>${entry.outsideShopName}</strong> (${entry.outsideShopLocation || ''}) • Quote: ${UI.formatCurrency(entry.outsideShopAmount || 0)}
          </div>
        ` : ''}
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="admin-delete-entry-btn" class="util-btn" style="width: 100%; justify-content: center; padding: 11px; border-color: var(--danger-border); color: var(--status-overdue); background: var(--danger-bg); font-size: 13px;">
          🗑️ Delete This Enquiry Record
        </button>
      </div>
    </div>
  `;

  // Bind events
  container.querySelector('#admin-detail-back')?.addEventListener('click', () => router.back());

  // Reassign Modal
  container.querySelector('#admin-reassign-btn')?.addEventListener('click', () => {
    UI.showModal(`
      <h3 class="sheet-title">Reassign Staff</h3>
      <p class="sheet-sub">Select workshop staff member for ${entry.customerName}.</p>

      <div class="form-group" style="margin: 0 0 16px;">
        <label class="form-label">Assign To</label>
        <select id="reassign-select-input" class="form-select">
          ${users.map(u => `
            <option value="${u.id}" ${u.id === entry.assignedToUserId ? 'selected' : ''}>
              ${u.fullName || u.name} (${u.role} - ${u.phone})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="sheet-actions">
        <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
        <button id="confirm-reassign-action" class="btn-primary-cta" style="margin:0;">Update Assignment</button>
      </div>
    `, {
      onMounted(sheet) {
        sheet.querySelector('#confirm-reassign-action').addEventListener('click', async () => {
          const newUserId = sheet.querySelector('#reassign-select-input').value;
          await Store.updateEntry(entry.id, { assignedToUserId: newUserId });
          UI.hideModal();
          UI.showToast('Staff assignment updated successfully', 'success');
          router.navigate(`/entries`);
        });
      }
    });
  });

  // Delete Action
  container.querySelector('#admin-delete-entry-btn')?.addEventListener('click', async () => {
    if (confirm(`Are you sure you want to delete this enquiry for "${entry.customerName}"?`)) {
      await Store.deleteEntry(entry.id, 'Deleted by Admin');
      UI.showToast('Enquiry record deleted', 'info');
      router.navigate('/entries');
    }
  });

  return container;
}
