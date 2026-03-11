import YoutubeTracker from "@/components/YoutubeTracker";
import AgendaList from "@/components/AgendaList";
import StreakAnimation from "@/components/StreakAnimation";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 1. Ambil data asli database
  const activeAcademicTasks = await prisma.task.count({ where: { category: "AKADEMIK", isDone: false } });
  
  // Target GSA (23 Maret 2026)
  const targetDate = new Date("2026-03-23");
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const gsaCountdown = diffDays > 0 ? diffDays : 0;

  // 2. Logika Streak
  const isStreakActive = true; 
  const streakDay = 12;

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Halo, Haikal! 👋</h2>
          <p className="text-slate-500 mt-1">Fokusmu hari ini sudah Naksu siapkan. Mari selesaikan.</p>
        </div>
        
        {/* ANIMASI STREAK LOTTIE */}
        <StreakAnimation isActive={isStreakActive} day={streakDay} />
      </header>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <YoutubeTracker />
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-blue-500 flex flex-col justify-center">
          <h3 className="text-slate-500 font-medium text-sm">Tugas Akademik Aktif</h3>
          <p className="text-2xl font-bold text-slate-800 mt-2">{activeAcademicTasks} Tugas</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-amber-500 flex flex-col justify-center">
          <h3 className="text-slate-500 font-medium text-sm">GSA Countdown</h3>
          <p className="text-2xl font-bold text-slate-800 mt-2">{gsaCountdown} Hari</p>
        </div>
      </div>

      {/* Area List Tugas */}
      <AgendaList />
    </>
  );
}