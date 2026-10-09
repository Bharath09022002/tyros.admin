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

  // Define exactly 27 unique customer profiles across the 4 shops (matching Flutter Dashboard Screenshot 1: 27 total customers)
  const CUSTOMERS_27 = [
    { name: 'Bharah', phone: '9894169716' },
    { name: 'Yasir', phone: '7894561235' },
    { name: 'Nithesh A K', phone: '7373533278' },
    { name: 'Arun', phone: '9840112233' },
    { name: 'Vijay', phone: '9840223344' },
    { name: 'Jain', phone: '9840334455' },
    { name: 'Ashok', phone: '9840445566' },
    { name: 'Ajith', phone: '9840556677' },
    { name: 'Giri', phone: '9840667788' },
    { name: 'Rohit', phone: '9840778899' },
    { name: 'Vinoth', phone: '9840889900' },
    { name: 'Sathish', phone: '9840990011' },
    { name: 'Dani', phone: '9840123987' },
    { name: 'Dinesh', phone: '9840234876' },
    { name: 'Santhosh', phone: '9840345765' },
    { name: 'Anand', phone: '9840456654' },
    { name: 'Sasi', phone: '9840567543' },
    { name: 'Ram', phone: '9840678432' },
    { name: 'Karthik', phone: '9840789012' },
    { name: 'Suresh', phone: '9840890123' },
    { name: 'Manoj', phone: '9840901234' },
    { name: 'Deepak', phone: '9840012345' },
    { name: 'Saravanan', phone: '9840123456' },
    { name: 'Gokul', phone: '9840234567' },
    { name: 'Praveen', phone: '9840345678' },
    { name: 'Sanjay', phone: '9840456780' },
    { name: 'Harish', phone: '9840567801' }
  ];

  const shops = INITIAL_SHOPS;
  const brands = ['Bridgestone', 'Michelin', 'Apollo', 'CEAT', 'Goodyear', 'Yokohama', 'MRF'];
  const models = ['Swift', 'Creta', 'i20', 'City', 'Brezza', 'Nexon', 'Seltos', 'Baleno'];

  // Entries 1-18 already in list (1 overdue, 1 not fitted, 16 completed)
  let compCount = list.filter(e => e.status === 'COMPLETED' && e.fitStatus === 'FIT').length;
  let notFitCount = list.filter(e => e.fitStatus === 'NOT_FIT').length;

  // Entries 19 to 71: repeat visits & purchases by the same 27 customers
  // Total breakdown across all 71: 47 Completed, 1 Overdue, 0 Pending, 23 Not Fitted
  for (let i = 19; i <= 71; i++) {
    const isComp = compCount < 47;
    if (isComp) compCount++; else notFitCount++;

    const cust = CUSTOMERS_27[(i - 1) % CUSTOMERS_27.length];
    const shop = shops[i % shops.length];
    const brand = brands[i % brands.length];
    const model = models[i % models.length];

    list.push({
      id: `enq-${i}`,
      customerName: cust.name,
      mobileNumber: cust.phone,
      vehicleNumber: `TN 0${(i % 9) + 1} XY ${1000 + i}`,
      vehicleDetails: model,
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

const INITIAL_TYRE_BRANDS = [
  'Bridgestone', 'Apollo', 'Michelin', 'MRF', 'CEAT',
  'Goodyear', 'Yokohama', 'Continental', 'JK Tyre', 'Pirelli',
  'Hankook', 'Falken', 'Firestone', 'Kumho', 'Nexen',
  'Toyo', 'Maxxis', 'TVS Eurogrip', 'BKT', 'Kelly',
  'Dunlop', 'Birla'
].map((name, idx) => ({
  id: `tb-${idx + 1}`,
  name,
  isActive: true
}));

const INITIAL_CAR_BRANDS = [
  'Audi', 'BMW', 'BYD', 'Bajaj', 'Citroen',
  'Honda', 'Hyundai', 'Tata', 'Mahindra', 'Maruti Suzuki',
  'Toyota', 'Kia', 'Volkswagen', 'Skoda', 'MG',
  'Renault', 'Nissan', 'Ford', 'Jeep'
].map((name, idx) => ({
  id: `cb-${idx + 1}`,
  name,
  isActive: true
}));

const CAR_MODELS_RAW = [
  { brand: 'Audi', models: ['A4', 'A6', 'Q3', 'Q5', 'Q7'] },
  { brand: 'BMW', models: ['3 Series', '5 Series', 'X1', 'X3', 'X5'] },
  { brand: 'BYD', models: ['Atto 3', 'Seal', 'e6'] },
  { brand: 'Bajaj', models: ['Qute'] },
  { brand: 'Citroen', models: ['C3', 'C3 Aircross', 'C5 Aircross', 'Basalt'] },
  { brand: 'Honda', models: ['City', 'Amaze', 'Elevate', 'WR-V', 'Jazz', 'Civic', 'CR-V'] },
  { brand: 'Hyundai', models: ['Creta', 'i20', 'Venue', 'Verna', 'Grand i10 Nios', 'Aura', 'Alcazar', 'Tucson', 'Exter', 'Santro'] },
  { brand: 'Tata', models: ['Nexon', 'Punch', 'Altroz', 'Tiago', 'Safari', 'Harrier', 'Tigor', 'Curvv'] },
  { brand: 'Mahindra', models: ['Thar', 'Scorpio-N', 'Scorpio Classic', 'XUV700', 'XUV300', 'Bolero', 'Bolero Neo', 'XUV 3XO'] },
  { brand: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'Dzire', 'Ertiga', 'WagonR', 'Alto K10', 'Fronx', 'Grand Vitara', 'Ciaz', 'XL6', 'Jimny'] },
  { brand: 'Toyota', models: ['Innova Crysta', 'Innova Hycross', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza', 'Rumion', 'Hilux', 'Camry', 'Vellfire'] },
  { brand: 'Kia', models: ['Seltos', 'Sonet', 'Carens', 'EV6', 'Carnival'] },
  { brand: 'Volkswagen', models: ['Virtus', 'Taigun', 'Polo', 'Vento', 'Tiguan'] },
  { brand: 'Skoda', models: ['Slavia', 'Kushaq', 'Octavia', 'Superb', 'Kodiaq'] },
  { brand: 'MG', models: ['Hector', 'Astor', 'ZS EV', 'Comet EV', 'Gloster'] },
  { brand: 'Renault', models: ['Kwid', 'Triber', 'Kiger', 'Duster'] },
  { brand: 'Nissan', models: ['Magnite', 'Kicks', 'Sunny', 'X-Trail'] },
  { brand: 'Ford', models: ['EcoSport', 'Endeavour', 'Figo', 'Aspire'] },
  { brand: 'Jeep', models: ['Compass', 'Meridian', 'Wrangler', 'Grand Cherokee'] }
];

function generateCarModels108() {
  const models = [];
  let idCount = 1;
  for (const group of CAR_MODELS_RAW) {
    for (const m of group.models) {
      models.push({
        id: `cm-${idCount++}`,
        name: m,
        brandName: group.brand,
        isActive: true
      });
    }
  }
  return models;
}

function generateTyreSizes348() {
  const seeds = [
    '135/70R12', '145/70R12', '145/70R13', '145/80R12', '145/80R13',
    '155/65R12', '155/65R13', '155/65R14', '155/70R13', '155/80R13',
    '165/65R13', '165/65R14', '165/70R13', '165/70R14', '165/80R14',
    '175/65R14', '175/65R15', '175/70R13', '175/70R14', '185/60R14',
    '185/60R15', '185/65R14', '185/65R15', '185/70R14', '195/55R16',
    '195/60R15', '195/60R16', '195/65R15', '205/55R16', '205/60R16',
    '205/65R15', '205/65R16', '215/55R17', '215/60R16', '215/60R17',
    '215/65R16', '215/75R15', '225/55R18', '225/60R17', '225/60R18',
    '235/60R18', '235/65R17', '235/70R16', '245/45R18', '255/55R18'
  ];
  const set = new Set(seeds);
  const widths = [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285];
  const profiles = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
  const rims = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  for (const w of widths) {
    for (const p of profiles) {
      for (const r of rims) {
        if (set.size >= 348) break;
        set.add(`${w}/${p}R${r}`);
      }
      if (set.size >= 348) break;
    }
    if (set.size >= 348) break;
  }
  return Array.from(set).slice(0, 348).map((sz, idx) => ({
    id: `ts-${idx + 1}`,
    size: sz,
    isActive: true
  }));
}

const INITIAL_MONTHLY_TARGETS = {
  all: {
    shopId: 'all',
    shopName: 'All Shops',
    period: 'OCTOBER 2026',
    month: 'October',
    year: '2026',
    daysLeft: 22,
    revenueAchieved: 19343000,
    revenueTarget: 1500000,
    revenuePercentage: 1868.6,
    tyreAchieved: 195,
    tyreTarget: 100,
    tyrePercentage: 195.0,
    services: [
      { name: '2W Enquiry', achieved: 0, target: 25, percentage: 0 },
      { name: '2W Alignment', achieved: 0, target: 25, percentage: 0 },
      { name: 'Wheel Alignment', achieved: 0, target: 25, percentage: 0 }
    ]
  },
  'shop-flare': {
    shopId: 'shop-flare',
    shopName: 'Flareminds',
    period: 'OCTOBER 2026',
    month: 'October',
    year: '2026',
    daysLeft: 22,
    revenueAchieved: 8543000,
    revenueTarget: 600000,
    revenuePercentage: 1423.8,
    tyreAchieved: 82,
    tyreTarget: 40,
    tyrePercentage: 205.0,
    services: [
      { name: '2W Enquiry', achieved: 0, target: 10, percentage: 0 },
      { name: '2W Alignment', achieved: 0, target: 10, percentage: 0 },
      { name: 'Wheel Alignment', achieved: 0, target: 10, percentage: 0 }
    ]
  },
  'shop-point': {
    shopId: 'shop-point',
    shopName: 'Tyre Point',
    period: 'OCTOBER 2026',
    month: 'October',
    year: '2026',
    daysLeft: 22,
    revenueAchieved: 5200000,
    revenueTarget: 400000,
    revenuePercentage: 1300.0,
    tyreAchieved: 54,
    tyreTarget: 30,
    tyrePercentage: 180.0,
    services: [
      { name: '2W Enquiry', achieved: 0, target: 8, percentage: 0 },
      { name: '2W Alignment', achieved: 0, target: 8, percentage: 0 },
      { name: 'Wheel Alignment', achieved: 0, target: 8, percentage: 0 }
    ]
  },
  'shop-tyros': {
    shopId: 'shop-tyros',
    shopName: 'Tyros Anna Nagar',
    period: 'OCTOBER 2026',
    month: 'October',
    year: '2026',
    daysLeft: 22,
    revenueAchieved: 3400000,
    revenueTarget: 300000,
    revenuePercentage: 1133.3,
    tyreAchieved: 36,
    tyreTarget: 20,
    tyrePercentage: 180.0,
    services: [
      { name: '2W Enquiry', achieved: 0, target: 5, percentage: 0 },
      { name: '2W Alignment', achieved: 0, target: 5, percentage: 0 },
      { name: 'Wheel Alignment', achieved: 0, target: 5, percentage: 0 }
    ]
  },
  'shop-bharath': {
    shopId: 'shop-bharath',
    shopName: 'bharath',
    period: 'OCTOBER 2026',
    month: 'October',
    year: '2026',
    daysLeft: 22,
    revenueAchieved: 2200000,
    revenueTarget: 200000,
    revenuePercentage: 1100.0,
    tyreAchieved: 23,
    tyreTarget: 10,
    tyrePercentage: 230.0,
    services: [
      { name: '2W Enquiry', achieved: 0, target: 2, percentage: 0 },
      { name: '2W Alignment', achieved: 0, target: 2, percentage: 0 },
      { name: 'Wheel Alignment', achieved: 0, target: 2, percentage: 0 }
    ]
  }
};

class StoreClass {
  constructor() {
    this.seedVersionKey = 'tyros_seed_v7';
    this.init();
  }

  init() {
    const currentVersion = localStorage.getItem(this.seedVersionKey);
    if (currentVersion !== '7.0') {
      localStorage.setItem('tyros_shops', JSON.stringify(INITIAL_SHOPS));
      localStorage.setItem('tyros_users', JSON.stringify(INITIAL_USERS));
      localStorage.setItem('tyros_entries', JSON.stringify(generateSeedEntries()));
      localStorage.setItem('tyros_daily_reports', JSON.stringify(INITIAL_DAILY_REPORTS));
      localStorage.setItem('tyros_tyre_sizes', JSON.stringify(generateTyreSizes348()));
      localStorage.setItem('tyros_tyre_brands', JSON.stringify(INITIAL_TYRE_BRANDS));
      localStorage.setItem('tyros_car_brands', JSON.stringify(INITIAL_CAR_BRANDS));
      localStorage.setItem('tyros_car_models', JSON.stringify(generateCarModels108()));
      localStorage.setItem('tyros_monthly_targets', JSON.stringify(INITIAL_MONTHLY_TARGETS));
      localStorage.setItem(this.seedVersionKey, '7.0');
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

  // Exact Target Data matching Screenshot 3
  async getTargetDashboard(shopId = 'shop-flare') {
    const shops = await this.getShops();
    const shop = shops.find(s => s.id === shopId) || shops[0];

    let targetAmount = shop.targetAmount || 6000000;
    let targetTyres = shop.targetTyres || 120;
    let achievedAmount = 8543000;
    let achievedTyres = 28;

    if (ApiClient.hasRealBackendToken()) {
      try {
        const res = await ApiClient.get('/admin/targets/current', { shopId: shop.id });
        const d = res?.data || res?.target || res;
        if (d) {
          if (d.targetAmount) targetAmount = Number(d.targetAmount);
          if (d.targetTyres) targetTyres = Number(d.targetTyres);
          if (d.achievedAmount !== undefined) achievedAmount = Number(d.achievedAmount);
          if (d.achievedTyres !== undefined) achievedTyres = Number(d.achievedTyres);
        }
      } catch (_) {}
    }

    const amountPercentage = targetAmount > 0 ? parseFloat(((achievedAmount / targetAmount) * 100).toFixed(1)) : 142.4;
    const tyresPercentage = targetTyres > 0 ? parseFloat(((achievedTyres / targetTyres) * 100).toFixed(1)) : 23.3;
    const remainingTyres = Math.max(0, targetTyres - achievedTyres);
    const remainingAmount = Math.max(0, targetAmount - achievedAmount);

    return {
      shopId: shop.id,
      shopName: shop.name,
      formattedPeriod: 'October 2026',
      targetAmount,
      targetTyres,
      achievedAmount,
      achievedTyres,
      amountPercentage,
      tyresPercentage,
      remainingAmount,
      remainingTyres,
      isOverallAchieved: achievedAmount >= targetAmount && achievedTyres >= targetTyres
    };
  }

  // Exact Daily Reports matching Screenshot 4
  async getDailyReports(shopId = 'shop-flare') {
    if (ApiClient.hasRealBackendToken()) {
      try {
        const res = await ApiClient.get('/daily-reports', { shopId });
        const list = res?.data?.reports || res?.data || res?.items || (Array.isArray(res) ? res : null);
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      } catch (_) {}
    }
    return this.getLocal('daily_reports', INITIAL_DAILY_REPORTS);
  }

  // ==========================================
  // Tyre Sizes Catalog
  // ==========================================
  async getTyreSizes() {
    return this.getLocal('tyre_sizes', generateTyreSizes348());
  }

  async toggleTyreSize(id) {
    const list = await this.getTyreSizes();
    const item = list.find(s => s.id === id);
    if (item) {
      item.isActive = !item.isActive;
      this.setLocal('tyre_sizes', list);
    }
    return item;
  }

  async updateTyreSize(id, newSize) {
    const list = await this.getTyreSizes();
    const item = list.find(s => s.id === id);
    if (item) {
      item.size = newSize.trim();
      this.setLocal('tyre_sizes', list);
    }
    return item;
  }

  async addTyreSize(sizeStr) {
    const list = await this.getTyreSizes();
    const newItem = {
      id: `ts-${Date.now()}`,
      size: sizeStr.trim(),
      isActive: true
    };
    list.unshift(newItem);
    this.setLocal('tyre_sizes', list);
    return newItem;
  }

  // ==========================================
  // Tyre Brands Catalog
  // ==========================================
  async getTyreBrands() {
    return this.getLocal('tyre_brands', INITIAL_TYRE_BRANDS);
  }

  async toggleTyreBrand(id) {
    const list = await this.getTyreBrands();
    const item = list.find(b => b.id === id);
    if (item) {
      item.isActive = !item.isActive;
      this.setLocal('tyre_brands', list);
    }
    return item;
  }

  async updateTyreBrand(id, newName) {
    const list = await this.getTyreBrands();
    const item = list.find(b => b.id === id);
    if (item) {
      item.name = newName.trim();
      this.setLocal('tyre_brands', list);
    }
    return item;
  }

  async addTyreBrand(name) {
    const list = await this.getTyreBrands();
    const newItem = {
      id: `tb-${Date.now()}`,
      name: name.trim(),
      isActive: true
    };
    list.unshift(newItem);
    this.setLocal('tyre_brands', list);
    return newItem;
  }

  // ==========================================
  // Car Brands Catalog
  // ==========================================
  async getCarBrands() {
    return this.getLocal('car_brands', INITIAL_CAR_BRANDS);
  }

  async toggleCarBrand(id) {
    const list = await this.getCarBrands();
    const item = list.find(b => b.id === id);
    if (item) {
      item.isActive = !item.isActive;
      this.setLocal('car_brands', list);
    }
    return item;
  }

  async updateCarBrand(id, newName) {
    const list = await this.getCarBrands();
    const item = list.find(b => b.id === id);
    if (item) {
      item.name = newName.trim();
      this.setLocal('car_brands', list);
    }
    return item;
  }

  async addCarBrand(name) {
    const list = await this.getCarBrands();
    const newItem = {
      id: `cb-${Date.now()}`,
      name: name.trim(),
      isActive: true
    };
    list.unshift(newItem);
    this.setLocal('car_brands', list);
    return newItem;
  }

  // ==========================================
  // Car Models Catalog
  // ==========================================
  async getCarModels() {
    return this.getLocal('car_models', generateCarModels108());
  }

  async toggleCarModel(id) {
    const list = await this.getCarModels();
    const item = list.find(m => m.id === id);
    if (item) {
      item.isActive = !item.isActive;
      this.setLocal('car_models', list);
    }
    return item;
  }

  async updateCarModel(id, newName, brandName) {
    const list = await this.getCarModels();
    const item = list.find(m => m.id === id);
    if (item) {
      if (newName) item.name = newName.trim();
      if (brandName) item.brandName = brandName.trim();
      this.setLocal('car_models', list);
    }
    return item;
  }

  async addCarModel(name, brandName) {
    const list = await this.getCarModels();
    const newItem = {
      id: `cm-${Date.now()}`,
      name: name.trim(),
      brandName: brandName ? brandName.trim() : 'Other',
      isActive: true
    };
    list.unshift(newItem);
    this.setLocal('car_models', list);
    return newItem;
  }

  // ==========================================
  // Monthly Target Progress Data
  // ==========================================
  async getMonthlyTargetData(shopId = 'all') {
    const targetsMap = this.getLocal('monthly_targets', INITIAL_MONTHLY_TARGETS);
    if (targetsMap[shopId]) {
      return targetsMap[shopId];
    }
    return targetsMap['all'] || INITIAL_MONTHLY_TARGETS.all;
  }

  async updateMonthlyTarget(shopId, targetAmount, targetTyres, serviceTargets = null) {
    const targetsMap = this.getLocal('monthly_targets', INITIAL_MONTHLY_TARGETS);
    const target = targetsMap[shopId] || { ...INITIAL_MONTHLY_TARGETS.all, shopId };

    if (targetAmount !== undefined && targetAmount !== null && !isNaN(targetAmount)) {
      target.revenueTarget = Number(targetAmount);
      target.revenuePercentage = target.revenueTarget > 0 ? parseFloat(((target.revenueAchieved / target.revenueTarget) * 100).toFixed(1)) : 0;
    }
    if (targetTyres !== undefined && targetTyres !== null && !isNaN(targetTyres)) {
      target.tyreTarget = Number(targetTyres);
      target.tyrePercentage = target.tyreTarget > 0 ? parseFloat(((target.tyreAchieved / target.tyreTarget) * 100).toFixed(1)) : 0;
    }
    if (serviceTargets) {
      target.services = serviceTargets;
    }

    targetsMap[shopId] = target;
    this.setLocal('monthly_targets', targetsMap);
    return target;
  }
}

export const Store = new StoreClass();
