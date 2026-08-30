import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FIDSAsset, MaintenanceLog, ReplacementHistory } from './api';

export function exportAssetsPDF(
  assets: FIDSAsset[],
  searchQuery: string = '',
  statusFilter: string = '',
  terminalFilter: string = ''
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // 1. Header Banner Background (#0d4440)
  doc.setFillColor(13, 68, 64);
  doc.rect(0, 0, 297, 28, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('INJOURNEY AIRPORTS • LAPORAN REKAPITULASI INVENTARIS ASET AKTIF FIDS', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 243, 208); // Emerald 200
  doc.text(
    'PT Angkasa Pura Indonesia — Inventaris Perangkat Mini PC & Commercial Monitor FIDS',
    14,
    18
  );

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Waktu Cetak: ${formattedDate} WIB`, 205, 18);

  // 2. Sub-header Filter & Statistics Summary Box
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(14, 32, 269, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 32, 269, 14, 'S');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  const total = assets.length;
  const active = assets.filter((a) => a.status === 'Active').length;
  const maint = assets.filter((a) => a.status === 'Maintenance').length;
  const storage = assets.filter((a) => a.status === 'In Storage').length;

  const filterLabel = `Filter: Terminal [${terminalFilter || 'Semua'}]  |  Status [${
    statusFilter || 'Semua'
  }]  |  Kata Kunci [${searchQuery || '-'}]`;
  doc.text(filterLabel, 18, 40);

  const statsLabel = `Total: ${total} Unit   |   Aktif: ${active}   |   Maintenance: ${maint}   |   Cadangan: ${storage}`;
  doc.text(statsLabel, 175, 40);

  // 3. Table Rows Mapping
  const tableData = assets.map((a, index) => [
    (index + 1).toString(),
    a.code,
    `${a.name}\n${a.location_area || '-'}`,
    a.terminal || '-',
    a.ip_address || '-',
    `${a.mini_pc_brand || ''} ${a.mini_pc_model || '-'}\nSN: ${a.mini_pc_sn || '-'}\nOS: ${
      a.mini_pc_os || '-'
    }`,
    `${a.monitor_brand || ''} ${a.monitor_model || '-'} (${a.monitor_size || '-'})\nSN: ${
      a.monitor_sn || '-'
    }\nConv: ${a.monitor_converter || 'Direct Cable'}`,
    `${a.health_score}%`,
    a.status === 'Active' ? 'Aktif' : a.status === 'Maintenance' ? 'Maintenance' : 'Cadangan',
  ]);

  autoTable(doc, {
    startY: 50,
    head: [
      [
        'No',
        'Kode Aset',
        'Nama Display & Lokasi Area',
        'Terminal',
        'IP Address',
        'Spesifikasi Mini PC (Controller)',
        'Spesifikasi Display Panel (Monitor)',
        'Health',
        'Status',
      ],
    ],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [13, 68, 64],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 45 },
      3: { cellWidth: 20 },
      4: { cellWidth: 26 },
      5: { cellWidth: 52 },
      6: { cellWidth: 55 },
      7: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
      8: { cellWidth: 20, halign: 'center' },
    },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Dokumen Laporan Resmi Rekapitulasi Inventaris Aset FIDS  •  Halaman ${data.pageNumber} dari ${pageCount}`,
        14,
        200
      );
    },
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Laporan_Aset_Aktif_FIDS_${dateStr}.pdf`);
}

export function exportReplacementHistoryPDF(
  histories: ReplacementHistory[],
  searchQuery: string = '',
  terminalFilter: string = ''
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // 1. Header Banner Background (#1e293b / Navy)
  doc.setFillColor(26, 39, 68);
  doc.rect(0, 0, 297, 28, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INJOURNEY AIRPORTS • LAPORAN RIWAYAT & AUDIT PENGGANTIAN ALAT (LIFECYCLE)', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(147, 197, 253); // Blue 300
  doc.text(
    'PT Angkasa Pura Indonesia — Audit Trail Log Perangkat Lama Tergantikan (Monitor & Mini PC)',
    14,
    18
  );

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Waktu Cetak: ${formattedDate} WIB`, 205, 18);

  // 2. Sub-header Info Box
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 32, 269, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 32, 269, 14, 'S');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  const filterLabel = `Filter Terminal: [${terminalFilter || 'Semua'}]  |  Pencarian: [${
    searchQuery || '-'
  }]`;
  doc.text(filterLabel, 18, 40);

  const statsLabel = `Total Alat Tergantikan: ${histories.length} Unit Tercatat`;
  doc.text(statsLabel, 205, 40);

  // 3. Table Rows Mapping
  const tableData = histories.map((h, index) => {
    const dateFormatted = h.replaced_at
      ? new Date(h.replaced_at).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

    return [
      (index + 1).toString(),
      h.id,
      dateFormatted,
      `${h.asset_code}\n${h.location_area || h.asset_name} (${h.terminal})`,
      h.component_type,
      `${h.old_brand || ''} ${h.old_model || '-'}\nS/N: ${h.old_sn || '-'}`,
      `${h.new_brand || ''} ${h.new_model || '-'}\nS/N: ${h.new_sn || '-'}`,
      h.reason || 'Pergantian Komponen Rusak',
      h.old_status || 'In Repair',
      h.technician_name || 'Teknisi Maintenance',
    ];
  });

  autoTable(doc, {
    startY: 50,
    head: [
      [
        'No',
        'ID Audit',
        'Tanggal Ganti',
        'Titik Display FIDS & Lokasi',
        'Tipe Alat',
        'Alat Lama (Dicopot)',
        'Alat Baru (Pengganti)',
        'Alasan Penggantian',
        'Status Unit Lama',
        'Teknisi',
      ],
    ],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 39, 68],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 22, fontStyle: 'bold' },
      2: { cellWidth: 28 },
      3: { cellWidth: 42 },
      4: { cellWidth: 18, fontStyle: 'bold' },
      5: { cellWidth: 40 },
      6: { cellWidth: 40 },
      7: { cellWidth: 35 },
      8: { cellWidth: 20, halign: 'center' },
      9: { cellWidth: 18 },
    },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Dokumen Resmi Audit Trail Lifecycle & Penggantian Hardware FIDS  •  Halaman ${data.pageNumber} dari ${pageCount}`,
        14,
        200
      );
    },
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Audit_Riwayat_Penggantian_Alat_FIDS_${dateStr}.pdf`);
}

