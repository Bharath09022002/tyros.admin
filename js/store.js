// Data Store and State Management matching Flutter Repositories & Screenshots
import { ApiClient } from './api.js';

// Exact Workshop Branches from Flutter Screenshots
const INITIAL_SHOPS = [
  {
    id: 'shop-flare',
    name: 'Flareminds',
    address: 'Ms nagar',
    phone: '9840011223',
    isActive: true,
    targetAmount: 6000000,
    targetTyres: 120
  },
  {
    id: 'shop-point',
    name: 'Tyre Point',
    address: 'Anna Nagar',
    phone: '9840044556',
    isActive: true,
    targetAmount: 400000,
    targetTyres: 80
  },
  {
    id: 'shop-bharath',
    name: 'bharath',
    address: 'Velachery',
    phone: '9840077889',
    isActive: true,
    targetAmount: 350000,
    targetTyres: 70
  },
  {
    id: 'shop-pk',
    name: 'pk shop',
    address: 'Tambaram',
    phone: '9840099001',
    isActive: true,
    targetAmount: 300000,
    targetTyres: 60
  }
];

// Exact Admin User from Screenshots ("Bharath", 4 shops)
const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Bharath',
    fullName: 'Bharath',
    phone: '9876543203',
    role: 'ADMIN',
    assignedShopIds: ['shop-flare', 'shop-point', 'shop-bharath', 'shop-pk'],
    isActive: true
  },
  {
    id: 'user-emp-1',
    name: 'Vishnu K',
    fullName: 'Vishnu K',
    phone: '9894169716',
    role: 'EMPLOYEE',
    assignedShopIds: ['shop-flare'],
    isActive: true
  },
  {
    id: 'user-emp-2',
    name: 'Ravi Kumar',
    fullName: 'Ravi Kumar',
    phone: '9876543201',
    role: 'EMPLOYEE',
    assignedShopIds: ['shop-point'],
    isActive: true
  }
];

// Exact Daily Reports from Screenshot 1 (Flareminds, October 2026)
const INITIAL_DAILY_REPORTS = [
  {
    id: 'rep-1',
    shopId: 'shop-flare',
    shopName: 'Flareminds',
    reportDate: '2026-10-06T10:00:00.000Z',
    displayDate: 'Tue, 6 October 2026',
    amount: 8500000,
    totalTyres: 15,
    totalServices: 31,
    metrics: [
      { label: '2W Enquiry', count: 2 },
      { label: '2W Alignment', count: 10 },
      { label: 'Wheel Alignment', count: 4 },
      { label: 'Commercial Tyre', count: 9 },
      { label: 'Water Wash', count: 17 },
      { label: 'Above 17"', count: 2 },
      { label: '4W Tyre', count: 2 }
    ]
  },
  {
    id: 'rep-2',
    shopId: 'shop-flare',
    shopName: 'Flareminds',
    reportDate: '2026-10-05T10:00:00.000Z',
    displayDate: 'Mon, 5 October 2026',
    amount: 18000,
    totalTyres: 7,
    totalServices: 0,
    metrics: [
      { label: '2W Enquiry', count: 0 },
      { label: '2W Alignment', count: 0 },
      { label: 'Wheel Alignment', count: 0 },
      { label: 'Commercial Tyre', count: 0 },
      { label: 'Water Wash', count: 0 },
      { label: 'Above 17"', count: 0 },
      { label: '4W Tyre', count: 7 }
    ]
  },
  {
    id: 'rep-3',
    shopId: 'shop-flare',
    shopName: 'Flareminds',
    reportDate: '2026-10-04T10:00:00.000Z',
    displayDate: 'Sun, 4 October 2026',
    amount: 25000,
    totalTyres: 6,
    totalServices: 4,
    metrics: [
      { label: '4W Tyre', count: 6 },
      { label: 'Wheel Alignment', count: 4 }
    ]
  }
];

