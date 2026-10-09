// Daily Report Screen matching Flutter DailyReportScreen
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderDailyReport(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shopId = Auth.getActiveShopId();
  const shop = await Store.getShopById(shopId);
  const shopName = shop?.name || 'Store';

  const pastReports = await Store.getDailyReports(shopId);
  const todayStr = new Date().toISOString().slice(0, 10);

  container.innerHTML = `
    <header class="sub-header">
      <button id="rep-back-btn" class="back-btn" title="Back">
        ${UI.icons.back(18)}
      </button>
      <div class="sub-header-content">
        <div class="sub-header-title">Daily Operations Report</div>
        <div class="sub-header-context">${shopName} • ${UI.formatDate(new Date(), 'short')}</div>
      </div>
    </header>

    <div style="padding: 16px 20px 40px;">
      <!-- Report Form -->
      <form id="daily-report-form" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="font-family: var(--font-condensed); font-size: 16px; font-weight: 700; text-transform: uppercase; margin-bottom: 14px; color: var(--text-main);">
          Submit Daily Sales & Counts
        </div>

        <div class="form-row-2" style="margin: 0 0 12px;">
          <div class="form-group">
            <label class="form-label">4-Wheeler Tyres Sold <span class="req">*</span></label>
            <input type="number" id="rep-4w-tyres" class="form-input" min="0" value="0" required>
          </div>
          <div class="form-group">
            <label class="form-label">2-Wheeler Tyres Sold</label>
            <input type="number" id="rep-2w-tyres" class="form-input" min="0" value="0">
          </div>
        </div>

        <div class="form-group" style="margin: 0 0 14px;">
          <label class="form-label">Wheel Alignments Done</label>
          <input type="number" id="rep-alignment" class="form-input" min="0" value="0">
        </div>

        <div class="form-row-2" style="margin: 0 0 12px;">
          <div class="form-group">
            <label class="form-label">Cash Collection ₹</label>
            <input type="number" id="rep-cash" class="form-input" min="0" value="0" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">Online / UPI Collection ₹</label>
            <input type="number" id="rep-online" class="form-input" min="0" value="0" placeholder="0">
          </div>
        </div>

        <div class="form-group" style="margin: 0 0 14px; background: var(--bg-paper); padding: 10px; border-radius: 6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Total Day Collection:</span>
            <span id="rep-total-val" style="font-family: var(--font-condensed); font-size: 22px; font-weight: 700; color: var(--accent-rust);">₹0</span>
          </div>
        </div>

        <div class="form-group" style="margin: 0 0 16px;">
          <label class="form-label">Day Closing Remarks / Stock Notes</label>
          <textarea id="rep-remarks" class="form-textarea" rows="2" placeholder="e.g. CEAT SecuraDrive stock low; Nitrogen pump serviced"></textarea>
        </div>

        <button type="submit" id="rep-submit-btn" class="btn-primary-cta" style="margin: 0; width: 100%;">
          Submit Today's Daily Report
        </button>
      </form>

      <!-- Past Submissions History -->
      <div style="margin-top: 24px;">
        <div style="font-family: var(--font-condensed); font-size: 16px; font-weight: 700; text-transform: uppercase; color: var(--text-main); margin-bottom: 10px;">
          Past Reports History
        </div>

        <div id="past-reports-list">
          ${pastReports.length === 0 ? `
            <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">
              No past reports recorded yet for this shop.
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  const cashInput = container.querySelector('#rep-cash');
  const onlineInput = container.querySelector('#rep-online');
  const totalValEl = container.querySelector('#rep-total-val');
  const form = container.querySelector('#daily-report-form');
  const submitBtn = container.querySelector('#rep-submit-btn');
  const pastList = container.querySelector('#past-reports-list');

  function updateTotal() {
    const c = parseFloat(cashInput.value) || 0;
    const o = parseFloat(onlineInput.value) || 0;
    totalValEl.textContent = UI.formatCurrency(c + o);
  }
  cashInput.addEventListener('input', updateTotal);
  onlineInput.addEventListener('input', updateTotal);

  // Render past reports
  pastReports.forEach(r => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--card-bg); border:1px solid var(--border-color); border-radius:8px; padding:12px 14px; margin-bottom:8px;';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <strong style="font-size:13px; color:var(--text-main);">${UI.formatDate(r.reportDate || r.createdAt)}</strong>
        <span style="font-family:var(--font-condensed); font-weight:700; color:var(--accent-rust);">${UI.formatCurrency(r.totalAmount || 0)}</span>
      </div>
      <div style="font-size:11.5px; color:var(--text-muted);">
        4W Tyres: <strong>${r.fourWheelerTyres || 0}</strong> • Alignments: <strong>${r.wheelAlignmentCount || 0}</strong>
      </div>
    `;
    pastList.appendChild(card);
  });

  // Handle submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner light"></span> Submitting...';

    const fourW = parseInt(container.querySelector('#rep-4w-tyres').value, 10) || 0;
    const twoW = parseInt(container.querySelector('#rep-2w-tyres').value, 10) || 0;
    const align = parseInt(container.querySelector('#rep-alignment').value, 10) || 0;
    const cash = parseFloat(cashInput.value) || 0;
    const online = parseFloat(onlineInput.value) || 0;
    const remarks = container.querySelector('#rep-remarks').value.trim();

    try {
      await Store.saveDailyReport({
        shopId,
        shopName,
        reportDate: todayStr,
        fourWheelerTyres: fourW,
        twoWheelerTyres: twoW,
        wheelAlignmentCount: align,
        totalAmount: cash + online,
        remarks
      });

      UI.showToast("Today's Daily Report submitted successfully!", 'success');
      router.navigate('/employee/home');
    } catch (err) {
      UI.showToast(err.message || 'Failed to submit report', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Today's Daily Report";
    }
  });

  container.querySelector('#rep-back-btn')?.addEventListener('click', () => router.back());

  return container;
}
