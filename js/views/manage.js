// Workshop Management Tab matching Flutter ManageTab (Shops, Staff, Targets, Catalogs)
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderManage(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  let currentTab = 'users'; // Default to staff users as viewed by user

  container.innerHTML = `
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title">Workshop Management</div>
          <div class="header-subtitle">Branches, Staff, Targets & Catalog</div>
        </div>
      </div>
    </header>

    <!-- Sub-Tabs Navigation Chips -->
    <div class="filter-chips-row" style="background: #E8E2D5; padding: 10px 16px; border-bottom: 1px solid var(--border-color);">
      <button class="filter-chip" data-tab="shops">🏪 Branches</button>
      <button class="filter-chip active" data-tab="users">👥 Staff Users</button>
      <button class="filter-chip" data-tab="targets">🎯 Shop Targets</button>
      <button class="filter-chip" data-tab="tyres">🛞 Tyre Catalog</button>
      <button class="filter-chip" data-tab="cars">🚘 Car Catalog</button>
    </div>

    <div id="manage-tab-content" style="padding: 16px 20px 50px;"></div>
  `;

  const contentEl = container.querySelector('#manage-tab-content');

  async function renderTab() {
    contentEl.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; min-height: 200px;">
        <div class="spinner"></div>
      </div>
    `;

    const shops = await Store.getShops();
    const users = await Store.getUsers();
    const shopMap = Object.fromEntries(shops.map(s => [s.id, s.name]));

    contentEl.innerHTML = '';

    // ==========================================
    // 1. STAFF USERS TAB
    // ==========================================
    if (currentTab === 'users') {
      contentEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <div>
            <h3 style="font-family:var(--font-condensed); font-size:20px; font-weight:700; text-transform:uppercase; color:var(--text-main);">
              Staff & Admins (${users.length})
            </h3>
            <div style="font-size:12px; color:var(--text-muted);">Active workshop team members</div>
          </div>
          <button id="add-user-btn" class="header-add-btn" style="background:var(--accent-rust); color:#fff; padding:7px 14px; font-size:12px;">
            + Add User
          </button>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${users.map(u => {
            const userName = u.fullName || u.name || (u.phone ? `Staff (${u.phone.slice(-4)})` : 'Staff Member');
            const userPhone = u.phone || 'No phone number';
            const userRole = (u.role || 'EMPLOYEE').toUpperCase();
            const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
            const assignedBranches = (u.assignedShopIds && u.assignedShopIds.length > 0)
              ? u.assignedShopIds.map(id => shopMap[id] || id).join(', ')
              : 'All Branches';

            return `
              <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <!-- User Header -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
                  <div>
                    <div style="font-family:var(--font-body); font-size:16px; font-weight:700; color:var(--text-main); line-height:1.2;">
                      ${userName}
                    </div>
                    <div style="font-size:13px; color:var(--text-muted); margin-top:4px; display:flex; align-items:center; gap:6px;">
                      <span>📞</span>
                      <a href="tel:${u.phone}" style="color:var(--text-main); text-decoration:none; font-weight:600;">
                        ${userPhone}
                      </a>
                    </div>
                  </div>

                  <!-- Role Badge -->
                  <span style="font-family:var(--font-condensed); font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; padding:3px 9px; border-radius:6px; background:${isAdmin ? '#22201E' : 'rgba(53,81,107,0.12)'}; color:${isAdmin ? '#F3EFE7' : 'var(--accent-steel)'};">
                    ${userRole}
                  </span>
                </div>

                <!-- Assigned Branch -->
                <div style="font-size:12px; color:var(--text-sub); padding-top:8px; border-top:1px dashed var(--row-divider); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="color:var(--text-muted); font-size:11px;">Assigned:</span>
                    <strong style="color:var(--text-main);">${assignedBranches}</strong>
                  </div>
                  <span style="font-size:10px; font-weight:700; padding:2px 7px; border-radius:10px; background:${u.isActive ? 'rgba(46,125,50,0.1)' : '#eee'}; color:${u.isActive ? 'var(--status-done)' : '#888'};">
                    ${u.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      contentEl.querySelector('#add-user-btn')?.addEventListener('click', () => {
        UI.showModal(`
          <h3 class="sheet-title">Add Staff Member</h3>
          <p class="sheet-sub">Provision login credentials for workshop employee.</p>

          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Full Name <span class="req">*</span></label>
            <input type="text" id="new-user-name" class="form-input" placeholder="e.g. Suresh Kumar" required>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Mobile Number (10 Digits) <span class="req">*</span></label>
            <input type="tel" id="new-user-phone" class="form-input" placeholder="98XXXXXXXX" maxlength="10" required>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Account Role</label>
            <select id="new-user-role" class="form-select">
              <option value="EMPLOYEE">Employee / Shop Floor</option>
              <option value="ADMIN">Workshop Administrator</option>
            </select>
          </div>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Assigned Branch</label>
            <select id="new-user-shop" class="form-select">
              ${shops.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="save-new-user-btn" class="btn-primary-cta" style="margin:0;">Create Account</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#save-new-user-btn').addEventListener('click', async () => {
              const name = sheet.querySelector('#new-user-name').value.trim();
              const phone = sheet.querySelector('#new-user-phone').value.trim().replace(/\D/g, '');
              const role = sheet.querySelector('#new-user-role').value;
              const assignedShopId = sheet.querySelector('#new-user-shop').value;

              if (!name || phone.length < 10) {
                return UI.showToast('Name and 10-digit mobile required', 'error');
              }

              const usersList = await Store.getUsers();
              const newUser = {
                id: `user-${Date.now()}`,
                name,
                fullName: name,
                phone,
                role,
                assignedShopIds: [assignedShopId],
                isActive: true
              };
              usersList.unshift(newUser);
              Store.setLocal('users', usersList);
              UI.hideModal();
              UI.showToast(`User "${name}" created successfully`, 'success');
              renderTab();
            });
          }
        });
      });
    }

    // ==========================================
    // 2. WORKSHOP BRANCHES TAB
    // ==========================================
    else if (currentTab === 'shops') {
      contentEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
          <div>
            <h3 style="font-family:var(--font-condensed); font-size:20px; font-weight:700; text-transform:uppercase; color:var(--text-main);">
              Branches (${shops.length})
            </h3>
            <div style="font-size:12px; color:var(--text-muted);">Manage store locations & contacts</div>
          </div>
          <button id="add-shop-btn" class="header-add-btn" style="background:var(--accent-rust); color:#fff; padding:7px 14px; font-size:12px;">
            + Add Branch
          </button>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${shops.map(s => `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
                <div>
                  <div style="font-size:16px; font-weight:700; color:var(--text-main);">${s.name}</div>
                  <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">📍 ${s.address || 'Chennai'}</div>
                  ${s.phone ? `<div style="font-size:12px; color:var(--text-muted); margin-top:2px;">📞 ${s.phone}</div>` : ''}
                </div>
                <span style="font-family:var(--font-condensed); font-size:11px; font-weight:700; padding:2px 8px; border-radius:10px; background:${s.isActive ? 'rgba(46,125,50,0.1)' : '#eee'}; color:${s.isActive ? 'var(--status-done)' : '#888'};">
                  ${s.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div style="font-size:12px; color:var(--text-sub); padding-top:10px; border-top:1px dashed var(--row-divider); display:flex; justify-content:space-between;">
                <span>Monthly Target: <strong>${UI.formatCurrency(s.targetAmount || 500000)}</strong></span>
                <span>Tyres: <strong>${s.targetTyres || 120} units</strong></span>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      contentEl.querySelector('#add-shop-btn')?.addEventListener('click', () => {
        UI.showModal(`
          <h3 class="sheet-title">Add Workshop Branch</h3>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Branch Name <span class="req">*</span></label>
            <input type="text" id="new-shop-name" class="form-input" placeholder="e.g. Alwarpet Branch" required>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Full Address</label>
            <input type="text" id="new-shop-addr" class="form-input" placeholder="Street, Landmark, Chennai">
          </div>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Contact Phone</label>
            <input type="tel" id="new-shop-phone" class="form-input" placeholder="98XXXXXXXX">
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="save-new-shop-btn" class="btn-primary-cta" style="margin:0;">Create Branch</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#save-new-shop-btn').addEventListener('click', async () => {
              const name = sheet.querySelector('#new-shop-name').value.trim();
              if (!name) return UI.showToast('Please enter shop name', 'error');

              const shopsList = await Store.getShops();
              const newShop = {
                id: `shop-${Date.now()}`,
                name,
                address: sheet.querySelector('#new-shop-addr').value.trim(),
                phone: sheet.querySelector('#new-shop-phone').value.trim(),
                isActive: true,
                targetAmount: 400000,
                targetTyres: 100
              };
              shopsList.push(newShop);
              Store.setLocal('shops', shopsList);
              UI.hideModal();
              UI.showToast(`Branch "${name}" created successfully`, 'success');
              renderTab();
            });
          }
        });
      });
    }

    // ==========================================
    // 3. SHOP TARGETS TAB
    // ==========================================
    else if (currentTab === 'targets') {
      contentEl.innerHTML = `
        <div style="margin-bottom: 16px;">
          <h3 style="font-family:var(--font-condensed); font-size:20px; font-weight:700; text-transform:uppercase; color:var(--text-main);">
            Monthly Branch Targets
          </h3>
          <div style="font-size:12px; color:var(--text-muted);">Set revenue goals and tyre volume quotas</div>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${shops.map(s => `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-family:var(--font-condensed); font-size:18px; font-weight:700; color:var(--text-main);">${s.name}</span>
                <button class="util-btn edit-target-btn" data-shop-id="${s.id}" data-shop-name="${s.name}" data-amt="${s.targetAmount || 500000}" data-tyres="${s.targetTyres || 120}" style="padding:5px 12px; font-size:12px; background:var(--accent-steel); color:#fff;">
                  ✏️ Edit Target
                </button>
              </div>
              <div style="display:flex; gap:16px; margin-top:8px; font-size:13px; color:var(--text-sub);">
                <div>Target Revenue: <strong style="color:var(--accent-rust);">${UI.formatCurrency(s.targetAmount || 500000)}</strong></div>
                <div>Target Tyres: <strong>${s.targetTyres || 120} units</strong></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      contentEl.querySelectorAll('.edit-target-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const shopId = btn.dataset.shopId;
          const sName = btn.dataset.shopName;
          const curAmt = btn.dataset.amt;
          const curTyres = btn.dataset.tyres;

          UI.showModal(`
            <h3 class="sheet-title">Edit Target: ${sName}</h3>
            <div class="form-group" style="margin: 0 0 12px;">
              <label class="form-label">Monthly Revenue Target ₹</label>
              <input type="number" id="target-amt-input" class="form-input" value="${curAmt}" required>
            </div>
            <div class="form-group" style="margin: 0 0 16px;">
              <label class="form-label">Monthly Tyres Target (Count)</label>
              <input type="number" id="target-tyre-input" class="form-input" value="${curTyres}" required>
            </div>
            <div class="sheet-actions">
              <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
              <button id="save-target-btn" class="btn-primary-cta" style="margin:0;">Save Target</button>
            </div>
          `, {
            onMounted(sheet) {
              sheet.querySelector('#save-target-btn').addEventListener('click', async () => {
                const amt = parseFloat(sheet.querySelector('#target-amt-input').value) || 0;
                const tyres = parseInt(sheet.querySelector('#target-tyre-input').value, 10) || 0;

                const shopsList = await Store.getShops();
                const shopIdx = shopsList.findIndex(s => s.id === shopId);
                if (shopIdx !== -1) {
                  shopsList[shopIdx].targetAmount = amt;
                  shopsList[shopIdx].targetTyres = tyres;
                  Store.setLocal('shops', shopsList);
                }
                UI.hideModal();
                UI.showToast(`Targets updated for ${sName}`, 'success');
                renderTab();
              });
            }
          });
        });
      });
    }

    // ==========================================
    // 4. TYRE CATALOG TAB
    // ==========================================
    else if (currentTab === 'tyres') {
      const sizes = await Store.getTyreSizes();
      const brands = await Store.getTyreBrands();

      contentEl.innerHTML = `
        <h3 style="font-family:var(--font-condensed); font-size:18px; font-weight:700; text-transform:uppercase; margin-bottom: 12px;">Tyre Catalog</h3>
        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px; margin-bottom:14px;">
          <div style="font-weight:700; margin-bottom:10px; font-size:13px; color:var(--accent-rust);">POPULAR TYRE SIZES (${sizes.length})</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${sizes.map(s => `<span class="util-btn" style="background:#EFEAE0; color:#222; border:none; padding:6px 12px; font-size:12px;">${s.size}</span>`).join('')}
          </div>
        </div>

        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
          <div style="font-weight:700; margin-bottom:10px; font-size:13px; color:var(--accent-steel);">TYRE BRANDS (${brands.length})</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${brands.map(b => `<span class="util-btn" style="background:#EFEAE0; color:#222; border:none; padding:6px 12px; font-size:12px;">${b.name}</span>`).join('')}
          </div>
        </div>
      `;
    }

    // ==========================================
    // 5. CAR CATALOG TAB
    // ==========================================
    else if (currentTab === 'cars') {
      const carBrands = await Store.getCarBrands();
      const carModels = await Store.getCarModels();

      contentEl.innerHTML = `
        <h3 style="font-family:var(--font-condensed); font-size:18px; font-weight:700; text-transform:uppercase; margin-bottom: 12px;">Vehicle Catalog</h3>
        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px; margin-bottom:14px;">
          <div style="font-weight:700; margin-bottom:10px; font-size:13px; color:var(--text-main);">CAR BRANDS (${carBrands.length})</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${carBrands.map(b => `<span class="util-btn" style="background:#EFEAE0; color:#222; border:none; padding:6px 12px; font-size:12px;">${b.name}</span>`).join('')}
          </div>
        </div>

        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
          <div style="font-weight:700; margin-bottom:10px; font-size:13px; color:var(--text-main);">POPULAR MODELS (${carModels.length})</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${carModels.map(m => `<span class="util-btn" style="background:#EFEAE0; color:#222; border:none; padding:6px 12px; font-size:12px;">${m.name}</span>`).join('')}
          </div>
        </div>
      `;
    }
  }

  container.querySelectorAll('.filter-chips-row .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-chips-row .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      renderTab();
    });
  });

  renderTab();
  return container;
}
