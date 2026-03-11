"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Calendar, BookOpen, Users, Megaphone, Target, Loader2, X } from "lucide-react";

// Tipe data sesuaikan dengan schema Prisma (id sekarang string UUID)
type Task = {
  id: string;
  title: string;
  category: string;
  deadline: string;
  isDone: boolean;
};

export default function AgendaList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk form Tambah Tugas
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AKADEMIK");
  const [deadline, setDeadline] = useState("");

  // Jalankan fetch saat komponen pertama kali dimuat
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fungsi Tarik Data (GET)
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Tambah Tugas (POST)
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, deadline }),
      });
      const newTask = await res.json();
      
      // Masukkan tugas baru ke baris paling atas secara langsung
      setTasks([newTask, ...tasks]); 
      
      // Bersihkan form
      setTitle("");
      setCategory("AKADEMIK");
      setDeadline("");
      setIsAdding(false);
    } catch (error) {
      console.error("Gagal menambah tugas", error);
    }
  };

  // Fungsi Centang Tugas (PUT)
  const toggleTask = async (id: string, currentStatus: boolean) => {
    // Ubah UI duluan biar terasa responsif (Optimistic Update)
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isDone: !currentStatus } : task
    ));

    try {
      // Kirim update ke database secara diam-diam di background
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDone: !currentStatus }),
      });
    } catch (error) {
      console.error("Gagal update status", error);
      fetchTasks(); // Kalau error, tarik data asli lagi
    }
  };

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "AKADEMIK": return { color: "text-blue-600", bg: "bg-blue-100", icon: <BookOpen size={14} /> };
      case "UPM": return { color: "text-emerald-600", bg: "bg-emerald-100", icon: <Users size={14} /> };
      case "KOMTING": return { color: "text-orange-600", bg: "bg-orange-100", icon: <Megaphone size={14} /> };
      case "PROYEK": return { color: "text-amber-600", bg: "bg-amber-100", icon: <Target size={14} /> };
      default: return { color: "text-slate-600", bg: "bg-slate-100", icon: <Calendar size={14} /> };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[300px]">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-800">Agenda Hari Ini</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          {isAdding ? <X size={16} /> : "+ Tambah"}
        </button>
      </div>

      {/* Form Tambah Tugas (Muncul kalau isAdding = true) */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
          <input 
            type="text" placeholder="Nama Tugas..." value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            required
          />
          <div className="flex gap-3">
            <select 
              value={category} onChange={e => setCategory(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="AKADEMIK">Akademik</option>
              <option value="UPM">UPM English</option>
              <option value="KOMTING">Komting</option>
              <option value="PROYEK">Proyek Spesial</option>
            </select>
            <input 
              type="text" placeholder="Deadline (Cth: Besok, 14:00)" value={deadline} onChange={e => setDeadline(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
            Simpan Tugas
          </button>
        </form>
      )}

      {/* Tampilan List Tugas */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-32 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-sm">
            <p>Wah, ruang kerja bersih! 🎉</p>
          </div>
        ) : (
          tasks.map((task) => {
            const style = getCategoryStyle(task.category);
            return (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  task.isDone 
                  ? "bg-slate-50 border-slate-100 opacity-60" 
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleTask(task.id, task.isDone)}
                    className={`transition-colors ${task.isDone ? "text-green-500" : "text-slate-300 hover:text-slate-400"}`}
                  >
                    {task.isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div>
                    <h4 className={`font-semibold transition-all ${task.isDone ? "text-slate-400 line-through" : "text-slate-800"}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${style.bg} ${style.color}`}>
                        {style.icon} {task.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar size={12} /> {task.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}