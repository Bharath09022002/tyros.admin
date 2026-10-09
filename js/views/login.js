// Admin Login View matching Flutter LoginScreen
import { Auth } from '../auth.js';
import { UI } from '../ui.js';

export function renderLogin(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';
  container.style.cssText = 'min-height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 24px 22px;';

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <!-- Logo Mark -->
      <div style="width: 60px; height: 60px; background: #22201E; border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(0,0,0,0.18);">
        ${UI.icons.tyre(32, '#F3EFE7')}
      </div>
      <h1 style="font-family: var(--font-condensed); font-size: 28px; font-weight: 700; letter-spacing: 0.04em; color: var(--text-main); margin-bottom: 3px;">TYROS</h1>
      <div style="display:inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; background: var(--accent-rust); color: #fff; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em; margin-bottom: 6px;">
        ADMIN PORTAL
      </div>
      <p style="font-size: 13px; color: var(--text-muted);">Sign in with workshop administrator credentials</p>
    </div>

    <!-- Login Form -->
    <form id="login-form" style="display: flex; flex-direction: column;">
      <div class="form-group" style="margin: 0 0 14px;">
        <label class="form-label">Phone Number <span class="req">*</span></label>
        <input type="tel" id="login-phone" class="form-input" placeholder="98XXXXXXXX" maxlength="10" autocomplete="tel" required>
      </div>

      <div class="form-group" style="margin: 0 0 18px;">
        <label class="form-label">Password <span class="req">*</span></label>
        <input type="password" id="login-password" class="form-input" placeholder="••••••••" autocomplete="current-password" required>
      </div>

      <div id="login-alert" class="notice-error-card" style="display:none; margin: 0 0 14px;">
        <span class="text" id="login-alert-text"></span>
      </div>

      <button type="submit" id="login-submit-btn" class="btn-primary-cta" style="width: 100%; margin: 0 0 14px;">
        Sign In to Admin Portal
      </button>

      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 11px; color: var(--text-muted);">
          Protected administrative system for Tyros Workshop Network.
        </p>
      </div>
    </form>
  `;

  const form = container.querySelector('#login-form');
  const phoneInput = container.querySelector('#login-phone');
  const passInput = container.querySelector('#login-password');
  const submitBtn = container.querySelector('#login-submit-btn');
  const alertBox = container.querySelector('#login-alert');
  const alertText = container.querySelector('#login-alert-text');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.style.display = 'none';

    const phone = phoneInput.value.trim();
    const pass = passInput.value.trim();

    if (!phone || phone.length < 10) {
      alertText.textContent = 'Please enter a valid 10-digit phone number.';
      alertBox.style.display = 'flex';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner light" style="margin-right:8px;"></span> Authenticating...';

    try {
      const result = await Auth.login(phone, pass);

      // Force admin role in portal
      if (!Auth.isAdmin()) {
        const u = Auth.getUser();
        u.role = 'admin';
        Auth.setSession(u);
      }

      UI.showToast('Welcome to Tyros Admin Portal', 'success');
      router.navigate('/dashboard');
    } catch (err) {
      alertText.textContent = err.message || 'Login failed. Please check credentials.';
      alertBox.style.display = 'flex';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In to Admin Portal';
    }
  });

  return container;
}
