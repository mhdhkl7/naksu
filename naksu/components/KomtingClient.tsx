"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, Plus, MessageSquare, Link as LinkIcon, CheckCircle2 } from "lucide-react";

type Draft = { id: string; content: string; createdAt: string };
type ImportantLink = { id: string; title: string; url: string; createdAt: string };

export default function KomtingClient() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [newDraft, setNewDraft] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data dari Database (Supabase) saat pertama kali dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDrafts = await fetch('/api/komting/drafts');
        const dataDrafts = await resDrafts.json();
        setDrafts(dataDrafts);

        const resLinks = await fetch('/api/komting/links');
        const dataLinks = await resLinks.json();
        setLinks(dataLinks);
      } catch (error) {
        console.error("Gagal mengambil data komting:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CRUD DRAF PENGUMUMAN (DATABASE) ---
  const handleSaveDraft = async () => {
    if (!newDraft.trim()) return;
    try {
      const res = await fetch('/api/komting/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newDraft }),
      });
      const savedDraft = await res.json();
      setDrafts([savedDraft, ...drafts]); // Update UI langsung
      setNewDraft(""); 
    } catch (error) {
      console.error("Gagal menyimpan draf:", error);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await fetch('/api/komting/drafts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setDrafts(drafts.filter(d => d.id !== id));
    } catch (error) {
      console.error("Gagal menghapus draf:", error);
    }
  };

  // --- CRUD LINK PENTING (DATABASE) ---
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    try {
      const res = await fetch('/api/komting/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newLinkTitle, url: newLinkUrl }),
      });
      const savedLink = await res.json();
      setLinks([savedLink, ...links]);
      setNewLinkTitle("");
      setNewLinkUrl("");
    } catch (error) {
      console.error("Gagal menyimpan link:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await fetch('/api/komting/links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setLinks(links.filter(l => l.id !== id));
    } catch (error) {
      console.error("Gagal menghapus link:", error);
    }
  };

  // --- FUNGSI COPY TO CLIPBOARD ---
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); 
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Memuat Data Pusat Komando...</div>;

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          Pusat Komando Komting 📢
        </h2>
        <p className="text-slate-500 mt-1">Informatika Semester 4. Pastikan informasi kelas tersampaikan dengan baik.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KOLOM KIRI: DRAF PENGUMUMAN */}
        <div className="flex flex-col gap-6">
          <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-orange-500" /> Draf Pengumuman Kelas
            </h3>
            <textarea 
              value={newDraft}
              onChange={(e) => setNewDraft(e.target.value)}
              className="w-full h-32 p-3 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white resize-none mb-4"
              placeholder="Ketik pengumuman baru di sini..."
            />
            <button onClick={handleSaveDraft} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl text-sm transition-colors shadow-sm">
              Simpan Draf
            </button>
          </div>

          {drafts.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">Riwayat Draf Tersimpan</h3>
              <div className="flex flex-col gap-4">
                {drafts.map(draft => (
                  <div key={draft.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 group relative">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap mb-4">{draft.content}</p>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-[10px] text-slate-400">
                        {new Date(draft.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteDraft(draft.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus Draf"><Trash2 size={16} /></button>
                        <button onClick={() => handleCopy(draft.content, draft.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${copiedId === draft.id ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                          {copiedId === draft.id ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: LINK PENTING */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LinkIcon size={18} className="text-orange-500" /> Link Penting Kelas
            </h3>
            
            <div className="flex flex-col gap-3 mb-6">
              {links.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Belum ada link tersimpan.</p>
              ) : (
                links.map(link => (
                  <div key={link.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50 hover:border-slate-200 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-semibold text-sm text-slate-800 truncate">{link.title}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{link.url}</a>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleDeleteLink(link.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus Link"><Trash2 size={16} /></button>
                      <button onClick={() => handleCopy(link.url, link.id)} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${copiedId === link.id ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                        {copiedId === link.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tambah Link Baru</h4>
              <form onSubmit={handleAddLink} className="flex flex-col gap-3">
                <input required type="text" placeholder="Judul Link (Cth: Drive Tugas)" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-400" />
                <input required type="url" placeholder="URL (Cth: https://...)" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-400" />
                <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-1">
                  <Plus size={16} /> Simpan Link
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}