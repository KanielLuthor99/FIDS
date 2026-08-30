export interface HardwarePreset {
  brand: string;
  model: string;
  specs: string;
}

export const SWAP_REASONS = [
  'Unit Mengalami Kerusakan Hardware (No Display / Mati Total)',
  'Motherboard Korslet / Burn Out',
  'Panel Bergaris Vertikal / Horizontal',
  'Backlight Redup / Tidak Menyala',
  'Power Supply Unit (PSU) Rusak',
  'SSD / Storage Failure (Tidak Boot)',
  'Port LAN / Display Rusak / Tidak Terdeteksi',
  'Layar Retak / Pecah Fisik',
  'Overheating — Sistem Tidak Stabil',
  'Preventive Replacement (Rotasi Berkala)',
  'Lainnya (Isi Manual)',
];

export const DISPOSAL_OPTIONS = [
  { value: 'RMA Servis (Bengkel IT / Vendor)', label: '🔧 Masuk Servis — Kirim ke Bengkel IT / Vendor RMA' },
  { value: 'Simpan Gudang (Unit Cadangan Backup)', label: '📦 Simpan Gudang — Unit Masih Bisa Dipakai' },
  { value: 'Afkir / Rusak Total (Scrapped)', label: '🗑️ Afkir / Scrap — Rusak Total, Tidak Bisa Diperbaiki' },
];

export const PRESET_MINI_PC: HardwarePreset[] = [
  { brand: 'HP', model: 'Thin Client Elite t655', specs: 'AMD Ryzen R2314, 8GB DDR4, 64GB NVMe SSD, Win 10/11 IoT' },
  { brand: 'HP', model: 'Thin Client t640', specs: 'AMD Ryzen R1505G, 8GB DDR4, 64GB M.2 SSD, Win 10 IoT' },
  { brand: 'HP', model: 'Thin Client t630', specs: 'AMD GX-420GI, 4GB RAM, 32GB Flash, Win 10' },
  { brand: 'Intel NUC', model: 'NUC 7i3BNH', specs: 'Intel Core i3-7100U, 4GB RAM, 500GB HDD/SSD, Lubuntu/Win 10' },
  { brand: 'Intel NUC', model: 'NUC 14MNK-B2', specs: 'Intel Core 3 / Ultra, 8GB DDR5, 128GB SSD, Win 11' },
  { brand: 'Intel NUC', model: 'NUC 5CPYH', specs: 'Intel Celeron N3050, 4GB RAM, 128GB SSD' },
  { brand: 'Asus', model: 'VC65', specs: 'Intel Core i3/i5, 4GB DDR3, 500GB HDD' },
  { brand: 'CGEAR', model: 'D945GSEJT', specs: 'Intel Atom N270, 2GB RAM, 500GB HDD, Lubuntu' },
  { brand: 'Cycrone', model: 'MPC X3700', specs: 'Intel Celeron, 2GB RAM, 32GB SSD, Lubuntu' },
  { brand: 'Fujitech', model: 'Smart PC', specs: 'Intel Dual Core, 4GB RAM, 64GB SSD' },
  { brand: 'Gigabyte', model: 'GB-BSi3H-6100', specs: 'Intel Core i3-6100U, 4GB RAM, 128GB SSD' },
  { brand: 'Giada', model: 'Signage Player D68', specs: 'Intel Core i3-1115G4, 8GB DDR4, 128GB SSD' },
  { brand: 'Lenovo', model: 'ThinkEdge SE10', specs: 'Intel Atom x6211E, 4GB RAM, 64GB eMMC' },
  { brand: 'Dell', model: 'Wyse N07D001', specs: 'AMD G-Series T48E, 2GB RAM, 8GB Flash' },
  { brand: 'Zotac', model: 'ZBOX', specs: 'Intel Celeron / Core i3, 4GB RAM, 64GB SSD' },
  { brand: 'Minix', model: 'NEO Z64-W10', specs: 'Intel Atom Z3735F, 2GB RAM, 32GB eMMC, Win 10' },
];

export const PRESET_MONITORS: HardwarePreset[] = [
  { brand: 'LG', model: '43SM5KD-BH', specs: '43 Inch Full HD, IPS 450 nits, 24/7 Commercial Display' },
  { brand: 'LG', model: '43SM5KE-BJ', specs: '43 Inch Full HD, IPS 450 nits, 24/7 Commercial Signage' },
  { brand: 'LG', model: '43SM5KE-B', specs: '43 Inch Full HD, IPS 450 nits, 24/7 Commercial Signage' },
  { brand: 'LG', model: '43UH5F', specs: '43 Inch UHD 4K Commercial Signage, 24/7 Operation' },
  { brand: 'LG', model: '49SE3KD', specs: '49 Inch Full HD, IPS 350 nits, 18/7 Operation' },
  { brand: 'LG', model: '55UH5C', specs: '55 Inch Ultra HD 4K, 500 nits, 24/7 Commercial Display' },
  { brand: 'LG', model: '65UH5C', specs: '65 Inch Ultra HD 4K, 500 nits, 24/7 Commercial Display' },
  { brand: 'LG', model: '65UH5C-BF', specs: '65 Inch Ultra HD 4K, 500 nits, 24/7 Commercial Signage' },
  { brand: 'LG', model: '75XF3C', specs: '75 Inch Ultra HD 4K, High Brightness 3000 nits, 24/7' },
  { brand: 'BOE', model: 'LDV 43AAAXX', specs: '43 Inch Full HD Commercial Display Panel' },
  { brand: 'BOE', model: 'SR75AA', specs: '75 Inch 4K UHD Commercial Display Panel' },
  { brand: 'Samsung', model: 'QM75C', specs: '75 Inch 4K UHD 500 nits, Non-glare, 24/7 Commercial' },
  { brand: 'Samsung', model: 'QM65C', specs: '65 Inch 4K UHD 500 nits, Non-glare, 24/7 Commercial' },
  { brand: 'Samsung', model: 'QM55B', specs: '55 Inch 4K UHD 500 nits, Non-glare, 24/7 Commercial' },
  { brand: 'Samsung', model: 'QM43B', specs: '43 Inch 4K UHD 500 nits, Non-glare, 24/7 Commercial' },
  { brand: 'Samsung', model: 'QB55R', specs: '55 Inch 4K UHD 350 nits, 16/7 Operation' },
  { brand: 'Samsung', model: 'PM55H', specs: '55 Inch Full HD 500 nits, 24/7 Commercial Display' },
  { brand: 'Philips', model: '65BDL3052E', specs: '65 Inch 4K UHD Signage Display' },
];

export const WAREHOUSE_LOCATIONS = [
  'Gudang T3 Central - Rak PC-01',
  'Gudang T3 Central - Storage Area C',
  'Workshop T2 - Rak B-01',
  'Workshop T2 - Rak Display',
  'Workshop T1 - Rak A-02',
  'Workshop T1 - Rak Display',
  'Workshop PSIT - Meja Servis',
  'Vendor LG Service Center',
  'Gudang T3 - Area Afkir',
];
