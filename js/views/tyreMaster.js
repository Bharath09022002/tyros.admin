// Tyre Master Screen matching Flutter TyreMaster Screen with Sizes, Brands & Products
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderTyreMaster(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  let currentTab = 'sizes'; // 'sizes' | 'brands' | 'products'
  let searchQuery = '';

  let sizes = await Store.getTyreSizes();
  let brands = await Store.getTyreBrands();
  let products = await Store.getTyreProducts();

  function buildHtml() {
    return `
      <!-- App Header -->
      <header class="master-header">
        <div class="master-header-left">
          <button id="tyre-back-btn" class="back-btn" style="background:none; border:none; padding:4px; cursor:pointer; color:var(--text-main); display:flex; align-items:center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div class="master-header-title">Tyre Master</div>
        </div>
        <button id="tyre-header-add-btn" class="master-header-btn">
          <span style="font-size:16px; line-height:1;">+</span>
          <span>${currentTab === 'sizes' ? 'Add Size' : (currentTab === 'brands' ? 'Add Brand' : 'Add Product')}</span>
        </button>
      </header>

      <!-- Tabs Bar: Sizes, Brands, Products -->
      <div class="master-tabs-bar" style="display:flex; gap:6px;">
        <button class="master-tab-btn ${currentTab === 'sizes' ? 'active' : ''}" data-tab="sizes" style="flex:1;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
          Sizes (${sizes.length})
        </button>
        <button class="master-tab-btn ${currentTab === 'brands' ? 'active' : ''}" data-tab="brands" style="flex:1;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          Brands (${brands.length})
        </button>
        <button class="master-tab-btn ${currentTab === 'products' ? 'active' : ''}" data-tab="products" style="flex:1;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Products (${products.length})
        </button>
      </div>

      <!-- Search Bar -->
      <div class="master-search-row">
        <div class="master-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="tyre-search-input" placeholder="${currentTab === 'sizes' ? 'Search sizes...' : (currentTab === 'brands' ? 'Search brands...' : 'Search products...')}" value="${searchQuery}">
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

    // 1. SIZES TAB
    if (currentTab === 'sizes') {
      const filtered = sizes.filter(s => s.size.toLowerCase().includes(q));
      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">${searchQuery ? `No tyre sizes found matching "${searchQuery}"` : 'No tyre sizes found.<br><span style="font-size:12px; margin-top:6px; display:inline-block;">Tap <b>+ Add Size</b> to add specification.</span>'}</div>`;
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
              <input type="text" id="edit-size-val" class="form-input" value="${item.size}" placeholder="e.g. 215/60 R16" required>
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
                try {
                  await Store.updateTyreSize(id, val);
                  sizes = await Store.getTyreSizes();
                  UI.hideModal();
                  UI.showToast(`Updated tyre size to ${val}`, 'success');
                  renderItems();
                } catch (err) {
                  UI.showToast(err.message || 'Failed to update size', 'error');
                }
              });
            }
          });
        });
      });
    }

    // 2. BRANDS TAB
    else if (currentTab === 'brands') {
      const filtered = brands.filter(b => b.name.toLowerCase().includes(q));
      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">${searchQuery ? `No tyre brands found matching "${searchQuery}"` : 'No tyre brands found.<br><span style="font-size:12px; margin-top:6px; display:inline-block;">Tap <b>+ Add Brand</b> to register brand.</span>'}</div>`;
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
                try {
                  await Store.updateTyreBrand(id, val);
                  brands = await Store.getTyreBrands();
                  UI.hideModal();
                  UI.showToast(`Updated tyre brand to ${val}`, 'success');
                  renderItems();
                } catch (err) {
                  UI.showToast(err.message || 'Failed to update brand', 'error');
                }
              });
            }
          });
        });
      });
    }

    // 3. PRODUCTS TAB
    else if (currentTab === 'products') {
      const filtered = products.filter(p =>
        (p.productName || '').toLowerCase().includes(q) ||
        (p.tyreBrand || '').toLowerCase().includes(q) ||
        (p.tyreSize || '').toLowerCase().includes(q)
      );

      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:14px;">${searchQuery ? `No tyre products found matching "${searchQuery}"` : 'No tyre products registered.<br><span style="font-size:12px; margin-top:6px; display:inline-block;">Tap <b>+ Add Product</b> to link sizes and brands.</span>'}</div>`;
        return;
      }

      listEl.innerHTML = filtered.map(item => `
        <div class="master-card" data-id="${item.id}">
          <div class="master-card-left">
            <div class="master-avatar-square" style="background:#F0FDF4; color:#16A34A;">
              ₹
            </div>
            <div class="master-card-info">
              <div class="master-card-title">${item.productName || 'Tyre Model'}</div>
              <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
                ${item.tyreBrand || ''} ${item.tyreSize ? `· ${item.tyreSize}` : ''} · <strong style="color:var(--accent-rust);">${UI.formatCurrency(item.price)}</strong>
              </div>
            </div>
          </div>
          <div class="master-card-right">
            <label class="switch-toggle">
              <input type="checkbox" class="toggle-product-input" data-id="${item.id}" ${item.isActive ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `).join('');

      listEl.querySelectorAll('.toggle-product-input').forEach(chk => {
        chk.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          await Store.toggleTyreProduct(id);
          products = await Store.getTyreProducts();
          renderItems();
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
          <p class="sheet-sub">Add a new tyre dimension specification (e.g. 205/55 R16).</p>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Tyre Size Specification <span class="req">*</span></label>
            <input type="text" id="new-size-val" class="form-input" placeholder="e.g. 205/55 R16" required>
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
              try {
                await Store.addTyreSize(val);
                sizes = await Store.getTyreSizes();
                UI.hideModal();
                UI.showToast(`Added tyre size "${val}"`, 'success');
                container.innerHTML = buildHtml();
                setupEvents();
                renderItems();
              } catch (err) {
                UI.showToast(err.message || 'Failed to add size', 'error');
              }
            });
          }
        });
      } else if (currentTab === 'brands') {
        UI.showModal(`
          <h3 class="sheet-title">Add Tyre Brand</h3>
          <p class="sheet-sub">Register a tyre manufacturer brand (e.g. Michelin).</p>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Brand Name <span class="req">*</span></label>
            <input type="text" id="new-brand-val" class="form-input" placeholder="e.g. Michelin" required>
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
              try {
                await Store.addTyreBrand(val);
                brands = await Store.getTyreBrands();
                UI.hideModal();
                UI.showToast(`Added tyre brand "${val}"`, 'success');
                container.innerHTML = buildHtml();
                setupEvents();
                renderItems();
              } catch (err) {
                UI.showToast(err.message || 'Failed to add brand', 'error');
              }
            });
          }
        });
      } else if (currentTab === 'products') {
        UI.showModal(`
          <h3 class="sheet-title">Add Tyre Product</h3>
          <p class="sheet-sub">Link a tyre size, brand, and vehicle category with pricing.</p>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Product Name / Pattern <span class="req">*</span></label>
            <input type="text" id="new-prod-name" class="form-input" placeholder="e.g. Primacy 4ST" required>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Vehicle Type <span class="req">*</span></label>
            <select id="new-prod-veh-type" class="form-select">
              <option value="FOUR_WHEELER">Four Wheeler</option>
              <option value="TWO_WHEELER">Two Wheeler</option>
            </select>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Tyre Brand <span class="req">*</span></label>
            <select id="new-prod-brand" class="form-select">
              ${brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Tyre Size <span class="req">*</span></label>
            <select id="new-prod-size" class="form-select">
              ${sizes.map(s => `<option value="${s.id}">${s.size}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Price ₹ <span class="req">*</span></label>
            <input type="number" id="new-prod-price" class="form-input" placeholder="8500" required>
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="add-prod-save-btn" class="btn-primary-cta" style="margin:0;">Create Product</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#add-prod-save-btn').addEventListener('click', async () => {
              const productName = sheet.querySelector('#new-prod-name').value.trim();
              const vehicleType = sheet.querySelector('#new-prod-veh-type').value;
              const tyreBrandId = sheet.querySelector('#new-prod-brand').value;
              const tyreSizeId = sheet.querySelector('#new-prod-size').value;
              const price = parseFloat(sheet.querySelector('#new-prod-price').value) || 0;

              if (!productName) return UI.showToast('Please enter product name', 'error');

              try {
                await Store.addTyreProduct({
                  productName,
                  vehicleType,
                  tyreBrandId,
                  tyreSizeId,
                  price
                });
                products = await Store.getTyreProducts();
                UI.hideModal();
                UI.showToast(`Added product "${productName}"`, 'success');
                container.innerHTML = buildHtml();
                setupEvents();
                renderItems();
              } catch (err) {
                UI.showToast(err.message || 'Failed to add tyre product', 'error');
              }
            });
          }
        });
      }
    });

    // Tab switching
    container.querySelectorAll('.master-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        container.innerHTML = buildHtml();
        setupEvents();
        renderItems();
      });
    });

    // Search filter
    container.querySelector('#tyre-search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderItems();
    });
  }

  container.innerHTML = buildHtml();
  setupEvents();
  await renderItems();

  return container;
}
