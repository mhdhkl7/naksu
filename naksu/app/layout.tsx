import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, BookOpen, Users, Megaphone, Target, Sparkles } from "lucide-react";
import GeminiChat from "@/components/GeminiChat";
import NewsRadar from "@/components/NewsRadar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naksu AI Dashboard",
  description: "Sistem Produktivitas Mahasiswa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Kontainer utama yang bisa berubah arah: Ke samping (Desktop) atau Ke bawah (Mobile) */}
        <div className="flex flex-col xl:flex-row min-h-screen bg-slate-50 text-slate-800 font-sans">
          
          {/* 1. SIDEBAR KIRI (Navigasi) */}
          <aside className="w-full xl:w-64 bg-white border-b xl:border-b-0 xl:border-r border-slate-200 p-4 xl:p-6 flex flex-col gap-4 shrink-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">N</div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Naksu</h1>
            </div>
            
            {/* Navigasi bisa digeser ke samping kalau di HP */}
            <nav className="flex flex-row xl:flex-col gap-2 overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
              <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" color="text-slate-500" />
              <NavItem href="/akademik" icon={<BookOpen size={20} />} label="Akademik" color="text-blue-500" />
              <NavItem href="/upm" icon={<Users size={20} />} label="UPM English" color="text-emerald-500" />
              <NavItem href="/komting" icon={<Megaphone size={20} />} label="Komting" color="text-orange-500" />
              <NavItem href="/proyek" icon={<Target size={20} />} label="Proyek Spesial" color="text-amber-500" />
            </nav>
          </aside>

          {/* 2. MAIN CONTENT (Tengah - Bebas Bergerak) */}
          <main className="flex-1 w-full p-4 md:p-6 lg:p-8 xl:h-screen xl:overflow-y-auto">
            {children}
          </main>

          {/* 3. RADAR & AI (Kanan) - Akan turun ke paling bawah kalau di HP */}
          <aside className="w-full xl:w-[350px] bg-white border-t xl:border-t-0 xl:border-l border-slate-200 p-4 xl:p-6 flex flex-col gap-4 shrink-0 z-20 xl:h-screen xl:overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-800 shrink-0 mb-2">
              <Sparkles size={20} className="text-purple-500" />
              <h2 className="font-bold text-lg">Naksu AI & Radar</h2>
            </div>
            <GeminiChat />
            <NewsRadar />
          </aside>

        </div>
      </body>
    </html>
  );
}

// Komponen Pembantu Menu Navigasi
function NavItem({ icon, label, href, color = "text-slate-400" }: { icon: React.ReactNode, label: string, href: string, color?: string }) {
  return (
    <a href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 xl:w-full">
      <span className={color}>{icon}</span>
      <span className="inline">{label}</span>
    </a>
  );
}