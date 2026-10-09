// Data Store for Tyros Web Application
// 100% API-Driven: Directly interacts with Backend API endpoints
import { ApiClient } from './api.js';

class StoreClass {
  constructor() {
    this.purgeDummyData();
  }

  // Purge any previously seeded mock data from LocalStorage
  purgeDummyData() {
    try {
      const keysToPurge = [
        'tyros_entries',
        'tyros_shops',
        'tyros_users',
        'tyros_daily_reports',
        'tyros_tyre_sizes',
        'tyros_tyre_brands',
        'tyros_car_brands',
        'tyros_car_models',
        'tyros_monthly_targets',
        'tyros_seed_v1',
        'tyros_seed_v2',
        'tyros_seed_v3',
        'tyros_seed_v4',
        'tyros_seed_v5',
        'tyros_seed_v6',
        'tyros_seed_v7'
      ];
      keysToPurge.forEach(k => localStorage.removeItem(k));
    } catch (_) {}
  }

  normalizeUser(u) {
    if (!u) return null;
    const id = (u.id || u._id || '').toString();
    const name = u.fullName || u.full_name || u.name || u.userName || u.username || 'Staff Member';
    const phone = u.phone || u.phoneNumber || u.phone_number || u.mobileNumber || u.mobile || '';
    const role = (u.role || 'EMPLOYEE').toUpperCase();
    const assignedShopIds = u.assignedShopIds || u.assigned_shop_ids || u.shopIds || u.shop_ids || (u.shopId ? [u.shopId] : []);
    const isActive = u.isActive !== undefined ? !!u.isActive : true;

    return {
      ...u,
      id,
      name,
      fullName: name,
      phone,
      role,
      assignedShopIds: Array.isArray(assignedShopIds) ? assignedShopIds : [assignedShopIds.toString()],
      isActive
    };
  }

  normalizeShop(s) {
    if (!s) return null;
    const id = (s.id || s._id || '').toString();
    const name = s.name || s.shopName || s.shop_name || 'Workshop Branch';
    const address = s.address || s.location || s.shopAddress || '';
    const phone = s.phone || s.contactNumber || s.phone_number || '';
    const isActive = s.isActive !== undefined ? !!s.isActive : true;
    const targetAmount = Number(s.targetAmount || s.target_amount || 0);
    const targetTyres = Number(s.targetTyres || s.target_tyres || 0);

    return {
      ...s,
      id,
      name,
      address,
      phone,
      isActive,
      targetAmount,
      targetTyres
    };
  }

  normalizeEntry(e) {
    if (!e) return null;
    const id = (e.id || e._id || '').toString();
    const customerName = e.customerName || e.customer_name || e.name || 'Customer';
    const mobileNumber = e.mobileNumber || e.mobile_number || e.phone || '';
    const vehicleNumber = e.vehicleNumber || e.vehicle_number || '';
    const vehicleDetails = e.vehicleDetails || e.vehicle_details || e.vehicleModel || 'Vehicle';
    const tyreSize = e.tyreSize || e.tyre_size || '';
    const tyreBrand = e.tyreBrand || e.tyre_brand || '';
    const amount = Number(e.amount || e.totalAmount || 0);
    const quantity = Number(e.quantity || 0);
    const shopId = (e.shopId || e.shop_id || '').toString();
    const shopName = e.shopName || e.shop_name || 'Shop';
    const status = (e.status || 'PENDING').toUpperCase();
    const fitStatus = (e.fitStatus || e.fit_status || 'FIT').toUpperCase();
    const followUpDate = e.followUpDate || e.follow_up_date || new Date().toISOString();
    const dateText = e.dateText || (e.followUpDate ? new Date(e.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '');
    const isOverdue = !!e.isOverdue || (status === 'PENDING' && fitStatus === 'FIT' && new Date(followUpDate) < new Date());

    return {
      ...e,
      id,
      customerName,
      mobileNumber,
      vehicleNumber,
      vehicleDetails,
      tyreSize,
      tyreBrand,
      amount,
      quantity,
      shopId,
      shopName,
      status,
      fitStatus,
      followUpDate,
      dateText,
      isOverdue
    };
  }

  // ==========================================
  // Shops API
  // ==========================================
  async getShops() {
    try {
      const res = await ApiClient.get('/admin/shops').catch(() => ApiClient.get('/employee/shops'));
      const list = res?.data?.shops || res?.data || res?.shops || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list.map(s => this.normalizeShop(s)).filter(Boolean);
      }
    } catch (err) {
      console.warn('[Store] getShops API error:', err.message);
    }
    return [];
  }

