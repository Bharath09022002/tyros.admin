// Tyre Master Screen matching Screenshot 3 exactly
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderTyreMaster(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  let currentTab = 'sizes'; // 'sizes' | 'brands'
  let searchQuery = '';

  let sizes = await Store.getTyreSizes();
  let brands = await Store.getTyreBrands();

  function buildHtml() {
    return `
      <!-- App Header matching Screenshot 3 -->
      <header class="master-header">
        <div class="master-header-left">
          <button id="tyre-back-btn" class="back-btn" style="background:none; border:none; padding:4px; cursor:pointer; color:var(--text-main); display:flex; align-items:center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div class="master-header-title">Tyre Master</div>
        </div>
        <button id="tyre-header-add-btn" class="master-header-btn">
          <span style="font-size:16px; line-height:1;">+</span>
          <span>${currentTab === 'sizes' ? 'Add Size' : 'Add Brand'}</span>
        </button>
      </header>

      <!-- Tabs Bar: Sizes (348) & Brands (22) -->
      <div class="master-tabs-bar">
        <button class="master-tab-btn ${currentTab === 'sizes' ? 'active' : ''}" data-tab="sizes">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
          Sizes (${sizes.length})
        </button>
        <button class="master-tab-btn ${currentTab === 'brands' ? 'active' : ''}" data-tab="brands">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          Brands (${brands.length})
        </button>
      </div>

      <!-- Search Bar -->
      <div class="master-search-row">
        <div class="master-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="tyre-search-input" placeholder="Search sizes or brands..." value="${searchQuery}">
        </div>
      </div>

      <!-- Items List -->
      <div id="tyre-items-list" style="padding-top: 4px; padding-bottom: 80px;"></div>
    `;
  }

  async function renderItems() {
    const listEl = container.querySelector('#tyre-items-list');
    if (!listEl) return;

    const q = searchQuery.toLowerCase().trim();

    if (currentTab === 'sizes') {
      const filtered = sizes.filter(s => s.size.toLowerCase().includes(q));
      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">${searchQuery ? `No tyre sizes found matching "${searchQuery}"` : 'No tyre sizes found in database.<br><span style="font-size:12px; margin-top:6px; display:inline-block;">Tap <b>+ Add Size</b> to add your first specification.</span>'}</div>`;
        return;
      }

      listEl.innerHTML = filtered.map(item => `
        <div class="master-card" data-id="${item.id}">
          <div class="master-card-left">
            <div class="master-card-info">
              <div class="master-card-title">${item.size}</div>
              <span class="${item.isActive ? 'master-badge-active' : 'master-badge-inactive'}">
                ${item.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div class="master-card-right">
            <button class="master-edit-btn edit-size-btn" data-id="${item.id}" title="Edit Size">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <label class="switch-toggle">
              <input type="checkbox" class="toggle-size-input" data-id="${item.id}" ${item.isActive ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `).join('');

      // Attach event listeners for size items
      listEl.querySelectorAll('.toggle-size-input').forEach(chk => {
        chk.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          await Store.toggleTyreSize(id);
          sizes = await Store.getTyreSizes();
          renderItems();
        });
      });

      listEl.querySelectorAll('.edit-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = sizes.find(s => s.id === id);
          if (!item) return;

          UI.showModal(`
            <h3 class="sheet-title">Edit Tyre Size</h3>
            <div class="form-group" style="margin: 0 0 16px;">
              <label class="form-label">Tyre Size Specification <span class="req">*</span></label>
              <input type="text" id="edit-size-val" class="form-input" value="${item.size}" placeholder="e.g. 205/65R16" required>
            </div>
            <div class="sheet-actions">
              <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
              <button id="save-size-btn" class="btn-primary-cta" style="margin:0;">Update Size</button>
            </div>
          `, {
            onMounted(sheet) {
              sheet.querySelector('#save-size-btn').addEventListener('click', async () => {
                const val = sheet.querySelector('#edit-size-val').value.trim();
                if (!val) return UI.showToast('Please enter tyre size', 'error');
                await Store.updateTyreSize(id, val);
                sizes = await Store.getTyreSizes();
                UI.hideModal();
                UI.showToast(`Updated tyre size to ${val}`, 'success');
                renderItems();
              });
            }
          });
        });
      });
    } else {
      // Brands tab
      const filtered = brands.filter(b => b.name.toLowerCase().includes(q));
      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">${searchQuery ? `No tyre brands found matching "${searchQuery}"` : 'No tyre brands found in database.<br><span style="font-size:12px; margin-top:6px; display:inline-block;">Tap <b>+ Add Brand</b> to register a tyre brand.</span>'}</div>`;
        return;
      }

      listEl.innerHTML = filtered.map(item => `
        <div class="master-card" data-id="${item.id}">
          <div class="master-card-left">
            <div class="master-avatar-square">
              ${item.name.charAt(0).toUpperCase()}
            </div>
            <div class="master-card-info">
              <div class="master-card-title">${item.name}</div>
              <span class="${item.isActive ? 'master-badge-active' : 'master-badge-inactive'}">
                ${item.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div class="master-card-right">
            <button class="master-edit-btn edit-brand-btn" data-id="${item.id}" title="Edit Brand">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <label class="switch-toggle">
              <input type="checkbox" class="toggle-brand-input" data-id="${item.id}" ${item.isActive ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `).join('');

      // Attach event listeners for brand items
      listEl.querySelectorAll('.toggle-brand-input').forEach(chk => {
        chk.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          await Store.toggleTyreBrand(id);
          brands = await Store.getTyreBrands();
          renderItems();
        });
      });

      listEl.querySelectorAll('.edit-brand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = brands.find(b => b.id === id);
          if (!item) return;

          UI.showModal(`
            <h3 class="sheet-title">Edit Tyre Brand</h3>
            <div class="form-group" style="margin: 0 0 16px;">
              <label class="form-label">Brand Name <span class="req">*</span></label>
              <input type="text" id="edit-brand-val" class="form-input" value="${item.name}" placeholder="e.g. Michelin" required>
            </div>
            <div class="sheet-actions">
              <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
              <button id="save-brand-btn" class="btn-primary-cta" style="margin:0;">Update Brand</button>
            </div>
          `, {
            onMounted(sheet) {
              sheet.querySelector('#save-brand-btn').addEventListener('click', async () => {
                const val = sheet.querySelector('#edit-brand-val').value.trim();
                if (!val) return UI.showToast('Please enter brand name', 'error');
                await Store.updateTyreBrand(id, val);
                brands = await Store.getTyreBrands();
                UI.hideModal();
                UI.showToast(`Updated tyre brand to ${val}`, 'success');
                renderItems();
              });
            }
          });
        });
      });
    }
  }

  function setupEvents() {
    container.querySelector('#tyre-back-btn')?.addEventListener('click', () => router.navigate('/dashboard'));

    // Top Add CTA
    container.querySelector('#tyre-header-add-btn')?.addEventListener('click', () => {
      if (currentTab === 'sizes') {
        UI.showModal(`
          <h3 class="sheet-title">Add Tyre Size</h3>
          <p class="sheet-sub">Add a new tyre dimension specification to the catalog.</p>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Tyre Size Specification <span class="req">*</span></label>
            <input type="text" id="new-size-val" class="form-input" placeholder="e.g. 215/60R16" required>
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="add-size-save-btn" class="btn-primary-cta" style="margin:0;">Add Size</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#add-size-save-btn').addEventListener('click', async () => {
              const val = sheet.querySelector('#new-size-val').value.trim();
              if (!val) return UI.showToast('Please enter tyre size', 'error');
              await Store.addTyreSize(val);
              sizes = await Store.getTyreSizes();
              UI.hideModal();
              UI.showToast(`Added tyre size "${val}"`, 'success');
              container.innerHTML = buildHtml();
              setupEvents();
              renderItems();
            });
          }
        });
      } else {
        UI.showModal(`
          <h3 class="sheet-title">Add Tyre Brand</h3>
          <p class="sheet-sub">Add a manufacturer tyre brand to the catalog.</p>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Brand Name <span class="req">*</span></label>
            <input type="text" id="new-brand-val" class="form-input" placeholder="e.g. Pirelli" required>
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="add-brand-save-btn" class="btn-primary-cta" style="margin:0;">Add Brand</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#add-brand-save-btn').addEventListener('click', async () => {
              const val = sheet.querySelector('#new-brand-val').value.trim();
              if (!val) return UI.showToast('Please enter brand name', 'error');
              await Store.addTyreBrand(val);
              brands = await Store.getTyreBrands();
              UI.hideModal();
              UI.showToast(`Added tyre brand "${val}"`, 'success');
              container.innerHTML = buildHtml();
              setupEvents();
              renderItems();
            });
          }
        });
      }
    });

    // Tab buttons
    container.querySelectorAll('.master-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.master-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        const addBtnSpan = container.querySelector('#tyre-header-add-btn span:last-child');
        if (addBtnSpan) addBtnSpan.textContent = currentTab === 'sizes' ? 'Add Size' : 'Add Brand';
        renderItems();
      });
    });

    // Search input
    container.querySelector('#tyre-search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderItems();
    });
  }

  container.innerHTML = buildHtml();
  setupEvents();
  renderItems();

  return container;
}
