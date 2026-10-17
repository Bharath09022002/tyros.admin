// Tyros Admin - Customer Entries View (js/pages/entries.js)
import { Store } from '../store.js';
import { UI } from '../ui.js';
import { Sheet } from '../sheet.js';
import { Toast } from '../toast.js';

export async function renderEntriesPage(router, params = {}) {
  const container = document.createElement('div');
  container.className = 'page-container';

  // State
  let activeFilter = params.filter ? params.filter.toLowerCase() : 'all'; // 'all' | 'pending' | 'overdue' | 'completed' | 'other'
  let selectedShopId = params.shopId || 'all';
  let searchQuery = '';
  let allEntries = [];
  let shops = [];
  let isFetching = false;

  // Initials generator
  function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  const avatarPalettes = [
    { bg: '#FEE2E2', text: '#DC2626' },
    { bg: '#FCE7F3', text: '#DB2777' },
    { bg: '#DCFCE7', text: '#16A34A' },
    { bg: '#FFEDD5', text: '#EA580C' },
    { bg: '#EDE9FE', text: '#7C3AED' },
    { bg: '#E0F2FE', text: '#0284C7' }
  ];

  function getAvatarColors(name) {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarPalettes[Math.abs(hash) % avatarPalettes.length];
  }

  // Render Skeleton while initial fetch happens
  container.innerHTML = `
    <header class="app-header mobile-only-header">
      <div class="app-header-row">
        <div class="app-header-info">
          <h1 class="app-header-title">All Entries</h1>
          <div class="app-header-subtitle">Loading records...</div>
        </div>
      </div>
    </header>
    <div style="padding-top: var(--space-4);">
      <div class="skeleton" style="height: 44px; border-radius: var(--radius-md); margin-bottom: var(--space-3);"></div>
      <div class="skeleton" style="height: 36px; border-radius: var(--radius-pill); margin-bottom: var(--space-4);"></div>
      <div style="display:flex; flex-direction:column; gap:var(--space-3);">
        <div class="skeleton" style="height: 110px; border-radius:var(--radius-lg);"></div>
        <div class="skeleton" style="height: 110px; border-radius:var(--radius-lg);"></div>
        <div class="skeleton" style="height: 110px; border-radius:var(--radius-lg);"></div>
      </div>
    </div>
  `;

  async function loadData() {
    try {
      isFetching = true;
      const [fetchedShops, fetchedEntries] = await Promise.all([
        Store.getShops(),
        Store.getEntries({ limit: 100 })
      ]);
      shops = fetchedShops;
      allEntries = fetchedEntries.filter(e => !e.isDeleted);
      renderUI();
    } catch (err) {
      console.error('[Entries] Load error:', err);
      container.innerHTML = `
        <div style="text-align:center; padding: 48px var(--space-4); background:var(--bg-surface); border:1px solid var(--border-default); border-radius:var(--radius-xl); margin-top:var(--space-4);">
          <div style="font-size: 36px; margin-bottom: 8px;">⚠️</div>
          <h2 style="font-family:var(--font-display); font-size: 24px; color:var(--status-overdue); margin-bottom: 6px;">Failed to load entries</h2>
          <p style="font-size: 13.5px; color:var(--text-muted); margin-bottom: 20px;">${UI.escape(err.message || 'Network error')}</p>
          <button id="entries-retry-btn" class="btn-primary" style="margin: 0 auto;">Retry</button>
        </div>
      `;
      container.querySelector('#entries-retry-btn')?.addEventListener('click', loadData);
    } finally {
      isFetching = false;
    }
  }

  function getFilteredEntries() {
    return allEntries.filter(e => {
      // Shop filter
      if (selectedShopId !== 'all' && e.shopId !== selectedShopId) {
        return false;
      }

      // Status pill filter
      if (activeFilter === 'pending') {
        if (e.status !== 'PENDING' || e.fitStatus === 'NOT_FIT' || e.isNoResponse || e.isOverdue) return false;
      } else if (activeFilter === 'overdue') {
        if (!e.isOverdue) return false;
      } else if (activeFilter === 'completed') {
        if (e.status !== 'COMPLETED' || e.fitStatus === 'NOT_FIT') return false;
      } else if (activeFilter === 'other') {
        // Lost, No Response, or Unfit Pending
        const isComp = e.status === 'COMPLETED' && e.fitStatus !== 'NOT_FIT';
        const isPend = e.status === 'PENDING' && e.fitStatus !== 'NOT_FIT' && !e.isNoResponse && !e.isOverdue;
        const isOver = e.isOverdue;
        if (isComp || isPend || isOver) return false;
      }

      // Search query (300ms debounced)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = (e.customerName || '').toLowerCase().includes(q);
        const matchPhone = (e.mobileNumber || '').includes(q);
        const matchReg = (e.vehicleNumber || '').toLowerCase().includes(q);
        const matchModel = (e.vehicleDetails || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchReg && !matchModel) return false;
      }

      return true;
    });
  }

  function showEntryDetailSheet(entry) {
    const avatarColor = getAvatarColors(entry.customerName);
    const detailContent = document.createElement('div');
    detailContent.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <div style="width:48px; height:48px; border-radius:var(--radius-pill); background:${avatarColor.bg}; color:${avatarColor.text}; font-family:var(--font-display); font-size:20px; font-weight:700; display:flex; align-items:center; justify-content:center;">
          ${getInitials(entry.customerName)}
        </div>
        <div>
          <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-primary); line-height:1.2;">
            ${UI.escape(entry.customerName)}
          </div>
          <a href="tel:${entry.mobileNumber}" style="font-size:13px; color:var(--accent); font-weight:600; text-decoration:none;">
            📞 ${UI.escape(entry.mobileNumber)}
          </a>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px; background:var(--bg-subtle); padding:14px; border-radius:var(--radius-md); font-size:13.5px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Vehicle</span>
          <strong>${UI.escape(entry.vehicleDetails)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Registration</span>
          <strong style="font-family:monospace; background:var(--bg-surface); padding:1px 6px; border-radius:4px;">${UI.escape(entry.vehicleNumber || 'N/A')}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Tyre Spec</span>
          <span>${UI.escape(entry.tyreSize)} ${UI.escape(entry.tyreBrand)} (${entry.quantity} units)</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Estimated Amount</span>
          <strong style="color:var(--accent); font-size:15px;">₹${Number(entry.amount || 0).toLocaleString('en-IN')}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Branch</span>
          <span>${UI.escape(entry.shopName || 'Workshop')}</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Status</span>
          <span style="font-weight:700; text-transform:uppercase; font-size:11.5px; padding:2px 8px; border-radius:6px; background:${entry.status === 'COMPLETED' ? 'rgba(22,163,74,0.15)' : 'rgba(234,88,12,0.15)'}; color:${entry.status === 'COMPLETED' ? 'var(--status-completed)' : 'var(--status-pending)'};">
            ${UI.escape(entry.status)}
          </span>
        </div>
        ${entry.remarks ? `
          <div style="border-top:1px dashed var(--border-default); padding-top:8px; margin-top:2px;">
            <div style="font-size:11.5px; color:var(--text-muted);">Remarks</div>
            <div style="font-size:13px; color:var(--text-primary); margin-top:2px;">${UI.escape(entry.remarks)}</div>
          </div>
        ` : ''}
      </div>
    `;

    Sheet.show({
      title: 'Enquiry Details',
      contentEl: detailContent,
      actions: [
        { label: 'Close', primary: true, fullWidth: true }
      ]
    });
  }

  function renderUI() {
    const filtered = getFilteredEntries();

    // Reconcile status counts across all entries
    const countCompleted = allEntries.filter(e => e.status === 'COMPLETED' && e.fitStatus !== 'NOT_FIT').length;
    const countPending = allEntries.filter(e => e.status === 'PENDING' && e.fitStatus !== 'NOT_FIT' && !e.isNoResponse && !e.isOverdue).length;
    const countOverdue = allEntries.filter(e => e.isOverdue).length;
    const countOther = Math.max(0, allEntries.length - (countCompleted + countPending + countOverdue));

    container.innerHTML = `
      <header class="app-header mobile-only-header">
        <div class="app-header-row">
          <div class="app-header-info">
            <h1 class="app-header-title">All Entries</h1>
            <div class="app-header-subtitle">
              ${filtered.length} of ${allEntries.length} records · ${shops.length} shops
            </div>
          </div>
        </div>
      </header>

      <div style="padding-top: var(--space-3);">
        <!-- Search and Shop Filter Row -->
        <div style="display:flex; gap:10px; margin-bottom:var(--space-3); flex-wrap:wrap;">
          <div style="flex:1; min-width:200px; position:relative;">
            <input
              type="text"
              id="entries-search-input"
              placeholder="Search name, phone, vehicle..."
              value="${UI.escape(searchQuery)}"
              style="width:100%; padding-left:36px;"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>

          <select id="entries-shop-select" style="min-width:140px;">
            <option value="all" ${selectedShopId === 'all' ? 'selected' : ''}>All Shops (${shops.length})</option>
            ${shops.map(s => `<option value="${s.id}" ${selectedShopId === s.id ? 'selected' : ''}>${UI.escape(s.name)}</option>`).join('')}
          </select>
        </div>

        <!-- Filter Pills Bar (All, Pending, Overdue, Completed, Other) -->
        <div class="filter-pills-row">
          <button class="filter-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">
            All (${allEntries.length})
          </button>
          <button class="filter-pill ${activeFilter === 'pending' ? 'active' : ''}" data-filter="pending">
            Pending (${countPending})
          </button>
          <button class="filter-pill ${activeFilter === 'overdue' ? 'active' : ''}" data-filter="overdue">
            Overdue (${countOverdue})
          </button>
          <button class="filter-pill ${activeFilter === 'completed' ? 'active' : ''}" data-filter="completed">
            Completed (${countCompleted})
          </button>
          <button class="filter-pill ${activeFilter === 'other' ? 'active' : ''}" data-filter="other">
            Other (${countOther})
          </button>
        </div>

        <!-- Cards List Container -->
        <div id="entries-list-container" style="display:flex; flex-direction:column; gap:var(--space-3); padding-bottom:var(--space-6);"></div>
      </div>
    `;

    const listEl = container.querySelector('#entries-list-container');

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--border-default); border-radius:var(--radius-xl); padding:40px var(--space-4); text-align:center;">
          <div style="font-size:32px; margin-bottom:8px;">🔍</div>
          <div style="font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-primary);">No matching records</div>
          <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Try adjusting your search query or filter selection.</p>
        </div>
      `;
    } else {
      filtered.forEach(entry => {
        const avatarColor = getAvatarColors(entry.customerName);
        const card = document.createElement('div');
        card.className = 'enquiry-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const isComp = entry.status === 'COMPLETED' && entry.fitStatus !== 'NOT_FIT';
        const isOver = entry.isOverdue;
        const statusColor = isComp ? 'var(--status-completed)' : isOver ? 'var(--status-overdue)' : 'var(--status-pending)';
        const statusBg = isComp ? 'var(--status-completed-bg)' : isOver ? 'var(--status-overdue-bg)' : 'var(--status-pending-bg)';

        card.innerHTML = `
          <div class="enquiry-top-row">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
              <div class="enquiry-avatar" style="background:${avatarColor.bg}; color:${avatarColor.text};">
                ${getInitials(entry.customerName)}
              </div>
              <div style="min-width:0;">
                <div class="enquiry-cust-name" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${UI.escape(entry.customerName)}
                </div>
                <div class="enquiry-cust-phone">
                  <span>📞</span>
                  <span>${UI.escape(entry.mobileNumber)}</span>
                </div>
              </div>
            </div>
            <span style="font-size:11px; font-weight:700; text-transform:uppercase; padding:3px 8px; border-radius:6px; background:${statusBg}; color:${statusColor}; flex-shrink:0;">
              ${UI.escape(entry.status)}
            </span>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <div class="enquiry-vehicle-pill">
              <span>🚗</span>
              <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;">
                ${UI.escape(entry.vehicleDetails)} ${entry.vehicleNumber ? `· ${UI.escape(entry.vehicleNumber)}` : ''}
              </span>
            </div>
            <span style="font-size:12px; font-weight:600; color:var(--text-muted);">${UI.escape(entry.shopName || 'Shop')}</span>
          </div>

          <div class="enquiry-details-row">
            <span style="font-size:12.5px; color:var(--text-secondary); font-weight:500;">
              ${UI.escape(entry.tyreSize)} ${UI.escape(entry.tyreBrand)} · ${entry.quantity || 1} tyres
            </span>
            <span style="font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--accent);">
              ₹${Number(entry.amount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        `;

        card.addEventListener('click', () => showEntryDetailSheet(entry));
        listEl.appendChild(card);
      });
    }

    // Attach search listener (debounced 300ms)
    const searchInput = container.querySelector('#entries-search-input');
    searchInput?.addEventListener('input', UI.debounce((e) => {
      searchQuery = e.target.value.trim();
      renderUI();
    }, 300));

    // Attach shop filter listener
    const shopSelect = container.querySelector('#entries-shop-select');
    shopSelect?.addEventListener('change', (e) => {
      selectedShopId = e.target.value;
      renderUI();
    });

    // Attach filter pill buttons
    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        activeFilter = pill.dataset.filter;
        renderUI();
      });
    });
  }

  // Load live data
  loadData();

  return container;
}