  async getShopById(id) {
    try {
      const res = await ApiClient.get(`/admin/shops/${id}`).catch(() => null);
      const data = res?.data?.shop || res?.data || res?.shop || res;
      if (data && data.name) return this.normalizeShop(data);
    } catch (_) {}
    const all = await this.getShops();
    return all.find(s => s.id === id) || null;
  }

  // ==========================================
  // Staff Users API
  // ==========================================
  async getUsers() {
    try {
      const res = await ApiClient.get('/admin/users');
      const list = res?.data?.users || res?.data || res?.users || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list.map(u => this.normalizeUser(u)).filter(Boolean);
      }
    } catch (err) {
      console.warn('[Store] getUsers API error:', err.message);
    }
    return [];
  }

  // ==========================================
  // Enquiries / Entries API
  // ==========================================
  async getEntries(shopId = null) {
    try {
      const params = shopId ? { shopId } : {};
      const res = await ApiClient.get('/admin/enquiries', params).catch(() => ApiClient.get('/employee/enquiries', params));
      const list = res?.data?.enquiries || res?.data || res?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list.map(e => this.normalizeEntry(e)).filter(Boolean);
      }
    } catch (err) {
      console.warn('[Store] getEntries API error:', err.message);
    }
    return [];
  }

  async getEntryById(id) {
    try {
      const res = await ApiClient.get(`/admin/enquiries/${id}`).catch(() => ApiClient.get(`/employee/enquiries/${id}`));
      const data = res?.data?.enquiry || res?.data || res?.item || res;
      if (data && (data.customerName || data.name || data.mobileNumber)) {
        return this.normalizeEntry(data);
      }
    } catch (_) {}
    const all = await this.getEntries();
    return all.find(e => e.id === id) || null;
  }

  async createEntry(entryData) {
    const res = await ApiClient.post('/employee/enquiries', entryData);
    const created = res?.data?.enquiry || res?.data || res;
    return this.normalizeEntry(created);
  }

  async updateEntry(id, updates) {
    try {
      const res = await ApiClient.patch(`/admin/enquiries/${id}`, updates).catch(() => ApiClient.put(`/employee/enquiries/${id}`, updates));
      const updated = res?.data?.enquiry || res?.data || res;
      return this.normalizeEntry(updated);
    } catch (err) {
      console.error('[Store] updateEntry failed:', err);
      throw err;
    }
  }

  async deleteEntry(id) {
    return await ApiClient.delete(`/admin/enquiries/${id}`);
  }

  // ==========================================
  // Tyre Sizes Catalog API
  // ==========================================
  async getTyreSizes() {
    try {
      const res = await ApiClient.get('/admin/tyre-sizes').catch(() => ApiClient.get('/employee/tyre-sizes'));
      const list = res?.data?.sizes || res?.data || res?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list.map((s, idx) => ({
          id: (s.id || s._id || `ts-${idx}`).toString(),
          size: typeof s === 'string' ? s : (s.size || s.name || ''),
          isActive: s.isActive !== undefined ? !!s.isActive : true
        })).filter(s => !!s.size);
      }
    } catch (err) {
      console.warn('[Store] getTyreSizes API error:', err.message);
    }
    return [];
  }

  async addTyreSize(sizeStr) {
    const res = await ApiClient.post('/admin/tyre-sizes', { size: sizeStr.trim(), isActive: true });
    return res?.data || res;
  }

  async updateTyreSize(id, newSize) {
    const res = await ApiClient.patch(`/admin/tyre-sizes/${id}`, { size: newSize.trim() }).catch(() => ApiClient.put(`/admin/tyre-sizes/${id}`, { size: newSize.trim() }));
    return res?.data || res;
  }

  async toggleTyreSize(id) {
    const sizes = await this.getTyreSizes();
    const item = sizes.find(s => s.id === id);
    if (item) {
      return await ApiClient.patch(`/admin/tyre-sizes/${id}`, { isActive: !item.isActive }).catch(() => null);
    }
    return null;
  }

  // ==========================================
  // Tyre Brands Catalog API
  // ==========================================
  async getTyreBrands() {
    try {
      const res = await ApiClient.get('/admin/tyre-brands').catch(() => ApiClient.get('/employee/tyre-brands'));
      const list = res?.data?.brands || res?.data || res?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list.map((b, idx) => ({
          id: (b.id || b._id || `tb-${idx}`).toString(),
          name: typeof b === 'string' ? b : (b.name || b.brandName || ''),
          isActive: b.isActive !== undefined ? !!b.isActive : true
        })).filter(b => !!b.name);
      }
    } catch (err) {
      console.warn('[Store] getTyreBrands API error:', err.message);
    }
    return [];
  }

  async addTyreBrand(nameStr) {
    const res = await ApiClient.post('/admin/tyre-brands', { name: nameStr.trim(), isActive: true });
    return res?.data || res;
  }

  async updateTyreBrand(id, newName) {
    const res = await ApiClient.patch(`/admin/tyre-brands/${id}`, { name: newName.trim() }).catch(() => ApiClient.put(`/admin/tyre-brands/${id}`, { name: newName.trim() }));
    return res?.data || res;
  }

  async toggleTyreBrand(id) {
    const brands = await this.getTyreBrands();
    const item = brands.find(b => b.id === id);
    if (item) {
      return await ApiClient.patch(`/admin/tyre-brands/${id}`, { isActive: !item.isActive }).catch(() => null);
    }
    return null;
  }

  // ==========================================
  // Car Brands Catalog API
  // ==========================================
  async getCarBrands() {
    try {
      const res = await ApiClient.get('/employee/car-brands').catch(() => ApiClient.get('/admin/car-brands'));
      const list = res?.data?.brands || res?.data || res?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list.map((b, idx) => ({
          id: (b.id || b._id || `cb-${idx}`).toString(),
          name: typeof b === 'string' ? b : (b.name || b.brand || ''),
          isActive: b.isActive !== undefined ? !!b.isActive : true
        })).filter(b => !!b.name);
      }
    } catch (err) {
      console.warn('[Store] getCarBrands API error:', err.message);
    }
    return [];
  }

  async addCarBrand(nameStr) {
    const res = await ApiClient.post('/admin/car-brands', { name: nameStr.trim(), isActive: true }).catch(() => ApiClient.post('/employee/car-brands', { name: nameStr.trim(), isActive: true }));
    return res?.data || res;
  }

  async updateCarBrand(id, newName) {
    const res = await ApiClient.patch(`/admin/car-brands/${id}`, { name: newName.trim() }).catch(() => null);
    return res?.data || res;
  }

  async toggleCarBrand(id) {
    const brands = await this.getCarBrands();
    const item = brands.find(b => b.id === id);
    if (item) {
      return await ApiClient.patch(`/admin/car-brands/${id}`, { isActive: !item.isActive }).catch(() => null);
    }
    return null;
  }

  // ==========================================
  // Car Models Catalog API
  // ==========================================
  async getCarModels() {
    try {
      const res = await ApiClient.get('/employee/car-models').catch(() => ApiClient.get('/admin/car-models'));
      const list = res?.data?.models || res?.data || res?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list.map((m, idx) => ({
          id: (m.id || m._id || `cm-${idx}`).toString(),
          name: typeof m === 'string' ? m : (m.name || m.model || ''),
          brandName: m.brandName || m.brand || m.carBrand || '',
          isActive: m.isActive !== undefined ? !!m.isActive : true
        })).filter(m => !!m.name);
      }
    } catch (err) {
      console.warn('[Store] getCarModels API error:', err.message);
    }
    return [];
  }

  async addCarModel(nameStr, brandName) {
    const res = await ApiClient.post('/admin/car-models', { name: nameStr.trim(), brandName: brandName?.trim() || '', isActive: true }).catch(() => ApiClient.post('/employee/car-models', { name: nameStr.trim(), brand: brandName?.trim() || '', isActive: true }));
    return res?.data || res;
  }

  async updateCarModel(id, newName, brandName) {
    const res = await ApiClient.patch(`/admin/car-models/${id}`, { name: newName.trim(), brandName: brandName?.trim() }).catch(() => null);
    return res?.data || res;
  }

  async toggleCarModel(id) {
    const models = await this.getCarModels();
    const item = models.find(m => m.id === id);
    if (item) {
      return await ApiClient.patch(`/admin/car-models/${id}`, { isActive: !item.isActive }).catch(() => null);
    }
    return null;
  }

  // ==========================================
  // Target Dashboard API
  // ==========================================
  async getTargetDashboard(shopId = null) {
    try {
      const params = shopId ? { shopId } : {};
      const res = await ApiClient.get('/employee/target-dashboard', params).catch(() => ApiClient.get('/admin/dashboard', params));
      const d = res?.data || res?.target || res;
      if (d) {
        const targetAmount = Number(d.targetAmount || d.target_amount || 0);
        const targetTyres = Number(d.targetTyres || d.target_tyres || 0);
        const achievedAmount = Number(d.achievedAmount || d.achieved_amount || d.currentAmount || 0);
        const achievedTyres = Number(d.achievedTyres || d.achieved_tyres || d.currentTyres || 0);
        const amountPercentage = targetAmount > 0 ? parseFloat(((achievedAmount / targetAmount) * 100).toFixed(1)) : 0;
        const tyresPercentage = targetTyres > 0 ? parseFloat(((achievedTyres / targetTyres) * 100).toFixed(1)) : 0;

        return {
          shopId: shopId || d.shopId || '',
          shopName: d.shopName || d.name || 'Branch',
          formattedPeriod: d.formattedPeriod || d.period || 'Current Period',
          targetAmount,
          targetTyres,
          achievedAmount,
          achievedTyres,
          amountPercentage,
          tyresPercentage,
          remainingAmount: Math.max(0, targetAmount - achievedAmount),
          remainingTyres: Math.max(0, targetTyres - achievedTyres),
          isOverallAchieved: achievedAmount >= targetAmount && achievedTyres >= targetTyres
        };
      }
    } catch (err) {
      console.warn('[Store] getTargetDashboard API error:', err.message);
    }

    return {
      shopId: shopId || '',
      shopName: 'Branch',
      formattedPeriod: 'Current Period',
      targetAmount: 0,
      targetTyres: 0,
      achievedAmount: 0,
      achievedTyres: 0,
      amountPercentage: 0,
      tyresPercentage: 0,
      remainingAmount: 0,
      remainingTyres: 0,
      isOverallAchieved: false
    };
  }

  // ==========================================
  // Monthly Target Data API
  // ==========================================
  async getMonthlyTargetData(shopId = 'all') {
    try {
      const params = shopId && shopId !== 'all' ? { shopId } : {};
      const res = await ApiClient.get('/employee/target-dashboard', params).catch(() => ApiClient.get('/admin/dashboard', params));
      const d = res?.data || res?.target || res;
      if (d) {
        const revTarget = Number(d.targetAmount || d.target_amount || d.revenueTarget || 0);
        const revAchieved = Number(d.achievedAmount || d.achieved_amount || d.revenueAchieved || 0);
        const tyreTarget = Number(d.targetTyres || d.target_tyres || d.tyreTarget || 0);
        const tyreAchieved = Number(d.achievedTyres || d.achieved_tyres || d.tyreAchieved || 0);

        return {
          shopId: shopId || 'all',
          shopName: d.shopName || (shopId === 'all' ? 'All Shops' : 'Branch'),
          period: d.period || 'CURRENT PERIOD',
          month: d.month || 'Current Month',
          year: d.year || new Date().getFullYear().toString(),
          daysLeft: d.daysLeft !== undefined ? d.daysLeft : 0,
          revenueAchieved: revAchieved,
          revenueTarget: revTarget,
          revenuePercentage: revTarget > 0 ? parseFloat(((revAchieved / revTarget) * 100).toFixed(1)) : 0,
          tyreAchieved: tyreAchieved,
          tyreTarget: tyreTarget,
          tyrePercentage: tyreTarget > 0 ? parseFloat(((tyreAchieved / tyreTarget) * 100).toFixed(1)) : 0,
          services: Array.isArray(d.services) ? d.services : [
            { name: '2W Enquiry', achieved: Number(d.twoWheelEnquiryAchieved || 0), target: Number(d.twoWheelEnquiryTarget || 0), percentage: 0 },
            { name: '2W Alignment', achieved: Number(d.twoWheelAlignmentAchieved || 0), target: Number(d.twoWheelAlignmentTarget || 0), percentage: 0 },
            { name: 'Wheel Alignment', achieved: Number(d.wheelAlignmentAchieved || 0), target: Number(d.wheelAlignmentTarget || 0), percentage: 0 }
          ]
        };
      }
    } catch (err) {
      console.warn('[Store] getMonthlyTargetData API error:', err.message);
    }

    return {
      shopId: shopId || 'all',
      shopName: shopId === 'all' ? 'All Shops' : 'Branch',
      period: 'CURRENT PERIOD',
      month: 'Current Month',
      year: new Date().getFullYear().toString(),
      daysLeft: 0,
      revenueAchieved: 0,
      revenueTarget: 0,
      revenuePercentage: 0,
      tyreAchieved: 0,
      tyreTarget: 0,
      tyrePercentage: 0,
      services: [
        { name: '2W Enquiry', achieved: 0, target: 0, percentage: 0 },
        { name: '2W Alignment', achieved: 0, target: 0, percentage: 0 },
        { name: 'Wheel Alignment', achieved: 0, target: 0, percentage: 0 }
      ]
    };
  }

  async updateMonthlyTarget(shopId, targetAmount, targetTyres, serviceTargets = null) {
    try {
      const payload = {
        targetAmount: Number(targetAmount),
        targetTyres: Number(targetTyres),
        serviceTargets
      };
      if (shopId && shopId !== 'all') payload.shopId = shopId;
      const res = await ApiClient.post('/admin/targets', payload).catch(() => ApiClient.put(`/admin/shops/${shopId}`, payload));
      return res?.data || res;
    } catch (err) {
      console.warn('[Store] updateMonthlyTarget API error:', err.message);
      throw err;
    }
  }

  // ==========================================
  // Daily Reports API
  // ==========================================
  async getDailyReports(shopId = null) {
    try {
      const params = shopId ? { shopId } : {};
      const res = await ApiClient.get('/daily-reports', params);
      const list = res?.data?.reports || res?.data || res?.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        return list;
      }
    } catch (err) {
      console.warn('[Store] getDailyReports API error:', err.message);
    }
    return [];
  }
}

export const Store = new StoreClass();
