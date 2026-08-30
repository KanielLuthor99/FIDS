import React from 'react';
import { X, Download, FileText, History, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { FIDSAsset, ReplacementHistory } from '@/lib/api';
import { exportAssetsPDF, exportReplacementHistoryPDF } from '@/lib/exportPdf';

interface AssetExportModalProps {
  isOpen: boolean;
  assets: FIDSAsset[];
  replacementHistories: ReplacementHistory[];
  searchQuery: string;
  terminalFilter: string;
  statusFilter: string;
  onClose: () => void;
  onExportCSV: () => void;
}

export default function AssetExportModal({
  isOpen,
  assets,
  replacementHistories,
  searchQuery,
  terminalFilter,
  onClose,
  onExportCSV,
}: AssetExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <span className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
            <Download className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Pusat Unduh Dokumen & Laporan Aset
            </h3>
            <p className="text-xs text-slate-500">
              Pilih format laporan inventaris yang ingin diekspor.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* OPSI 1: PDF REKAPITULASI ASET AKTIF */}
          <div
            onClick={() => {
              exportAssetsPDF(assets, searchQuery, terminalFilter);
              onClose();
            }}
            className="group p-4 rounded-2xl border border-slate-200 hover:border-[#1a2744] hover:bg-slate-50/80 cursor-pointer transition-all flex items-start gap-4"
          >
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1a2744]">
                  1. Laporan Rekapitulasi Inventaris Aset Aktif (PDF)
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {assets.length} Unit
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Mencakup seluruh unit Mini PC dan Monitor komersial yang <strong>saat ini aktif beroperasi terpasang</strong> di Terminal 1, 2, 3 & Non-Terminal.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#1a2744] group-hover:translate-x-1 transition-all shrink-0 mt-3" />
          </div>

          {/* OPSI 2: AUDIT & HISTORY ALAT LAMA */}
          <div
            onClick={() => {
              exportReplacementHistoryPDF(replacementHistories, searchQuery, terminalFilter);
              onClose();
            }}
            className="group p-4 rounded-2xl border border-slate-200 hover:border-amber-700 hover:bg-amber-50/50 cursor-pointer transition-all flex items-start gap-4"
          >
            <div className="p-3 rounded-xl bg-amber-100 text-amber-800 group-hover:scale-105 transition-transform shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-900">
                  2. Laporan Riwayat & Audit Penggantian Alat (PDF)
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {replacementHistories.length} Log
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Melacak seluruh <strong>perangkat lama yang telah digantikan (dicopot)</strong>, riwayat nomor seri (S/N) lama vs baru, tanggal penggantian, alasan kerusakan & teknisi.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-800 group-hover:translate-x-1 transition-all shrink-0 mt-3" />
          </div>

          {/* OPSI 3: EXPORT RAW CSV */}
          <div
            onClick={() => {
              onExportCSV();
              onClose();
            }}
            className="p-3.5 rounded-2xl border border-dashed border-slate-300 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between text-xs text-slate-600 font-semibold"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download File Spreadsheet (.CSV)</span>
            </div>
            <span className="text-[11px] text-slate-400">Excel Compatible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
