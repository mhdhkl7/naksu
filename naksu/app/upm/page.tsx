"use client";

import { useState, useEffect } from "react";
import { Users, Mic, CalendarDays, FileText, ArrowLeft, Trash2, Loader2 } from "lucide-react";
import UpmMemberManager from "@/components/UpmMemberManager";
import UpmProkerManager from "@/components/UpmProkerManager";

export default function UpmPage() {
  // Sekarang ada 3 layar: dashboard, database, agenda
  const [activeView, setActiveView] = useState<"dashboard" | "database" | "agenda">("dashboard");
  
  // State khusus untuk Ide/Sambutan
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [isAddingIdea, setIsAddingIdea] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", content: "" });

  useEffect(() => { fetchIdeas(); }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/upm-ideas");
      const text = await res.text();
      setIdeas(text ? JSON.parse(text) : []);
    } catch(e) { setIdeas([]); }
    finally { setIsLoadingIdeas(false); }
  };

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/upm-ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newIdea) });
    setIsAddingIdea(false);
    setNewIdea({ title: "", content: "" });
    fetchIdeas();
  };

  const deleteIdea = async (id: string) => {
    if(!confirm("Hapus catatan ide ini?")) return;
    await fetch(`/api/upm-ideas?id=${id}`, { method: "DELETE" });
    fetchIdeas();
  };

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center gap-4">
          {activeView !== "dashboard" && (
            <button onClick={() => setActiveView("dashboard")} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"><ArrowLeft size={20} className="text-slate-700" /></button>
          )}
          <div><h2 className="text-3xl font-bold text-slate-900">UPM English Club 🌍</h2><p className="text-slate-500 mt-1">Ruang Komando Ketua. Let's elevate our English skills together!</p></div>
        </div>
      </header>

      {activeView === "dashboard" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div onClick={() => setActiveView("database")} className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0"><Users size={24} /></div>
              <div><h3 className="font-bold text-emerald-900">Database Anggota</h3><p className="text-sm text-emerald-700 mt-1">Kelola data peserta aktif.</p></div>
            </div>
            
            <div onClick={() => setActiveView("agenda")} className="bg-teal-50 border border-teal-100 p-6 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-teal-500 text-white rounded-xl flex items-center justify-center shrink-0"><CalendarDays size={24} /></div>
              <div><h3 className="font-bold text-teal-900">Agenda Kegiatan</h3><p className="text-sm text-teal-700 mt-1">Rancangan jadwal proker rutin.</p></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Mic size={20} className="text-emerald-500" /> Catatan Sambutan & Ide Program</h3>
              <button onClick={() => setIsAddingIdea(!isAddingIdea)} className="text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-200 transition-colors">
                {isAddingIdea ? "Batal" : "+ Tulis Ide Baru"}
              </button>
            </div>
            
            {isAddingIdea && (
              <form onSubmit={handleAddIdea} className="mb-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex flex-col gap-3">
                <input required type="text" placeholder="Judul Ide/Catatan..." value={newIdea.title} onChange={e=>setNewIdea({...newIdea, title: e.target.value})} className="p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500" />
                <textarea required placeholder="Isi catatan..." value={newIdea.content} onChange={e=>setNewIdea({...newIdea, content: e.target.value})} className="p-2 border border-slate-200 rounded-lg text-sm h-24 resize-none outline-none focus:border-emerald-500" />
                <button type="submit" className="bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 w-full md:w-auto self-start">Simpan Catatan</button>
              </form>
            )}

            <div className="flex flex-col gap-4">
              {isLoadingIdeas ? <Loader2 className="animate-spin text-emerald-500 mx-auto" /> : 
               ideas.length === 0 ? <p className="text-slate-400 text-sm text-center">Belum ada catatan. Silakan tulis ide pertamamu!</p> :
               ideas.map(idea => (
                <div key={idea.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 relative group hover:border-emerald-200 transition-colors">
                  <button onClick={() => deleteIdea(idea.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 p-1 rounded hover:bg-red-100"><Trash2 size={16}/></button>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><FileText size={16} className="text-slate-400" /> {idea.title}</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{idea.content}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Komponen Layar Lain */}
      {activeView === "database" && <UpmMemberManager />}
      {activeView === "agenda" && <UpmProkerManager />}
    </>
  );
}