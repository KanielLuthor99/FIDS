import React, { useState } from 'react';
import { ArrowRightLeft, MapPin, Cpu, Monitor, CheckCircle2, X } from 'lucide-react';
import { FIDSAsset, SparePart } from '@/lib/api';
import { SWAP_REASONS, DISPOSAL_OPTIONS } from './constants';

interface SwapModalProps {
  isOpen: boolean;
  allAssets: FIDSAsset[];
  spareParts: SparePart[];
  isPending: boolean;
  initialComponentType?: 'Mini PC' | 'Monitor';
  initialSparePartId?: string;
  onClose: () => void;
  onSubmit: (swapPayload: any) => void;
}

export default function SwapModal({
  isOpen,
  allAssets,
  spareParts,
  isPending,
  initialComponentType = 'Mini PC',
  initialSparePartId = '',
  onClose,
  onSubmit,
}: SwapModalProps) {
  const [swapStep, setSwapStep] = useState(1);
  const [swapAssetId, setSwapAssetId] = useState('');
  const [swapComponentType, setSwapComponentType] = useState<'Mini PC' | 'Monitor'>(initialComponentType);
  const [swapSelectedSpareId, setSwapSelectedSpareId] = useState(initialSparePartId);
  const [swapReasonPreset, setSwapReasonPreset] = useState(SWAP_REASONS[0]);
  const [swapReasonCustom, setSwapReasonCustom] = useState('');
  const [swapDisposal, setSwapDisposal] = useState(DISPOSAL_OPTIONS[0].value);
  const [swapDisposalLoc, setSwapDisposalLoc] = useState('Workshop PSIT - Meja Servis');
  const [swapTechnician, setSwapTechnician] = useState('Teknisi Maintenance');

  if (!isOpen) return null;

  const currentTargetAsset = allAssets.find((a) => a.id === swapAssetId);
  const availableSparesForSwap = spareParts.filter(
    (p) => p.category === swapComponentType && p.status === 'Available'
  );
  const chosenSpare = spareParts.find((p) => p.id === swapSelectedSpareId);

  const canGoSwapStep2 = !!swapAssetId;
  const canGoSwapStep3 = canGoSwapStep2;
  const canGoSwapStep4 = canGoSwapStep3 && !!swapSelectedSpareId;
  const swapReasonFinal = swapReasonPreset === 'Lainnya (Isi Manual)' ? swapReasonCustom : swapReasonPreset;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapAssetId) { alert('Pilih titik display aset target terlebih dahulu!'); return; }
    const targetAsset = allAssets.find((a) => a.id === swapAssetId);
    if (!targetAsset) return;

    const chosenPart = spareParts.find((p) => p.id === swapSelectedSpareId);
    if (!chosenPart) { alert('Silakan pilih unit spare part pengganti yang tersedia!'); return; }

    const swapReason = swapReasonPreset === 'Lainnya (Isi Manual)' ? swapReasonCustom : swapReasonPreset;
    if (!swapReason.trim()) { alert('Alasan penggantian wajib diisi!'); return; }

    const oldBrand = swapComponentType === 'Mini PC'
      ? (targetAsset.mini_pc_brand || targetAsset.brand || 'HP')
      : (targetAsset.monitor_brand || 'LG');
    const oldModel = swapComponentType === 'Mini PC'
      ? (targetAsset.mini_pc_model || 'Thin Client')
      : (targetAsset.monitor_model || 'Display Panel');
    const oldSN = swapComponentType === 'Mini PC'
      ? (targetAsset.mini_pc_sn || targetAsset.serial_number || 'N/A')
      : (targetAsset.monitor_sn || 'N/A');
    const oldOrigin = swapComponentType === 'Mini PC'
      ? (targetAsset.mini_pc_origin || 'Pengadaan Awal')
      : (targetAsset.monitor_origin || 'Pengadaan Awal');

    onSubmit({
      asset_id: targetAsset.id,
      component_type: swapComponentType,
      old_brand: oldBrand,
      old_model: oldModel,
      old_sn: oldSN,
      old_origin: oldOrigin,
      old_disposal: swapDisposal,
      old_disposal_loc: swapDisposalLoc,
      old_status: swapDisposal,
      new_sparepart_id: chosenPart.id,
      new_brand: chosenPart.brand,
      new_model: chosenPart.model,
      new_sn: chosenPart.serial_number,
      new_specs: chosenPart.specs,
      new_origin: chosenPart.origin_procurement,
      reason: swapReason,
      technician_name: swapTechnician,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-700"><ArrowRightLeft className="w-5 h-5" /></span>
            <div>
              <h3 className="text-base font-bold text-slate-800">Proses Swap / Penggantian Komponen Hardware</h3>
              <p className="text-[11px] text-slate-400">Ganti komponen rusak di titik display dengan unit cadangan ready stock.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-5 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <button
                  type="button"
                  onClick={() => s <= swapStep && setSwapStep(s)}
                  className={`w-7 h-7 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                    s === swapStep ? 'bg-orange-500 text-white shadow-sm shadow-orange-300'
                    : s < swapStep ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s < swapStep ? '✓' : s}
                </button>
                {s < 4 && <div className={`flex-1 h-0.5 rounded-full ${s < swapStep ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {['Aset Target', 'Komponen', 'Unit Baru', 'Konfirmasi'].map((label, i) => (
              <span key={i} className={`text-[9px] font-bold ${i + 1 === swapStep ? 'text-orange-600' : i + 1 < swapStep ? 'text-emerald-600' : 'text-slate-400'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">
          <form onSubmit={handleSubmit} id="swap-form">
            {/* STEP 1 */}
            {swapStep === 1 && (
              <div className="space-y-4 py-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Titik Display FIDS yang Bermasalah *
                  </label>
                  <select required value={swapAssetId} onChange={(e) => setSwapAssetId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                    <option value="">-- Pilih Titik Lokasi Display FIDS --</option>
                    {allAssets.map((ast) => (
                      <option key={ast.id} value={ast.id}>
                        [{ast.code}] {ast.name} — {ast.terminal} ({ast.location_area}) [{ast.status}]
                      </option>
                    ))}
                  </select>
                </div>

                {currentTargetAsset && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>Info Aset Terpilih</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-400">Kode:</span> <strong>{currentTargetAsset.code}</strong></div>
                      <div><span className="text-slate-400">Status:</span> <strong>{currentTargetAsset.status}</strong></div>
                      <div className="col-span-2"><span className="text-slate-400">Nama:</span> <strong>{currentTargetAsset.name}</strong></div>
                      <div><span className="text-slate-400">Terminal:</span> <strong>{currentTargetAsset.terminal}</strong></div>
                      <div><span className="text-slate-400">Zona:</span> <strong>{currentTargetAsset.location_area}</strong></div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-blue-600 mb-0.5 flex items-center gap-1"><Cpu className="w-3 h-3" /> Mini PC Terpasang</div>
                        <div className="font-mono text-[10px] text-slate-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          {currentTargetAsset.mini_pc_sn || currentTargetAsset.serial_number || 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{currentTargetAsset.mini_pc_brand} {currentTargetAsset.mini_pc_model}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-purple-600 mb-0.5 flex items-center gap-1"><Monitor className="w-3 h-3" /> Monitor Terpasang</div>
                        <div className="font-mono text-[10px] text-slate-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                          {currentTargetAsset.monitor_sn || 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{currentTargetAsset.monitor_brand} {currentTargetAsset.monitor_model}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {swapStep === 2 && (
              <div className="space-y-4 py-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Tipe Komponen yang Akan Ditukar *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Mini PC', 'Monitor'] as const).map((ct) => (
                      <button key={ct} type="button"
                        onClick={() => { setSwapComponentType(ct); setSwapSelectedSpareId(''); }}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                          swapComponentType === ct
                            ? ct === 'Mini PC' ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold' : 'border-purple-500 bg-purple-50/50 text-purple-900 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {ct === 'Mini PC' ? <Cpu className="w-5 h-5 text-blue-600" /> : <Monitor className="w-5 h-5 text-purple-600" />}
                        <div className="text-left">
                          <div className="text-xs">Tukar Komponen</div>
                          <div className="text-sm font-bold">{ct}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Pergantian Hardware *</label>
                  <select value={swapReasonPreset} onChange={(e) => setSwapReasonPreset(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 mb-2">
                    {SWAP_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {swapReasonPreset === 'Lainnya (Isi Manual)' && (
                    <input type="text" required placeholder="Jelaskan kendala teknis spesifik..." value={swapReasonCustom}
                      onChange={(e) => setSwapReasonCustom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Disposisi Unit Lama (Dilepas) *</label>
                    <select value={swapDisposal} onChange={(e) => setSwapDisposal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                      {DISPOSAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Penyimpanan / Kirim</label>
                    <input type="text" placeholder="Workshop PSIT - Meja Servis" value={swapDisposalLoc}
                      onChange={(e) => setSwapDisposalLoc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Teknisi Pelaksana *</label>
                  <input type="text" required placeholder="Cecep / Teknisi On-Duty" value={swapTechnician}
                    onChange={(e) => setSwapTechnician(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {swapStep === 3 && (
              <div className="space-y-4 py-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilih Unit Cadangan ({swapComponentType}) Ready Stock *
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {availableSparesForSwap.length} unit tersedia
                    </span>
                  </div>

                  {availableSparesForSwap.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center text-amber-800 text-xs">
                      <p className="font-bold mb-1">⚠️ Tidak Ada Stok {swapComponentType} yang Berstatus Available</p>
                      <p className="text-[11px] text-amber-700">Silakan tambahkan unit baru terlebih dahulu lewat tombol "Tambah Unit (SN)".</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {availableSparesForSwap.map((part) => (
                        <label
                          key={part.id}
                          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            swapSelectedSpareId === part.id
                              ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="selected_spare"
                              value={part.id}
                              checked={swapSelectedSpareId === part.id}
                              onChange={() => setSwapSelectedSpareId(part.id)}
                              className="accent-orange-600"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <code className="font-mono font-bold text-xs text-slate-800">{part.serial_number}</code>
                                <span className="text-xs font-bold text-slate-700">{part.brand} {part.model}</span>
                              </div>
                              <div className="text-[11px] text-slate-500">{part.specs}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                📍 {part.warehouse_location} • Asal: {part.origin_procurement} ({part.procurement_year})
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            Ready
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {swapStep === 4 && (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-3">
                  <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wide">Ringkasan Pergantian (Swap)</h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-rose-600 mb-1">⬆️ UNIT LAMA (DILEPAS)</div>
                      <div className="font-mono font-bold text-slate-800 text-xs">
                        {swapComponentType === 'Mini PC'
                          ? (currentTargetAsset?.mini_pc_sn || 'N/A')
                          : (currentTargetAsset?.monitor_sn || 'N/A')}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {swapComponentType === 'Mini PC'
                          ? `${currentTargetAsset?.mini_pc_brand} ${currentTargetAsset?.mini_pc_model}`
                          : `${currentTargetAsset?.monitor_brand} ${currentTargetAsset?.monitor_model}`}
                      </div>
                      <div className="text-[10px] text-rose-700 font-semibold mt-1">Disposisi: {swapDisposal}</div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-emerald-600 mb-1">⬇️ UNIT BARU (DIPASANG)</div>
                      <div className="font-mono font-bold text-emerald-800 text-xs">{chosenSpare?.serial_number}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{chosenSpare?.brand} {chosenSpare?.model}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{chosenSpare?.specs}</div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 pt-2 border-t border-orange-200/60 text-slate-700">
                    <div>Titik Display: <strong>{currentTargetAsset?.code} — {currentTargetAsset?.name} ({currentTargetAsset?.terminal})</strong></div>
                    <div>Alasan: <strong>{swapReasonFinal}</strong></div>
                    <div>Teknisi: <strong>{swapTechnician}</strong></div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * Setelah tombol konfirmasi ditekan, data Serial Number di Master Aset akan langsung terupdate, status aset diset ke Aktif (100%), dan Berita Acara PDF otomatis dapat dicetak.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 pt-3 border-t border-slate-100 shrink-0">
          <div>
            {swapStep > 1 && (
              <button type="button" onClick={() => setSwapStep(swapStep - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                ← Kembali
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              Batal
            </button>

            {swapStep < 4 ? (
              <button
                type="button"
                onClick={() => setSwapStep(swapStep + 1)}
                disabled={(swapStep === 1 && !canGoSwapStep2) || (swapStep === 3 && !canGoSwapStep4)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-950/20 transition-all disabled:opacity-40"
              >
                Lanjut ke Langkah {swapStep + 1} →
              </button>
            ) : (
              <button
                type="submit"
                form="swap-form"
                disabled={isPending}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/20 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isPending ? 'Memproses Swap...' : 'Konfirmasi & Eksekusi Swap'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
