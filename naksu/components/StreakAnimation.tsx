"use client";

import dynamic from 'next/dynamic';

// Panggil DotLottiePlayer di sini (karena file ini adalah Client Component)
const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then((mod) => mod.DotLottiePlayer),
  { ssr: false } 
);

export default function StreakAnimation({ isActive, day }: { isActive: boolean, day: number }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-sm group cursor-default transition-all ${
      isActive 
      ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' 
      : 'bg-slate-100 border-slate-200'
    }`}>
      <div className="w-12 h-12 flex items-center justify-center drop-shadow-md">
        <DotLottiePlayer
          src={isActive ? "/animations/streak-on.json" : "/animations/streak-off.json"}
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div>
        <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-0.5 ${isActive ? 'text-orange-800' : 'text-slate-500'}`}>
          Productivity Streak
        </p>
        <p className={`text-xl font-black leading-none ${isActive ? 'text-orange-600' : 'text-slate-600'}`}>
          Day {day}
        </p>
      </div>
    </div>
  );
}