import React, { useState } from 'react';
import {
  Wrench,
  X,
  Upload,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
  Activity,
  Cpu,
  Monitor,
  Layers,
} from 'lucide-react';
import { FIDSAsset, MaintenanceLog } from '@/lib/api';

const DAMAGE_PRESET_TAGS = [
  'Redup',
  'Bergaris dan Berkedip',
  'Black Spot',
  'White Spot',
  'Mati Total',
  'Port Converter Rusak',
];

interface AddMaintenanceModalProps {
  isOpen: boolean;
  assets: FIDSAsset[];
  initialAssetId?: string;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (logData: Partial<MaintenanceLog>) => void;
}

export default function AddMaintenanceModal({
  isOpen,
  assets,
  initialAssetId = '',
  isPending,
  onClose,
  onSubmit,
}: AddMaintenanceModalProps) {
  const [assetId, setAssetId] = useState(initialAssetId);
  const [targetComponent, setTargetComponent] = useState<'Mini PC' | 'Monitor' | 'Sepaket'>('Monitor');
  const [maintenanceType, setMaintenanceType] = useState<'Corrective' | 'Preventive' | 'Component Swap'>('Preventive');
  const [description, setDescription] = useState('');
  const [spareParts, setSpareParts] = useState('');
  const [photoBefore, setPhotoBefore] = useState('');
  const [photoAfter, setPhotoAfter] = useState('');
  const [newComponentSN, setNewComponentSN] = useState('');
  const [newComponentModel, setNewComponentModel] = useState('');
  const [healthBefore, setHealthBefore] = useState(30);
  const [healthAfter, setHealthAfter] = useState(85);

  if (!isOpen) return null;

  const selectedAssetObj = assets?.find((a) => a.id === assetId);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      asset_id: assetId || 'ast-t3-3',
      asset_code: selectedAssetObj?.code || 'FIDS-T3-001',
      asset_name: selectedAssetObj?.name || 'FIDS Display Monitor',
      terminal: selectedAssetObj?.terminal || '3U-INT',
      target_component: targetComponent,
      type: maintenanceType,
      description: description || 'Pemeriksaan teknis dan perbaikan fisik perangkat.',
      spare_parts_used: spareParts || 'Tidak ada spare part',
      documentation_photo: photoBefore || photoAfter || '',
      new_component_sn: newComponentSN,
      new_component_model: newComponentModel,
      health_before: Number(healthBefore),
      health_after: Number(healthAfter),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <span className="p-3 rounded-2xl bg-[#1a2744] text-white">
            <Wrench className="w-6 h-6 text-cyan-300" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Catat Log Maintenance Baru
            </h2>
            <p className="text-xs text-slate-500">
              Form pencatatan tindakan perbaikan & pemeliharaan hardware FIDS
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Pilih Perangkat */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              1. PILIH PERANGKAT FIDS *
            </label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:bg-white"
              required
            >
              <option value="">-- Pilih Kode / Lokasi Aset FIDS --</option>
              {assets?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} — {a.location_area || a.name} ({a.terminal})
                </option>
              ))}
            </select>
          </div>

          {/* Tipe & Target Komponen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                2. JENIS MAINTENANCE *
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1">
                {(['Preventive', 'Corrective', 'Swap'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMaintenanceType(t === 'Swap' ? 'Component Swap' : t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      (t === 'Swap' && maintenanceType === 'Component Swap') || maintenanceType === t
                        ? 'bg-[#1a2744] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                TARGET KOMPONEN *
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1">
                {(['Monitor', 'Mini PC', 'Sepaket'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTargetComponent(c)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      targetComponent === c
                        ? 'bg-[#1a2744] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preset Kerusakan */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              3. KETERANGAN KERUSAKAN / TINDAKAN *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {DAMAGE_PRESET_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setDescription((prev) => (prev ? `${prev}, ${tag}` : tag))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-600 flex items-center gap-1 transition-colors"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail kendala teknis dan solusi yang dikerjakan..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white text-slate-800"
              required
            />
          </div>

          {/* Upload Foto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                FOTO SEBELUM PERBAIKAN
              </label>
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                {photoBefore ? (
                  <img src={photoBefore} alt="Before" className="h-16 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-500 font-medium">Upload Foto Sebelum</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPhotoBefore)} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                FOTO SESUDAH PERBAIKAN
              </label>
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                {photoAfter ? (
                  <img src={photoAfter} alt="After" className="h-16 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-500 font-medium">Upload Foto Sesudah</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPhotoAfter)} className="hidden" />
              </label>
            </div>
          </div>

          {/* Spare Parts & Health Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                SPARE PART DIGUNAKAN
              </label>
              <input
                type="text"
                value={spareParts}
                onChange={(e) => setSpareParts(e.target.value)}
                placeholder="Contoh: Kabel HDMI, Power Adaptor 19V"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="text-rose-600">Sebelum: {healthBefore}%</span>
                <span className="text-emerald-600">Sesudah: {healthAfter}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={healthAfter}
                onChange={(e) => setHealthAfter(Number(e.target.value))}
                className="w-full accent-[#1a6b65]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1a2744] hover:bg-[#243561] text-white font-bold shadow-md active:scale-95 transition-all"
            >
              {isPending ? (
                <Activity className="w-4 h-4 animate-spin text-emerald-300" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              )}
              <span>Simpan Log Maintenance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
