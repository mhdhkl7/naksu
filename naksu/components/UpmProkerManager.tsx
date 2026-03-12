"use client";

import { useState, useEffect } from "react";
import { Briefcase, Trash2, Plus, CheckCircle, Clock } from "lucide-react";

// Tipe disesuaikan persis dengan model UpmProker di schema.prisma
type Proker = { id: string; title: string; date: string; status: string };

export default function UpmProkerManager() {
  const [prokers, setProkers] = useState<Proker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // State Form (Disesuaikan dengan database)
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newStatus, setNewStatus] = useState("Rencana");

  useEffect(() => {
    fetchProkers();
  }, []);

  const fetchProkers = async () => {
    try {
      const res = await fetch('/api/upm-prokers');
      const data = await res.json();
      setProkers(data);
    } catch (error) {
      console.error("Gagal mengambil data proker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim()) return;

    try {
      const res = await fetch('/api/upm-prokers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTitle, 
          date: newDate, 
          status: newStatus 
        }),
      });
      
      if (res.ok) {
        setNewTitle("");
        setNewDate("");
        setNewStatus("Rencana");
        setIsAdding(false);
        fetchProkers(); // Refresh data
      }
    } catch (error) {
      console.error("Gagal menyimpan proker:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus program kerja ini?")) return;
    try {
      await fetch('/api/upm-prokers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setProkers(prokers.filter(p => p.id !== id));
    } catch (error) {
      console.error("Gagal hapus proker:", error);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Memuat Data Proker UPM...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
      <header className="flex justify-between items-center mb-6 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="text-purple-500" /> Program Kerja (Proker)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Pantau jalannya agenda UPM English Club.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
          {isAdding ? "Batal" : <><Plus size={16} /> Tambah Proker</>}
        </button>
      </header>

      {/* Form Tambah Proker */}
      {isAdding && (
        <form onSubmit={handleAddProker} className="bg-purple-50/50 border border-purple-100 rounded-xl p-5 mb-6 animate-in slide-in-from-top-4">
          <h3 className="text-sm font-bold text-purple-900 mb-4">Input Proker Baru</h3>
          <div className="flex flex-col gap-4">
            <input required type="text" placeholder="Nama Proker (Cth: English Debate)" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2.5 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-500" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-800 mb-1 block">Waktu Pelaksanaan (Date)</label>
                <input required type="text" placeholder="Cth: 20 Agustus 2026 / Bulan Depan" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full p-2.5 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-800 mb-1 block">Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full p-2.5 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-500">
                  <option value="Rencana">Rencana</option>
                  <option value="Berjalan">Berjalan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            <button type="submit" className="bg-purple-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-purple-700 transition-colors mt-2">
              Simpan Proker
            </button>
          </div>
        </form>
      )}

      {/* Daftar Proker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prokers.map(proker => (
          <div key={proker.id} className="border border-slate-200 rounded-xl p-4 relative group hover:border-purple-300 transition-colors bg-slate-50 flex flex-col justify-between">
            <div>
              <button onClick={() => handleDelete(proker.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
              <div className="flex items-center gap-2 mb-2 pr-8">
                {proker.status === "Selesai" ? <CheckCircle size={18} className="text-green-500" /> : <Clock size={18} className="text-amber-500" />}
                <h3 className="font-bold text-slate-800">{proker.title}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4 font-mono bg-purple-100 px-2 py-1 rounded inline-block">📅 {proker.date}</p>
            </div>
            
            <div className="mt-auto">
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${proker.status === 'Selesai' ? 'bg-green-100 text-green-700' : proker.status === 'Berjalan' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                {proker.status}
              </span>
            </div>
          </div>
        ))}
        {prokers.length === 0 && (
          <p className="text-sm text-slate-400 col-span-2 text-center py-4">Belum ada program kerja yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
}