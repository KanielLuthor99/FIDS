'use client';

import React, { useState } from 'react';
import { exportBeritaAcaraPDF, BeritaAcaraData } from '@/lib/exportPdf';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  User,
  FileCheck,
  Camera,
} from 'lucide-react';

interface BeritaAcaraModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BeritaAcaraData>;
}

export default function BeritaAcaraModal({ isOpen, onClose, initialData }: BeritaAcaraModalProps) {
  if (!isOpen) return null;

  // Form State
  const [tipeDoc, setTipeDoc] = useState<'pergantian' | 'serah_terima' | 'dokumentasi'>(
    initialData?.tipeDoc || 'pergantian'
  );

  const [tanggal, setTanggal] = useState<string>(
    initialData?.tanggal ? initialData.tanggal.substring(0, 10) : new Date().toISOString().substring(0, 10)
  );
  const [shift, setShift] = useState<string>(initialData?.shift || 'Shift Pagi');
  const [terminal, setTerminal] = useState<string>(initialData?.terminal || 'Terminal 3');
  const [lokasi, setLokasi] = useState<string>(initialData?.lokasi || 'General Arrivals West Lobby Pilar 1 T3-INT');

  // Barang Baru (Terpasang)
  const [newItemName, setNewItemName] = useState<string>(initialData?.newItemName || 'Monitor 75 inch SAMSUNG QM75C');
  const [newItemQty, setNewItemQty] = useState<number>(initialData?.newItemQty || 1);
  const [newItemSN, setNewItemSN] = useState<string>(initialData?.newItemSN || '0SL9HNIL700014D');
  const [newItemKet, setNewItemKet] = useState<string>(initialData?.newItemKet || '');

  // Barang Lama (Bermasalah)
  const [oldItemName, setOldItemName] = useState<string>(initialData?.oldItemName || 'Monitor 75 inch BOE SR75AA');
  const [oldItemQty, setOldItemQty] = useState<number>(initialData?.oldItemQty || 1);
  const [oldItemSN, setOldItemSN] = useState<string>(initialData?.oldItemSN || 'MBVD07010019');
  const [oldItemStatus, setOldItemStatus] = useState<string>(initialData?.oldItemStatus || 'Flashing');
  const [oldItemKet, setOldItemKet] = useState<string>(initialData?.oldItemKet || '');

  // Penandatangan
  const [pihak1Nama, setPihak1Nama] = useState<string>(initialData?.pihak1Nama || 'Cecep');
  const [pihak1Jabatan, setPihak1Jabatan] = useState<string>(initialData?.pihak1Jabatan || 'IAS Support Indonesia (OM PSIT)');

  const [pihak2Nama, setPihak2Nama] = useState<string>(initialData?.pihak2Nama || 'Moh. Taufiqi / Heru S / Vanny S');
  const [pihak2Jabatan, setPihak2Jabatan] = useState<string>(initialData?.pihak2Jabatan || 'PT. Angkasa Pura Indonesia');

  // Opsi Kosongkan TTD (Tanda Tangan Basah)
  const [blankNames, setBlankNames] = useState<boolean>(initialData?.blankNames ?? true);

  const handleDownloadPDF = () => {
    const dataToSend: BeritaAcaraData = {
      tipeDoc,
      tanggal,
      shift,
      terminal,
      lokasi,
      newItemName,
      newItemQty,
      newItemSN,
      newItemKet,
      oldItemName,
      oldItemQty,
      oldItemSN,
      oldItemStatus,
      oldItemKet,
      pihak1Nama,
      pihak1Jabatan,
      pihak2Nama,
      pihak2Jabatan,
      blankNames,
    };

    exportBeritaAcaraPDF(dataToSend);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#002b49] text-cyan-400 shadow-md">
              <FileCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                Cetak / Download Berita Acara Resmi
              </h3>
              <p className="text-xs text-slate-500">
                Template Resmi <strong>InJourney Airports</strong> & <strong>IAS Support Indonesia</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Pilihan Tipe Dokumen */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih Jenis Berita Acara *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTipeDoc('pergantian')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                  tipeDoc === 'pergantian'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5 text-sky-600" />
                <span className="text-xs">BA Pergantian Barang</span>
              </button>

              <button
                type="button"
                onClick={() => setTipeDoc('serah_terima')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                  tipeDoc === 'serah_terima'
                    ? 'border-purple-500 bg-purple-50/70 text-purple-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileCheck className="w-5 h-5 text-purple-600" />
                <span className="text-xs">BA Serah Terima</span>
              </button>

              <button
                type="button"
                onClick={() => setTipeDoc('dokumentasi')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                  tipeDoc === 'dokumentasi'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Camera className="w-5 h-5 text-amber-600" />
                <span className="text-xs">Dokumentasi Foto</span>
              </button>
            </div>
          </div>

          {/* Setting Tanggal & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal *</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shift Kerja</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Shift Pagi">Shift Pagi</option>
                <option value="Shift Malam">Shift Malam</option>
                <option value="Non-Shift">Non-Shift</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Terminal</label>
              <input
                type="text"
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                placeholder="Terminal 3"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Lokasi Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Titik Display *</label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: General Arrivals West Lobby Pilar 1 T3-INT"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Data Barang Terpasang (Baru) */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data Barang Baru yang Terpasang</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nama Barang & Model</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Monitor 75 inch SAMSUNG QM75C"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Serial Number (SN)</label>
                <input
                  type="text"
                  value={newItemSN}
                  onChange={(e) => setNewItemSN(e.target.value)}
                  placeholder="0SL9HNIL700014D"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* Data Barang Bermasalah (Lama) — hanya tampil di mode 'pergantian' */}
          {tipeDoc === 'pergantian' && (
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
              <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Data Barang Lama yang Bermasalah (Dicopot)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nama Barang Lama</label>
                  <input
                    type="text"
                    value={oldItemName}
                    onChange={(e) => setOldItemName(e.target.value)}
                    placeholder="Monitor 75 inch BOE SR75AA"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Serial Number Lama</label>
                  <input
                    type="text"
                    value={oldItemSN}
                    onChange={(e) => setOldItemSN(e.target.value)}
                    placeholder="MBVD07010019"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Status Kerusakan</label>
                  <input
                    type="text"
                    value={oldItemStatus}
                    onChange={(e) => setOldItemStatus(e.target.value)}
                    placeholder="Flashing / Mati Total / Bergaris"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Opsi Penandatangan & Checkbox Kosongkan TTD */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-600" />
                <span>Pengaturan Tanda Tangan & Penandatangan</span>
              </div>

              {/* Checkbox Template TTD Basah */}
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm hover:border-sky-400 transition-all">
                <input
                  type="checkbox"
                  checked={blankNames}
                  onChange={(e) => setBlankNames(e.target.checked)}
                  className="w-4 h-4 accent-sky-600 rounded"
                />
                <span className="text-xs font-bold text-slate-700">
                  Kosongkan Nama & TTD (Template TTD Basah)
                </span>
              </label>
            </div>

            {!blankNames && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Penyedia (IAS Support / Pihak I)
                  </label>
                  <input
                    type="text"
                    value={pihak1Nama}
                    onChange={(e) => setPihak1Nama(e.target.value)}
                    placeholder="Contoh: Cecep Taufiqurohman"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white"
                  />
                  <input
                    type="text"
                    value={pihak1Jabatan}
                    onChange={(e) => setPihak1Jabatan(e.target.value)}
                    placeholder="IAS Support Indonesia (OM PSIT)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 bg-white mt-1"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Mengetahui (Angkasa Pura Indonesia / Pihak II)
                  </label>
                  <input
                    type="text"
                    value={pihak2Nama}
                    onChange={(e) => setPihak2Nama(e.target.value)}
                    placeholder="Contoh: Moh. Taufiqi / Heru S / Vanny S"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white"
                  />
                  <input
                    type="text"
                    value={pihak2Jabatan}
                    onChange={(e) => setPihak2Jabatan(e.target.value)}
                    placeholder="PT. Angkasa Pura Indonesia"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 bg-white mt-1"
                  />
                </div>
              </div>
            )}
            {blankNames && (
              <p className="text-[11px] text-slate-500 italic">
                * Nama dan kolom tanda tangan akan dicetak dengan garis kurung kosong <code className="font-mono bg-white px-1.5 rounded border">(                    )</code> agar siap ditandatangani secara fisik / basah.
              </p>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-between p-5 pt-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 shadow-md shadow-sky-950/20 transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download Berita Acara (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
