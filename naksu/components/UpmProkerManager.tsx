"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";

type Proker = { id: string; title: string; date: string; status: string; };

export default function UpmProkerManager() {
  const [prokers, setProkers] = useState<Proker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProker, setNewProker] = useState({ title: "", date: "", status: "Rencana" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Proker>>({});

  useEffect(() => { fetchProkers(); }, []);

  const fetchProkers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/upm-prokers");
      const text = await res.text();
      setProkers(text ? JSON.parse(text) : []);
    } catch (e) { setProkers([]); } 
    finally { setIsLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/upm-prokers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newProker) });
    setIsAdding(false);
    setNewProker({ title: "", date: "", status: "Rencana" });
    fetchProkers();
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await fetch("/api/upm-prokers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
    setEditingId(null);
    fetchProkers();
  };

  const deleteProker = async (id: string) => {
    if(!confirm("Hapus proker ini?")) return;
    await fetch(`/api/upm-prokers?id=${id}`, { method: "DELETE" });
    fetchProkers();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-teal-50">
        <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2"><CalendarDays size={20} /> Agenda Kegiatan</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-teal-700 transition-colors">
          {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? "Batal" : "Tambah Proker"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-3">
          <input required type="text" placeholder="Nama Proker..." value={newProker.title} onChange={e => setNewProker({...newProker, title: e.target.value})} className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
          <input required type="text" placeholder="Tanggal/Bulan..." value={newProker.date} onChange={e => setNewProker({...newProker, date: e.target.value})} className="w-32 border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" />
          <select value={newProker.status} onChange={e => setNewProker({...newProker, status: e.target.value})} className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
            <option value="Rencana">Rencana</option>
            <option value="Berjalan">Berjalan</option>
            <option value="Selesai">Selesai</option>
          </select>
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-700">Simpan</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-100">
            <tr><th className="px-6 py-3">Proker</th><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Aksi</th></tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={4} className="text-center py-8"><Loader2 className="animate-spin inline text-teal-500" /></td></tr> : 
             prokers.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-slate-400">Belum ada agenda proker.</td></tr> : 
             prokers.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{editingId === p.id ? <input className="border px-2 py-1 w-full" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} /> : p.title}</td>
                <td className="px-6 py-4 text-slate-600">{editingId === p.id ? <input className="border px-2 py-1 w-full" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} /> : p.date}</td>
                <td className="px-6 py-4">
                  {editingId === p.id ? (
                    <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="border px-2 py-1">
                      <option value="Rencana">Rencana</option><option value="Berjalan">Berjalan</option><option value="Selesai">Selesai</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Selesai' ? 'bg-green-100 text-green-700' : p.status === 'Berjalan' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{p.status}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {editingId === p.id ? (
                    <><button onClick={saveEdit} className="text-green-600 p-1"><Check size={16} /></button><button onClick={() => setEditingId(null)} className="text-slate-400 p-1"><X size={16} /></button></>
                  ) : (
                    <><button onClick={() => { setEditingId(p.id); setEditForm(p); }} className="text-blue-500 p-1"><Edit2 size={16} /></button><button onClick={() => deleteProker(p.id)} className="text-red-500 p-1"><Trash2 size={16} /></button></>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}