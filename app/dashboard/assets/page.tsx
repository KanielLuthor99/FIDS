'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetAssets, apiExportCSV, apiCreateAsset, apiGetReplacementHistory, FIDSAsset } from '@/lib/api';
import {
  Search,
  Download,
  Cpu,
  Monitor,
  Layers,
  Plus,
  History,
} from 'lucide-react';
import AssetDetailModal from '@/components/assets/AssetDetailModal';
import AddAssetModal from '@/components/assets/AddAssetModal';
import AssetExportModal from '@/components/assets/AssetExportModal';
import AssetTable from '@/components/assets/AssetTable';

export default function MasterAssetsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pairing' | 'monitor' | 'minipc' | 'replacement_history'>('pairing');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [terminalFilter, setTerminalFilter] = useState('All');
  const [kondisiFilter, setKondisiFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState<FIDSAsset | null>(null);

  // Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [histPage, setHistPage] = useState(1);
  const histPerPage = 10;

  // Queries
  const { data: assets = [] } = useQuery({
    queryKey: ['master-assets', searchQuery, statusFilter, terminalFilter],
    queryFn: () => apiGetAssets(searchQuery, statusFilter, terminalFilter),
  });

  const { data: replacementHistories = [] } = useQuery({
    queryKey: ['replacement-histories', searchQuery, terminalFilter],
    queryFn: () => apiGetReplacementHistory(searchQuery, terminalFilter, ''),
  });

  const createAssetMutation = useMutation({
    mutationFn: apiCreateAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      setIsAddModalOpen(false);
    },
  });

  // Filter by kondisi chip
  const mapKondisi = (status: string) => {
    if (status === 'Active') return 'Baik';
    if (status === 'Maintenance') return 'Maintenance';
    return 'Rusak';
  };

  const filteredByKondisi = (assets || []).filter((a) => {
    if (kondisiFilter === 'All') return true;
    return mapKondisi(a.status) === kondisiFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredByKondisi.length / perPage));
  const paginatedAssets = filteredByKondisi.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalHistPages = Math.max(1, Math.ceil(replacementHistories.length / histPerPage));
  const paginatedHistories = replacementHistories.slice((histPage - 1) * histPerPage, histPage * histPerPage);

  return (
    <div className="space-y-4">
      {/* ── Navigation Tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveTab('pairing'); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pairing'
              ? 'bg-[#1a2744] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Titik Display FIDS (Pairing)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'pairing' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {assets.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('monitor'); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'monitor'
              ? 'bg-purple-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Inventaris Monitor</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'monitor' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>
            {assets.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('minipc'); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'minipc'
              ? 'bg-blue-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Inventaris Mini PC</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'minipc' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
            {assets.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('replacement_history'); setHistPage(1); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'replacement_history'
              ? 'bg-amber-800 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Penggantian Alat</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'replacement_history' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
            {replacementHistories.length}
          </span>
        </button>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────── */}
      <div className="fids-card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); setHistPage(1); }}
              placeholder={activeTab === 'replacement_history' ? 'Cari nomor seri lama / baru / lokasi...' : 'Cari kode aset / nomor seri / lokasi display...'}
              className="fids-input w-full pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Terminal</span>
            <select
              value={terminalFilter}
              onChange={(e) => { setTerminalFilter(e.target.value); setCurrentPage(1); setHistPage(1); }}
              className="fids-select"
            >
              <option value="All">Semua Terminal</option>
              <option value="1A">Terminal 1A</option>
              <option value="1B">Terminal 1B</option>
              <option value="Terminal 2">Terminal 2</option>
              <option value="3U-INT">Terminal 3 Int</option>
              <option value="3U-DOM">Terminal 3 Dom</option>
              <option value="Non Terminal">Non Terminal</option>
            </select>
          </div>

          {activeTab !== 'replacement_history' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {['All', 'Baik', 'Rusak', 'Maintenance'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setKondisiFilter(chip); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                    kondisiFilter === chip
                      ? chip === 'All'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : chip === 'Baik'
                          ? 'bg-green-600 text-white border-green-600'
                          : chip === 'Rusak'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {chip === 'All' ? 'Semua' : chip}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Ekspor PDF / CSV</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a2744] text-white text-[12px] font-semibold hover:bg-[#243561] transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Aset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Tables ────────────────────────────────────────────────── */}
      <AssetTable
        activeTab={activeTab}
        assets={paginatedAssets}
        replacementHistories={paginatedHistories}
        filteredCount={filteredByKondisi.length}
        currentPage={currentPage}
        totalPages={totalPages}
        histPage={histPage}
        totalHistPages={totalHistPages}
        perPage={perPage}
        histPerPage={histPerPage}
        onPageChange={setCurrentPage}
        onHistPageChange={setHistPage}
        onSelectAsset={setSelectedAsset}
      />

      {/* ── Modals ────────────────────────────────────────────────── */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />

      <AddAssetModal
        isOpen={isAddModalOpen}
        isPending={createAssetMutation.isPending}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(assetData) => createAssetMutation.mutate(assetData as FIDSAsset)}
      />

      <AssetExportModal
        isOpen={isExportModalOpen}
        assets={assets}
        replacementHistories={replacementHistories}
        searchQuery={searchQuery}
        terminalFilter={terminalFilter}
        statusFilter={statusFilter}
        onClose={() => setIsExportModalOpen(false)}
        onExportCSV={() => apiExportCSV(searchQuery, statusFilter, terminalFilter)}
      />
    </div>
  );
}
