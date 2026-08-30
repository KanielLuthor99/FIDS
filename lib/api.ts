// Client-side API client connecting to Go Gin Gonic Backend (http://localhost:8080)

const API_BASE = 'http://localhost:8080/api/v1';

export interface UserSession {
  id: string;
  name: string;
  role: string;
  username: string;
  avatar: string;
  token: string;
}

export interface FIDSAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  location_area: string;
  terminal: string;
  zone: string;
  ip_address: string;
  status: 'Active' | 'Maintenance' | 'In Storage';
  health_score: number;

  // Backward compatibility fields
  brand?: string;
  serial_number?: string;
  
  // Mini PC Hardware Attributes
  mini_pc_origin?: string;
  mini_pc_brand?: string;
  mini_pc_model?: string;
  mini_pc_sn?: string;
  mini_pc_ports?: string;
  mini_pc_disk?: string;
  mini_pc_ram?: string;
  mini_pc_os?: string;
  mini_pc_year?: string;
  mini_pc_condition?: string;
  mini_pc_warranty?: string;

  // Monitor Attributes
  monitor_origin?: string;
  monitor_brand?: string;
  monitor_model?: string;
  monitor_sn?: string;
  monitor_ports?: string;
  monitor_size?: string;
  monitor_year?: string;
  monitor_condition?: string;
  monitor_warranty?: string;
  monitor_converter?: string;

  last_update: string;
}

export interface MapPin {
  asset_id: string;
  code: string;
  name: string;
  category: string;
  terminal: string;
  location_area: string;
  status: 'Active' | 'Maintenance' | 'In Storage';
  health_score: number;
  x_percent: number;
  y_percent: number;
}

export interface ReplacementHistory {
  id: string;
  asset_id: string;
  asset_code: string;
  asset_name: string;
  terminal: string;
  location_area: string;
  component_type: 'Mini PC' | 'Monitor';
  old_brand: string;
  old_model: string;
  old_sn: string;
  old_origin?: string;      // asal pengadaan unit lama
  old_disposal?: string;    // disposisi unit lama: RMA / Afkir / Simpan
  old_disposal_loc?: string; // lokasi tujuan unit lama
  new_brand: string;
  new_model: string;
  new_sn: string;
  new_origin?: string;      // asal pengadaan unit baru
  reason: string;
  old_status: string;
  technician_name: string;
  replaced_at: string;
}

export interface MaintenanceLog {
  id: string;
  asset_id: string;
  asset_code: string;
  asset_name: string;
  terminal: string;
  target_component: 'Mini PC' | 'Monitor' | 'Sepaket';
  type: 'Corrective' | 'Preventive' | 'Component Swap';
  description: string;
  spare_parts_used: string;
  documentation_photo?: string;
  new_component_sn?: string;
  new_component_model?: string;
  health_before: number;
  health_after: number;
  created_at: string;
}

export interface DashboardMetrics {
  target_sla: number;
  actual_sla: number;
  avg_health_score: number;
  total_assets: number;
  active_assets: number;
  need_service: number;
  in_storage_assets: number;
  total_logs_count: number;

  total_mini_pcs: number;
  active_mini_pcs: number;
  maintenance_mini_pcs: number;
  total_monitors: number;
  active_monitors: number;
  maintenance_monitors: number;
}

const FALLBACK_METRICS: DashboardMetrics = {
  target_sla: 99.8,
  actual_sla: 99.85,
  avg_health_score: 93.4,
  total_assets: 1318,
  active_assets: 1245,
  need_service: 52,
  in_storage_assets: 21,
  total_logs_count: 14,
  total_mini_pcs: 1318,
  active_mini_pcs: 1250,
  maintenance_mini_pcs: 68,
  total_monitors: 1318,
  active_monitors: 1248,
  maintenance_monitors: 70
};

