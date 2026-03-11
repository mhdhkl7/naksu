"use client";

import { useState, useEffect } from "react";
import { Youtube, CheckCircle2, Circle } from "lucide-react";

export default function YoutubeTracker() {
  const [videos, setVideos] = useState([false, false]);
  const [isClient, setIsClient] = useState(false);

  // Load ingatan dari browser saat web dimuat
  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem("naksu-youtube-tracker");
    if (savedData) {
      setVideos(JSON.parse(savedData));
    }
  }, []);

  // Fungsi saat tombol dicentang
  const toggleVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos[index] = !newVideos[index];
    
    setVideos(newVideos);
    // Simpan otomatis ke ingatan browser
    localStorage.setItem("naksu-youtube-tracker", JSON.stringify(newVideos));
  };

  const completedCount = videos.filter(Boolean).length;

  // Mencegah error Hydration di Next.js
  if (!isClient) return null; 

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <Youtube size={16} className="text-red-500" />
        <h3 className="text-slate-500 font-medium text-sm">Target YouTube (Tech)</h3>
      </div>
      
      <p className="text-2xl font-bold text-slate-800 mb-4">{completedCount} / 2 Video</p>
      
      <div className="flex gap-4">
        <button 
          onClick={() => toggleVideo(0)} 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${videos[0] ? 'text-red-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {videos[0] ? <CheckCircle2 size={18} /> : <Circle size={18} />} Video 1
        </button>
        <button 
          onClick={() => toggleVideo(1)} 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${videos[1] ? 'text-red-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {videos[1] ? <CheckCircle2 size={18} /> : <Circle size={18} />} Video 2
        </button>
      </div>
    </div>
  );
}