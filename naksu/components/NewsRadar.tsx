"use client";

import { useState, useEffect } from "react";
import { Globe, ExternalLink, Loader2 } from "lucide-react";

// Tipe data untuk berita
type NewsItem = {
  title: string;
  link: string;
  author: string;
  pubDate: string;
};

export default function NewsRadar() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fungsi penyadap berita Tech (The Verge)
    const fetchNews = async () => {
      try {
        const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/");
        const data = await res.json();
        
        if (data.items) {
          // Kita ambil 4 berita paling hangat saja
          setNews(data.items.slice(0, 4)); 
        }
      } catch (error) {
        console.error("Radar gagal menangkap sinyal", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="mt-6 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden shrink-0">
      {/* Header Radar */}
      <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-2">
        <Globe className="text-blue-500" size={18} />
        <h3 className="font-bold text-blue-900 text-sm">Radar Dunia (Tech)</h3>
      </div>
      
      {/* Area Daftar Berita */}
      <div className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-24 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : news.length === 0 ? (
          <p className="text-xs text-slate-400 text-center">Radar tidak menemukan sinyal berita.</p>
        ) : (
          news.map((item, idx) => (
            <a 
              key={idx} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block border-b border-slate-100 pb-3 last:border-0 last:pb-0"
            >
              <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                <span>TECH NEWS</span>
                <span>•</span>
                <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                  Baca <ExternalLink size={10} />
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}