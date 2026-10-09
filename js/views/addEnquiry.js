// Add Customer Enquiry View matching Flutter AddEnquiryScreen
import { Auth } from '../auth.js';
import { Store } from '../store.js';
import { UI } from '../ui.js';

export async function renderAddEnquiry(router) {
  const container = document.createElement('div');
  container.className = 'view-screen';

  const shopId = Auth.getActiveShopId();
  const shop = await Store.getShopById(shopId);
  const shopName = shop?.name || 'Store';

  // Load master data
  const carBrands = await Store.getCarBrands();
  const tyreSizes = await Store.getTyreSizes();
  const tyreBrands = await Store.getTyreBrands();

  // Default follow-up date: 7 days from now, 11:30 AM
  const defaultFollowUp = new Date();
  defaultFollowUp.setDate(defaultFollowUp.getDate() + 7);
  defaultFollowUp.setHours(11, 30, 0, 0);
  const defaultFollowUpStr = defaultFollowUp.toISOString().slice(0, 16);

  container.innerHTML = `
    <!-- SubHeader with Back Button -->
    <header class="sub-header">
      <button id="add-back-btn" class="back-btn" title="Back">
        ${UI.icons.back(18)}
      </button>
      <div class="sub-header-content">
        <div class="sub-header-title">Add Customer Enquiry</div>
        <div class="sub-header-context">${shopName}</div>
      </div>
      <button id="add-save-top-btn" class="sub-header-action">Save</button>
    </header>

    <form id="enquiry-form" style="padding-top: 14px;">
      <!-- Vehicle Type Toggle -->
      <div class="segmented-control" id="veh-type-control">
        <button type="button" class="segmented-btn active" data-type="FOUR_WHEELER">🚗 4-Wheeler</button>
        <button type="button" class="segmented-btn" data-type="TWO_WHEELER">🏍️ 2-Wheeler</button>
      </div>

      <!-- Customer Name & Mobile -->
      <div class="form-group">
        <label class="form-label">Customer Name <span class="req">*</span></label>
        <input type="text" id="cust-name" class="form-input" placeholder="e.g. Karthik Subramanian" required>
      </div>

      <div class="form-group">
        <label class="form-label">Mobile Number (10 Digits) <span class="req">*</span></label>
        <input type="tel" id="cust-mobile" class="form-input" placeholder="98XXXXXXXX" maxlength="10" required>
        <div id="duplicate-warn" class="notice-warn-card" style="display:none; margin: 8px 0 0;">
          <span class="icon">⚠️</span>
          <span class="text" id="duplicate-warn-text"></span>
        </div>
      </div>

      <!-- Vehicle Registration & Brand/Model -->
      <div class="form-group">
        <label class="form-label">Vehicle Registration Number</label>
        <input type="text" id="cust-plate" class="form-input" placeholder="e.g. TN 01 AB 1234" style="text-transform: uppercase;">
      </div>

      <!-- Car Brand & Model Row -->
      <div id="four-wheeler-fields" class="form-row-2">
        <div class="form-group">
          <label class="form-label">Car Brand</label>
          <select id="cust-car-brand" class="form-select">
            <option value="">Select Brand</option>
            ${carBrands.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Car Model</label>
          <select id="cust-car-model" class="form-select">
            <option value="">Select Model</option>
          </select>
        </div>
      </div>

      <!-- Tyre Size & Brand -->
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Tyre Size</label>
          <input type="text" id="cust-tyre-size" class="form-input" list="size-list" placeholder="e.g. 195/65 R15">
          <datalist id="size-list">
            ${tyreSizes.map(s => `<option value="${s.size}">`).join('')}
          </datalist>
        </div>
        <div class="form-group">
          <label class="form-label">Tyre Brand</label>
          <input type="text" id="cust-tyre-brand" class="form-input" list="brand-list" placeholder="e.g. Bridgestone">
          <datalist id="brand-list">
            ${tyreBrands.map(b => `<option value="${b.name}">`).join('')}
          </datalist>
        </div>
      </div>

      <!-- Quoted Options Card -->
      <div style="margin: 0 20px 14px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
        <div style="font-family: var(--font-condensed); font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 10px; text-transform: uppercase;">
          Quoted Tyre Options & Rates
        </div>

        <!-- Option 1 -->
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed var(--row-divider);">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-rust); margin-bottom: 6px;">OPTION 1 (PRIMARY)</div>
          <div class="form-row-2" style="margin:0 0 8px;">
            <div class="form-group"><input type="text" id="opt1-model" class="form-input" placeholder="Model / Pattern (e.g. Turanza)"></div>
            <div class="form-group"><input type="number" id="opt1-price" class="form-input" placeholder="Price/Tyre ₹"></div>
          </div>
          <div class="form-row-2" style="margin:0;">
            <div class="form-group"><input type="number" id="opt1-qty" class="form-input" placeholder="Quantity (e.g. 4)" value="4"></div>
            <div class="form-group"><input type="text" id="opt1-total" class="form-input" placeholder="Total Estimated ₹" readonly style="background:#eee;"></div>
          </div>
        </div>

        <!-- Option 2 -->
        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-steel); margin-bottom: 6px;">OPTION 2 (ALTERNATIVE)</div>
          <div class="form-row-2" style="margin:0 0 8px;">
            <div class="form-group"><input type="text" id="opt2-model" class="form-input" placeholder="Model / Pattern (e.g. Earth-1)"></div>
            <div class="form-group"><input type="number" id="opt2-price" class="form-input" placeholder="Price/Tyre ₹"></div>
          </div>
        </div>
      </div>

      <!-- Follow-up Date & Time Picker -->
      <div class="form-group">
        <label class="form-label">Follow-up Date & Time <span class="req">*</span></label>
        <input type="datetime-local" id="cust-followup-date" class="form-input" value="${defaultFollowUpStr}" required>
      </div>

      <!-- Customer Source & Wheel Alignment -->
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Arrival Source</label>
          <select id="cust-source" class="form-select">
            <option value="Walk-in">Walk-in</option>
            <option value="JustDial">JustDial</option>
            <option value="Google">Google / Maps</option>
            <option value="Referral">Customer Referral</option>
            <option value="Phone Call">Direct Phone Call</option>
          </select>
        </div>
        <div class="form-group" style="justify-content: flex-end; padding-bottom: 6px;">
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; cursor:pointer;">
            <input type="checkbox" id="cust-alignment" style="width:16px; height:16px; accent-color: var(--accent-rust);">
            Wheel Alignment
          </label>
        </div>
      </div>

      <!-- Remarks / Notes -->
      <div class="form-group">
        <label class="form-label">Remarks / Customer Notes</label>
        <textarea id="cust-remarks" class="form-textarea" rows="3" placeholder="Special requirements, discounts discussed, customer preferences..."></textarea>
      </div>

      <!-- Submit CTA Button -->
      <button type="submit" id="add-submit-btn" class="btn-primary-cta" style="margin-bottom: 30px;">
        + Save & Schedule Follow-Up
      </button>
    </form>
  `;

  // Bind interactive elements
  const form = container.querySelector('#enquiry-form');
  const nameInput = container.querySelector('#cust-name');
  const mobileInput = container.querySelector('#cust-mobile');
  const plateInput = container.querySelector('#cust-plate');
  const carBrandSelect = container.querySelector('#cust-car-brand');
  const carModelSelect = container.querySelector('#cust-car-model');
  const tyreSizeInput = container.querySelector('#cust-tyre-size');
  const tyreBrandInput = container.querySelector('#cust-tyre-brand');
  const followUpDateInput = container.querySelector('#cust-followup-date');
  const sourceSelect = container.querySelector('#cust-source');
  const alignmentCheck = container.querySelector('#cust-alignment');
  const remarksInput = container.querySelector('#cust-remarks');
  const dupWarn = container.querySelector('#duplicate-warn');
  const dupWarnText = container.querySelector('#duplicate-warn-text');
  const submitBtn = container.querySelector('#add-submit-btn');

  let vehicleType = 'FOUR_WHEELER';

  // Toggle vehicle type
  container.querySelectorAll('#veh-type-control .segmented-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('#veh-type-control .segmented-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vehicleType = btn.dataset.type;
      container.querySelector('#four-wheeler-fields').style.display = vehicleType === 'FOUR_WHEELER' ? 'flex' : 'none';
    });
  });

  // Plate auto formatting
  plateInput.addEventListener('input', () => {
    plateInput.value = UI.formatPlate(plateInput.value);
  });

  // Calculate Option 1 total
  const opt1Price = container.querySelector('#opt1-price');
  const opt1Qty = container.querySelector('#opt1-qty');
  const opt1Total = container.querySelector('#opt1-total');

  function updateOpt1Total() {
    const p = parseFloat(opt1Price.value) || 0;
    const q = parseInt(opt1Qty.value, 10) || 0;
    opt1Total.value = p && q ? UI.formatCurrency(p * q) : '';
  }
  opt1Price.addEventListener('input', updateOpt1Total);
  opt1Qty.addEventListener('input', updateOpt1Total);

  // Dynamic Car Models by Brand
  carBrandSelect.addEventListener('change', async () => {
    const brandId = carBrandSelect.value;
    carModelSelect.innerHTML = '<option value="">Select Model</option>';
    if (brandId) {
      const models = await Store.getCarModels(brandId);
      models.forEach(m => {
        carModelSelect.innerHTML += `<option value="${m.id}">${m.name}</option>`;
      });
    }
  });

  // Real-time Duplicate Mobile Check
  let dupTimeout;
  mobileInput.addEventListener('input', () => {
    clearTimeout(dupTimeout);
    const digits = mobileInput.value.replace(/\D/g, '');
    if (digits.length === 10) {
      dupTimeout = setTimeout(async () => {
        const dup = await Store.checkDuplicate(digits, shopId);
        if (dup) {
          dupWarnText.textContent = `Customer already exists: ${dup.customerName} (${dup.vehicleNumber || 'Enquiry on file'})`;
          dupWarn.style.display = 'flex';
        } else {
          dupWarn.style.display = 'none';
        }
      }, 300);
    } else {
      dupWarn.style.display = 'none';
    }
  });

  // Handle Form Submission
  async function handleSubmit(e) {
    if (e) e.preventDefault();

    const name = nameInput.value.trim();
    const mobile = mobileInput.value.trim().replace(/\D/g, '');

    if (!name) {
      UI.showToast('Please enter customer name', 'error');
      nameInput.focus();
      return;
    }

    if (!mobile || mobile.length < 10) {
      UI.showToast('Please enter valid 10-digit mobile number', 'error');
      mobileInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner light"></span> Saving...';

    // Build entry payload
    const selectedBrandText = carBrandSelect.options[carBrandSelect.selectedIndex]?.text || '';
    const selectedModelText = carModelSelect.options[carModelSelect.selectedIndex]?.text || '';
    const vehicleDetails = vehicleType === 'FOUR_WHEELER'
      ? `${selectedBrandText} ${selectedModelText}`.trim()
      : 'Two Wheeler';

    const p1 = parseFloat(opt1Price.value) || null;
    const q1 = parseInt(opt1Qty.value, 10) || 4;
    const totalAmount = p1 ? p1 * q1 : null;

    const quoteOptions = [];
    if (container.querySelector('#opt1-model').value.trim() || p1) {
      quoteOptions.push({
        tyreSize: tyreSizeInput.value.trim(),
        tyreModel: container.querySelector('#opt1-model').value.trim() || tyreBrandInput.value.trim(),
        price: p1,
        quantity: q1
      });
    }
    if (container.querySelector('#opt2-model').value.trim() || container.querySelector('#opt2-price').value) {
      quoteOptions.push({
        tyreSize: tyreSizeInput.value.trim(),
        tyreModel: container.querySelector('#opt2-model').value.trim(),
        price: parseFloat(container.querySelector('#opt2-price').value) || null,
        quantity: q1
      });
    }

    const payload = {
      shopId,
      shopName,
      customerName: name,
      mobileNumber: mobile,
      vehicleType,
      vehicleNumber: plateInput.value.trim(),
      vehicleDetails: vehicleDetails || 'Vehicle',
      carBrandId: carBrandSelect.value || null,
      carModelId: carModelSelect.value || null,
      tyreSize: tyreSizeInput.value.trim(),
      tyreBrand: tyreBrandInput.value.trim(),
      quantity: q1,
      amount: totalAmount,
      quoteOptions,
      followUpDate: new Date(followUpDateInput.value).toISOString(),
      source: sourceSelect.value,
      wheelAlignment: alignmentCheck.checked ? 'YES' : 'NO',
      remarks: remarksInput.value.trim()
    };

    try {
      const created = await Store.addEntry(payload);
      UI.showToast('Follow-up enquiry created successfully!', 'success');
      router.navigate(`/employee/entry/${created.id}`);
    } catch (err) {
      UI.showToast(err.message || 'Failed to save enquiry', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = '+ Save & Schedule Follow-Up';
    }
  }

  form.addEventListener('submit', handleSubmit);
  container.querySelector('#add-save-top-btn')?.addEventListener('click', handleSubmit);
  container.querySelector('#add-back-btn')?.addEventListener('click', () => router.back());

  return container;
}
