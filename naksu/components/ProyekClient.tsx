"use client";

import { useState, useEffect } from "react";
import { Github, Globe, Trash2, Plus, Rocket, X } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  linkUrl: string;
  linkType: "github" | "web";
  colorCode: string; // Untuk warna garis atas kartu
};

const defaultProjects: Project[] = [
  { id: "p1", title: "Naksu AI Assistant", description: "Asisten virtual web-based terintegrasi dengan Gemini AI, Prisma, Supabase, dan Next.js.", tags: ["Next.js", "Gemini AI", "Tailwind"], linkUrl: "https://github.com", linkType: "github", colorCode: "border-t-amber-500" },
  { id: "p2", title: "Telegram Bot Manager", description: "Bot cerdas yang dibangun menggunakan bahasa Python dan integrasi MongoDB, di-deploy via Railway.", tags: ["Python", "MongoDB"], linkUrl: "https://github.com", linkType: "github", colorCode: "border-t-blue-500" },
  { id: "p3", title: "Gym Management API", description: "Sistem backend komprehensif untuk Web Development menggunakan arsitektur Express.js dan MySQL.", tags: ["Express.js", "MySQL"], linkUrl: "https://github.com", linkType: "web", colorCode: "border-t-emerald-500" }
];

const borderColors = ["border-t-amber-500", "border-t-blue-500", "border-t-emerald-500", "border-t-purple-500", "border-t-rose-500"];

export default function ProyekClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // State Form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState(""); // dipisah dengan koma
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState<"github" | "web">("github");

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('naksu-projects');
    setProjects(saved ? JSON.parse(saved) : defaultProjects);
  }, []);

  const saveState = (data: Project[]) => {
    localStorage.setItem('naksu-projects', JSON.stringify(data));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArray = newTags.split(",").map(t => t.trim()).filter(t => t !== "");
    const randomColor = borderColors[Math.floor(Math.random() * borderColors.length)];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      tags: tagsArray,
      linkUrl: newLinkUrl,
      linkType: newLinkType,
      colorCode: randomColor
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    saveState(updated);
    
    // Reset form
    setNewTitle(""); setNewDesc(""); setNewTags(""); setNewLinkUrl(""); setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus proyek ini dari portofolio?")) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    saveState(updated);
  };

  if (!isClient) return null;

  return (
    <>
      <header className="mb-8 flex justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Proyek & Portofolio <Rocket size={28} className="text-rose-500" />
          </h2>
          <p className="text-slate-500 mt-1">Gudang amunisi karya. Persiapan solid untuk mendaftar GSA.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shrink-0"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? "Batal" : "Tambah Karya"}
        </button>
      </header>

      {/* Form Tambah Proyek */}
      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">Input Proyek Baru</h3>
          <form onSubmit={handleAddProject} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nama Proyek</label>
                <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800" placeholder="Cth: Naksu AI Assistant" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Teknologi (Pisahkan dgn koma)</label>
                <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800" placeholder="Cth: Next.js, Tailwind, Prisma" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Deskripsi Singkat</label>
              <textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full h-20 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800 resize-none" placeholder="Jelaskan apa fungsi proyek ini..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Jenis Link</label>
                <select value={newLinkType} onChange={e => setNewLinkType(e.target.value as "github"|"web")} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800">
                  <option value="github">Repository GitHub</option>
                  <option value="web">Live Website</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">URL Link</label>
                <input type="url" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-800" placeholder="https://github.com/..." />
              </div>
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors">
              Simpan ke Portofolio
            </button>
          </form>
        </div>
      )}

      {/* Grid Kartu Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <p className="text-slate-400 text-sm col-span-2 text-center py-8">Belum ada karya. Waktunya membangun sesuatu yang epik!</p>
        ) : (
          projects.map((proj) => (
            <div key={proj.id} className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group border-t-4 ${proj.colorCode} flex flex-col`}>
              
              <button onClick={() => handleDelete(proj.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded p-1">
                <Trash2 size={18} />
              </button>

              <div className="flex justify-between items-start mb-3 pr-8">
                <h3 className="font-bold text-lg text-slate-800">{proj.title}</h3>
                {proj.linkUrl && (
                  <a href={proj.linkUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-800 transition-colors" title={proj.linkType === 'github' ? 'Lihat Kode di GitHub' : 'Kunjungi Website'}>
                    {proj.linkType === 'github' ? <Github size={20} /> : <Globe size={20} />}
                  </a>
                )}
              </div>
              
              <p className="text-sm text-slate-500 mb-6 flex-1">{proj.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {proj.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}