export function exportLogsPDF(
  logs: MaintenanceLog[],
  searchQuery: string = '',
  terminalFilter: string = ''
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner Background (#0d4440)
  doc.setFillColor(13, 68, 64);
  doc.rect(0, 0, 297, 28, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('INJOURNEY AIRPORTS • LAPORAN REKAPITULASI LOG MAINTENANCE FIDS', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 243, 208);
  doc.text(
    'PT Angkasa Pura Indonesia — Riwayat Pemeliharaan & Swapping Sparepart FIDS',
    14,
    18
  );

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Waktu Cetak: ${formattedDate} WIB`, 205, 18);

  // Sub-header Info Box
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 32, 269, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 32, 269, 14, 'S');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  const filterLabel = `Filter Terminal: [${terminalFilter || 'Semua'}]  |  Pencarian: [${
    searchQuery || '-'
  }]`;
  doc.text(filterLabel, 18, 40);

  const statsLabel = `Total Log Terdata: ${logs.length} Log Maintenance`;
  doc.text(statsLabel, 210, 40);

  // Table Data
  const tableData = logs.map((log, index) => {
    const dateFormatted = log.created_at
      ? new Date(log.created_at).toLocaleString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

    return [
      (index + 1).toString(),
      log.id,
      dateFormatted,
      `${log.asset_code}\n${log.asset_name}`,
      log.terminal || '-',
      log.target_component || 'Sepaket',
      log.type || 'Corrective',
      log.description || '-',
      log.spare_parts_used || '-',
      `${log.health_before}% ➔ ${log.health_after}%`,
    ];
  });

  autoTable(doc, {
    startY: 50,
    head: [
      [
        'No',
        'ID Log',
        'Waktu Pelaksanaan',
        'Kode & Nama Display',
        'Terminal',
        'Komponen Target',
        'Kategori',
        'Deskripsi Tindakan & Analisa',
        'Sparepart / Komponen Pengganti',
        'Perubahan Health',
      ],
    ],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [13, 68, 64],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 18 },
      5: { cellWidth: 25, fontStyle: 'bold' },
      6: { cellWidth: 24 },
      7: { cellWidth: 48 },
      8: { cellWidth: 32 },
      9: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Dokumen Laporan Resmi Rekapitulasi Maintenance & Perbaikan FIDS  •  Halaman ${data.pageNumber} dari ${pageCount}`,
        14,
        200
      );
    },
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Rekap_Maintenance_FIDS_${dateStr}.pdf`);
}

// ─────────────────────────────────────────────────────────────────────────────
// BERITA ACARA PDF GENERATOR (InJourney Airports & IAS Support Official Format)
// ─────────────────────────────────────────────────────────────────────────────

export interface BeritaAcaraData {
  tipeDoc: 'pergantian' | 'serah_terima' | 'dokumentasi';
  tanggal: string; // e.g. "2026-08-19"
  shift: string; // e.g. "Shift Pagi"
  terminal: string; // e.g. "Terminal 3"
  lokasi: string; // e.g. "General Arrivals West Lobby Pilar 1 T3-INT"

  // Barang Baru (Terpasang)
  newItemName: string; // e.g. "Monitor 75 inch SAMSUNG QM75C"
  newItemQty: number; // e.g. 1
  newItemSN: string; // e.g. "0SL9HNIL700014D"
  newItemKet?: string;

  // Barang Lama (Dicopot / Bermasalah)
  oldItemName?: string; // e.g. "Monitor 75 inch BOE SR75AA"
  oldItemQty?: number; // e.g. 1
  oldItemSN?: string; // e.g. "MBVD07010019"
  oldItemStatus?: string; // e.g. "Flashing"
  oldItemKet?: string;

  // Pihak Pertama / Penyedia (IAS Support)
  pihak1Nama: string; // e.g. "Cecep"
  pihak1Jabatan?: string; // e.g. "IAS Support Indonesia (OM PSIT)"

  // Pihak Kedua / Mengetahui (PT Angkasa Pura Indonesia)
  pihak2Nama: string; // e.g. "Moh. Taufiqi / Heru S / Vanny S"
  pihak2Jabatan?: string; // e.g. "PT. Angkasa Pura Indonesia"

  // Opsi TTD Kosong / Basah
  blankNames: boolean;

  // Foto Lampiran (Base64 Data URLs)
  foto1?: string; // Sebelum Pergantian
  foto2?: string; // Proses Pergantian
  foto3?: string; // Serial Number
  foto4?: string; // Hasil Pergantian
}

function numberToWordsID(num: number): string {
  const words = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (num < 12) return words[num];
  if (num < 20) return numberToWordsID(num - 10) + ' Belas';
  if (num < 100) return numberToWordsID(Math.floor(num / 10)) + ' Puluh ' + (num % 10 !== 0 ? numberToWordsID(num % 10) : '');
  if (num < 200) return 'Seratus ' + (num - 100 !== 0 ? numberToWordsID(num - 100) : '');
  if (num < 1000) return numberToWordsID(Math.floor(num / 100)) + ' Ratus ' + (num % 100 !== 0 ? numberToWordsID(num % 100) : '');
  if (num < 2000) return 'Seribu ' + (num - 1000 !== 0 ? numberToWordsID(num - 1000) : '');
  if (num < 1000000) return numberToWordsID(Math.floor(num / 1000)) + ' Ribu ' + (num % 1000 !== 0 ? numberToWordsID(num % 1000) : '');
  return num.toString();
}

function formatFullDateIndonesian(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) {
    return { dayName: 'Rabu', dayNumText: 'Sembilan Belas', monthText: 'Agustus', yearText: 'Dua Ribu Dua Puluh Enam', dateFormatted: '19/08/2026' };
  }

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const dayName = days[d.getDay()];
  const dayNum = d.getDate();
  const monthText = months[d.getMonth()];
  const yearNum = d.getFullYear();

  const dayNumText = numberToWordsID(dayNum);
  const yearText = numberToWordsID(yearNum);

  const dd = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
  const mm = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const dateFormatted = `${dd}/${mm}/${yearNum}`;

  return { dayName, dayNumText, monthText, yearText, dateFormatted };
}

export function exportBeritaAcaraPDF(data: BeritaAcaraData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { dayName, dayNumText, monthText, yearText, dateFormatted } = formatFullDateIndonesian(data.tanggal);

  // Helper Header Logo Text (InJourney Airports & IAS Support)
  const renderHeaderLogos = () => {
    // Left Branding Logo (InJourney Airports)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 43, 73); // Dark Navy
    doc.text('injourney', 15, 16);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 163, 224); // Cyan
    doc.text('A I R P O R T S', 15, 20);

    // Right Branding Logo (IAS Support)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(0, 43, 73);
    doc.text('IAS', 165, 16);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 163, 224);
    doc.text('S U P P O R T', 165, 20);
  };

  if (data.tipeDoc === 'pergantian') {
    // ── 1. BERITA ACARA PERGANTIAN BARANG ──────────────────────────────────────
    renderHeaderLogos();

    // Judul Dokumen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('BERITA ACARA PERGANTIAN BARANG', 105, 30, { align: 'center' });

    // Paragraf Pembuka
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const shiftLabel = data.shift ? ` (${data.shift})` : '';
    doc.text(
      `Pada hari ini ${dayName}, tanggal ${dayNumText} bulan ${monthText} tahun ${yearText} (${dateFormatted})${shiftLabel}, Kami yang bertanda tangan di bawah ini :`,
      15,
      40
    );

    let startY = 48;
    const p1Nama = data.blankNames ? '' : (data.pihak1Nama || 'Cecep Taufiqurohman');
    const p2Nama = data.blankNames ? '' : (data.pihak2Nama || 'Moh. Taufiqi / Heru S / Vanny S');

    // Pihak Pertama (Penyedia / Pelaksana)
    doc.text(`Nama             : ${p1Nama}`, 25, startY);
    doc.text(`Unit/instansi  : ${data.pihak1Jabatan || 'IAS Support Indonesia (OM PSIT)'}`, 25, startY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('Selanjutnya disebut sebagai PIHAK PERTAMA (Pelaksana)', 25, startY + 12);

    startY += 20;
    doc.setFont('helvetica', 'normal');
    // Pihak Kedua (Pengelola / Mengetahui)
    doc.text(`Nama             : ${p2Nama}`, 25, startY);
    doc.text(`Unit/instansi  : ${data.pihak2Jabatan || 'PT. Angkasa Pura Indonesia'}`, 25, startY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('Selanjutnya disebut sebagai PIHAK KEDUA (Mengetahui)', 25, startY + 12);

    startY += 20;
    doc.setFont('helvetica', 'normal');
    const oldItemNameText = data.oldItemName || data.newItemName;
    const pPernyataan = `PIHAK PERTAMA telah melaksanakan pekerjaan pergantian perangkat FIDS pada ${data.lokasi} (${data.terminal}), dan PIHAK KEDUA telah memeriksa serta menyetujui hasil pergantian dengan rincian sebagai berikut:`;
    doc.text(doc.splitTextToSize(pPernyataan, 180), 15, startY);

    startY += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Daftar Rincian Pergantian Barang :', 15, startY);
    startY += 3;

    const ketTerpasang = data.newItemKet || `Normal / Siap Operasi (${data.lokasi})`;
    const statusKerusakan = data.oldItemStatus ? `Status: ${data.oldItemStatus}` : 'Rusak';
    const ketBermasalah = data.oldItemKet || `${statusKerusakan} (${data.lokasi})`;

    autoTable(doc, {
      startY: startY,
      head: [['No', 'STATUS PERANGKAT', 'NAMA & TIPE BARANG', 'QTY', 'SERIAL NUMBER', 'KETERANGAN']],
      body: [
        [
          '1.',
          'Barang Baru (Terpasang)',
          data.newItemName,
          (data.newItemQty || 1).toString(),
          data.newItemSN || '-',
          ketTerpasang,
        ],
        [
          '2.',
          'Barang Lama (Dicopot)',
          oldItemNameText,
          (data.oldItemQty || 1).toString(),
          data.oldItemSN || '-',
          ketBermasalah,
        ],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        lineWidth: 0.15,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 8.5,
        cellPadding: 3.5,
        lineWidth: 0.15,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 42, fontStyle: 'bold', halign: 'left' },
        2: { cellWidth: 46, halign: 'left' },
        3: { cellWidth: 14, halign: 'center' },
        4: { cellWidth: 34, fontStyle: 'bold', halign: 'center' },
        5: { cellWidth: 34, halign: 'left' },
      },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Demikian Berita Acara Pergantian Barang ini dibuat oleh kedua belah pihak untuk dapat dipergunakan sebagaimana mestinya.',
      15,
      startY
    );

    // TTD Section
    startY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('(PIHAK PERTAMA)', 50, startY, { align: 'center' });
    doc.text('(PIHAK KEDUA)', 150, startY, { align: 'center' });

    startY += 26;
    const ttdP1 = data.blankNames ? '(                                            )' : `( ${data.pihak1Nama || 'Cecep'} )`;
    const ttdP2 = data.blankNames ? '(                                            )' : `( ${data.pihak2Nama || 'Moh. Taufiqi / Heru S / Vanny S'} )`;

    doc.text(ttdP1, 50, startY, { align: 'center' });
    doc.text(ttdP2, 150, startY, { align: 'center' });

    doc.save(`BA_Pergantian_Barang_${data.newItemSN || 'FIDS'}_${dateFormatted.replace(/\//g, '')}.pdf`);

  } else if (data.tipeDoc === 'serah_terima') {
    // ── 2. BERITA ACARA SERAH TERIMA BARANG ───────────────────────────────────
    renderHeaderLogos();

    // Judul
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('BERITA ACARA SERAH TERIMA BARANG', 105, 30, { align: 'center' });

    // Paragraf Pembuka
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`Pada hari ini ${dayName}, tanggal ${dayNumText} bulan ${monthText} tahun ${yearText} (${dateFormatted}), Kami yang bertanda tangan di bawah ini :`, 15, 40);

    let startY = 48;
    const p1Nama = data.blankNames ? '' : (data.pihak1Nama || 'Cecep Taufiqurohman');
    const p2Nama = data.blankNames ? '' : (data.pihak2Nama || 'Heru Sabrides');

    doc.text(`Nama             : ${p1Nama}`, 25, startY);
    doc.text(`Unit/instansi  : ${data.pihak1Jabatan || 'IAS Support Indonesia (OM PSIT)'}`, 25, startY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('Selanjutnya di sebut sebagai PIHAK PERTAMA', 25, startY + 12);

    startY += 20;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nama             : ${p2Nama}`, 25, startY);
    doc.text(`Unit/instansi  : ${data.pihak2Jabatan || 'PT. Angkasa Pura Indonesia'}`, 25, startY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('Selanjutnya disebut sebagai PIHAK KEDUA', 25, startY + 12);

    startY += 20;
    doc.setFont('helvetica', 'normal');
    const pPernyataan = `PIHAK PERTAMA menyerahkan barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima barang dari PIHAK PERTAMA berupa daftar terlampir:`;
    doc.text(doc.splitTextToSize(pPernyataan, 180), 15, startY);

    startY += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Daftar Barang :', 15, startY);
    startY += 3;

    autoTable(doc, {
      startY: startY,
      head: [['No', 'JENIS BARANG', 'JUMLAH', 'Serial Number', 'Keterangan']],
      body: [[
        '1.',
        data.newItemName,
        (data.newItemQty || 1).toString(),
        data.newItemSN || '-',
        data.newItemKet || 'Baru & Normal'
      ]],
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        lineWidth: 0.15,
        lineColor: [0, 0, 0]
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 8.5,
        cellPadding: 3,
        lineWidth: 0.15,
        lineColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 55, fontStyle: 'bold', halign: 'left' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 50, fontStyle: 'bold', halign: 'center' },
        4: { cellWidth: 43, halign: 'left' },
      },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'normal');
    doc.text('Demikian Berita Acara Serah Terima Barang ini di buat oleh kedua belah pihak untuk dapat di pergunakan sebagaimana mestinya .', 15, startY);

    // TTD Section
    startY += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('(PIHAK PERTAMA)', 50, startY, { align: 'center' });
    doc.text('(PIHAK KEDUA)', 150, startY, { align: 'center' });

    startY += 26;
    const ttdP1 = data.blankNames ? '(                                            )' : `( ${data.pihak1Nama || 'Cecep'} )`;
    const ttdP2 = data.blankNames ? '(                                            )' : `( ${data.pihak2Nama || 'Heru S'} )`;

    doc.text(ttdP1, 50, startY, { align: 'center' });
    doc.text(ttdP2, 150, startY, { align: 'center' });

    doc.save(`BA_Serah_Terima_${data.newItemSN || 'FIDS'}_${dateFormatted.replace(/\//g, '')}.pdf`);

  } else {
    // ── 3. DOKUMENTASI PERGANTIAN BARANG ──────────────────────────────────────
    renderHeaderLogos();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('DOKUMENTASI PERGANTIAN BARANG', 105, 30, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let startY = 40;

    doc.text(`Hari / Tanggal   : ${dayName} / ${dateFormatted} (${data.shift || 'Shift Pagi'})`, 15, startY);
    doc.text(`Detail Barang     : ${data.newItemName}`, 15, startY + 5);
    doc.text(`Total Barang     : ${data.newItemQty || 1}`, 15, startY + 10);
    doc.text(`Lokasi & SN      : ${data.lokasi} (SN: ${data.newItemSN})`, 15, startY + 15);
    doc.text(`Lampiran           : Hasil Dokumentasi Pergantian Barang`, 15, startY + 20);

    startY += 28;

    // Grid Foto 2x2
    const boxW = 85;
    const boxH = 65;

    // Box 1
    doc.setDrawColor(180, 180, 180);
    doc.rect(15, startY, boxW, boxH);
    if (data.foto1) {
      try { doc.addImage(data.foto1, 'JPEG', 16, startY + 1, boxW - 2, boxH - 2); } catch (e) {}
    }
    doc.setFontSize(8);
    doc.text(`(Sebelum Pergantian)`, 15 + boxW / 2, startY + boxH + 5, { align: 'center' });
    doc.text(`${data.oldItemName || data.newItemName} pada ${data.lokasi}`, 15 + boxW / 2, startY + boxH + 9, { align: 'center' });

    // Box 2
    doc.rect(110, startY, boxW, boxH);
    if (data.foto2) {
      try { doc.addImage(data.foto2, 'JPEG', 111, startY + 1, boxW - 2, boxH - 2); } catch (e) {}
    }
    doc.text(`(Proses Pergantian)`, 110 + boxW / 2, startY + boxH + 5, { align: 'center' });
    doc.text(`Pemasangan unit baru oleh teknisi`, 110 + boxW / 2, startY + boxH + 9, { align: 'center' });

    startY += boxH + 18;

    // Box 3
    doc.rect(15, startY, boxW, boxH);
    if (data.foto3) {
      try { doc.addImage(data.foto3, 'JPEG', 16, startY + 1, boxW - 2, boxH - 2); } catch (e) {}
    }
    doc.text(`(Serial Number Unit Baru)`, 15 + boxW / 2, startY + boxH + 5, { align: 'center' });
    doc.text(`SN: ${data.newItemSN}`, 15 + boxW / 2, startY + boxH + 9, { align: 'center' });

    // Box 4
    doc.rect(110, startY, boxW, boxH);
    if (data.foto4) {
      try { doc.addImage(data.foto4, 'JPEG', 111, startY + 1, boxW - 2, boxH - 2); } catch (e) {}
    }
    doc.text(`(Hasil Pergantian)`, 110 + boxW / 2, startY + boxH + 5, { align: 'center' });
    doc.text(`Display berfungsi normal pada ${data.lokasi}`, 110 + boxW / 2, startY + boxH + 9, { align: 'center' });

    doc.save(`Dokumentasi_Pergantian_${data.newItemSN || 'FIDS'}_${dateFormatted.replace(/\//g, '')}.pdf`);
  }
}



