import React, { useState } from 'react';
import { X, PlusCircle, Activity, CheckCircle2, Cpu, Monitor } from 'lucide-react';
import { FIDSAsset } from '@/lib/api';

interface AddAssetModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (assetData: Partial<FIDSAsset>) => void;
}

export default function AddAssetModal({
  isOpen,
  isPending,
  onClose,
  onSubmit,
}: AddAssetModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Flight Information Board');
  const [terminal, setTerminal] = useState('3U-INT');
  const [zone, setZone] = useState('Departure');
  const [locationArea, setLocationArea] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState<'Active' | 'Maintenance' | 'In Storage'>('Active');
  const [healthScore, setHealthScore] = useState(100);

  // Mini PC State
  const [miniPcBrand, setMiniPcBrand] = useState('HP');
  const [miniPcModel, setMiniPcModel] = useState('Thin Client t640');
  const [miniPcSn, setMiniPcSn] = useState('');
  const [miniPcRam, setMiniPcRam] = useState('8GB');
  const [miniPcDisk, setMiniPcDisk] = useState('60GB');
  const [miniPcOs, setMiniPcOs] = useState('Windows 10');

  // Monitor State
  const [monitorBrand, setMonitorBrand] = useState('LG');
  const [monitorModel, setMonitorModel] = useState('65UH5C');
  const [monitorSn, setMonitorSn] = useState('');
  const [monitorSize, setMonitorSize] = useState('65"');
  const [monitorConverter, setMonitorConverter] = useState('Direct Cable');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code: code || `FIDS-${terminal.replace(/\s+/g, '')}-${Math.floor(Math.random() * 899 + 100)}`,
      name: name || `Display ${locationArea || 'Baru'}`,
      category,
      terminal,
      zone,
      location_area: locationArea || 'General Area',
      ip_address: ipAddress || '172.17.150.100',
      status,
      health_score: Number(healthScore),
      mini_pc_brand: miniPcBrand,
      mini_pc_model: miniPcModel,
      mini_pc_sn: miniPcSn || 'SN-PC-NEW',
      mini_pc_ram: miniPcRam,
      mini_pc_disk: miniPcDisk,
      mini_pc_os: miniPcOs,
      monitor_brand: monitorBrand,
      monitor_model: monitorModel,
      monitor_sn: monitorSn || 'SN-MON-NEW',
      monitor_size: monitorSize,
      monitor_converter: monitorConverter,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-emerald-900/10 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-900 to-teal-700 text-emerald-200">
            <PlusCircle className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Form Registrasi Aset FIDS Baru
            </h2>
            <p className="text-xs text-slate-500">
              Input data perangkat display FIDS baru lengkap dengan spesifikasi Mini PC & Commercial Monitor.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Data Identitas & Lokasi */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-1.5">
              1. Informasi Identitas & Lokasi Display
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Aset FIDS</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. FIDS-3U-099"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#1a6b65]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Peralatan Display</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FIDS Gate 12 Display"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-900 focus:ring-2 focus:ring-[#1a6b65]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">IP Address Network</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="e.g. 172.17.150.99"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-slate-900 focus:ring-2 focus:ring-[#1a6b65]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terminal</label>
                <select
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="3U-INT">Terminal 3 Int</option>
                  <option value="3U-DOM">Terminal 3 Dom</option>
                  <option value="1A">Terminal 1A</option>
                  <option value="1B">Terminal 1B</option>
                  <option value="1C">Terminal 1C</option>
                  <option value="Terminal 2">Terminal 2</option>
                  <option value="Non Terminal">Non Terminal</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Zona Area</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="Departure">Departure (Keberangkatan)</option>
                  <option value="Arrival">Arrival (Kedatangan)</option>
                  <option value="Checkin">Check-in Area</option>
                  <option value="Baggage">Baggage Claim</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori FIDS</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="Flight Information Board">Flight Information Board</option>
                  <option value="Master Departure">Master Departure</option>
                  <option value="Gate Display">Gate Display</option>
                  <option value="Check-in Counter">Check-in Counter</option>
                  <option value="Baggage Claim">Baggage Claim</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi Spesifik Lokasi</label>
              <input
                type="text"
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                placeholder="e.g. General Departure Curbside Pintu 5 T3"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                required
              />
            </div>
          </div>

          {/* Section 2: Hardware (Mini PC & Monitor) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mini PC Card */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-blue-950 border-b border-blue-200 pb-1.5">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Komponen 1: Controller Mini PC</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">Merk</label>
                  <input
                    type="text"
                    value={miniPcBrand}
                    onChange={(e) => setMiniPcBrand(e.target.value)}
                    placeholder="HP / Intel / Lenovo"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">Model</label>
                  <input
                    type="text"
                    value={miniPcModel}
                    onChange={(e) => setMiniPcModel(e.target.value)}
                    placeholder="Thin Client t640"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">Serial Number (S/N)</label>
                  <input
                    type="text"
                    value={miniPcSn}
                    onChange={(e) => setMiniPcSn(e.target.value)}
                    placeholder="8CN2490GQW"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">OS</label>
                  <input
                    type="text"
                    value={miniPcOs}
                    onChange={(e) => setMiniPcOs(e.target.value)}
                    placeholder="Windows 10 / Lubuntu"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Monitor Card */}
            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-purple-950 border-b border-purple-200 pb-1.5">
                <Monitor className="w-4 h-4 text-purple-600" />
                <span>Komponen 2: Commercial Monitor</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">Merk Monitor</label>
                  <input
                    type="text"
                    value={monitorBrand}
                    onChange={(e) => setMonitorBrand(e.target.value)}
                    placeholder="LG / BOE / Samsung"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">Model Panel</label>
                  <input
                    type="text"
                    value={monitorModel}
                    onChange={(e) => setMonitorModel(e.target.value)}
                    placeholder="65UH5C"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">Serial Number (S/N)</label>
                  <input
                    type="text"
                    value={monitorSn}
                    onChange={(e) => setMonitorSn(e.target.value)}
                    placeholder="111INCN01219"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-1">Ukuran Screen</label>
                  <input
                    type="text"
                    value={monitorSize}
                    onChange={(e) => setMonitorSize(e.target.value)}
                    placeholder="65 inch"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Status Awal */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
            <div>
              <label className="block font-bold text-emerald-900 text-xs">Status Operational Awal</label>
              <span className="text-[11px] text-emerald-700">Tentukan status awal perangkat baru</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-xs text-emerald-950"
              >
                <option value="Active">🟢 Aktif Normal</option>
                <option value="Maintenance">🔴 Maintenance</option>
                <option value="In Storage">🟡 Cadangan Gudang</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/30 active:scale-95 transition-all"
            >
              {isPending ? (
                <Activity className="w-4 h-4 animate-spin text-emerald-200" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              )}
              <span>Simpan Aset Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