const FALLBACK_ASSETS: FIDSAsset[] = [
  {
    id: "ast-t1t2-4",
    code: "FIDS-1A-001",
    name: "FIDS - Display 001",
    category: "Master Departure",
    location_area: "General Departure T1A",
    terminal: "1A",
    zone: "Departure",
    ip_address: "172.17.26.30",
    status: "Active",
    health_score: 100,
    mini_pc_origin: "China", mini_pc_brand: "HP", mini_pc_model: "Thin Client Elite t655", mini_pc_sn: "8CG5080SDG",
    mini_pc_ports: "DP dan VGA", mini_pc_disk: "58 GB", mini_pc_ram: "8GB", mini_pc_os: "Win 10", mini_pc_year: "2025", mini_pc_condition: "100%",
    monitor_origin: "Korea", monitor_brand: "LG", monitor_model: "75XF3C", monitor_sn: "807KCRNND398", monitor_size: "75\"",
    monitor_year: "2018", monitor_condition: "100%", monitor_converter: "VGA TO HDMI",
    last_update: new Date().toISOString()
  },
  {
    id: "ast-t1t2-5",
    code: "FIDS-1A-002",
    name: "FIDS - Display 002",
    category: "Master Departure",
    location_area: "Departure Pintu Awak T1A",
    terminal: "1A",
    zone: "Departure",
    ip_address: "172.17.26.31",
    status: "Active",
    health_score: 70,
    mini_pc_origin: "China", mini_pc_brand: "CGEAR", mini_pc_model: "D945GSEJT", mini_pc_sn: "Filled By O.E.M",
    mini_pc_ports: "3 USB, 1 LAN, 1 DVI, 1 VGA", mini_pc_disk: "500GB", mini_pc_ram: "2GB", mini_pc_os: "Lubuntu", mini_pc_year: "2012", mini_pc_condition: "70%",
    monitor_origin: "Korea", monitor_brand: "LG", monitor_model: "65UH5C", monitor_sn: "805KCASKY160", monitor_size: "65\"",
    monitor_year: "2018", monitor_condition: "100%", monitor_converter: "VGA TO HDMI",
    last_update: new Date().toISOString()
  },
  {
    id: "ast-t3-3",
    code: "FIDS-T3-001",
    name: "FIDS T3 Display #1",
    category: "Master Departure",
    location_area: "General Departure Curbside Pintu 1 T3",
    terminal: "3U-INT",
    zone: "Departure",
    ip_address: "172.17.149.30",
    status: "Maintenance",
    health_score: 50,
    mini_pc_origin: "China", mini_pc_brand: "HP", mini_pc_model: "Thin Client Elite t655", mini_pc_sn: "8CG5080SD5",
    mini_pc_ports: "1 VGA, 3 DP, 6 USB Type A, 1 LAN", mini_pc_disk: "60 GB", mini_pc_ram: "8 GB", mini_pc_os: "Windows 10", mini_pc_year: "2025", mini_pc_condition: "50%",
    monitor_origin: "Korea", monitor_brand: "LG", monitor_model: "65LS33A", monitor_sn: "111INSE01222", monitor_size: "65\"",
    monitor_year: "2014", monitor_condition: "70%", monitor_converter: "DP TO HDMI",
    last_update: new Date().toISOString()
  }
];

const FALLBACK_PINS: MapPin[] = [
  { asset_id: "ast-t1t2-4", code: "FIDS-1A-001", name: "FIDS - Display 001", category: "Master Departure", terminal: "1A", location_area: "General Departure T1A", status: "Active", health_score: 100, x_percent: 28.5, y_percent: 32.0 },
  { asset_id: "ast-t3-3", code: "FIDS-T3-001", name: "FIDS T3 Display #1", category: "Master Departure", terminal: "3U-INT", location_area: "General Departure Curbside Pintu 1 T3", status: "Maintenance", health_score: 50, x_percent: 62.0, y_percent: 22.5 },
];

const FALLBACK_LOGS: MaintenanceLog[] = [
  {
    id: "LOG-2026-001", asset_id: "ast-t3-3", asset_code: "FIDS-T3-001", asset_name: "Baggage Breakdown 01",
    terminal: "3U-INT", target_component: "Monitor", type: "Corrective",
    description: "Pemeriksaan teknis dan pembersihan port hardware.", spare_parts_used: "N/A",
    documentation_photo: "",
    health_before: 20, health_after: 80, created_at: new Date(Date.now() - 3*3600000).toISOString()
  },
  {
    id: "LOG-2026-002", asset_id: "ast-t1t2-5", asset_code: "FIDS-1A-002", asset_name: "Baggage Breakdown 04",
    terminal: "1A", target_component: "Monitor", type: "Component Swap",
    description: "Penggantian unit Commercial Display 65\".", spare_parts_used: "Display Panel LG 65UH5C",
    documentation_photo: "",
    new_component_sn: "805KCASKY160-NEW", new_component_model: "LG 65UH5C-v2",
    health_before: 40, health_after: 95, created_at: new Date(Date.now() - 12*3600000).toISOString()
  }
];

