'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import {
  LayoutDashboard,
  Tv,
  Wrench,
  Package,
  Network,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
} from 'lucide-react';

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des',
  ];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return (
    <span className="text-sm text-slate-600 font-medium whitespace-nowrap">
      {dayName}, {date} {month} {year} · {hours}:{minutes} WIB
    </span>
  );
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/assets': 'Aset',
  '/dashboard/maintenance': 'Maintenance',
  '/dashboard/sparepart': 'Spare Part',
  '/dashboard/map': 'Peta Aset',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/assets', label: 'Aset', icon: Tv },
    { href: '/dashboard/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/dashboard/sparepart', label: 'Spare Part', icon: Package },
  ];

  const bottomNavItems = [
    { href: '/dashboard/map', label: 'Data Network & AOCC', icon: Network },
  ];

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#f0f2f5] text-slate-800 antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[160px] bg-[#1a2744] text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Logo Area */}
        <div className="px-4 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
              <img
                src="/injourney-logo.png"
                alt="InJourney"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white leading-tight">INJOURNEY</div>
              <div className="text-[9px] text-blue-300 leading-tight">AIRPORTS</div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-white/60 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-4 py-3 border-b border-white/10">
          <span className="text-[10px] text-blue-300/80 font-medium">FIDS Asset Management</span>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-0.5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:bg-white/8 hover:text-white transition-all duration-150"
              >
                <Icon className="w-[18px] h-[18px] shrink-0 text-slate-400" />
                <span className="leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[160px]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-[60px] bg-white border-b border-slate-200 px-5 flex items-center justify-between shadow-sm">
          {/* Left: Hamburger + Logo text (mobile) | Logo/text for brand (desktop) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Logo inside header (mobile only) */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-[#1a2744] rounded-md flex items-center justify-center">
                <img
                  src="/injourney-logo.png"
                  alt="InJourney"
                  className="w-5 h-5 object-contain brightness-0 invert"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <span className="text-sm font-bold text-slate-800">FIDS Asset Management</span>
            </div>
            {/* Desktop: Separator + app name */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-px h-5 bg-slate-200" />
              <span className="text-sm text-slate-500 font-medium">FIDS Asset Management</span>
            </div>
          </div>

          {/* Center: Page Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-slate-800 hidden sm:block">
            {pageTitle}
          </h1>

          {/* Right: Clock + User */}
          {/* Right: Live Clock & Logout Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LiveClock />
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari Sistem"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-7 max-w-[1400px] w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200 bg-white">
          © 2026 InJourney Airports. Semua hak dilindungi.
        </footer>
      </div>

      {/* Click outside to close dropdown */}
      {userDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
      )}
    </div>
  );
}
