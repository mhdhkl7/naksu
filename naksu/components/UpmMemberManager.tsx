"use client";

import { useState, useEffect } from "react";
import { Users, Trash2, Plus, Upload, Search } from "lucide-react";

type Member = { id: string; nim: string; name: string; phone?: string; email?: string };

export default function UpmMemberManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State Form
  const [isAdding, setIsAdding] = useState(false);
  const [bulkData, setBulkData] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/upm-members');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) return;
    
    // Asumsi format: NIM, Nama Lengkap, No HP, Email
    const newMembers = bulkData.split('\n').map(line => {
      const [nim, name, phone, email] = line.split(/[,\t]/);
      return {
        nim: nim?.trim(),
        name: name?.trim() || "Tanpa Nama",
        phone: phone?.trim() || "",
        email: email?.trim() || ""
      };
    }).filter(m => m.nim); // Harus ada NIM

    try {
      const res = await fetch('/api/upm-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMembers), // Kirim sebagai Array (sesuai API-mu)
      });
      
      if (res.ok) {
        setBulkData("");
        setIsAdding(false);
        fetchMembers(); // Refresh data
      }
    } catch (error) {
      console.error("Gagal upload massal:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus anggota ini?")) return;
    try {
      await fetch('/api/upm-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.nim.includes(searchQuery)
  );

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Memuat Database UPM...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-500" /> Manajemen Anggota UPM
          </h2>
          <p className="text-sm text-slate-500 mt-1">Total {members.length} anggota terdaftar aktif.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari NIM / Nama..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 w-full md:w-48"
            />
          </div>
          <button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shrink-0 transition-colors">
            {isAdding ? "Batal" : <><Plus size={16} /> Tambah</>}
          </button>
        </div>
      </header>

      {/* Form Upload Massal */}
      {isAdding && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
            <Upload size={16} className="text-blue-600" /> Upload Massal (Copy-Paste dari Excel/CSV)
          </h3>
          <p className="text-xs text-blue-700 mb-3">Format per baris: <strong className="font-mono bg-blue-100 px-1 rounded">NIM, Nama, NoHP, Email</strong> (Bisa dipisah koma atau Tab).</p>
          <textarea 
            value={bulkData}
            onChange={e => setBulkData(e.target.value)}
            className="w-full h-32 p-3 border border-blue-200 rounded-lg text-sm outline-none focus:border-blue-500 font-mono"
            placeholder="24010101, Budi Santoso, 081234, budi@mail.com&#10;24010102, Siti Aminah, 085678, siti@mail.com"
          />
          <button onClick={handleBulkUpload} className="mt-3 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Simpan Data
          </button>
        </div>
      )}

      {/* Tabel Anggota */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
              <th className="py-3 px-4 font-bold">NIM</th>
              <th className="py-3 px-4 font-bold">Nama Lengkap</th>
              <th className="py-3 px-4 font-bold">Kontak</th>
              <th className="py-3 px-4 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => (
              <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-600">{member.nim}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{member.name}</td>
                <td className="py-3 px-4 text-xs text-slate-500">
                  <div className="flex flex-col gap-0.5">
                    <span>{member.phone || '-'}</span>
                    <span>{member.email || '-'}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDelete(member.id)} className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 italic">Data anggota tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}