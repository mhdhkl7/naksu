"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Plus, X } from "lucide-react";
import AttendanceCard from "./AttendanceCard";

const defaultCourses = [
  { id: "c1", sem: 4, name: "Pemrograman Aplikasi Bisnis", sks: 4, day: 1, type: "Teori & Praktik", lecturer: "Mikha Dayan Sinaga" },
  { id: "c2", sem: 4, name: "Organisasi & Arsitektur Komputer", sks: 4, day: 2, type: "Teori", lecturer: "M. Fachrurrozi Nst" },
  { id: "c3", sem: 4, name: "Kecerdasan Buatan", sks: 4, day: 3, type: "Teori & Praktik", lecturer: "Putri Athirah Thaibur" },
  { id: "c4", sem: 4, name: "Inklusivitas dan Multikulturalisme", sks: 2, day: 4, type: "Teori", lecturer: "Muhammad Irfan" },
  { id: "c5", sem: 4, name: "Keberagamaan", sks: 2, day: 4, type: "Teori", lecturer: "Dr. Ernida Marbun" },
  { id: "c6", sem: 4, name: "Jaringan Komputer", sks: 4, day: 5, type: "Teori & Praktik", lecturer: "Nita Sari Br Sembiring" }
];

export default function AkademikClient() {
  const [view, setView] = useState<"dashboard" | "detail">("dashboard");
  const [selectedSem, setSelectedSem] = useState(4);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [courses, setCourses] = useState<any[]>([]);
  const [grades, setGrades] = useState<Record<string, { uts: string, uas: string, tugas: string, quiz: string }>>({});
  const [attendanceData, setAttendanceData] = useState<Record<string, number[]>>({});
  const [isClient, setIsClient] = useState(false);

  // --- STATE UNTUK FORM TAMBAH MATKUL ---
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", sks: 2, day: 1, type: "Teori", lecturer: "" });

  const daysName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => {
    setIsClient(true);
    const savedCourses = localStorage.getItem('naksu-courses');
    setCourses(savedCourses ? JSON.parse(savedCourses) : defaultCourses);

    const savedGrades = localStorage.getItem('naksu-grades');
    if (savedGrades) setGrades(JSON.parse(savedGrades));

    const savedAtt = localStorage.getItem('naksu-attendance');
    if (savedAtt) setAttendanceData(JSON.parse(savedAtt));
  }, []);

  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // --- FUNGSI MENYIMPAN MATKUL BARU ---
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const courseToAdd = {
      id: `c-${Date.now()}`,
      sem: selectedSem, // Otomatis masuk ke semester yang sedang dibuka
      name: newCourse.name,
      sks: Number(newCourse.sks),
      day: Number(newCourse.day),
      type: newCourse.type,
      lecturer: newCourse.lecturer
    };
    
    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    saveState('naksu-courses', updatedCourses);
    
    // Reset & Tutup Form
    setNewCourse({ name: "", sks: 2, day: 1, type: "Teori", lecturer: "" });
    setIsAddingCourse(false);
  };

  const updateGrade = (courseId: string, field: string, val: string) => {
    const numVal = val.replace(/[^0-9]/g, '').slice(0,3); 
    const newGrades = { ...grades, [courseId]: { ...grades[courseId], [field]: numVal } };
    setGrades(newGrades);
    saveState('naksu-grades', newGrades);
  };

  const updateAttendance = (cardId: string, newAtt: number[]) => {
    const newData = { ...attendanceData, [cardId]: newAtt };
    setAttendanceData(newData);
    saveState('naksu-attendance', newData);
  };

  // --- MESIN PEMECAH JADWAL CERDAS (UPDATE) ---
  const getExpandedSchedule = (dayIndex: number, semFilter: number) => {
    const dailyOriginals = courses.filter(c => c.sem === semFilter && c.day === dayIndex);
    let expanded: any[] = [];
    
    dailyOriginals.forEach(c => {
      // Aturan 1: Teori & Praktik (Pecah 2)
      if (c.type === "Teori & Praktik") {
        expanded.push({ ...c, cardId: `${c.id}-teori`, subType: "Teori", subSks: c.sks / 2 });
        expanded.push({ ...c, cardId: `${c.id}-praktik`, subType: "Praktik", subSks: c.sks / 2 });
      } 
      // Aturan 2: Teori Murni 4 SKS (Pecah 2 Sesi)
      else if (c.type === "Teori" && c.sks === 4) {
        expanded.push({ ...c, cardId: `${c.id}-sesi1`, subType: "Teori (Sesi 1)", subSks: 2 });
        expanded.push({ ...c, cardId: `${c.id}-sesi2`, subType: "Teori (Sesi 2)", subSks: 2 });
      } 
      // Aturan 3: Teori Biasa (Tidak Pecah)
      else {
        expanded.push({ ...c, cardId: c.id, subType: c.type, subSks: c.sks });
      }
    });

    // Menentukan Jam otomatis
    return expanded.map((item, idx) => ({
      ...item,
      time: idx === 0 ? "14.00 s/d 15.20" : "15.40 s/d 17.00"
    }));
  };

  const calculateGPA = (semFilter?: number) => {
    let totalScore = 0;
    let totalSks = 0;
    const filterCourses = semFilter ? courses.filter(c => c.sem === semFilter) : courses;

    filterCourses.forEach(c => {
      const g = grades[c.id] || { uts: 0, uas: 0, tugas: 0, quiz: 0 };
      const avg = (Number(g.uts||0) + Number(g.uas||0) + Number(g.tugas||0) + Number(g.quiz||0)) / 4;
      
      let weight = 0;
      if (avg >= 85) weight = 4;
      else if (avg >= 75) weight = 3;
      else if (avg >= 65) weight = 2;
      else if (avg >= 55) weight = 1;

      if (avg > 0) { 
        totalScore += (weight * c.sks);
        totalSks += c.sks;
      }
    });

    return totalSks > 0 ? (totalScore / totalSks).toFixed(2) : "0.00";
  };

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const dayOfWeek = selectedDate.getDay();
  const todaysSchedule = getExpandedSchedule(dayOfWeek, selectedSem);

  if (!isClient) return null;

  return (
    <div className="bg-slate-50 min-h-screen relative">
      <div className="bg-[#10B981] text-white p-4 font-bold flex items-center gap-4 shadow-sm">
        {view === "detail" && <button onClick={() => setView("dashboard")} className="p-1 hover:bg-[#059669] rounded transition-colors"><ArrowLeft size={20}/></button>}
        <span>Dashboard &gt; {view === "detail" ? "Detail Absensi" : "Akademik"}</span>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#10B981] to-teal-600 rounded-2xl p-6 text-white mb-8 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-emerald-100 font-medium">Indeks Prestasi Kumulatif (IPK)</p>
            <h2 className="text-5xl font-black">{calculateGPA()}</h2>
          </div>
          <div className="md:text-right border-t md:border-t-0 md:border-l border-emerald-400/30 pt-4 md:pt-0 md:pl-6">
            <p className="text-emerald-100 font-medium">IPS Semester {selectedSem}</p>
            <h2 className="text-3xl font-bold">{calculateGPA(selectedSem)}</h2>
          </div>
        </div>

        {/* Tab Semester & Tombol Tambah */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex gap-2">
            {[1,2,3,4].map(s => (
              <button key={s} onClick={() => setSelectedSem(s)} className={`px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm border ${s === selectedSem ? 'bg-[#10B981] text-white border-[#10B981]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                Semester {s}
              </button>
            ))}
          </div>
          <button onClick={() => setIsAddingCourse(true)} className="px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm border bg-slate-800 text-white hover:bg-slate-700 flex items-center gap-2">
            <Plus size={16}/> Tambah Matkul
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          {view === "dashboard" ? (
            <>
              {/* Kalender & Jadwal */}
              <div className="border border-slate-200 rounded-xl p-5 mb-8">
                <h3 className="font-bold text-slate-800 mb-4">Jadwal Perkuliahan</h3>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-64 shrink-0 border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={() => setSelectedDate(new Date(currentYear, currentMonth - 1, 1))} className="text-slate-400 hover:text-slate-800"><ChevronLeft size={20}/></button>
                      <span className="font-bold text-sm">{selectedDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</span>
                      <button onClick={() => setSelectedDate(new Date(currentYear, currentMonth + 1, 1))} className="text-slate-400 hover:text-slate-800"><ChevronRight size={20}/></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`b-${i}`}></div>)}
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                        <button key={d} onClick={() => setSelectedDate(new Date(currentYear, currentMonth, d))}
                          className={`p-1.5 rounded-full w-8 h-8 mx-auto flex items-center justify-center transition-colors ${d === selectedDate.getDate() ? 'bg-[#10B981] text-white font-bold shadow-md' : 'hover:bg-slate-100 text-slate-700'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-500 mb-3">Jadwal Reguler ({daysName[dayOfWeek]})</h4>
                    <div className="flex flex-col gap-3">
                      {dayOfWeek === 0 ? (
                        <div className="p-4 rounded-lg bg-slate-50 text-slate-500 text-sm text-center">Tidak ada jadwal hari ini. Selamat beristirahat! 🌴</div>
                      ) : dayOfWeek === 6 ? (
                        <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50 text-emerald-800 text-sm">
                          <strong>UPM English Club</strong><br/>Jam: 14.00 s/d 15.00
                        </div>
                      ) : todaysSchedule.length === 0 ? (
                        <div className="p-4 rounded-lg bg-slate-50 text-slate-500 text-sm text-center">Kosong.</div>
                      ) : (
                        todaysSchedule.map(c => (
                          <div key={c.cardId} className="p-4 border border-slate-200 rounded-lg shadow-sm text-sm text-slate-700">
                            <table className="w-full"><tbody>
                              <tr><td className="w-24 font-medium py-1">Mata Kuliah</td><td>: {c.name} ({c.subType})</td></tr>
                              <tr><td className="w-24 font-medium py-1">Jam</td><td>: {c.time}</td></tr>
                              <tr><td className="w-24 font-medium py-1">Dosen</td><td>: {c.lecturer}</td></tr>
                            </tbody></table>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Nilai */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Informasi Absensi & Nilai Mata Kuliah</h3>
                <button onClick={() => setView("detail")} className="bg-[#10B981] text-white text-xs font-bold px-4 py-2 rounded shadow hover:bg-[#059669]">Lihat Detail Absen</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].flatMap(d => getExpandedSchedule(d, selectedSem)).map(c => {
                  const att = attendanceData[c.cardId] || [];
                  const hadirCount = att.filter(v => v === 1).length;
                  const percentage = Math.round((hadirCount / 16) * 100);
                  const gr = grades[c.id] || { uts: "", uas: "", tugas: "", quiz: "" };

                  return (
                    <div key={c.cardId} className="border border-slate-200 rounded-xl p-5 shadow-sm text-center flex flex-col items-center bg-white hover:shadow-md transition-shadow">
                      <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-inner" style={{ background: `conic-gradient(#10B981 ${percentage}%, #e2e8f0 0)` }}>
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-slate-800">{percentage}%</span>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{c.name}</h4>
                      <p className="text-xs font-bold text-emerald-600 mb-1">({c.subType})</p>
                      <p className="text-[10px] text-slate-500 mb-6">Pertemuan {hadirCount}/16</p>
                      
                      <div className="w-full flex justify-between text-[10px] font-bold text-slate-500 mt-auto border-t border-slate-100 pt-3">
                        {['uts', 'tugas', 'uas', 'quiz'].map(field => (
                          <div key={field} className="flex flex-col items-center">
                            <span className="uppercase mb-1">{field}</span>
                            <input 
                              type="text" 
                              value={(gr as any)[field]} 
                              onChange={(e) => updateGrade(c.id, field, e.target.value)}
                              placeholder="-"
                              className="w-8 text-center border-b border-slate-300 focus:border-emerald-500 outline-none text-slate-800 font-bold bg-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5].flatMap(d => getExpandedSchedule(d, selectedSem)).map(c => (
                <AttendanceCard 
                  key={c.cardId} 
                  course={{...c, dayName: daysName[c.day]}} 
                  attendance={attendanceData[c.cardId] || Array(16).fill(0)}
                  onUpdate={(newAtt) => updateAttendance(c.cardId, newAtt)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL FORM TAMBAH MATKUL --- */}
      {isAddingCourse && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Tambah Matkul (Semester {selectedSem})</h3>
              <button onClick={() => setIsAddingCourse(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddCourse} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Nama Mata Kuliah</label>
                <input required type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#10B981]" placeholder="Contoh: Algoritma Dasar" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 block mb-1">Total SKS</label>
                  <select value={newCourse.sks} onChange={e => setNewCourse({...newCourse, sks: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#10B981]">
                    <option value={2}>2 SKS</option>
                    <option value={3}>3 SKS</option>
                    <option value={4}>4 SKS</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 block mb-1">Hari</label>
                  <select value={newCourse.day} onChange={e => setNewCourse({...newCourse, day: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#10B981]">
                    <option value={1}>Senin</option>
                    <option value={2}>Selasa</option>
                    <option value={3}>Rabu</option>
                    <option value={4}>Kamis</option>
                    <option value={5}>Jumat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Tipe Perkuliahan</label>
                <select value={newCourse.type} onChange={e => setNewCourse({...newCourse, type: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#10B981]">
                  <option value="Teori">Hanya Teori</option>
                  <option value="Teori & Praktik">Teori & Praktik (Pecah 2 Kartu)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">*Jika pilih "Teori & Praktik", SKS akan dibagi rata menjadi 2 jadwal.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Nama Dosen</label>
                <input required type="text" value={newCourse.lecturer} onChange={e => setNewCourse({...newCourse, lecturer: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#10B981]" placeholder="Contoh: Budi Santoso, S.Kom." />
              </div>

              <button type="submit" className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 rounded-lg mt-2 transition-colors">
                Simpan Matkul
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}