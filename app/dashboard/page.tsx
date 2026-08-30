'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiGetMetrics, apiGetLogs } from '@/lib/api';
import {
  Monitor,
  AlertTriangle,
  Package,
  Wrench,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ── Static mock data for charts (replace with API when available) ──────────
const maintenanceChartData = [
  { month: 'Jan', jumlah: 38, selesai: 28 },
  { month: 'Feb', jumlah: 42, selesai: 35 },
  { month: 'Mar', jumlah: 55, selesai: 48 },
  { month: 'Apr', jumlah: 61, selesai: 55 },
  { month: 'Mei', jumlah: 50, selesai: 42 },
  { month: 'Jun', jumlah: 78, selesai: 64 },
];

const terminalConditionData = [
  { terminal: 'T1 Gate', baik: 78, maintenance: 14, rusak: 8 },
  { terminal: 'T1 Check-in', baik: 72, maintenance: 18, rusak: 10 },
  { terminal: 'T2 Gate', baik: 76, maintenance: 16, rusak: 8 },
  { terminal: 'T2 Baggage Claim', baik: 68, maintenance: 20, rusak: 12 },
  { terminal: 'T3 CIQ', baik: 81, maintenance: 12, rusak: 7 },
];

const lowStockAlerts = [
  { name: 'Power Supply Unit', stok: 3, ambang: 10, status: 'Kritis' },
  { name: 'HDMI Splitter', stok: 2, ambang: 5, status: 'Kritis' },
  { name: 'Panel PC Spare', stok: 1, ambang: 3, status: 'Kritis' },
];

// ──────────────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  valueColor,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  valueColor?: string;
}) {
  return (
    <div className="stat-card">
      <p className="text-sm text-slate-500 font-medium mb-2">{title}</p>
      <p className={`text-4xl font-bold ${valueColor || 'text-slate-800'}`}>{value}</p>
      <div
        className="stat-card-icon"
        style={{ color: iconColor }}
      >
        <Icon size={44} />
      </div>
    </div>
  );
}

