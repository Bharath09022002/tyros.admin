// Admin Reports matching Flutter ShopReportScreen with Tabs
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderAdminReports(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shops = await Store.getShops();
  const selectedShop = shops[0] || { name: 'Flareminds', address: 'Ms nagar', isActive: true, id: 'shop-flare' };
  const targetData = await Store.getTargetDashboard(selectedShop.id);
  const dailyReports = await Store.getDailyReports(selectedShop.id);

  // Current month
  const now = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  // Daily report aggregate for "This Month"
  const monthReports = dailyReports.filter(r => {
    const d = new Date(r.reportDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalCollection = monthReports.reduce((s, r) => s + (r.amount || 0), 0);
  const totalTyresSold = monthReports.reduce((s, r) => s + (r.totalTyres || 0), 0);
  const totalServices = monthReports.reduce((s, r) => s + (r.totalServices || 0), 0);

  container.innerHTML = `
    <!-- Sub Header: Back + Shop Name -->
    <div class="sub-header">
      <button id="rep-back-btn" class="back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="sub-header-content">
        <div class="sub-header-title">${selectedShop.name}</div>
        <div class="sub-header-context">Shop Report & Targets</div>
      </div>
      <div style="display:flex; gap:8px;">
        <button style="width:32px; height:32px; border-radius:50%; background:none; border:none; color:var(--accent-rust); cursor:pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M10 3v18"/></svg>
        </button>
        <button id="rep-refresh-btn" style="width:32px; height:32px; border-radius:50%; background:none; border:none; color:var(--text-muted); cursor:pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
        </button>
      </div>
    </div>

    <!-- Shop Info Card -->
    <div style="padding:12px 20px; display:flex; align-items:center; gap:10px;">
      <div style="width:36px; height:36px; border-radius:8px; background:rgba(193,68,14,0.1); display:flex; align-items:center; justify-content:center;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rust)" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h4"/><path d="M18 9h2a2 2 0 0 1 2 2v11h-4"/></svg>
      </div>
      <div>
        <div style="font-size:15px; font-weight:700; color:var(--text-main);">${selectedShop.name} <span style="font-size:10px; font-weight:600; color:var(--status-done); background:rgba(46,125,50,0.12); padding:2px 8px; border-radius:10px; margin-left:6px;">Active</span></div>
        <div style="font-size:12px; color:var(--text-muted);">${selectedShop.address || 'Chennai'}</div>
      </div>
    </div>

    <!-- Month Selector -->
    <div style="display:flex; align-items:center; justify-content:space-between; padding:4px 20px 12px; border-bottom:1px solid var(--border-color);">
      <button id="rep-prev-month" style="width:28px; height:28px; border:none; background:none; cursor:pointer; color:var(--text-main);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style="display:flex; align-items:center; gap:6px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span style="font-size:15px; font-weight:600; color:var(--text-main);">${currentMonthYear}</span>
      </div>
      <button id="rep-next-month" style="width:28px; height:28px; border:none; background:none; cursor:pointer; color:var(--text-main);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- Tabs: Target & Goals / Daily Reports / Enquiries / Staff -->
    <div style="display:flex; border-bottom:2px solid var(--border-color); position:sticky; top:0; background:var(--bg-paper); z-index:5;">
      <button class="rep-tab active" data-tab="targets" style="flex:1; padding:12px 0 10px; text-align:center; font-size:12px; font-weight:600; color:var(--accent-rust); border:none; background:none; cursor:pointer; position:relative; border-bottom:2px solid var(--accent-rust); margin-bottom:-2px;">
        <div style="font-size:18px; margin-bottom:2px;">🎯</div>
        Target & Goals
      </button>
      <button class="rep-tab" data-tab="reports" style="flex:1; padding:12px 0 10px; text-align:center; font-size:12px; font-weight:600; color:var(--text-muted); border:none; background:none; cursor:pointer; position:relative;">
        <div style="font-size:18px; margin-bottom:2px;">📋</div>
        Daily Reports
      </button>
      <button class="rep-tab" data-tab="enquiries" style="flex:1; padding:12px 0 10px; text-align:center; font-size:12px; font-weight:600; color:var(--text-muted); border:none; background:none; cursor:pointer; position:relative;">
        <div style="font-size:18px; margin-bottom:2px;">👥</div>
        Enquiries
      </button>
      <button class="rep-tab" data-tab="staff" style="flex:1; padding:12px 0 10px; text-align:center; font-size:12px; font-weight:600; color:var(--text-muted); border:none; background:none; cursor:pointer; position:relative;">
        <div style="font-size:18px; margin-bottom:2px;">⚙️</div>
        Staff
      </button>
    </div>

    <!-- TAB CONTENT PANELS -->
    <!-- Target & Goals Tab -->
    <div id="panel-targets" class="tab-panel" style="padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <span style="font-size:17px; font-weight:700; color:var(--text-main);">${currentMonthYear} Target</span>
        <button style="font-size:12.5px; font-weight:700; color:var(--accent-rust); background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:4px;">
          ✏️ Edit Target
        </button>
      </div>

      <!-- Tyre Sales Target Card -->
      <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; padding:18px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">🔧</span>
            <span style="font-size:14px; font-weight:700; color:var(--text-main);">Tyre Sales Target</span>
          </div>
          <span style="font-size:12px; font-weight:700; color:var(--status-overdue); background:rgba(220,38,38,0.08); padding:3px 10px; border-radius:10px;">${targetData.tyresPercentage}%</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:8px;">
          <span style="font-family:var(--font-condensed); font-size:36px; font-weight:700; color:var(--text-main);">${targetData.achievedTyres}</span>
          <span style="font-size:13px; color:var(--text-muted);">/ ${targetData.targetTyres} tyres</span>
        </div>
        <div style="width:100%; height:8px; background:var(--border-color); border-radius:4px; overflow:hidden; margin-bottom:8px;">
          <div style="width:${Math.min(100, targetData.tyresPercentage)}%; height:100%; background:var(--status-overdue); border-radius:4px;"></div>
        </div>
        <div style="font-size:12px; color:var(--text-muted);">${targetData.remainingTyres} tyres remaining</div>
      </div>

      <!-- Revenue Target Card -->
      <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; padding:18px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">₹</span>
            <span style="font-size:14px; font-weight:700; color:var(--text-main);">Revenue Target</span>
          </div>
          <span style="font-size:12px; font-weight:700; color:var(--status-done); background:rgba(46,125,50,0.08); padding:3px 10px; border-radius:10px;">${targetData.amountPercentage}%</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:8px;">
          <span style="font-family:var(--font-condensed); font-size:36px; font-weight:700; color:var(--text-main);">${UI.formatCurrency(targetData.achievedAmount)}</span>
          <span style="font-size:13px; color:var(--text-muted);">/ ${UI.formatCurrency(targetData.targetAmount)}</span>
        </div>
        <div style="width:100%; height:8px; background:var(--border-color); border-radius:4px; overflow:hidden; margin-bottom:8px;">
          <div style="width:100%; height:100%; background:var(--status-done); border-radius:4px;"></div>
        </div>
        <div style="font-size:12px; color:var(--status-done); font-weight:600;">
          Target Achieved! (+${UI.formatCurrency(targetData.achievedAmount - targetData.targetAmount)})
        </div>
      </div>

      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-top:16px;">
        ANNUAL TARGET HISTORY
      </div>
      <div style="text-align:center; padding:24px; color:var(--text-muted); font-size:18px;">⚙️</div>
    </div>

    <!-- Daily Reports Tab -->
    <div id="panel-reports" class="tab-panel" style="padding:20px; display:none;">
      <!-- Date Filter Chips -->
      <div style="display:flex; gap:8px; overflow-x:auto; overflow-y:hidden; scrollbar-width:none; padding-bottom:16px; min-height:48px; -webkit-overflow-scrolling:touch;">
        <button class="dr-chip active" data-dr="month" style="height:32px; padding:0 14px; border-radius:20px; font-size:12px; font-weight:600; background:var(--accent-rust); color:#fff; border:none; cursor:pointer; white-space:nowrap; flex-shrink:0;">This Month</button>
        <button class="dr-chip" data-dr="today" style="height:32px; padding:0 14px; border-radius:20px; font-size:12px; font-weight:600; background:var(--card-bg); color:var(--text-main); border:1px solid var(--border-color); cursor:pointer; white-space:nowrap; flex-shrink:0;">Today</button>
        <button class="dr-chip" data-dr="yesterday" style="height:32px; padding:0 14px; border-radius:20px; font-size:12px; font-weight:600; background:var(--card-bg); color:var(--text-main); border:1px solid var(--border-color); cursor:pointer; white-space:nowrap; flex-shrink:0;">Yesterday</button>
        <button class="dr-chip" data-dr="all" style="height:32px; padding:0 14px; border-radius:20px; font-size:12px; font-weight:600; background:var(--card-bg); color:var(--text-main); border:1px solid var(--border-color); cursor:pointer; white-space:nowrap; flex-shrink:0;">All</button>
        <button class="dr-chip" data-dr="custom" style="height:32px; padding:0 14px; border-radius:20px; font-size:12px; font-weight:600; background:var(--card-bg); color:var(--text-main); border:1px solid var(--border-color); cursor:pointer; white-space:nowrap; flex-shrink:0;">📅 Date</button>
      </div>

      <!-- Aggregated Stats -->
      <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:14px 16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:var(--text-muted); font-weight:500;">Total Collection</div>
            <div style="font-family:var(--font-condensed); font-size:24px; font-weight:700; color:var(--accent-rust);">${UI.formatCurrency(totalCollection)}</div>
          </div>
          <div style="border-left:1px solid var(--border-color); padding-left:14px;">
            <div style="font-size:11px; color:var(--text-muted); font-weight:500;">Tyres Sold</div>
            <div style="font-family:var(--font-condensed); font-size:24px; font-weight:700; color:var(--text-main);">${totalTyresSold}</div>
          </div>
          <div style="border-left:1px solid var(--border-color); padding-left:14px;">
            <div style="font-size:11px; color:var(--text-muted); font-weight:500;">Services</div>
            <div style="font-family:var(--font-condensed); font-size:24px; font-weight:700; color:var(--text-main);">${totalServices}</div>
          </div>
        </div>
      </div>

      <!-- Section Header -->
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
        <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted);">DAY-WISE REPORTS (${monthReports.length})</span>
        <span style="font-size:11px; color:var(--text-muted);">Tap report for breakdown</span>
      </div>

      <!-- Daily Report Cards -->
      <div id="daily-reports-list"></div>
    </div>

    <!-- Enquiries Tab -->
    <div id="panel-enquiries" class="tab-panel" style="padding:20px; display:none;">
      <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
        <div style="font-size:36px; margin-bottom:8px;">📋</div>
        <div style="font-size:15px; font-weight:600; color:var(--text-main);">Shop Enquiries</div>
        <div style="font-size:12px; margin-top:4px;">View all entries for this shop from the main Entries tab.</div>
        <button id="goto-entries-btn" class="btn-dark-cta" style="margin:16px auto 0; max-width:200px;">View Entries</button>
      </div>
    </div>

    <!-- Staff Tab -->
    <div id="panel-staff" class="tab-panel" style="padding:20px; display:none;">
      <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
        <div style="font-size:36px; margin-bottom:8px;">👥</div>
        <div style="font-size:15px; font-weight:600; color:var(--text-main);">Staff Management</div>
        <div style="font-size:12px; margin-top:4px;">Manage team members from the Manage tab.</div>
        <button id="goto-manage-btn" class="btn-dark-cta" style="margin:16px auto 0; max-width:200px;">Manage Staff</button>
      </div>
    </div>
  `;

  // Daily Report Detail Sheet matching Flutter daily_report_detail_sheet.dart
  function showDailyReportSheet(report, shop) {
    const d = new Date(report.reportDate);
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dateTitle = `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;

    const sheetHtml = `
      <div style="padding-top:10px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <div style="font-family:var(--font-condensed); font-size:22px; font-weight:700; color:var(--text-main);">${dateTitle}</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">${shop.name} · ${shop.address || 'Ms nagar'}</div>
          </div>
          <button id="close-sheet-btn" style="width:30px; height:30px; border-radius:50%; background:var(--field-bg); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; color:var(--text-muted);">✕</button>
        </div>

        <!-- Total Collection Banner -->
        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; padding:16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-muted); font-weight:600;">Total Day Collection</div>
            <div style="font-family:var(--font-condensed); font-size:32px; font-weight:700; color:var(--accent-rust); line-height:1.1;">${UI.formatCurrency(report.amount)}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:13px; font-weight:700; color:var(--text-main);">${report.totalTyres || 0} Tyres</div>
            <div style="font-size:12px; color:var(--text-muted);">${report.totalServices || 0} Services</div>
          </div>
        </div>

        <!-- Breakdown: Tyres Sold -->
        <div style="margin-bottom:16px;">
          <div style="font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin-bottom:8px; display:flex; justify-content:space-between;">
            <span>Tyres Breakdown</span>
            <span>${report.totalTyres || 0} total</span>
          </div>
          <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:12px 14px; display:flex; flex-direction:column; gap:8px;">
            ${(report.metrics || []).filter(m => m.label.toLowerCase().includes('tyre') || m.label.toLowerCase().includes('above 17')).map(m => `
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                <span style="color:var(--text-main); font-weight:500;">${m.label}</span>
                <span style="font-weight:700; color:${m.count > 0 ? 'var(--accent-rust)' : 'var(--text-muted)'}; background:${m.count > 0 ? 'rgba(193,68,14,0.08)' : 'transparent'}; padding:2px 8px; border-radius:8px;">${m.count}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Breakdown: Services -->
        <div style="margin-bottom:16px;">
          <div style="font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin-bottom:8px; display:flex; justify-content:space-between;">
            <span>Services Performed</span>
            <span>${report.totalServices || 0} total</span>
          </div>
          <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:12px 14px; display:flex; flex-direction:column; gap:8px;">
            ${(report.metrics || []).filter(m => m.label.toLowerCase().includes('alignment') || m.label.toLowerCase().includes('wash') || m.label.toLowerCase().includes('service')).map(m => `
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                <span style="color:var(--text-main); font-weight:500;">${m.label}</span>
                <span style="font-weight:700; color:${m.count > 0 ? 'var(--status-done)' : 'var(--text-muted)'}; background:${m.count > 0 ? 'rgba(46,125,50,0.08)' : 'transparent'}; padding:2px 8px; border-radius:8px;">${m.count}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Breakdown: Enquiries -->
        <div style="margin-bottom:16px;">
          <div style="font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin-bottom:8px;">
            Enquiries
          </div>
          <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:12px 14px; display:flex; flex-direction:column; gap:8px;">
            ${(report.metrics || []).filter(m => m.label.toLowerCase().includes('enquiry')).map(m => `
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                <span style="color:var(--text-main); font-weight:500;">${m.label}</span>
                <span style="font-weight:700; color:${m.count > 0 ? 'var(--accent-steel)' : 'var(--text-muted)'}; background:${m.count > 0 ? 'rgba(53,81,107,0.08)' : 'transparent'}; padding:2px 8px; border-radius:8px;">${m.count}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <button id="sheet-done-btn" class="btn-dark-cta" style="margin-top:12px;">Close Breakdown</button>
      </div>
    `;

    UI.showModal(sheetHtml, {
      onMounted(modal) {
        modal.querySelector('#close-sheet-btn')?.addEventListener('click', () => UI.hideModal());
        modal.querySelector('#sheet-done-btn')?.addEventListener('click', () => UI.hideModal());
      }
    });
  }

  // Render Daily Report Cards
  const drList = container.querySelector('#daily-reports-list');
  function renderDailyReports(reports) {
    drList.innerHTML = '';
    if (reports.length === 0) {
      drList.innerHTML = '<div style="text-align:center; padding:32px; color:var(--text-muted); font-size:13px;">No reports for this period.</div>';
      return;
    }
    reports.forEach(report => {
      const d = new Date(report.reportDate);
      const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const dateStr = `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      const card = document.createElement('div');
      card.style.cssText = 'background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px; margin-bottom:12px; cursor:pointer;';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:14px;">📋</span>
            <span style="font-size:14px; font-weight:700; color:var(--text-main);">${dateStr}</span>
          </div>
          <span style="font-family:var(--font-condensed); font-size:15px; font-weight:700; color:var(--accent-rust);">${UI.formatCurrency(report.amount)}</span>
        </div>
        <!-- Metric Chips -->
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
          ${(report.metrics || []).map(m => `
            <span style="font-size:11px; font-weight:500; padding:3px 10px; border-radius:14px; background:${m.count > 0 ? 'rgba(193,68,14,0.08)' : 'var(--field-bg)'}; color:${m.count > 0 ? 'var(--accent-rust)' : 'var(--text-muted)'}; border:1px solid ${m.count > 0 ? 'rgba(193,68,14,0.15)' : 'var(--border-color)'};">
              ${m.label}: ${m.count}
            </span>
          `).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-sub); font-weight:600;">
          <span>Total Tyres: ${report.totalTyres} · Total Services: ${report.totalServices}</span>
          <span style="color:var(--accent-rust); font-weight:700;">View Breakdown ›</span>
        </div>
      `;
      card.addEventListener('click', () => showDailyReportSheet(report, selectedShop));
      drList.appendChild(card);
    });
  }
  renderDailyReports(monthReports);

  // Tab switching
  container.querySelectorAll('.rep-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.rep-tab').forEach(t => {
        t.style.color = 'var(--text-muted)';
        t.style.borderBottom = 'none';
        t.style.marginBottom = '0';
      });
      tab.style.color = 'var(--accent-rust)';
      tab.style.borderBottom = '2px solid var(--accent-rust)';
      tab.style.marginBottom = '-2px';

      container.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
      container.querySelector(`#panel-${tab.dataset.tab}`).style.display = 'block';
    });
  });

  // Daily report date filter chips
  container.querySelectorAll('.dr-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.dr-chip').forEach(c => {
        c.style.background = 'var(--card-bg)';
        c.style.color = 'var(--text-main)';
        c.style.border = '1px solid var(--border-color)';
      });
      chip.style.background = 'var(--accent-rust)';
      chip.style.color = '#fff';
      chip.style.border = 'none';

      const filter = chip.dataset.dr;
      if (filter === 'all') {
        renderDailyReports(dailyReports);
      } else if (filter === 'month') {
        renderDailyReports(monthReports);
      } else if (filter === 'today') {
        const today = new Date().toISOString().slice(0, 10);
        renderDailyReports(dailyReports.filter(r => r.reportDate.slice(0, 10) === today));
      } else if (filter === 'yesterday') {
        const y = new Date(); y.setDate(y.getDate() - 1);
        const yStr = y.toISOString().slice(0, 10);
        renderDailyReports(dailyReports.filter(r => r.reportDate.slice(0, 10) === yStr));
      }
    });
  });

  // Navigation
  container.querySelector('#rep-back-btn')?.addEventListener('click', () => router.navigate('/dashboard'));
  container.querySelector('#goto-entries-btn')?.addEventListener('click', () => router.navigate('/entries'));
  container.querySelector('#goto-manage-btn')?.addEventListener('click', () => router.navigate('/manage'));
  container.querySelector('#rep-refresh-btn')?.addEventListener('click', () => window.location.reload());

  return container;
}