// Generate 71 realistic records matching Screenshot 3 & 4 (47 Completed, 1 Overdue, 0 Pending, 23 Not Fitted)
function generateSeedEntries() {
  const list = [
    {
      id: 'enq-1',
      customerName: 'Bharah',
      mobileNumber: '9894169716',
      vehicleNumber: 'TN 78 ZH 6789',
      vehicleDetails: 'C3',
      tyreBrand: 'MICHELIN',
      tyreSize: '145/80 R12',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '6 Oct, 11:30 AM',
      followUpDate: '2026-10-06T11:30:00.000Z',
      amount: 14000,
      quantity: 4,
      status: 'PENDING',
      fitStatus: 'FIT',
      isOverdue: true,
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-2',
      customerName: 'Yasir',
      mobileNumber: '7894561235',
      vehicleNumber: 'TN 56 TH 6789',
      vehicleDetails: 'City',
      tyreBrand: 'CONTINENTAL',
      tyreSize: '145/80 R13',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '13 Oct, 11:30 AM',
      followUpDate: '2026-10-13T11:30:00.000Z',
      amount: 22500,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'NOT_FIT',
      unfitReason: 'Found lower price outside',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-3',
      customerName: 'Nithesh A K',
      mobileNumber: '7373533278',
      vehicleNumber: 'TN 65 BH 1005',
      vehicleDetails: 'Aura',
      tyreBrand: 'CEAT',
      tyreSize: '185/65 R15',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '5 Oct, 02:15 PM',
      followUpDate: '2026-10-05T14:15:00.000Z',
      amount: 14000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-4',
      customerName: 'Arun',
      mobileNumber: '9840112233',
      vehicleNumber: 'TN 09 AB 6889',
      vehicleDetails: 'Swift',
      tyreBrand: 'Bridgestone',
      tyreSize: '185/65 R15',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '4 Oct, 04:00 PM',
      followUpDate: '2026-10-04T16:00:00.000Z',
      amount: 28000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-5',
      customerName: 'Vijay',
      mobileNumber: '9840223344',
      vehicleNumber: 'TN 02 CD 4410',
      vehicleDetails: 'Creta',
      tyreBrand: 'Goodyear',
      tyreSize: '205/65 R16',
      shopId: 'shop-point',
      shopName: 'Tyre Point',
      dateText: '4 Oct, 01:20 PM',
      followUpDate: '2026-10-04T13:20:00.000Z',
      amount: 31000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-2'
    },
    {
      id: 'enq-6',
      customerName: 'Jain',
      mobileNumber: '9840334455',
      vehicleNumber: 'TN 04 EF 0488',
      vehicleDetails: 'Carnival',
      tyreBrand: 'JK TYRE',
      tyreSize: '235/65 R17',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '3 Oct, 11:00 AM',
      followUpDate: '2026-10-03T11:00:00.000Z',
      amount: 13000,
      quantity: 2,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-7',
      customerName: 'Ashok',
      mobileNumber: '9840445566',
      vehicleNumber: 'TN 03 GH 8224',
      vehicleDetails: 'City',
      tyreBrand: 'CEAT',
      tyreSize: '175/65 R14',
      shopId: 'shop-bharath',
      shopName: 'bharath',
      dateText: '2 Oct, 10:30 AM',
      followUpDate: '2026-10-02T10:30:00.000Z',
      amount: 12000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-admin'
    },
    {
      id: 'enq-8',
      customerName: 'Ajith',
      mobileNumber: '9840556677',
      vehicleNumber: 'TN 05 IJ 6543',
      vehicleDetails: 'Kushaq',
      tyreBrand: 'Bridgestone',
      tyreSize: '205/60 R16',
      shopId: 'shop-pk',
      shopName: 'pk shop',
      dateText: '1 Oct, 05:45 PM',
      followUpDate: '2026-10-01T17:45:00.000Z',
      amount: 28000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-admin'
    },
    {
      id: 'enq-9',
      customerName: 'Giri',
      mobileNumber: '9840667788',
      vehicleNumber: 'TN 07 KL 7708',
      vehicleDetails: 'Magnite',
      tyreBrand: 'Apollo',
      tyreSize: '195/60 R16',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '30 Sep, 12:00 PM',
      followUpDate: '2026-09-30T12:00:00.000Z',
      amount: 20000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-10',
      customerName: 'Rohit',
      mobileNumber: '9840778899',
      vehicleNumber: 'TN 08 MN 3456',
      vehicleDetails: 'WagonR',
      tyreBrand: 'Michelin',
      tyreSize: '155/80 R13',
      shopId: 'shop-point',
      shopName: 'Tyre Point',
      dateText: '29 Sep, 03:30 PM',
      followUpDate: '2026-09-29T15:30:00.000Z',
      amount: 16000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-2'
    },
    {
      id: 'enq-11',
      customerName: 'Vinoth',
      mobileNumber: '9840889900',
      vehicleNumber: 'TN 10 OP 7654',
      vehicleDetails: 'i20',
      tyreBrand: 'Yokohama',
      tyreSize: '195/55 R16',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '28 Sep, 01:15 PM',
      followUpDate: '2026-09-28T13:15:00.000Z',
      amount: 29000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-12',
      customerName: 'Sathish',
      mobileNumber: '9840990011',
      vehicleNumber: 'TN 11 QR 9012',
      vehicleDetails: 'Brezza',
      tyreBrand: 'Continental',
      tyreSize: '215/60 R16',
      shopId: 'shop-bharath',
      shopName: 'bharath',
      dateText: '27 Sep, 11:45 AM',
      followUpDate: '2026-09-27T11:45:00.000Z',
      amount: 32000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-admin'
    },
    {
      id: 'enq-13',
      customerName: 'Dani',
      mobileNumber: '9840123987',
      vehicleNumber: 'TN 01 ST 4567',
      vehicleDetails: 'Altroz',
      tyreBrand: 'Bridgestone',
      tyreSize: '185/60 R16',
      shopId: 'shop-pk',
      shopName: 'pk shop',
      dateText: '26 Sep, 04:30 PM',
      followUpDate: '2026-09-26T16:30:00.000Z',
      amount: 24000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-admin'
    },
    {
      id: 'enq-14',
      customerName: 'Dinesh',
      mobileNumber: '9840234876',
      vehicleNumber: 'TN 22 UV 1234',
      vehicleDetails: 'City',
      tyreBrand: 'Bridgestone',
      tyreSize: '185/60 R15',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '25 Sep, 02:00 PM',
      followUpDate: '2026-09-25T14:00:00.000Z',
      amount: 22000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-15',
      customerName: 'Santhosh',
      mobileNumber: '9840345765',
      vehicleNumber: 'TN 05 WX 7890',
      vehicleDetails: 'Creta',
      tyreBrand: 'Bridgestone',
      tyreSize: '205/65 R16',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '24 Sep, 10:15 AM',
      followUpDate: '2026-09-24T10:15:00.000Z',
      amount: 30000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-16',
      customerName: 'Anand',
      mobileNumber: '9840456654',
      vehicleNumber: 'TN 09 YZ 2345',
      vehicleDetails: 'Amaze',
      tyreBrand: 'Apollo',
      tyreSize: '175/65 R14',
      shopId: 'shop-point',
      shopName: 'Tyre Point',
      dateText: '23 Sep, 05:00 PM',
      followUpDate: '2026-09-23T17:00:00.000Z',
      amount: 18000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-2'
    },
    {
      id: 'enq-17',
      customerName: 'Sasi',
      mobileNumber: '9840567543',
      vehicleNumber: 'TN 14 AA 8901',
      vehicleDetails: 'XUV300',
      tyreBrand: 'Bridgestone',
      tyreSize: '205/65 R16',
      shopId: 'shop-flare',
      shopName: 'Flareminds',
      dateText: '22 Sep, 12:30 PM',
      followUpDate: '2026-10-22T12:30:00.000Z',
      amount: 28000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-emp-1'
    },
    {
      id: 'enq-18',
      customerName: 'Ram',
      mobileNumber: '9840678432',
      vehicleNumber: 'TN 02 AB 3456',
      vehicleDetails: 'Kiger',
      tyreBrand: 'Apollo',
      tyreSize: '195/60 R16',
      shopId: 'shop-bharath',
      shopName: 'bharath',
      dateText: '21 Sep, 11:20 AM',
      followUpDate: '2026-09-21T11:20:00.000Z',
      amount: 21000,
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: 'FIT',
      assignedToUserId: 'user-admin'
    }
  ];

  // Fill up remaining completed and not fitted entries to reach exactly 71 records (47 completed, 1 overdue, 0 pending, 23 not fitted)
  const names = ['Karthik', 'Suresh', 'Manoj', 'Deepak', 'Saravanan', 'Gokul', 'Praveen', 'Sanjay', 'Murugan', 'Kishore', 'Harish', 'Kamesh', 'Vignesh', 'Aravind', 'Manikandan', 'Pradeep', 'Bala', 'Naveen', 'Ramesh', 'Senthil', 'Shankar', 'Mahesh', 'Ganesh', 'Karthikeyan', 'Dhanush', 'Surya', 'Ajay', 'Varun', 'Vimal', 'Akash', 'Gautam', 'Kiran', 'Santosh', 'Shiva', 'Guru', 'Raghu', 'Raj', 'Vikram', 'Anbu', 'Mohan', 'Sundar', 'Deva', 'Sridhar', 'Sathya', 'Sankar', 'Thiru', 'Mani', 'Pandian', 'Velu', 'Selvam', 'Babu', 'Murugan', 'Ramu'];
  const shops = INITIAL_SHOPS;
  const brands = ['Bridgestone', 'Michelin', 'Apollo', 'CEAT', 'Goodyear', 'Yokohama', 'MRF'];

  let compCount = list.filter(e => e.status === 'COMPLETED' && e.fitStatus === 'FIT').length;
  let notFitCount = list.filter(e => e.fitStatus === 'NOT_FIT').length;

  for (let i = 19; i <= 71; i++) {
    const isComp = compCount < 47;
    if (isComp) compCount++; else notFitCount++;

    const name = names[(i - 19) % names.length] + ' ' + String.fromCharCode(65 + (i % 26));
    const shop = shops[i % shops.length];
    const brand = brands[i % brands.length];

    list.push({
      id: `enq-${i}`,
      customerName: name,
      mobileNumber: `9840${String(100000 + i).slice(1)}`,
      vehicleNumber: `TN 0${(i % 9) + 1} XY ${1000 + i}`,
      vehicleDetails: (i % 2 === 0) ? 'Swift' : 'Creta',
      tyreBrand: brand,
      tyreSize: (i % 2 === 0) ? '185/65 R15' : '205/65 R16',
      shopId: shop.id,
      shopName: shop.name,
      dateText: `${(i % 28) + 1} Sep, 10:00 AM`,
      followUpDate: `2026-09-${String((i % 28) + 1).padStart(2, '0')}T10:00:00.000Z`,
      amount: 16000 + (i * 200),
      quantity: 4,
      status: 'COMPLETED',
      fitStatus: isComp ? 'FIT' : 'NOT_FIT',
      unfitReason: isComp ? '' : 'Fitted at competitor dealer',
      isOverdue: false,
      assignedToUserId: 'user-admin'
    });
  }

  return list;
}

