// Tyros Admin - Login Page (js/pages/login.js)
import { Auth } from '../auth.js';
import { Toast } from '../toast.js';

export function renderLoginPage(router) {
  const container = document.createElement('div');
  container.className = 'login-view-wrapper';

  container.innerHTML = `
    <div class="login-card">
      <div class="login-brand-header">
        <div class="login-logo-badge">T</div>
        <h1 class="login-title">Tyros Admin</h1>
        <p class="login-subtitle">Multi-Shop Workshop Management Portal</p>
      </div>

      <div id="login-error-box" class="login-error-banner" role="alert"></div>

      <form id="login-form" novalidate autocomplete="off">
        <div class="form-group">
          <label class="form-label" for="login-phone">Mobile Number</label>
          <input
            type="tel"
            id="login-phone"
            name="tyros_user_phone"
            class="form-input"
            maxlength="10"
            autocomplete="off"
            value=""
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            name="tyros_user_pwd"
            class="form-input"
            autocomplete="new-password"
            value=""
            required
          />
        </div>

        <button type="submit" id="login-submit" class="btn-primary login-submit-btn">
          Sign In
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector('#login-form');
  const errorBox = container.querySelector('#login-error-box');
  const submitBtn = container.querySelector('#login-submit');
  const phoneInput = container.querySelector('#login-phone');
  const passwordInput = container.querySelector('#login-password');

  // Prevent browser password manager from autofilling dummy credentials
  if (phoneInput) phoneInput.value = '';
  if (passwordInput) passwordInput.value = '';
  setTimeout(() => {
    if (phoneInput) phoneInput.value = '';
    if (passwordInput) passwordInput.value = '';
  }, 60);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    const phone = container.querySelector('#login-phone').value.trim();
    const password = container.querySelector('#login-password').value;

    if (!phone || phone.length < 10) {
      errorBox.textContent = 'Please enter a valid 10-digit mobile number.';
      errorBox.style.display = 'block';
      return;
    }

    if (!password) {
      errorBox.textContent = 'Please enter your password.';
      errorBox.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
      await Auth.login(phone, password);
      Toast.success('Signed in successfully.');
      router.navigate('#/dashboard');
    } catch (err) {
      const msg = err.message || 'Login failed. Please check credentials.';
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
      Toast.error(msg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });

  return container;
}
