// Tyros Admin Manage Screen (Shops & Users only, matching Flutter ManageTab exactly)
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderManage(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  let currentTab = 'shops'; // Default to Shops ('shops' | 'users')
  const currentAdmin = Auth.getUser();
  const currentAdminId = (currentAdmin?.id || currentAdmin?._id || '').toString();

  const shops = await Store.getShops();
  const users = await Store.getUsers();
  const shopsWithEmployees = await Store.getShopsWithEmployees().catch(() => []);
  const shopMap = Object.fromEntries(shops.map(s => [s.id, s.name]));
  const employeeCountMap = Object.fromEntries(shopsWithEmployees.map(s => [s.id || s.shopId, s.employeeCount || s.employees?.length || 0]));

  const activeShopCount = shops.filter(s => s.isActive !== false).length;
  const totalShopCount = shops.length;
  const activeUserCount = users.filter(u => u.isActive !== false).length;
  const totalUserCount = users.length;

  container.innerHTML = `
    <!-- Pinned Dark Header matching Flutter AppHeader -->
    <header class="app-header">
      <div class="header-row">
        <div class="header-info">
          <div class="header-title" style="font-size:26px;">Manage</div>
          <div id="manage-header-sub" class="header-subtitle" style="font-size:12px; color:#DDD5C4;">
            ${activeShopCount} active · ${totalShopCount} shops
          </div>
        </div>
        <div class="header-actions">
          <button id="manage-header-add-btn" style="background:rgba(53,49,46,0.9); border:1px solid rgba(255,255,255,0.18); color:#fff; border-radius:24px; padding:7px 15px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 6px rgba(0,0,0,0.25);">
            <span id="manage-add-btn-text">+ Add shop</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Sub-Tab Segmented Selector (Shops & Users only) -->
    <div style="padding: 12px 18px 8px; background: var(--bg-paper);">
      <div style="display:flex; background:#EFEAE0; border-radius:12px; padding:3px; border:1px solid var(--border-color);">
        <button id="subtab-shops-btn" class="manage-subtab active" data-tab="shops" style="flex:1; padding:10px 0; border:none; border-radius:10px; font-size:13.5px; font-weight:700; cursor:pointer; background:#FFFFFA; color:var(--accent-rust); box-shadow:0 1px 3px rgba(34,32,30,0.06); display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.2s ease;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Shops (${totalShopCount})</span>
        </button>
        <button id="subtab-users-btn" class="manage-subtab" data-tab="users" style="flex:1; padding:10px 0; border:none; border-radius:10px; font-size:13.5px; font-weight:600; cursor:pointer; background:transparent; color:var(--text-muted); display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.2s ease;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Users (${totalUserCount})</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div id="manage-tab-content" style="padding: 12px 18px 80px;"></div>
  `;

  const headerSub = container.querySelector('#manage-header-sub');
  const headerAddBtn = container.querySelector('#manage-header-add-btn');
  const headerAddBtnText = container.querySelector('#manage-add-btn-text');
  const contentEl = container.querySelector('#manage-tab-content');

  function updateSubtabsUI() {
    const shopsBtn = container.querySelector('#subtab-shops-btn');
    const usersBtn = container.querySelector('#subtab-users-btn');

    if (currentTab === 'shops') {
      shopsBtn.style.background = '#FFFFFA';
      shopsBtn.style.color = 'var(--accent-rust)';
      shopsBtn.style.fontWeight = '700';
      shopsBtn.style.boxShadow = '0 1px 3px rgba(34,32,30,0.06)';

      usersBtn.style.background = 'transparent';
      usersBtn.style.color = 'var(--text-muted)';
      usersBtn.style.fontWeight = '600';
      usersBtn.style.boxShadow = 'none';

      headerSub.textContent = `${activeShopCount} active · ${totalShopCount} shops`;
      headerAddBtnText.textContent = '+ Add shop';
    } else {
      usersBtn.style.background = '#FFFFFA';
      usersBtn.style.color = 'var(--accent-rust)';
      usersBtn.style.fontWeight = '700';
      usersBtn.style.boxShadow = '0 1px 3px rgba(34,32,30,0.06)';

      shopsBtn.style.background = 'transparent';
      shopsBtn.style.color = 'var(--text-muted)';
      shopsBtn.style.fontWeight = '600';
      shopsBtn.style.boxShadow = 'none';

      headerSub.textContent = `${activeUserCount} active · ${totalUserCount} users`;
      headerAddBtnText.textContent = '+ Add user';
    }
  }

  function renderCurrentTab() {
    updateSubtabsUI();

    if (currentTab === 'shops') {
      renderShopsTab();
    } else {
      renderUsersTab();
    }
  }

  // ==========================================
  // 1. SHOPS TAB
  // ==========================================
  function renderShopsTab() {
    contentEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${shops.map(s => {
          const empCount = employeeCountMap[s.id] || 0;
          return `
            <div style="background:#FFFFFA; border:1px solid var(--border-color); border-radius:14px; padding:16px 18px; box-shadow:0 1px 4px rgba(34,32,30,0.03);">
              <!-- Shop Card Header -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:40px; height:40px; border-radius:10px; background:#FDEEE6; display:flex; align-items:center; justify-content:center; color:var(--accent-rust); flex-shrink:0;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <div>
                    <div style="font-family:var(--font-body); font-size:16px; font-weight:700; color:var(--text-main);">${s.name}</div>
                    <div style="font-size:12px; color:var(--text-muted); margin-top:1px;">📍 ${s.address || 'Chennai'}</div>
                    ${s.phone ? `<div style="font-size:12px; color:var(--text-muted); margin-top:2px;">📞 ${s.phone}</div>` : ''}
                    ${s.gstNumber ? `<div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">GST: ${s.gstNumber}</div>` : ''}
                  </div>
                </div>
                <span style="font-size:11.5px; font-weight:600; padding:2px 8px; border-radius:8px; background:${s.isActive !== false ? '#EAF7EE' : '#eee'}; color:${s.isActive !== false ? '#16A34A' : '#888'};">
                  ${s.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>

              <!-- Shop Meta -->
              <div style="font-size:12px; color:var(--text-sub); padding:10px 0 8px; border-top:1px dashed var(--row-divider); display:flex; justify-content:space-between; margin-top:8px;">
                <span>Assigned Staff: <strong style="color:var(--text-main);">${empCount} employees</strong></span>
                <span>Branch ID: <span style="font-family:monospace; font-size:11px; color:var(--text-muted);">${(s.id || '').slice(0, 8)}...</span></span>
              </div>

              <!-- Action Buttons -->
              <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:6px; padding-top:10px; border-top:1px solid var(--row-divider);">
                <button class="util-btn toggle-shop-active-btn" data-id="${s.id}" data-active="${s.isActive !== false}" style="font-size:11.5px; padding:6px 12px; background:${s.isActive !== false ? '#FFF1F0' : '#EAF7EE'}; color:${s.isActive !== false ? '#DC2626' : '#16A34A'}; border-color:${s.isActive !== false ? '#FCA5A5' : '#86EFAC'};">
                  ${s.isActive !== false ? 'Deactivate' : 'Activate'}
                </button>
                <button class="util-btn edit-shop-btn" data-id="${s.id}" data-name="${s.name}" data-address="${s.address || ''}" data-phone="${s.phone || ''}" data-gst="${s.gstNumber || ''}" style="font-size:11.5px; padding:6px 12px;">
                  ✏️ Edit
                </button>
                <button class="util-btn delete-shop-btn" data-id="${s.id}" data-name="${s.name}" style="font-size:11.5px; padding:6px 12px; color:#DC2626;">
                  🗑️ Delete
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Edit Branch
    contentEl.querySelectorAll('.edit-shop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const shopId = btn.dataset.id;
        const sName = btn.dataset.name;
        const sAddr = btn.dataset.address;
        const sPhone = btn.dataset.phone;
        const sGst = btn.dataset.gst;

        UI.showModal(`
          <h3 class="sheet-title">Edit Branch</h3>
          <p class="sheet-sub">Update details for ${sName}.</p>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Branch Name <span class="req">*</span></label>
            <input type="text" id="edit-shop-name" class="form-input" value="${sName}" required>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Address</label>
            <input type="text" id="edit-shop-addr" class="form-input" value="${sAddr}">
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Phone</label>
            <input type="tel" id="edit-shop-phone" class="form-input" value="${sPhone}" maxlength="10">
          </div>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">GST Number</label>
            <input type="text" id="edit-shop-gst" class="form-input" value="${sGst}">
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="save-edit-shop-btn" class="btn-primary-cta" style="margin:0;">Save Changes</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#save-edit-shop-btn').addEventListener('click', async () => {
              const name = sheet.querySelector('#edit-shop-name').value.trim();
              const address = sheet.querySelector('#edit-shop-addr').value.trim();
              const phone = sheet.querySelector('#edit-shop-phone').value.trim().replace(/\D/g, '');
              const gstNumber = sheet.querySelector('#edit-shop-gst').value.trim();

              if (!name) return UI.showToast('Please enter shop name', 'error');

              try {
                await Store.updateShop(shopId, { name, address, phone, gstNumber });
                UI.hideModal();
                UI.showToast(`Updated "${name}" successfully`, 'success');
                router.navigate('/manage');
              } catch (err) {
                UI.showToast(err.message || 'Failed to update branch', 'error');
              }
            });
          }
        });
      });
    });

    // Toggle Branch Active
    contentEl.querySelectorAll('.toggle-shop-active-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const shopId = btn.dataset.id;
        const isActive = btn.dataset.active === 'true';
        const actionText = isActive ? 'deactivate' : 'activate';

        if (confirm(`Are you sure you want to ${actionText} this workshop branch?`)) {
          try {
            if (isActive) {
              await Store.deactivateShop(shopId);
              UI.showToast('Branch deactivated', 'info');
            } else {
              await Store.activateShop(shopId);
              UI.showToast('Branch activated successfully', 'success');
            }
            router.navigate('/manage');
          } catch (err) {
            UI.showToast(err.message || `Failed to ${actionText} branch`, 'error');
          }
        }
      });
    });

    // Delete Branch
    contentEl.querySelectorAll('.delete-shop-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const shopId = btn.dataset.id;
        const sName = btn.dataset.name;

        if (confirm(`Are you sure you want to delete branch "${sName}"?`)) {
          try {
            await Store.deleteShop(shopId);
            UI.showToast(`Branch "${sName}" deleted`, 'info');
            router.navigate('/manage');
          } catch (err) {
            UI.showToast(err.message || 'Failed to delete branch', 'error');
          }
        }
      });
    });
  }

  // ==========================================
  // 2. USERS TAB
  // ==========================================
  function renderUsersTab() {
    contentEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${users.map(u => {
          const userName = u.fullName || u.name || (u.phone ? `Staff (${u.phone.slice(-4)})` : 'Staff Member');
          const userPhone = u.phone || 'No phone number';
          const userRole = (u.role || 'EMPLOYEE').toUpperCase();
          const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
          const isSelf = u.id === currentAdminId;
          const assignedBranches = (u.assignedShopIds && u.assignedShopIds.length > 0)
            ? u.assignedShopIds.map(id => shopMap[id] || id).join(', ')
            : 'All Branches';

          return `
            <div style="background:#FFFFFA; border:1px solid var(--border-color); border-radius:14px; padding:16px 18px; box-shadow:0 1px 4px rgba(34,32,30,0.03);">
              <!-- User Header -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
                <div>
                  <div style="font-family:var(--font-body); font-size:16px; font-weight:700; color:var(--text-main); line-height:1.2; display:flex; align-items:center; gap:6px;">
                    <span>${userName}</span>
                    ${isSelf ? '<span style="font-size:10px; background:#FDE2D2; color:var(--accent-rust); padding:1px 6px; border-radius:4px; font-weight:700;">YOU</span>' : ''}
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
              <div style="font-size:12px; color:var(--text-sub); padding:8px 0; border-top:1px dashed var(--row-divider); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <span style="color:var(--text-muted); font-size:11px;">Assigned:</span>
                  <strong style="color:var(--text-main);">${assignedBranches}</strong>
                </div>
                <span style="font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:8px; background:${u.isActive !== false ? '#EAF7EE' : '#eee'}; color:${u.isActive !== false ? '#16A34A' : '#888'};">
                  ${u.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <!-- Action Buttons -->
              ${!isSelf && !isAdmin ? `
                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px; padding-top:8px; border-top:1px solid var(--row-divider);">
                  <button class="util-btn reset-user-pwd-btn" data-id="${u.id}" data-name="${userName}" style="font-size:11px; padding:5px 9px; background:var(--bg-paper);">
                    🔑 Reset Password
                  </button>
                  <button class="util-btn toggle-user-active-btn" data-id="${u.id}" data-active="${u.isActive !== false}" style="font-size:11px; padding:5px 9px; background:${u.isActive !== false ? '#FFF1F0' : '#EAF7EE'}; color:${u.isActive !== false ? '#DC2626' : '#16A34A'}; border-color:${u.isActive !== false ? '#FCA5A5' : '#86EFAC'};">
                    ${u.isActive !== false ? 'Deactivate' : 'Activate'}
                  </button>
                  <button class="util-btn edit-user-btn" data-id="${u.id}" data-name="${userName}" data-phone="${u.phone}" data-shops="${(u.assignedShopIds || []).join(',')}" style="font-size:11px; padding:5px 9px;">
                    ✏️ Edit
                  </button>
                  <button class="util-btn delete-user-btn" data-id="${u.id}" data-name="${userName}" style="font-size:11px; padding:5px 9px; color:#DC2626;">
                    🗑️ Delete
                  </button>
                </div>
              ` : isSelf ? `
                <div style="font-size:11px; color:var(--text-muted); font-style:italic; margin-top:8px; text-align:right;">
                  Self-mutation protected (Admin policy)
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Edit User
    contentEl.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.id;
        const uName = btn.dataset.name;
        const uPhone = btn.dataset.phone;
        const uShops = btn.dataset.shops.split(',').filter(Boolean);

        UI.showModal(`
          <h3 class="sheet-title">Edit Staff Member</h3>
          <p class="sheet-sub">Update profile details for ${uName}.</p>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">Full Name <span class="req">*</span></label>
            <input type="text" id="edit-user-name" class="form-input" value="${uName}" required>
          </div>
          <div class="form-group" style="margin: 0 0 12px;">
            <label class="form-label">10-Digit Mobile Number <span class="req">*</span></label>
            <input type="tel" id="edit-user-phone" class="form-input" value="${uPhone}" maxlength="10" required>
          </div>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">Assigned Workshop Branch</label>
            <select id="edit-user-shop" class="form-select">
              ${shops.map(s => `<option value="${s.id}" ${uShops.includes(s.id) ? 'selected' : ''}>${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="save-edit-user-btn" class="btn-primary-cta" style="margin:0;">Save Changes</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#save-edit-user-btn').addEventListener('click', async () => {
              const fullName = sheet.querySelector('#edit-user-name').value.trim();
              const phone = sheet.querySelector('#edit-user-phone').value.trim().replace(/\D/g, '');
              const shopId = sheet.querySelector('#edit-user-shop').value;

              if (!fullName) return UI.showToast('Please enter full name', 'error');
              if (phone.length !== 10) return UI.showToast('Phone must be 10 digits', 'error');

              try {
                await Store.updateUser(userId, {
                  fullName,
                  phone,
                  shopIds: shopId ? [shopId] : []
                });
                UI.hideModal();
                UI.showToast(`Updated "${fullName}" successfully`, 'success');
                router.navigate('/manage');
              } catch (err) {
                UI.showToast(err.message || 'Failed to update employee', 'error');
              }
            });
          }
        });
      });
    });

    // Toggle User Active
    contentEl.querySelectorAll('.toggle-user-active-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.id;
        const isActive = btn.dataset.active === 'true';
        const actionText = isActive ? 'deactivate' : 'activate';

        if (confirm(`Are you sure you want to ${actionText} this user?`)) {
          try {
            if (isActive) {
              await Store.deactivateUser(userId);
              UI.showToast('Employee deactivated and session revoked', 'info');
            } else {
              await Store.activateUser(userId);
              UI.showToast('Employee activated successfully', 'success');
            }
            router.navigate('/manage');
          } catch (err) {
            UI.showToast(err.message || `Failed to ${actionText} user`, 'error');
          }
        }
      });
    });

    // Reset User Password
    contentEl.querySelectorAll('.reset-user-pwd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.id;
        const uName = btn.dataset.name;

        UI.showModal(`
          <h3 class="sheet-title">Reset Password</h3>
          <p class="sheet-sub">Set a new password for ${uName}. This immediately revokes their current active sessions.</p>
          <div class="form-group" style="margin: 0 0 16px;">
            <label class="form-label">New Password (Min 8 Characters) <span class="req">*</span></label>
            <input type="password" id="reset-pwd-input" class="form-input" placeholder="NewStrongPassword123!" minlength="8" required>
          </div>
          <div class="sheet-actions">
            <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
            <button id="confirm-reset-pwd-btn" class="btn-primary-cta" style="margin:0;">Reset Password</button>
          </div>
        `, {
          onMounted(sheet) {
            sheet.querySelector('#confirm-reset-pwd-btn').addEventListener('click', async () => {
              const newPassword = sheet.querySelector('#reset-pwd-input').value.trim();
              if (newPassword.length < 8) return UI.showToast('Password must be at least 8 characters', 'error');

              try {
                await Store.resetUserPassword(userId, newPassword);
                UI.hideModal();
                UI.showToast(`Password reset for ${uName}`, 'success');
              } catch (err) {
                UI.showToast(err.message || 'Failed to reset password', 'error');
              }
            });
          }
        });
      });
    });

    // Delete User
    contentEl.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.id;
        const uName = btn.dataset.name;

        if (confirm(`Are you sure you want to delete staff member "${uName}"? This will free their phone number and invalidate all their sessions.`)) {
          try {
            await Store.deleteUser(userId);
            UI.showToast(`Staff member "${uName}" deleted`, 'info');
            router.navigate('/manage');
          } catch (err) {
            UI.showToast(err.message || 'Failed to delete user', 'error');
          }
        }
      });
    });
  }

  // ==========================================
  // MODALS: ADD SHOP & ADD USER
  // ==========================================
  function showAddShopModal() {
    UI.showModal(`
      <h3 class="sheet-title">Add Workshop Branch</h3>
      <p class="sheet-sub">Create a new branch location scoped to your organization.</p>
      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">Branch Name <span class="req">*</span></label>
        <input type="text" id="new-shop-name" class="form-input" placeholder="e.g. Koramangala Branch" required>
      </div>
      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">Full Address</label>
        <input type="text" id="new-shop-addr" class="form-input" placeholder="100 Feet Rd, 4th Block">
      </div>
      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">Contact Phone (10 Digits)</label>
        <input type="tel" id="new-shop-phone" class="form-input" placeholder="98XXXXXXXX" maxlength="10">
      </div>
      <div class="form-group" style="margin: 0 0 16px;">
        <label class="form-label">GST Number</label>
        <input type="text" id="new-shop-gst" class="form-input" placeholder="29ABCDE1234F1Z5">
      </div>
      <div class="sheet-actions">
        <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
        <button id="save-new-shop-btn" class="btn-primary-cta" style="margin:0;">Create Branch</button>
      </div>
    `, {
      onMounted(sheet) {
        sheet.querySelector('#save-new-shop-btn').addEventListener('click', async () => {
          const name = sheet.querySelector('#new-shop-name').value.trim();
          const address = sheet.querySelector('#new-shop-addr').value.trim();
          const phone = sheet.querySelector('#new-shop-phone').value.trim().replace(/\D/g, '');
          const gstNumber = sheet.querySelector('#new-shop-gst').value.trim();

          if (!name) return UI.showToast('Please enter shop name', 'error');

          try {
            await Store.createShop({ name, address, phone, gstNumber });
            UI.hideModal();
            UI.showToast(`Branch "${name}" created successfully`, 'success');
            router.navigate('/manage');
          } catch (err) {
            UI.showToast(err.message || 'Failed to create branch', 'error');
          }
        });
      }
    });
  }

  function showAddUserModal() {
    UI.showModal(`
      <h3 class="sheet-title">Add Staff Member</h3>
      <p class="sheet-sub">Create a new EMPLOYEE login for workshop staff.</p>
      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">Full Name <span class="req">*</span></label>
        <input type="text" id="new-user-name" class="form-input" placeholder="e.g. Rahul Sharma" required>
      </div>
      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">10-Digit Mobile Number (Login ID) <span class="req">*</span></label>
        <input type="tel" id="new-user-phone" class="form-input" placeholder="98XXXXXXXX" maxlength="10" required>
      </div>
      <div class="form-group" style="margin: 0 0 12px;">
        <label class="form-label">Temporary Password (Min 8 Characters) <span class="req">*</span></label>
        <input type="password" id="new-user-password" class="form-input" placeholder="Min 8 characters" minlength="8" required>
      </div>
      <div class="form-group" style="margin: 0 0 16px;">
        <label class="form-label">Assigned Workshop Branch</label>
        <select id="new-user-shop" class="form-select">
          <option value="">-- All Branches --</option>
          ${shops.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
        </select>
      </div>
      <div class="sheet-actions">
        <button class="btn-outline util-btn" style="justify-content:center; padding:10px;" onclick="UI.hideModal()">Cancel</button>
        <button id="save-new-user-btn" class="btn-primary-cta" style="margin:0;">Create Staff</button>
      </div>
    `, {
      onMounted(sheet) {
        sheet.querySelector('#save-new-user-btn').addEventListener('click', async () => {
          const fullName = sheet.querySelector('#new-user-name').value.trim();
          const phone = sheet.querySelector('#new-user-phone').value.trim().replace(/\D/g, '');
          const password = sheet.querySelector('#new-user-password').value.trim();
          const shopId = sheet.querySelector('#new-user-shop').value;

          if (!fullName) return UI.showToast('Please enter full name', 'error');
          if (phone.length !== 10) return UI.showToast('Please enter 10-digit mobile number', 'error');
          if (!password || password.length < 8) return UI.showToast('Password must be at least 8 characters', 'error');

          try {
            await Store.createUser({
              fullName,
              phone,
              password,
              shopIds: shopId ? [shopId] : []
            });
            UI.hideModal();
            UI.showToast(`Employee "${fullName}" created successfully`, 'success');
            router.navigate('/manage');
          } catch (err) {
            UI.showToast(err.message || 'Failed to create user', 'error');
          }
        });
      }
    });
  }

  // Header Add Button click
  headerAddBtn.addEventListener('click', () => {
    if (currentTab === 'shops') {
      showAddShopModal();
    } else {
      showAddUserModal();
    }
  });

  // Subtab switching
  container.querySelector('#subtab-shops-btn').addEventListener('click', () => {
    if (currentTab !== 'shops') {
      currentTab = 'shops';
      renderCurrentTab();
    }
  });

  container.querySelector('#subtab-users-btn').addEventListener('click', () => {
    if (currentTab !== 'users') {
      currentTab = 'users';
      renderCurrentTab();
    }
  });

  // Initial render
  renderCurrentTab();

  return container;
}
