## 🚀 BAGIAN 1: Panduan Menjalankan di Komputer Lokal (Localhost)

Ikuti langkah-langkah di bawah ini setelah melakukan `git clone` proyek ini ke komputer Anda.

### 📋 Prasyarat Sistem (Prerequisites)
Pastikan komputer Anda sudah terinstal:
1. **Node.js** (Versi 18 ke atas) 👉 [Download Node.js](https://nodejs.org/)
2. **Go (Golang)** (Versi 1.21 ke atas) 👉 [Download Golang](https://go.dev/dl/)
3. **MySQL / XAMPP** *(Opsional)* — Jika MySQL tidak dinyalakan, sistem otomatis menggunakan *In-Memory CSV Engine*.

---

### 1️⃣ Clone Repositori
Buka Terminal / Git Bash / Command Prompt, lalu jalankan:
```bash
git clone https://github.com/USERNAME_ANDA/FIDS.git
cd FIDS
```

---

### 2️⃣ Menjalankan Backend (Go Gin)
1. Buka Terminal baru, lalu masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Jalankan server backend:
   ```bash
   go run main.go
   ```
3. Backend akan berjalan di `http://localhost:8080` (atau port `8088` otomatis jika port 8080 sedang dipakai).
4. **💡 Info Mode Database:**
   * Jika MySQL aktif di port 3306, backend otomatis membuat tabel (*auto-migrate*) dan mengisi data.
   * Jika MySQL mati, backend otomatis mengeluarkan log:
     ```
     ⚠️ MySQL not reachable on localhost:3306.
     ⚡ Running with In-Memory CSV Engine (Full data loaded directly from CSVs)
     ```
     Aplikasi tetap berjalan 100% menggunakan data dari file CSV di memori RAM!

---

### 3️⃣ Menjalankan Frontend (Next.js)
1. Buka Terminal baru (di folder root `FIDS`):
2. Instal seluruh dependensi:
   ```bash
   npm install
   ```
3. Jalankan server frontend mode development:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses:
   👉 **`http://localhost:3000`**


# 📁 Struktur Folder Proyek

```text
FIDS/
├── app/                        # Halaman Frontend (Next.js 14 App Router)
│   ├── dashboard/              # Halaman Dashboard, Aset, Maintenance, Sparepart
│   ├── login/                  # Halaman Login
│   ├── layout.tsx              # Root Layout
│   └── globals.css             # Konfigurasi CSS & Tailwind
├── components/                 # Komponen UI Modular
│   ├── assets/                 # Modal & Tabel Inventaris Aset
│   ├── maintenance/            # Modal & Tabel Log Perbaikan
│   ├── sparepart/              # Modal & Wizard Swap Suku Cadang
│   └── Providers.tsx           # Context Auth & React Query Provider
├── backend/                    # Backend API (Go Gin Gonic)
│   ├── database/               # Logic Database & In-Memory CSV Engine
│   ├── handlers/               # Controller REST API Endpoints
│   ├── models/                 # Struct Data Model (Asset, Log, Sparepart)
│   ├── main.go                 # Entry point server Go & API Routing
│   └── go.mod                  # Dependensi Go Backend
├── public/                     # Aset Gambar & Logo InJourney
├── Data ASET PSIT...csv        # Dataset Asli Inventaris FIDS Terminal 1, 2, & 3
├── PANDUAN_PRESENTASI_12JAM.md # Panduan Belajar & Skrip Demo Presentasi
├── LOGBOOK_KEGIATAN.md         # Jurnal Kegiatan Harian Magang/Proyek
└── README.md                   # Dokumentasi Utama Proyek