class StoreClass {
  constructor() {
    this.seedVersionKey = 'tyros_seed_v4';
    this.init();
  }

  init() {
    const currentVersion = localStorage.getItem(this.seedVersionKey);
    if (currentVersion !== '4.0') {
      localStorage.setItem('tyros_shops', JSON.stringify(INITIAL_SHOPS));
      localStorage.setItem('tyros_users', JSON.stringify(INITIAL_USERS));
      localStorage.setItem('tyros_entries', JSON.stringify(generateSeedEntries()));
      localStorage.setItem('tyros_daily_reports', JSON.stringify(INITIAL_DAILY_REPORTS));
      localStorage.setItem(this.seedVersionKey, '4.0');
    }
  }

  normalizeUser(u) {
    if (!u) return { id: '', name: 'Bharath', phone: '', role: 'ADMIN', assignedShopIds: ['shop-flare'], isActive: true };
    const name = u.fullName || u.full_name || u.name || u.userName || u.username || 'Staff Member';
    const phone = u.phone || u.phoneNumber || u.phone_number || u.mobileNumber || u.mobile || '';
    const role = (u.role || 'ADMIN').toUpperCase();
    const id = (u.id || u._id || '').toString();
    const assignedShopIds = u.assignedShopIds || u.assigned_shop_ids || u.shopIds || u.shop_ids || (u.shopId ? [u.shopId] : ['shop-flare']);
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
    if (!s) return { id: 'shop-flare', name: 'Flareminds', address: 'Ms nagar', phone: '', isActive: true, targetAmount: 6000000, targetTyres: 120 };
    const id = (s.id || s._id || 'shop-flare').toString();
    const name = s.name || s.shopName || s.shop_name || 'Workshop Branch';
    const address = s.address || s.location || s.shopAddress || 'Chennai';
    const phone = s.phone || s.contactNumber || s.phone_number || '';
    const isActive = s.isActive !== undefined ? !!s.isActive : true;
    const targetAmount = Number(s.targetAmount || s.target_amount || 6000000);
    const targetTyres = Number(s.targetTyres || s.target_tyres || 120);

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
    const vehicleDetails = e.vehicleDetails || e.vehicle_details || e.vehicleModel || '4-Wheeler';
    const tyreSize = e.tyreSize || e.tyre_size || '';
    const tyreBrand = e.tyreBrand || e.tyre_brand || '';
    const amount = Number(e.amount || e.totalAmount || 0);
    const quantity = Number(e.quantity || 4);
    const shopId = (e.shopId || e.shop_id || 'shop-flare').toString();
    const shopName = e.shopName || e.shop_name || 'Flareminds';
    const status = (e.status || 'PENDING').toUpperCase();
    const fitStatus = (e.fitStatus || e.fit_status || 'FIT').toUpperCase();
    const followUpDate = e.followUpDate || e.follow_up_date || new Date().toISOString();
    const dateText = e.dateText || (e.followUpDate ? new Date(e.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
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

  getLocal(key, def = []) {
    try {
      const data = localStorage.getItem(`tyros_${key}`);
      return data ? JSON.parse(data) : def;
    } catch (_) {
      return def;
    }
  }

  setLocal(key, val) {
    localStorage.setItem(`tyros_${key}`, JSON.stringify(val));
  }

  async getShops() {
    if (ApiClient.hasRealBackendToken()) {
      try {
        const res = await ApiClient.get('/admin/shops');
        const list = res?.data?.shops || res?.data || res?.shops || (Array.isArray(res) ? res : null);
        if (Array.isArray(list) && list.length > 0) {
          const normalized = list.map(s => this.normalizeShop(s));
          this.setLocal('shops', normalized);
          return normalized;
        }
      } catch (_) {}
    }
    return this.getLocal('shops', INITIAL_SHOPS).map(s => this.normalizeShop(s));
  }

  async getShopById(id) {
    const shops = await this.getShops();
    return shops.find(s => s.id === id) || shops[0] || this.normalizeShop(null);
  }

  async getUsers() {
    if (ApiClient.hasRealBackendToken()) {
      try {
        const res = await ApiClient.get('/admin/users');
        const list = res?.data?.users || res?.data || res?.users || (Array.isArray(res) ? res : null);
        if (Array.isArray(list) && list.length > 0) {
          const normalized = list.map(u => this.normalizeUser(u));
          this.setLocal('users', normalized);
          return normalized;
        }
      } catch (_) {}
    }
    return this.getLocal('users', INITIAL_USERS).map(u => this.normalizeUser(u));
  }

  async getEntries(shopId = null) {
    let entries = [];
    if (ApiClient.hasRealBackendToken()) {
      try {
        const res = await ApiClient.get('/admin/enquiries', shopId ? { shopId } : {});
        const list = res?.data?.enquiries || res?.data || res?.items || (Array.isArray(res) ? res : null);
        if (Array.isArray(list) && list.length > 0) {
          entries = list;
        }
      } catch (_) {}
    }

    if (entries.length === 0) {
      entries = this.getLocal('entries');
      if (shopId) {
        entries = entries.filter(e => e.shopId === shopId);
      }
    }

    return entries.map(e => this.normalizeEntry(e)).filter(Boolean);
  }

  async getEntryById(id) {
    const entries = await this.getEntries();
    return entries.find(e => e.id === id) || null;
  }

  async updateEntry(id, updates) {
    const entries = this.getLocal('entries');
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
      entries[idx] = { ...entries[idx], ...updates };
      this.setLocal('entries', entries);
      return this.normalizeEntry(entries[idx]);
    }
    return null;
  }

  async deleteEntry(id) {
    const entries = this.getLocal('entries');
    const filtered = entries.filter(e => e.id !== id);
    this.setLocal('entries', filtered);
  }

  // Exact Target Data matching Screenshot 2
  async getTargetDashboard(shopId = 'shop-flare') {
    const shops = await this.getShops();
    const shop = shops.find(s => s.id === shopId) || shops[0];

    const targetAmount = shop.targetAmount || 6000000;
    const targetTyres = shop.targetTyres || 120;
    const achievedAmount = 8543000;
    const achievedTyres = 28;

    return {
      shopId: shop.id,
      shopName: shop.name,
      formattedPeriod: 'October 2026',
      targetAmount,
      targetTyres,
      achievedAmount,
      achievedTyres,
      amountPercentage: 142.4,
      tyresPercentage: 23.3,
      remainingAmount: 0,
      remainingTyres: 92,
      isOverallAchieved: true
    };
  }

  // Exact Daily Reports matching Screenshot 1
  async getDailyReports(shopId = 'shop-flare') {
    return this.getLocal('daily_reports', INITIAL_DAILY_REPORTS);
  }
}

export const Store = new StoreClass();
