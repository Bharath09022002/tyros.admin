// Car Master Screen matching Screenshot 2 exactly
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderCarMaster(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  let currentTab = 'brands'; // 'brands' | 'models'
  let searchQuery = '';

  let brands = await Store.getCarBrands();
  let models = await Store.getCarModels();

  function buildHtml() {
    return `
      <!-- App Header matching Screenshot 2 -->
      <header class="master-header">
        <div class="master-header-left">
          <button id="car-back-btn" class="back-btn" style="background:none; border:none; padding:4px; cursor:pointer; color:var(--text-main); display:flex; align-items:center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div class="master-header-title">Car Master</div>
        </div>
        <button id="car-header-add-btn" class="master-header-btn">
          <span style="font-size:16px; line-height:1;">+</span>
          <span>${currentTab === 'brands' ? 'Add Brand' : 'Add Model'}</span>
        </button>
      </header>

      <!-- Tabs Bar: Brands (19) & Models (108) -->
      <div class="master-tabs-bar">
        <button class="master-tab-btn ${currentTab === 'brands' ? 'active' : ''}" data-tab="brands">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Brands (${brands.length})
        </button>
        <button class="master-tab-btn ${currentTab === 'models' ? 'active' : ''}" data-tab="models">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H6c-.7 0-1.3.3-1.8.7C3.3 8.6 2 10 2 10s-2.7.6-4.5 1.1C-3.3 11.3-4 12.1-4 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
          Models (${models.length})
        </button>
      </div>

      <!-- Search Row + Refresh Button -->
      <div class="master-search-row">
        <div class="master-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="car-search-input" placeholder="${currentTab === 'brands' ? 'Search car brand...' : 'Search car model...'}" value="${searchQuery}">
        </div>
        <button id="car-refresh-btn" class="master-refresh-btn" title="Refresh List">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        </button>
      </div>

      <!-- Items List -->
      <div id="car-items-list" style="padding-top: 4px; padding-bottom: 90px;"></div>

      <!-- Floating Action Button (FAB) matching Screenshot 2 -->
      <button id="car-fab-btn" class="master-fab">
        <span style="font-size:18px; line-height:1;">+</span>
        <span>${currentTab === 'brands' ? 'Add Brand' : 'Add Model'}</span>
      </button>
    `;
  }

  async function renderItems() {
    const listEl = container.querySelector('#car-items-list');
    if (!listEl) return;

    const q = searchQuery.toLowerCase().trim();

    if (currentTab === 'brands') {
      const filtered = brands.filter(b => b.name.toLowerCase().includes(q));
      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">No car brands found matching "${searchQuery}"</div>`;
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

      // Event listeners for Brands
      listEl.querySelectorAll('.toggle-brand-input').forEach(chk => {
        chk.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          await Store.toggleCarBrand(id);
          brands = await Store.getCarBrands();
          renderItems();
        });
      });

      listEl.querySelectorAll('.edit-brand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = brands.find(b => b.id === id);
          if (!item) return;

          UI.showModal(`
            <h3 class="sheet-title">Edit Car Brand</h3>
            <div class="form-group" style="margin: 0 0 16px;">
              <label class="form-label">Brand Name <span class="req">*</span></label>
              <input type="text" id="edit-brand-val" class="form-input" value="${item.name}" placeholder="e.g. Audi" required>
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
                await Store.updateCarBrand(id, val);
                brands = await Store.getCarBrands();
                UI.hideModal();
                UI.showToast(`Updated car brand to "${val}"`, 'success');
                renderItems();
              });
            }
          });
        });
      });
    } else {
      // Models tab
      const filtered = models.filter(m => m.name.toLowerCase().includes(q) || (m.brandName && m.brandName.toLowerCase().includes(q)));
      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">No car models found matching "${searchQuery}"</div>`;
        return;
      }

      listEl.innerHTML = filtered.map(item => `
        <div class="master-card" data-id="${item.id}">
          <div class="master-card-left">
            <div class="master-avatar-square" style="background:#EBF3F8; color:var(--accent-steel);">
              ${item.name.charAt(0).toUpperCase()}
            </div>
            <div class="master-card-info">
              <div class="master-card-title">${item.name}</div>
              <div style="font-size:11.5px; color:var(--text-muted);">${item.brandName || 'Vehicle'}</div>
              <span class="${item.isActive ? 'master-badge-active' : 'master-badge-inactive'}" style="margin-top:2px;">
                ${item.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div class="master-card-right">
            <button class="master-edit-btn edit-model-btn" data-id="${item.id}" title="Edit Model">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <label class="switch-toggle">
              <input type="checkbox" class="toggle-model-input" data-id="${item.id}" ${item.isActive ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `).join('');

      // Event listeners for Models
      listEl.querySelectorAll('.toggle-model-input').forEach(chk => {
        chk.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          await Store.toggleCarModel(id);
          models = await Store.getCarModels();
          renderItems();
        });
      });

      listEl.querySelectorAll('.edit-model-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = models.find(m => m.id === id);
          if (!item) return;

          UI.showModal(`
            <h3 class="sheet-title">Edit Car Model</h3>
            <div class="form-group" style="margin: 0 0 12px;">
              <label class="form-label">Model Name <span class="req">*</span></label>
              <input type="text" id="edit-model-name" class="form-input" value="${item.name}" required>
            </div>
            <div class="form-group" style="margin: 0 0 16px;">
              <label class="form-label">Brand</label>
              <select id="edit-model-brand" class="form-select">
                ${brands.map(b => `<option value="${b.name}" ${b.name === item.brandName ? 'selected' : ''}>${b.name}</option>`).join('')}
              </select>
            </div>
            <div class="sheet-actions">
              <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
              <button id="save-model-btn" class="btn-primary-cta" style="margin:0;">Update Model</button>
            </div>
          `, {
            onMounted(sheet) {
              sheet.querySelector('#save-model-btn').addEventListener('click', async () => {
                const name = sheet.querySelector('#edit-model-name').value.trim();
                const bName = sheet.querySelector('#edit-model-brand').value;
                if (!name) return UI.showToast('Please enter model name', 'error');
                await Store.updateCarModel(id, name, bName);
                models = await Store.getCarModels();
                UI.hideModal();
                UI.showToast(`Updated model to "${name}"`, 'success');
                renderItems();
              });
            }
          });
        });
      });
    }
  }

  function openAddModal() {
    if (currentTab === 'brands') {
      UI.showModal(`
        <h3 class="sheet-title">Add Car Brand</h3>
        <p class="sheet-sub">Add a vehicle brand / manufacturer to the catalog.</p>
        <div class="form-group" style="margin: 0 0 16px;">
          <label class="form-label">Brand Name <span class="req">*</span></label>
          <input type="text" id="new-car-brand" class="form-input" placeholder="e.g. Tata" required>
        </div>
        <div class="sheet-actions">
          <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
          <button id="add-brand-save-btn" class="btn-primary-cta" style="margin:0;">Add Brand</button>
        </div>
      `, {
        onMounted(sheet) {
          sheet.querySelector('#add-brand-save-btn').addEventListener('click', async () => {
            const val = sheet.querySelector('#new-car-brand').value.trim();
            if (!val) return UI.showToast('Please enter brand name', 'error');
            await Store.addCarBrand(val);
            brands = await Store.getCarBrands();
            UI.hideModal();
            UI.showToast(`Added car brand "${val}"`, 'success');
            container.innerHTML = buildHtml();
            setupEvents();
            renderItems();
          });
        }
      });
    } else {
      UI.showModal(`
        <h3 class="sheet-title">Add Car Model</h3>
        <p class="sheet-sub">Add a vehicle model linked to a brand.</p>
        <div class="form-group" style="margin: 0 0 12px;">
          <label class="form-label">Model Name <span class="req">*</span></label>
          <input type="text" id="new-model-name" class="form-input" placeholder="e.g. Creta" required>
        </div>
        <div class="form-group" style="margin: 0 0 16px;">
          <label class="form-label">Brand <span class="req">*</span></label>
          <select id="new-model-brand" class="form-select">
            ${brands.map(b => `<option value="${b.name}">${b.name}</option>`).join('')}
          </select>
        </div>
        <div class="sheet-actions">
          <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
          <button id="add-model-save-btn" class="btn-primary-cta" style="margin:0;">Add Model</button>
        </div>
      `, {
        onMounted(sheet) {
          sheet.querySelector('#add-model-save-btn').addEventListener('click', async () => {
            const name = sheet.querySelector('#new-model-name').value.trim();
            const bName = sheet.querySelector('#new-model-brand').value;
            if (!name) return UI.showToast('Please enter model name', 'error');
            await Store.addCarModel(name, bName);
            models = await Store.getCarModels();
            UI.hideModal();
            UI.showToast(`Added car model "${name}"`, 'success');
            container.innerHTML = buildHtml();
            setupEvents();
            renderItems();
          });
        }
      });
    }
  }

  function setupEvents() {
    container.querySelector('#car-back-btn')?.addEventListener('click', () => router.navigate('/dashboard'));

    // Top CTA & Floating FAB CTA
    container.querySelector('#car-header-add-btn')?.addEventListener('click', openAddModal);
    container.querySelector('#car-fab-btn')?.addEventListener('click', openAddModal);

    // Refresh button
    container.querySelector('#car-refresh-btn')?.addEventListener('click', async () => {
      brands = await Store.getCarBrands();
      models = await Store.getCarModels();
      UI.showToast('Catalog refreshed', 'info');
      renderItems();
    });

    // Tab buttons
    container.querySelectorAll('.master-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.master-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        const addBtnSpan = container.querySelector('#car-header-add-btn span:last-child');
        const fabBtnSpan = container.querySelector('#car-fab-btn span:last-child');
        const placeholder = currentTab === 'brands' ? 'Search car brand...' : 'Search car model...';
        if (addBtnSpan) addBtnSpan.textContent = currentTab === 'brands' ? 'Add Brand' : 'Add Model';
        if (fabBtnSpan) fabBtnSpan.textContent = currentTab === 'brands' ? 'Add Brand' : 'Add Model';
        const searchInput = container.querySelector('#car-search-input');
        if (searchInput) searchInput.placeholder = placeholder;
        renderItems();
      });
    });

    // Search input
    container.querySelector('#car-search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderItems();
    });
  }

  container.innerHTML = buildHtml();
  setupEvents();
  renderItems();

  return container;
}
