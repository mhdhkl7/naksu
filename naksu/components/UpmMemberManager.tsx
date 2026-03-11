"use client";

import { useState, useEffect, useRef } from "react";
import { Users, Upload, Edit2, Trash2, Check, X, Loader2, UserPlus } from "lucide-react";

type Member = { id: string; name: string; nim: string; phone: string; email: string; };

export default function UpmMemberManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk form tambah manual
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", nim: "", phone: "", email: "" });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/upm-members");
      const text = await res.text(); 
      const data = text ? JSON.parse(text) : []; 
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNGSI TAMBAH MANUAL
  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.nim) return;
    
    await fetch("/api/upm-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember)
    });
    
    setIsAdding(false);
    setNewMember({ name: "", nim: "", phone: "", email: "" });
    fetchMembers();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      // Ganti split separator dari \n lalu cek barisnya. Kita pakai regex untuk cover koma atau titik koma
      const lines = text.split("\n").filter(line => line.trim() !== "");
      
      const newMembers = lines.slice(1).map(line => {
        const separator = line.includes(";") ? ";" : ",";
        const [name, nim, phone, email] = line.split(separator).map(item => item.trim());
        return { name, nim, phone, email };
      }).filter(m => m.name && m.nim); 

      if (newMembers.length > 0) {
        await fetch("/api/upm-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMembers)
        });
        fetchMembers(); 
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await fetch("/api/upm-members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...editForm })
    });
    setEditingId(null);
    fetchMembers();
  };

  const deleteMember = async (id: string) => {
    if(!confirm("Yakin ingin menghapus anggota ini?")) return;
    await fetch(`/api/upm-members?id=${id}`, { method: "DELETE" });
    fetchMembers();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-50">
        <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
          <Users size={20} /> Database Anggota UPM
        </h3>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
          >
            {isAdding ? <X size={16} /> : <UserPlus size={16} />} 
            {isAdding ? "Batal" : "Tambah Manual"}
          </button>
          
          <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Upload size={16} /> Upload CSV
          </button>
        </div>
      </div>

      {/* Form Tambah Manual */}
      {isAdding && (
        <form onSubmit={handleAddManual} className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-3">
          <input required type="text" placeholder="Nama..." value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <input required type="text" placeholder="NIM..." value={newMember.nim} onChange={e => setNewMember({...newMember, nim: e.target.value})} className="w-32 border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <input type="text" placeholder="No HP..." value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="w-32 border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <input type="email" placeholder="Email..." value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700">Simpan</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">NIM</th>
              <th className="px-6 py-3">No. HP</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8"><Loader2 className="animate-spin inline text-emerald-500" /></td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Belum ada data. Silakan tambah manual atau upload CSV.</td></tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {editingId === m.id ? <input className="border rounded px-2 py-1 w-full" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /> : m.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {editingId === m.id ? <input className="border rounded px-2 py-1 w-24" value={editForm.nim} onChange={e => setEditForm({...editForm, nim: e.target.value})} /> : m.nim}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {editingId === m.id ? <input className="border rounded px-2 py-1 w-32" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /> : m.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {editingId === m.id ? <input className="border rounded px-2 py-1 w-full" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /> : m.email}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {editingId === m.id ? (
                      <>
                        <button onClick={saveEdit} className="text-green-600 p-1 hover:bg-green-50 rounded"><Check size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="text-slate-400 p-1 hover:bg-slate-100 rounded"><X size={16} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(m.id); setEditForm(m); }} className="text-blue-500 p-1 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => deleteMember(m.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}