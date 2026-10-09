// Target Dashboard Screen matching Flutter EmployeeTargetDashboardScreen
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderTargets(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shopId = Auth.getActiveShopId();
  const shop = await Store.getShopById(shopId);
  const shopName = shop?.name || 'Store';
  const data = await Store.getTargetDashboard(shopId);

  // Compute daily required run-rate
  const now = new Date();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, totalDays - now.getDate());
  const dailyNeededAmount = Math.round(data.remainingAmount / remainingDays);
  const dailyNeededTyres = Math.ceil(data.remainingTyres / remainingDays);

  container.innerHTML = `
    <header class="sub-header">
      <button id="targets-back-btn" class="back-btn">${UI.icons.back(18)}</button>
      <div class="sub-header-content">
        <div class="sub-header-title">Monthly Target Dashboard</div>
        <div class="sub-header-context">${shopName} • ${data.formattedPeriod}</div>
      </div>
    </header>

    <div style="padding: 16px 20px 40px;">
      <!-- Hero Status Box -->
      <div style="background: ${data.isOverallAchieved ? 'rgba(46,125,50,0.1)' : 'rgba(53,81,107,0.1)'}; border: 1px solid ${data.isOverallAchieved ? 'var(--status-done)' : 'var(--accent-steel)'}; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${data.isOverallAchieved ? 'var(--status-done)' : 'var(--accent-steel)'};">
          Overall Month Status
        </div>
        <div style="font-family: var(--font-condensed); font-size: 26px; font-weight: 700; color: var(--text-main); margin-top: 2px;">
          ${data.isOverallAchieved ? '🎉 Target Achieved!' : `${data.amountPercentage}% Revenue Achieved`}
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
          ${remainingDays} days remaining in ${data.formattedPeriod}
        </div>
      </div>

      <!-- Metric 1: Revenue -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 14px;">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
          <span style="font-family: var(--font-condensed); font-size: 16px; font-weight: 700; text-transform: uppercase;">Revenue Target</span>
          <span style="font-size: 14px; font-weight: 700; color: var(--accent-rust);">${data.amountPercentage}%</span>
        </div>
        <div class="progress-track" style="height: 10px; margin-bottom: 10px;">
          <div class="progress-fill amount ${data.amountPercentage >= 100 ? 'done' : ''}" style="width: ${data.amountPercentage}%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <div>Achieved: <strong>${UI.formatCurrency(data.achievedAmount)}</strong></div>
          <div>Target: <strong>${UI.formatCurrency(data.targetAmount)}</strong></div>
        </div>
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--row-divider); font-size: 11.5px; color: var(--text-muted);">
          ${data.remainingAmount > 0 ? `Required Run Rate: <strong>${UI.formatCurrency(dailyNeededAmount)} / day</strong> to reach goal` : 'Monthly target fully reached!'}
        </div>
      </div>

      <!-- Metric 2: Tyres -->
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 8px;">
          <span style="font-family: var(--font-condensed); font-size: 16px; font-weight: 700; text-transform: uppercase;">Tyres Target</span>
          <span style="font-size: 14px; font-weight: 700; color: var(--accent-steel);">${data.tyresPercentage}%</span>
        </div>
        <div class="progress-track" style="height: 10px; margin-bottom: 10px;">
          <div class="progress-fill tyres ${data.tyresPercentage >= 100 ? 'done' : ''}" style="width: ${data.tyresPercentage}%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <div>Achieved: <strong>${data.achievedTyres} tyres</strong></div>
          <div>Target: <strong>${data.targetTyres} tyres</strong></div>
        </div>
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--row-divider); font-size: 11.5px; color: var(--text-muted);">
          ${data.remainingTyres > 0 ? `Required Pace: <strong>${dailyNeededTyres} tyres / day</strong>` : 'Tyre target reached!'}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#targets-back-btn')?.addEventListener('click', () => router.back());

  return container;
}
