import React, { useState } from 'react';
import { PlusCircle, Cpu, Monitor, TriangleAlert, X } from 'lucide-react';
import { SparePart } from '@/lib/api';
import { PRESET_MINI_PC, PRESET_MONITORS, WAREHOUSE_LOCATIONS } from './constants';

interface AddSparePartModalProps {
  isOpen: boolean;
  spareParts: SparePart[];
  isPending: boolean;
  initialCategory?: 'Mini PC' | 'Monitor';
  onClose: () => void;
  onSubmit: (part: Partial<SparePart>) => void;
}

export default function AddSparePartModal({
  isOpen,
  spareParts,
  isPending,
  initialCategory = 'Mini PC',
  onClose,
  onSubmit,
}: AddSparePartModalProps) {
  const [formCategory, setFormCategory] = useState<'Mini PC' | 'Monitor'>(initialCategory);
  const [formSN, setFormSN] = useState('');
  const [selectedModelPreset, setSelectedModelPreset] = useState<string>(
    initialCategory === 'Mini PC' ? PRESET_MINI_PC[1].model : PRESET_MONITORS[6].model
  );
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [formBrand, setFormBrand] = useState(
    initialCategory === 'Mini PC' ? PRESET_MINI_PC[1].brand : PRESET_MONITORS[6].brand
  );
  const [formModel, setFormModel] = useState(
    initialCategory === 'Mini PC' ? PRESET_MINI_PC[1].model : PRESET_MONITORS[6].model
  );
  const [formSpecs, setFormSpecs] = useState(
    initialCategory === 'Mini PC' ? PRESET_MINI_PC[1].specs : PRESET_MONITORS[6].specs
  );
  const [formLocation, setFormLocation] = useState(
    initialCategory === 'Mini PC' ? 'Gudang T3 Central - Rak PC-01' : 'Gudang T3 Central - Storage Area C'
  );
  const [formOrigin, setFormOrigin] = useState('Pengadaan CAPEX AP II 2025');
  const [formYear, setFormYear] = useState('2025');
  const [formCondition, setFormCondition] = useState<'Bagus / Ready' | 'Perlu Servis (RMA)' | 'Afkir / Rusak'>('Bagus / Ready');
  const [formStatus, setFormStatus] = useState<'Available' | 'In-Use' | 'Under-Repair' | 'Scrapped'>('Available');
  const [formWarranty, setFormWarranty] = useState('Garansi Resmi s/d Des 2027');
  const [formNotes, setFormNotes] = useState('');
  const [formSNError, setFormSNError] = useState('');

  if (!isOpen) return null;

  const handleCategorySwitch = (cat: 'Mini PC' | 'Monitor') => {
    setFormCategory(cat);
    setFormSNError('');
    if (cat === 'Mini PC') {
      const p = PRESET_MINI_PC[1];
      setSelectedModelPreset(p.model);
      setIsCustomModel(false);
      setFormBrand(p.brand);
      setFormModel(p.model);
      setFormSpecs(p.specs);
      setFormLocation('Gudang T3 Central - Rak PC-01');
    } else {
      const p = PRESET_MONITORS[6];
      setSelectedModelPreset(p.model);
      setIsCustomModel(false);
      setFormBrand(p.brand);
      setFormModel(p.model);
      setFormSpecs(p.specs);
      setFormLocation('Gudang T3 Central - Storage Area C');
    }
  };

  const handleSelectPreset = (presetModel: string) => {
    if (presetModel === '__custom__') {
      setIsCustomModel(true);
      setSelectedModelPreset('__custom__');
      setFormBrand('');
      setFormModel('');
      setFormSpecs('');
    } else {
      setIsCustomModel(false);
      setSelectedModelPreset(presetModel);
      const list = formCategory === 'Mini PC' ? PRESET_MINI_PC : PRESET_MONITORS;
      const found = list.find((p) => p.model === presetModel);
      if (found) {
        setFormBrand(found.brand);
        setFormModel(found.model);
        setFormSpecs(found.specs);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSNError('');
    if (!formSN.trim()) {
      setFormSNError('Nomor Serial Number (SN) wajib diisi');
      return;
    }
    const duplicate = spareParts.find(
      (p) => p.serial_number.toLowerCase() === formSN.trim().toLowerCase()
    );
    if (duplicate) {
      setFormSNError(`⚠️ SN "${formSN.trim()}" sudah terdaftar di inventaris (ID: ${duplicate.id}, Status: ${duplicate.status})`);
      return;
    }

    onSubmit({
      category: formCategory,
      serial_number: formSN.trim(),
      brand: formBrand,
      model: formModel || (formCategory === 'Mini PC' ? 'Thin Client t640' : '65UH5C'),
      specs: formSpecs || (formCategory === 'Mini PC' ? '8GB RAM / 64GB SSD' : '4K Commercial Display'),
      warehouse_location: formLocation,
      origin_procurement: formOrigin,
      procurement_year: formYear,
      condition: formCondition,
      status: formStatus,
      warranty_status: formWarranty,
      notes: formNotes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-700"><PlusCircle className="w-5 h-5" /></span>
            <div>
              <h3 className="text-base font-bold text-slate-800">Tambah Stok Suku Cadang (Unit SN Baru)</h3>
              <p className="text-[11px] text-slate-400">Pencatatan unit hardware cadangan ke database</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Selector */}
          <div className="grid grid-cols-2 gap-3">
            {(['Mini PC', 'Monitor'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySwitch(cat)}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                  formCategory === cat
                    ? cat === 'Mini PC'
                      ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                      : 'border-purple-500 bg-purple-50/50 text-purple-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'Mini PC' ? <Cpu className="w-5 h-5 text-blue-600" /> : <Monitor className="w-5 h-5 text-purple-600" />}
                <div className="text-left">
                  <div className="text-xs">Kategori Unit</div>
                  <div className="text-sm font-bold">{cat === 'Mini PC' ? 'Mini PC Controller' : 'Monitor Display'}</div>
                </div>
              </button>
            ))}
          </div>

          {/* SN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Serial Number (SN) Unit * <span className="text-rose-500 font-normal">(Identitas Unik Pabrikan)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 8CN25204JK atau 807KCGWP9912"
              value={formSN}
              onChange={(e) => { setFormSN(e.target.value); setFormSNError(''); }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 bg-slate-50/50 transition-all ${
                formSNError
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
            />
            {formSNError && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <TriangleAlert className="w-3 h-3" />{formSNError}
              </p>
            )}
          </div>

          {/* Preset Model */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Pilih Model / Tipe {formCategory} *
                </label>
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  Katalog Preset
                </span>
              </div>

              <select
                value={isCustomModel ? '__custom__' : selectedModelPreset}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <optgroup label={`Preset Model ${formCategory} Resmi`}>
                  {(formCategory === 'Mini PC' ? PRESET_MINI_PC : PRESET_MONITORS).map((preset) => (
                    <option key={preset.model} value={preset.model}>
                      [{preset.brand}] {preset.model}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Model Lainnya">
                  <option value="__custom__">➕ Input Model & Spek Baru (Kustom / Lainnya)...</option>
                </optgroup>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Brand / Merk * {!isCustomModel && <span className="text-[10px] text-emerald-600 font-normal">(Auto-filled)</span>}
                </label>
                <input
                  type="text"
                  required
                  placeholder="HP, LG, Giada, Samsung"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors ${
                    !isCustomModel ? 'bg-slate-100/70 text-slate-700 font-semibold border-slate-200' : 'bg-white border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Model / Seri * {!isCustomModel && <span className="text-[10px] text-emerald-600 font-normal">(Auto-filled)</span>}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Thin Client t640 / 65UH5C"
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors ${
                    !isCustomModel ? 'bg-slate-100/70 text-slate-700 font-semibold border-slate-200' : 'bg-white border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Spesifikasi Hardware {!isCustomModel && <span className="text-[10px] text-emerald-600 font-normal">(Auto-filled)</span>}
              </label>
              <input
                type="text"
                placeholder={formCategory === 'Mini PC' ? '8GB DDR4, 64GB M.2 SSD, Windows 10 IoT, DP+VGA' : '65 Inch UHD 4K, 500 nits, 24/7 Heavy Duty, HDMI+DP'}
                value={formSpecs}
                onChange={(e) => setFormSpecs(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Asal Pengadaan / Vendor *</label>
              <input type="text" required placeholder="Pengadaan CAPEX AP II 2024" value={formOrigin}
                onChange={(e) => setFormOrigin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Pengadaan</label>
              <input type="text" placeholder="2025" value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Gudang / Rak *</label>
              <select value={formLocation} onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                {WAREHOUSE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Garansi</label>
              <input type="text" placeholder="Garansi Resmi s/d Des 2027" value={formWarranty}
                onChange={(e) => setFormWarranty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Fisik</label>
              <select value={formCondition} onChange={(e) => setFormCondition(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                <option value="Bagus / Ready">Bagus / Ready</option>
                <option value="Perlu Servis (RMA)">Perlu Servis (RMA)</option>
                <option value="Afkir / Rusak">Afkir / Rusak</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Ketersediaan</label>
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                <option value="Available">Available (Ready Stock)</option>
                <option value="In-Use">In-Use (Terpasang)</option>
                <option value="Under-Repair">Under-Repair (Servis)</option>
                <option value="Scrapped">Scrapped (Afkir)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan</label>
            <input type="text" placeholder="Sudah di-install OS image FIDS & siap langsung dipasang" value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
            <button type="submit" disabled={isPending}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-950/20 transition-all disabled:opacity-50">
              {isPending ? 'Menyimpan...' : 'Simpan ke Stok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