// Horizontal Stacked Bar Row Component
function StackedBarRow({
  terminal,
  baik,
  maintenance,
  rusak,
}: {
  terminal: string;
  baik: number;
  maintenance: number;
  rusak: number;
}) {
  return (
    <div className="stacked-bar-row">
      <div className="stacked-bar-label">{terminal}</div>
      <div className="stacked-bar-track">
        {/* Baik (green) */}
        <div
          className="flex items-center justify-center text-[11px] font-semibold text-white"
          style={{ width: `${baik}%`, background: '#16a34a' }}
        >
          {baik}%
        </div>
        {/* Maintenance (amber) */}
        <div
          className="flex items-center justify-center text-[11px] font-semibold text-white"
          style={{ width: `${maintenance}%`, background: '#d97706' }}
        >
          {maintenance}%
        </div>
        {/* Rusak (red) */}
        <div
          className="flex items-center justify-center text-[11px] font-semibold text-white"
          style={{ width: `${rusak}%`, background: '#dc2626' }}
        >
          {rusak}%
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: apiGetMetrics,
  });

  const { data: logs } = useQuery({
    queryKey: ['maintenance-logs'],
    queryFn: apiGetLogs,
  });

  // Recent maintenance (last 3)
  const recentLogs = (logs || []).slice(0, 3);

  const totalAset = metrics?.total_assets ?? 1248;
  const asetRusak = metrics?.need_service ?? 27;
  const stokMenipis = 9; // static until spare part API ready
  const maintenanceBulanIni = 64; // static until monthly endpoint ready

  return (
    <div className="space-y-5 animate-fade-in-up">

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Aset"
          value={totalAset.toLocaleString('id-ID')}
          icon={Monitor}
          iconColor="#94a3b8"
        />
        <StatCard
          title="Aset Rusak"
          value={asetRusak}
          icon={AlertTriangle}
          iconColor="#fca5a5"
          valueColor="text-rose-600"
        />
        <StatCard
          title="Stok Menipis"
          value={stokMenipis}
          icon={Package}
          iconColor="#fcd34d"
          valueColor="text-amber-500"
        />
        <StatCard
          title="Maintenance Bulan Ini"
          value={maintenanceBulanIni}
          icon={Wrench}
          iconColor="#94a3b8"
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Left: Maintenance Activity Chart */}
        <div className="fids-card p-5">
          <h2 className="text-[15px] font-semibold text-slate-800 mb-1">
            Aktivitas Maintenance — 6 Bulan Terakhir
          </h2>
          <div className="h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={maintenanceChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  formatter={(value) =>
                    value === 'jumlah' ? 'Jumlah Aktivitas' : 'Selesai'
                  }
                />
                <Bar dataKey="jumlah" fill="#c7d2e7" radius={[3, 3, 0, 0]} name="jumlah" />
                <Line
                  type="monotone"
                  dataKey="selesai"
                  stroke="#1a2744"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#1a2744' }}
                  name="selesai"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Kondisi Aset per Terminal */}
        <div className="fids-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-slate-800">
              Kondisi Aset per Terminal
            </h2>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm inline-block bg-green-600" />
                Baik
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm inline-block bg-amber-500" />
                Maintenance
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm inline-block bg-red-600" />
                Rusak
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {terminalConditionData.map((row) => (
              <StackedBarRow key={row.terminal} {...row} />
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-slate-400 mt-3 pl-[120px]">
            {['0%', '20%', '40%', '60%', '80%', '100%'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Tables Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Left: Alert Stok Rendah */}
        <div className="fids-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Alert Stok Rendah</h2>
            <Link
              href="/dashboard/sparepart"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              Kelola Stok &rarr;
            </Link>
          </div>
          <table className="fids-table">
            <thead>
              <tr>
                <th>Spare Part</th>
                <th className="text-right">Stok Saat Ini</th>
                <th className="text-right">Ambang Batas</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockAlerts.map((item) => (
                <tr key={item.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="font-medium text-slate-700 text-[13px]">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-right font-bold text-rose-600 text-[15px]">{item.stok}</td>
                  <td className="text-right text-slate-500 text-[13px]">{item.ambang}</td>
                  <td className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded border border-rose-300 text-rose-600 text-[12px] font-semibold bg-rose-50">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Aktivitas Maintenance Terbaru */}
        <div className="fids-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">Aktivitas Maintenance Terbaru</h2>
            <Link
              href="/dashboard/maintenance"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
          <table className="fids-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Terminal</th>
                <th>Deskripsi</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap text-[12px] text-slate-500">
                      {new Date(log.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <br />
                      <span className="text-[11px]">
                        {new Date(log.created_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="text-[12px] font-medium text-slate-700">T{log.terminal}</td>
                    <td className="text-[12px] text-slate-600 max-w-[160px]">
                      <span className="line-clamp-2">{log.description}</span>
                    </td>
                    <td className="text-center">
                      {log.type === 'Preventive' ? (
                        <span className="flex items-center justify-center gap-1 text-[12px] text-green-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </span>
                      ) : log.type === 'Corrective' ? (
                        <span className="flex items-center justify-center gap-1 text-[12px] text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5" /> Dalam Proses
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-[12px] text-rose-600 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Terbuka
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                /* Static fallback rows */
                [
                  { date: '11 Agt 2026', time: '13:45', terminal: 'T2 Gate', desc: 'Pergantian Power Supply Unit pada FIDS Gate 12', status: 'Selesai' },
                  { date: '11 Agt 2026', time: '11:20', terminal: 'T1 Check-in', desc: 'Perbaikan HDMI Splitter Check-in Counter D12', status: 'Dalam Proses' },
                  { date: '10 Agt 2026', time: '22:10', terminal: 'T3 CIQ', desc: 'Troubleshooting Panel PC FIDS CIQ 05', status: 'Terbuka' },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap text-[12px] text-slate-500">
                      {item.date}<br /><span className="text-[11px]">{item.time}</span>
                    </td>
                    <td className="text-[12px] font-medium text-slate-700">{item.terminal}</td>
                    <td className="text-[12px] text-slate-600 max-w-[160px]">
                      <span className="line-clamp-2">{item.desc}</span>
                    </td>
                    <td className="text-center">
                      {item.status === 'Selesai' && (
                        <span className="flex items-center justify-center gap-1 text-[12px] text-green-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </span>
                      )}
                      {item.status === 'Dalam Proses' && (
                        <span className="flex items-center justify-center gap-1 text-[12px] text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5" /> Dalam Proses
                        </span>
                      )}
                      {item.status === 'Terbuka' && (
                        <span className="flex items-center justify-center gap-1 text-[12px] text-rose-600 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Terbuka
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