async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    let res = await fetch(url, { signal: controller.signal }).catch(() => null);

    if (!res || !res.ok) {
      const altUrl = url.includes(':8080')
        ? url.replace(':8080', ':8088')
        : url.replace(':8088', ':8080');
      res = await fetch(altUrl, { signal: controller.signal }).catch(() => null);
    }

    clearTimeout(timeoutId);
    if (!res || !res.ok) throw new Error('API Error');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return fallbackData;
  }
}

export async function apiLogin(role = 'Operator'): Promise<UserSession> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Admin' })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.user.id,
        name: 'Operator FIDS',
        role: 'Operator',
        username: 'operator.fids',
        avatar: data.user.avatar,
        token: data.token
      };
    }
  } catch (e) {
    // Fallback
  }

  return {
    id: 'usr-001',
    name: 'Operator FIDS',
    role: 'Operator',
    username: 'operator.fids',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    token: 'mock-jwt-token-' + Date.now()
  };
}

export async function apiGetMetrics(): Promise<DashboardMetrics> {
  return fetchWithFallback(`${API_BASE}/dashboard/metrics`, FALLBACK_METRICS);
}

export async function apiGetAssets(q = '', status = '', terminal = ''): Promise<FIDSAsset[]> {
  const url = `${API_BASE}/assets?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&terminal=${encodeURIComponent(terminal)}`;
  const data = await fetchWithFallback<FIDSAsset[]>(url, FALLBACK_ASSETS);
  
  return data.filter(a => {
    if (status && status !== 'All' && a.status !== status) return false;
    if (terminal && terminal !== 'All' && !a.terminal.toLowerCase().includes(terminal.toLowerCase())) return false;
    if (q) {
      const query = q.toLowerCase();
      const match = a.code.toLowerCase().includes(query) ||
                    a.name.toLowerCase().includes(query) ||
                    (a.location_area && a.location_area.toLowerCase().includes(query)) ||
                    (a.ip_address && a.ip_address.toLowerCase().includes(query)) ||
                    (a.mini_pc_brand && a.mini_pc_brand.toLowerCase().includes(query)) ||
                    (a.mini_pc_model && a.mini_pc_model.toLowerCase().includes(query)) ||
                    (a.monitor_brand && a.monitor_brand.toLowerCase().includes(query)) ||
                    (a.monitor_sn && a.monitor_sn.toLowerCase().includes(query)) ||
                    (a.mini_pc_sn && a.mini_pc_sn.toLowerCase().includes(query));
      if (!match) return false;
    }
    return true;
  });
}

export async function apiGetPins(terminal = 'Terminal 3'): Promise<MapPin[]> {
  const url = `${API_BASE}/map/pins?terminal=${encodeURIComponent(terminal)}`;
  const pins = await fetchWithFallback<MapPin[]>(url, FALLBACK_PINS);
  if (terminal && terminal !== 'All') {
    return pins.filter(p => p.terminal.toLowerCase().includes(terminal.toLowerCase()));
  }
  return pins;
}

export async function apiGetLogs(): Promise<MaintenanceLog[]> {
  return fetchWithFallback(`${API_BASE}/maintenance`, FALLBACK_LOGS);
}

