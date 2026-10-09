// Monthly Targets Screen matching Screenshot 1 exactly
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderTargets(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  let selectedShopId = 'all'; // 'all' | 'shop-flare' | 'shop-point' | 'shop-tyros' | 'shop-bharath'
  let selectedMonth = 'October';
  let selectedYear = '2026';

  const shops = await Store.getShops();

  async function renderContent() {
    const data = await Store.getMonthlyTargetData(selectedShopId);
    const shopDisplayName = selectedShopId === 'all'
      ? 'All Shops Targets'
      : (shops.find(s => s.id === selectedShopId)?.name || 'Shop Targets');

    const subHeaderShop = selectedShopId === 'all'
      ? 'ALL SHOPS'
      : (shops.find(s => s.id === selectedShopId)?.name || 'SHOP').toUpperCase();

    container.innerHTML = `
      <!-- Header matching Screenshot 1 -->
      <header class="master-header">
        <div class="master-header-left">
          <button id="targets-back-btn" class="back-btn" style="background:none; border:none; padding:4px; cursor:pointer; color:var(--text-main); display:flex; align-items:center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div class="master-header-title">Monthly Targets</div>
        </div>
        <button id="set-target-header-btn" class="master-header-btn" style="padding: 7px 12px; gap: 6px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          <span>Set Target</span>
        </button>
      </header>

      <div style="padding: 14px 16px 80px;">
        <!-- Shop Dropdown Card -->
        <div id="shop-selector-card" style="background:#FFFFFA; border:1px solid var(--border-color); border-radius:12px; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; margin-bottom:14px; box-shadow:0 1px 3px rgba(34,32,30,0.02);">
          <div style="display:flex; align-items:center; gap:10px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span style="font-size:15px; font-weight:600; color:var(--text-main);">${shopDisplayName}</span>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        <!-- Main Progress Card matching Screenshot 1 -->
        <div style="background:#FFFFFA; border:1px solid var(--border-color); border-radius:16px; padding:18px 18px 20px; box-shadow:0 1px 4px rgba(34,32,30,0.03); margin-bottom:24px;">
          <!-- Top Row -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div style="font-family:var(--font-condensed); font-size:12.5px; font-weight:700; color:var(--accent-rust); letter-spacing:0.04em; text-transform:uppercase;">
              ${subHeaderShop} · ${selectedMonth.toUpperCase()} ${selectedYear}
            </div>
            <div style="background:#EFEAE0; color:var(--text-main); font-size:12px; font-weight:600; padding:3.5px 10px; border-radius:12px;">
              ${data.daysLeft || 22} days left
            </div>
          </div>

          <h2 style="font-family:var(--font-body); font-size:22px; font-weight:700; color:var(--text-main); margin-bottom:18px; letter-spacing:-0.01em;">
            Current Month Progress
          </h2>

          <!-- Metric 1: Revenue Target -->
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;">
              <span style="font-size:14px; font-weight:500; color:var(--text-main);">Revenue Target</span>
              <span style="font-size:13.5px; font-weight:700; color:#16A34A;">
                ₹${Number(data.revenueAchieved).toLocaleString('en-IN')} / ₹${Number(data.revenueTarget).toLocaleString('en-IN')} (${data.revenuePercentage}%)
              </span>
            </div>
            <div style="width:100%; height:8px; background:var(--border-color); border-radius:4px; overflow:hidden;">
              <div style="width:${Math.min(100, Math.max(5, data.revenuePercentage))}%; height:100%; background:#16A34A; border-radius:4px; transition:width 0.5s ease;"></div>
            </div>
          </div>

          <!-- Metric 2: Tyre Sales Target -->
          <div style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;">
              <span style="font-size:14px; font-weight:500; color:var(--text-main);">Tyre Sales Target</span>
              <span style="font-size:13.5px; font-weight:700; color:var(--accent-rust);">
                ${data.tyreAchieved} / ${data.tyreTarget} tyres (${data.tyrePercentage}%)
              </span>
            </div>
            <div style="width:100%; height:8px; background:var(--border-color); border-radius:4px; overflow:hidden;">
              <div style="width:${Math.min(100, Math.max(5, data.tyrePercentage))}%; height:100%; background:var(--accent-rust); border-radius:4px; transition:width 0.5s ease;"></div>
            </div>
          </div>

          <div style="border-top:1px solid var(--row-divider); margin:18px 0 14px;"></div>

          <!-- Additional Service Targets -->
          <div style="font-size:14px; font-weight:600; color:var(--text-main); margin-bottom:12px;">
            Additional Service Targets
          </div>

          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px;">
            ${(data.services || [
              { name: '2W Enquiry', achieved: 0, target: 25, percentage: 0 },
              { name: '2W Alignment', achieved: 0, target: 25, percentage: 0 },
              { name: 'Wheel Alignment', achieved: 0, target: 25, percentage: 0 }
            ]).map(s => `
              <div style="background:#EFEAE0; border-radius:10px; padding:10px 12px;">
                <div style="font-size:11.5px; color:var(--text-sub); margin-bottom:4px;">${s.name}</div>
                <div style="font-size:13.5px; font-weight:700; color:var(--text-main);">
                  ${s.achieved} / ${s.target} (${s.percentage}%)
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Target History Section matching Screenshot 1 -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px;">
          <h3 style="font-family:var(--font-body); font-size:20px; font-weight:700; color:var(--text-main);">
            Target History
          </h3>
          <div style="display:flex; gap:8px;">
            <!-- Month Select Pill -->
            <div style="position:relative;">
              <select id="history-month-select" style="appearance:none; -webkit-appearance:none; background:#FFFFFA; border:1px solid var(--border-color); border-radius:8px; padding:6px 26px 6px 12px; font-size:13px; font-weight:600; color:var(--text-main); cursor:pointer;">
                <option value="October" selected>October</option>
                <option value="September">September</option>
                <option value="August">August</option>
                <option value="July">July</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); pointer-events:none;"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <!-- Year Select Pill -->
            <div style="position:relative;">
              <select id="history-year-select" style="appearance:none; -webkit-appearance:none; background:#FFFFFA; border:1px solid var(--border-color); border-radius:8px; padding:6px 26px 6px 12px; font-size:13px; font-weight:600; color:var(--text-main); cursor:pointer;">
                <option value="2026" selected>2026</option>
                <option value="2025">2025</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); pointer-events:none;"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>

        <!-- Spinning Orange Wheel / Tyre Icon matching bottom of Screenshot 1 -->
        <div style="display:flex; justify-content:center; align-items:center; padding:10px 0 20px;">
          <svg class="spin-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rust)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="8"/>
            <line x1="12" y1="16" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="8" y2="12"/>
            <line x1="16" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
      </div>
    `;

    setupEvents();
  }

  function setupEvents() {
    container.querySelector('#targets-back-btn')?.addEventListener('click', () => router.navigate('/dashboard'));

    // Shop selector dropdown card click
    container.querySelector('#shop-selector-card')?.addEventListener('click', () => {
      UI.showModal(`
        <h3 class="sheet-title">Select Shop Targets</h3>
        <p class="sheet-sub">Choose a branch or view aggregate target metrics across all shops.</p>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:12px;">
          <button class="shop-select-opt" data-id="all" style="text-align:left; padding:12px 14px; background:${selectedShopId === 'all' ? '#FCEFEA' : '#FFFFFA'}; border:1px solid ${selectedShopId === 'all' ? 'var(--accent-rust)' : 'var(--border-color)'}; border-radius:10px; font-weight:${selectedShopId === 'all' ? '700' : '500'}; color:var(--text-main); cursor:pointer;">
            🏪 All Shops Targets
          </button>
          ${shops.map(s => `
            <button class="shop-select-opt" data-id="${s.id}" style="text-align:left; padding:12px 14px; background:${selectedShopId === s.id ? '#FCEFEA' : '#FFFFFA'}; border:1px solid ${selectedShopId === s.id ? 'var(--accent-rust)' : 'var(--border-color)'}; border-radius:10px; font-weight:${selectedShopId === s.id ? '700' : '500'}; color:var(--text-main); cursor:pointer;">
              🏬 ${s.name}
            </button>
          `).join('')}
        </div>
      `, {
        onMounted(sheet) {
          sheet.querySelectorAll('.shop-select-opt').forEach(btn => {
            btn.addEventListener('click', () => {
              selectedShopId = btn.dataset.id;
              UI.hideModal();
              renderContent();
            });
          });
        }
      });
    });

    // Set Target CTA click
    container.querySelector('#set-target-header-btn')?.addEventListener('click', async () => {
      const data = await Store.getMonthlyTargetData(selectedShopId);

      UI.showModal(`
        <h3 class="sheet-title">Set Monthly Target</h3>
        <p class="sheet-sub">Configure monthly quota for ${selectedShopId === 'all' ? 'All Shops' : shops.find(s => s.id === selectedShopId)?.name || 'Branch'}.</p>

        <div class="form-group" style="margin: 0 0 12px;">
          <label class="form-label">Revenue Target (₹) <span class="req">*</span></label>
          <input type="number" id="input-rev-target" class="form-input" value="${data.revenueTarget}" required>
        </div>

        <div class="form-group" style="margin: 0 0 12px;">
          <label class="form-label">Tyre Sales Target (Units) <span class="req">*</span></label>
          <input type="number" id="input-tyre-target" class="form-input" value="${data.tyreTarget}" required>
        </div>

        <div style="margin: 12px 0 8px; font-size:13px; font-weight:700; color:var(--text-main);">
          Additional Service Targets
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
          <div>
            <label class="form-label" style="font-size:11.5px;">2W Enquiry</label>
            <input type="number" id="input-srv-enq" class="form-input" value="${data.services?.[0]?.target || 25}">
          </div>
          <div>
            <label class="form-label" style="font-size:11.5px;">2W Alignment</label>
            <input type="number" id="input-srv-align2" class="form-input" value="${data.services?.[1]?.target || 25}">
          </div>
          <div style="grid-column: span 2;">
            <label class="form-label" style="font-size:11.5px;">Wheel Alignment</label>
            <input type="number" id="input-srv-alignw" class="form-input" value="${data.services?.[2]?.target || 25}">
          </div>
        </div>

        <div class="sheet-actions">
          <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
          <button id="save-target-btn" class="btn-primary-cta" style="margin:0;">Save Targets</button>
        </div>
      `, {
        onMounted(sheet) {
          sheet.querySelector('#save-target-btn').addEventListener('click', async () => {
            const rev = parseFloat(sheet.querySelector('#input-rev-target').value) || 0;
            const tyres = parseInt(sheet.querySelector('#input-tyre-target').value, 10) || 0;
            const enq = parseInt(sheet.querySelector('#input-srv-enq').value, 10) || 0;
            const al2 = parseInt(sheet.querySelector('#input-srv-align2').value, 10) || 0;
            const alw = parseInt(sheet.querySelector('#input-srv-alignw').value, 10) || 0;

            const newServices = [
              { name: '2W Enquiry', achieved: data.services?.[0]?.achieved || 0, target: enq, percentage: enq > 0 ? Math.round(((data.services?.[0]?.achieved || 0) / enq) * 100) : 0 },
              { name: '2W Alignment', achieved: data.services?.[1]?.achieved || 0, target: al2, percentage: al2 > 0 ? Math.round(((data.services?.[1]?.achieved || 0) / al2) * 100) : 0 },
              { name: 'Wheel Alignment', achieved: data.services?.[2]?.achieved || 0, target: alw, percentage: alw > 0 ? Math.round(((data.services?.[2]?.achieved || 0) / alw) * 100) : 0 }
            ];

            await Store.updateMonthlyTarget(selectedShopId, rev, tyres, newServices);
            UI.hideModal();
            UI.showToast('Monthly targets updated', 'success');
            renderContent();
          });
        }
      });
    });

    // History selectors
    container.querySelector('#history-month-select')?.addEventListener('change', (e) => {
      selectedMonth = e.target.value;
      renderContent();
    });

    container.querySelector('#history-year-select')?.addEventListener('change', (e) => {
      selectedYear = e.target.value;
      renderContent();
    });
  }

  await renderContent();
  return container;
}
