"use client";

import { useState } from "react";

type CourseProps = { id: string; name: string; sks: number; subType: string; lecturer: string; dayName: string; time: string; };

export default function AttendanceCard({ course, attendance, onUpdate }: { course: CourseProps, attendance: number[], onUpdate: (newAtt: number[]) => void }) {
  const [penMode, setPenMode] = useState<number>(1); 

  const handleBoxClick = (index: number) => {
    const newAtt = [...attendance];
    newAtt[index] = penMode;
    onUpdate(newAtt);
  };

  const getBgColor = (status: number) => {
    if (status === 1) return "bg-[#10B981] text-white border-[#059669]"; 
    if (status === 2) return "bg-[#F59E0B] text-white border-[#D97706]"; 
    if (status === 3) return "bg-[#EF4444] text-white border-[#DC2626]"; 
    return "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"; 
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="font-bold text-slate-800 text-sm leading-tight">{course.name} ({course.subType})</h3>
        <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded shrink-0">{course.sks} SKS</span>
      </div>
      <div className="mb-4">
        <p className="text-xs text-slate-600 font-semibold">{course.lecturer}</p>
        <p className="text-xs text-slate-500 mt-1">{course.dayName}, {course.time}</p>
      </div>

      <div className="flex gap-2 mb-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
        <button onClick={() => setPenMode(1)} className={`text-xs px-2 py-1 rounded font-bold transition-all ${penMode === 1 ? 'bg-[#10B981] text-white' : 'text-slate-500 hover:bg-slate-200'}`}>Hadir</button>
        <button onClick={() => setPenMode(2)} className={`text-xs px-2 py-1 rounded font-bold transition-all ${penMode === 2 ? 'bg-[#F59E0B] text-white' : 'text-slate-500 hover:bg-slate-200'}`}>Izin/Sakit</button>
        <button onClick={() => setPenMode(3)} className={`text-xs px-2 py-1 rounded font-bold transition-all ${penMode === 3 ? 'bg-[#EF4444] text-white' : 'text-slate-500 hover:bg-slate-200'}`}>Alpa</button>
        <button onClick={() => setPenMode(0)} className={`text-xs px-2 py-1 rounded font-bold transition-all ${penMode === 0 ? 'bg-slate-300 text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>Hapus</button>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {attendance.map((status, i) => (
          <button key={i} onClick={() => handleBoxClick(i)} className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold rounded border transition-colors ${getBgColor(status)}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}