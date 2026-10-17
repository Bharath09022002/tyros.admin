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

      <!-- Decoy inputs to absorb browser autofill heuristics -->
      <div style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;" aria-hidden="true">
        <input type="text" name="decoy_user" tabindex="-1" autocomplete="username">
        <input type="password" name="decoy_pwd" tabindex="-1" autocomplete="current-password">
      </div>

      <form id="login-form" novalidate autocomplete="off">
        <div class="form-group">
          <label class="form-label" for="login-phone">Mobile Number</label>
          <input
            type="tel"
            id="login-phone"
            name="tel_field_${Date.now()}"
            class="form-input"
            maxlength="10"
            autocomplete="new-password"
            readonly
            value=""
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="login-password">Password</label>
          <div class="password-input-wrap">
            <input
              type="text"
              id="login-password"
              name="pwd_field_${Date.now()}"
              class="form-input pwd-mask"
              autocomplete="new-password"
              readonly
              value=""
              required
            />
            <button type="button" id="toggle-pwd-btn" class="password-toggle-btn" aria-label="Show password" title="Show password">
              <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" id="login-submit" class="btn-primary login-submit-btn" style="margin-top:var(--space-2);">
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
  const togglePwdBtn = container.querySelector('#toggle-pwd-btn');
  const eyeIcon = container.querySelector('#eye-icon');

  let showPassword = false;

  // Make editable on first user touch/click/focus
  const makePhoneEditable = () => {
    if (phoneInput && phoneInput.hasAttribute('readonly')) {
      phoneInput.removeAttribute('readonly');
    }
  };

  const makePasswordEditable = () => {
    if (passwordInput) {
      if (passwordInput.hasAttribute('readonly')) {
        passwordInput.removeAttribute('readonly');
      }
      if (!showPassword) {
        passwordInput.type = 'password';
        passwordInput.classList.remove('pwd-mask');
      }
    }
  };

  ['focus', 'click', 'pointerdown', 'touchstart', 'keydown'].forEach(evt => {
    phoneInput.addEventListener(evt, makePhoneEditable, { once: true });
    passwordInput.addEventListener(evt, makePasswordEditable, { once: true });
  });

  // Password visibility toggle
  togglePwdBtn.addEventListener('click', () => {
    showPassword = !showPassword;
    makePasswordEditable();
    if (showPassword) {
      passwordInput.type = 'text';
      passwordInput.classList.remove('pwd-mask');
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
      togglePwdBtn.setAttribute('title', 'Hide password');
    } else {
      passwordInput.type = 'password';
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
      togglePwdBtn.setAttribute('title', 'Show password');
    }
  });

  // Aggressive anti-autofill & blank enforcement
  const forceClear = () => {
    if (phoneInput && phoneInput.hasAttribute('readonly') && phoneInput.value) {
      phoneInput.value = '';
    }
    if (passwordInput && passwordInput.hasAttribute('readonly') && passwordInput.value) {
      passwordInput.value = '';
    }
  };

  form.reset();
  forceClear();
  [20, 80, 180, 350, 600, 1000].forEach(ms => setTimeout(forceClear, ms));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    const phone = phoneInput.value.trim();
    const password = passwordInput.value;

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