export async function apiCreateLog(logData: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
  try {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    // fallback creation
  }

  const newLog: MaintenanceLog = {
    id: `LOG-2026-${Math.floor(Math.random() * 900 + 100)}`,
    asset_id: logData.asset_id || 'ast-t3-3',
    asset_code: logData.asset_code || 'FIDS-T3-001',
    asset_name: logData.asset_name || 'FIDS T3 Display #1',
    terminal: logData.terminal || '3U-INT',
    target_component: logData.target_component || 'Mini PC',
    type: logData.type || 'Corrective',
    description: logData.description || 'Pemeriksaan rutin dan maintenance hardware.',
    spare_parts_used: logData.spare_parts_used || 'N/A',
    documentation_photo: logData.documentation_photo || '',
    new_component_sn: logData.new_component_sn || '',
    new_component_model: logData.new_component_model || '',
    health_before: logData.health_before || 40,
    health_after: logData.health_after || 95,
    created_at: new Date().toISOString()
  };

  FALLBACK_LOGS.unshift(newLog);
  return newLog;
}

export async function apiCreateAsset(assetData: Partial<FIDSAsset>): Promise<FIDSAsset> {
  try {
    const res = await fetch(`${API_BASE}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetData)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    // fallback creation
  }

  const newId = `ast-new-${Date.now().toString().slice(-4)}`;
  const newAsset: FIDSAsset = {
    id: newId,
    code: assetData.code || `FIDS-NEW-${Math.floor(Math.random() * 900 + 100)}`,
    name: assetData.name || 'FIDS Display Baru',
    category: assetData.category || 'Flight Information Board',
    location_area: assetData.location_area || 'General Area',
    terminal: assetData.terminal || '3U-INT',
    zone: assetData.zone || 'Departure',
    ip_address: assetData.ip_address || '172.17.150.100',
    status: assetData.status || 'Active',
    health_score: assetData.health_score ?? 100,
    mini_pc_brand: assetData.mini_pc_brand || 'HP',
    mini_pc_model: assetData.mini_pc_model || 'Thin Client t640',
    mini_pc_sn: assetData.mini_pc_sn || 'SN-NEW-PC-001',
    mini_pc_ram: assetData.mini_pc_ram || '8GB',
    mini_pc_disk: assetData.mini_pc_disk || '60GB',
    mini_pc_os: assetData.mini_pc_os || 'Windows 10',
    mini_pc_condition: '100%',
    monitor_brand: assetData.monitor_brand || 'LG',
    monitor_model: assetData.monitor_model || '65UH5C',
    monitor_sn: assetData.monitor_sn || 'SN-NEW-MON-001',
    monitor_size: assetData.monitor_size || '65"',
    monitor_converter: assetData.monitor_converter || 'Direct Cable',
    monitor_condition: '100%',
    last_update: new Date().toISOString()
  };

  FALLBACK_ASSETS.unshift(newAsset);
  FALLBACK_METRICS.total_assets += 1;
  if (newAsset.status === 'Active') {
    FALLBACK_METRICS.active_assets += 1;
  } else if (newAsset.status === 'Maintenance') {
    FALLBACK_METRICS.need_service += 1;
  }
  return newAsset;
}

export function apiExportCSV(q = '', status = '', terminal = '') {
  window.open(`${API_BASE}/assets/export?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&terminal=${encodeURIComponent(terminal)}`, '_blank');
}

export async function apiGetReplacementHistory(q = '', terminal = '', componentType = ''): Promise<ReplacementHistory[]> {
  try {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (terminal) params.set('terminal', terminal);
    if (componentType) params.set('component_type', componentType);

    const res = await fetch(`${API_BASE}/history/replacements?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (e) {
    // Return fallback sample replacement histories
  }

  return [
    {
      id: 'REP-2026-001',
      asset_id: 'ast-t3-2',
      asset_code: 'FIDS-T3-002',
      asset_name: 'General Departure Curbside Pintu 2 T3',
      terminal: '3U-INT',
      location_area: 'Curbside Pintu 2 T3',
      component_type: 'Mini PC',
      old_brand: 'HP',
      old_model: 'Thin Client t630',
      old_sn: '8CN1920OLD',
      new_brand: 'HP',
      new_model: 'Thin Client Elite t655',
      new_sn: '8CN2490GQW',
      reason: 'Motherboard No Display / Mati Total',
      old_status: 'In Repair (Bengkel IT PSIT)',
      technician_name: 'Teknisi Maintenance',
      replaced_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
    },
    {
      id: 'REP-2026-002',
      asset_id: 'ast-t3-4',
      asset_code: 'FIDS-T3-004',
      asset_name: 'General Departure Curbside Pintu 4 T3',
      terminal: '3U-DOM',
      location_area: 'Curbside Pintu 4 T3',
      component_type: 'Monitor',
      old_brand: 'LG',
      old_model: '65UH5C',
      old_sn: '807KCOLD991',
      new_brand: 'LG',
      new_model: '65UH5C',
      new_sn: '807KCGWP1775',
      reason: 'Panel Bergaris Vertikal & Kedip',
      old_status: 'Scrapped / Afkir Gudang',
      technician_name: 'Teknisi Maintenance',
      replaced_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    },
    {
      id: 'REP-2026-003',
      asset_id: 'ast-t1t2-3',
      asset_code: 'FIDS-1A-003',
      asset_name: 'Checkin Counter 1 T1A',
      terminal: '1A',
      location_area: 'Checkin Counter 1 T1A',
      component_type: 'Mini PC',
      old_brand: 'Intel',
      old_model: 'NUC 7i3',
      old_sn: 'G6PY802OLD',
      new_brand: 'HP',
      new_model: 'Thin Client t640',
      new_sn: '8CN25202GG',
      reason: 'Power Supply Unit Rusak',
      old_status: 'Scrapped / Afkir Gudang',
      technician_name: 'Teknisi Maintenance',
      replaced_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ];
}

export interface SparePart {
  id: string;
  category: 'Mini PC' | 'Monitor';
  serial_number: string;
  brand: string;
  model: string;
  specs: string;
  warehouse_location: string;
  origin_procurement: string;
  procurement_year: string;
  condition: 'Bagus / Ready' | 'Perlu Servis (RMA)' | 'Afkir / Rusak';
  status: 'Available' | 'In-Use' | 'Under-Repair' | 'Scrapped';
  warranty_status: string;
  notes: string;
  last_updated: string;
}

export interface SwapRequest {
  asset_id: string;
  component_type: 'Mini PC' | 'Monitor';
  old_brand?: string;
  old_model?: string;
  old_sn?: string;
  old_origin?: string;       // asal pengadaan unit lama
  old_disposal?: string;     // disposisi: 'RMA Servis' | 'Afkir / Scrapped' | 'Simpan Gudang'
  old_disposal_loc?: string; // lokasi tujuan unit lama
  old_status?: string;
  new_sparepart_id?: string;
  new_brand: string;
  new_model: string;
  new_sn: string;
  new_specs?: string;
  new_origin?: string;
  reason: string;
  technician_name: string;
}

const FALLBACK_SPARE_PARTS: SparePart[] = [
  {
    id: 'SP-PC-001',
    category: 'Mini PC',
    serial_number: '8CN25202GG',
    brand: 'HP',
    model: 'Thin Client t640',
    specs: 'AMD Ryzen R1505G, 8GB DDR4, 64GB M.2 SSD, Win 10 IoT',
    warehouse_location: 'Gudang T3 Central - Rak PC-01',
    origin_procurement: 'Pengadaan CAPEX AP II 2024',
    procurement_year: '2024',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Resmi s/d Des 2026',
    notes: 'Pre-installed image FIDS Client v4.2',
    last_updated: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: 'SP-PC-002',
    category: 'Mini PC',
    serial_number: '8CN25203HA',
    brand: 'HP',
    model: 'Thin Client t640',
    specs: 'AMD Ryzen R1505G, 8GB DDR4, 64GB M.2 SSD, Win 10 IoT',
    warehouse_location: 'Gudang T3 Central - Rak PC-01',
    origin_procurement: 'Pengadaan CAPEX AP II 2024',
    procurement_year: '2024',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Resmi s/d Des 2026',
    notes: 'Unit cadangan staging siap pasang',
    last_updated: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: 'SP-PC-003',
    category: 'Mini PC',
    serial_number: '8CN30114AB',
    brand: 'HP',
    model: 'Thin Client Elite t655',
    specs: 'AMD Ryzen R2314, 16GB DDR4, 128GB NVMe SSD, Win 11 IoT',
    warehouse_location: 'Workshop T2 - Rak B-01',
    origin_procurement: 'Pengadaan InJourney FIDS 2025',
    procurement_year: '2025',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Resmi s/d Nov 2027',
    notes: 'Cadangan performa tinggi untuk Gate Display T2',
    last_updated: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    id: 'SP-PC-004',
    category: 'Mini PC',
    serial_number: 'GD20249911X',
    brand: 'Giada',
    model: 'Signage Player D68',
    specs: 'Intel Core i3-1115G4, 8GB DDR4, 128GB SSD',
    warehouse_location: 'Workshop T1 - Rak A-02',
    origin_procurement: 'Pengadaan Terminal 1 2023',
    procurement_year: '2023',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Habis (Perawatan Mandiri)',
    notes: 'Khusus replace unit Giada T1 & T2',
    last_updated: new Date(Date.now() - 72 * 3600000).toISOString()
  },
  {
    id: 'SP-PC-005',
    category: 'Mini PC',
    serial_number: '8CN1920OLD',
    brand: 'HP',
    model: 'Thin Client t630',
    specs: 'AMD GX-420GI, 4GB RAM, 32GB Flash',
    warehouse_location: 'Workshop PSIT - Meja Servis',
    origin_procurement: 'Eks Copotan Gate 2 T3',
    procurement_year: '2021',
    condition: 'Perlu Servis (RMA)',
    status: 'Under-Repair',
    warranty_status: 'Garansi Habis',
    notes: 'Kendala No Display, sedang diganti IC power',
    last_updated: new Date(Date.now() - 36 * 3600000).toISOString()
  },
  {
    id: 'SP-MON-001',
    category: 'Monitor',
    serial_number: '807KCGWP1775',
    brand: 'LG',
    model: '65UH5C',
    specs: '65 Inch UHD 4K, 500 nits, 24/7 Heavy Duty Operation',
    warehouse_location: 'Gudang T3 Central - Storage Area C',
    origin_procurement: 'Pengadaan Display Terminal 3 2024',
    procurement_year: '2024',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Panel LG s/d Ags 2027',
    notes: 'Panel Grade A untuk Master FIDS T3',
    last_updated: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'SP-MON-002',
    category: 'Monitor',
    serial_number: '807KCGWP1776',
    brand: 'LG',
    model: '65UH5C',
    specs: '65 Inch UHD 4K, 500 nits, 24/7 Heavy Duty Operation',
    warehouse_location: 'Gudang T3 Central - Storage Area C',
    origin_procurement: 'Pengadaan Display Terminal 3 2024',
    procurement_year: '2024',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Panel LG s/d Ags 2027',
    notes: 'Unit cadangan masih segel dus',
    last_updated: new Date(Date.now() - 18 * 3600000).toISOString()
  },
  {
    id: 'SP-MON-003',
    category: 'Monitor',
    serial_number: '409KCPL90123',
    brand: 'LG',
    model: '43UH5F',
    specs: '43 Inch UHD Commercial Signage, 24/7 Operation',
    warehouse_location: 'Workshop T2 - Rak Display',
    origin_procurement: 'Pengadaan Boarding Gate T2 2024',
    procurement_year: '2024',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Panel LG s/d Feb 2027',
    notes: 'Standar pengganti Boarding Gate & Conveyor Belt',
    last_updated: new Date(Date.now() - 30 * 3600000).toISOString()
  },
  {
    id: 'SP-MON-004',
    category: 'Monitor',
    serial_number: '0B3MH4ZN8001',
    brand: 'Samsung',
    model: 'QB55R',
    specs: '55 Inch UHD 350 nits Non-glare 16/7 Operation',
    warehouse_location: 'Workshop T1 - Rak Display',
    origin_procurement: 'Pengadaan Terminal 1 2023',
    procurement_year: '2023',
    condition: 'Bagus / Ready',
    status: 'Available',
    warranty_status: 'Garansi Resmi s/d Okt 2026',
    notes: 'Cadangan display Checkin Row T1',
    last_updated: new Date(Date.now() - 50 * 3600000).toISOString()
  }
];

export async function apiGetSpareParts(q = '', category = '', status = '', location = ''): Promise<SparePart[]> {
  try {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    if (location) params.set('location', location);

    const res = await fetch(`${API_BASE}/spareparts?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (e) {
    // fallback
  }

  return FALLBACK_SPARE_PARTS.filter(p => {
    if (category && category !== 'All' && p.category !== category) return false;
    if (status && status !== 'All' && p.status !== status) return false;
    if (location && location !== 'All' && !p.warehouse_location.toLowerCase().includes(location.toLowerCase())) return false;
    if (q) {
      const ql = q.toLowerCase();
      return p.serial_number.toLowerCase().includes(ql) ||
             p.brand.toLowerCase().includes(ql) ||
             p.model.toLowerCase().includes(ql) ||
             p.specs.toLowerCase().includes(ql) ||
             p.origin_procurement.toLowerCase().includes(ql) ||
             p.warehouse_location.toLowerCase().includes(ql);
    }
    return true;
  });
}

export async function apiCreateSparePart(partData: Partial<SparePart>): Promise<SparePart> {
  try {
    const res = await fetch(`${API_BASE}/spareparts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partData)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {}

  const newPart: SparePart = {
    id: `SP-${partData.category === 'Monitor' ? 'MON' : 'PC'}-${Date.now().toString().slice(-4)}`,
    category: partData.category || 'Mini PC',
    serial_number: partData.serial_number || `SN-${Date.now()}`,
    brand: partData.brand || 'HP',
    model: partData.model || '-',
    specs: partData.specs || '-',
    warehouse_location: partData.warehouse_location || 'Gudang T3 Central',
    origin_procurement: partData.origin_procurement || 'Pengadaan Mandiri',
    procurement_year: partData.procurement_year || '2025',
    condition: partData.condition || 'Bagus / Ready',
    status: partData.status || 'Available',
    warranty_status: partData.warranty_status || 'Garansi Resmi',
    notes: partData.notes || '',
    last_updated: new Date().toISOString()
  };
  FALLBACK_SPARE_PARTS.unshift(newPart);
  return newPart;
}

export async function apiUpdateSparePart(id: string, partData: Partial<SparePart>): Promise<SparePart> {
  try {
    const res = await fetch(`${API_BASE}/spareparts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partData)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {}

  const idx = FALLBACK_SPARE_PARTS.findIndex(p => p.id === id);
  if (idx !== -1) {
    FALLBACK_SPARE_PARTS[idx] = { ...FALLBACK_SPARE_PARTS[idx], ...partData, last_updated: new Date().toISOString() };
    return FALLBACK_SPARE_PARTS[idx];
  }
  throw new Error('Spare part not found');
}

export async function apiDeleteSparePart(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/spareparts/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) return true;
  } catch (e) {}

  const idx = FALLBACK_SPARE_PARTS.findIndex(p => p.id === id);
  if (idx !== -1) {
    FALLBACK_SPARE_PARTS.splice(idx, 1);
    return true;
  }
  return false;
}

export async function apiExecuteSwap(swapReq: SwapRequest): Promise<ReplacementHistory> {
  try {
    const res = await fetch(`${API_BASE}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swapReq)
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {}

  const hist: ReplacementHistory = {
    id: `REP-2026-${Date.now().toString().slice(-4)}`,
    asset_id: swapReq.asset_id,
    asset_code: 'FIDS-T3-002',
    asset_name: 'Display Curbside Pintu 2 T3',
    terminal: '3U-INT',
    location_area: 'Curbside Pintu 2 T3',
    component_type: swapReq.component_type,
    old_brand: swapReq.old_brand || '-',
    old_model: swapReq.old_model || '-',
    old_sn: swapReq.old_sn || '-',
    new_brand: swapReq.new_brand,
    new_model: swapReq.new_model,
    new_sn: swapReq.new_sn,
    reason: swapReq.reason,
    old_status: swapReq.old_status || 'In Repair',
    technician_name: swapReq.technician_name || 'Teknisi Maintenance',
    replaced_at: new Date().toISOString()
  };
  return hist;
}
export async function apiGetSparePartHistory(sn: string): Promise<ReplacementHistory[]> {
  try {
    const res = await fetch(`${API_BASE}/spareparts/${encodeURIComponent(sn)}/history`);
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (e) {}
  // Fallback: search in local fallback histories matching the SN
  return [];
}
