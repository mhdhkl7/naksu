"use client";

import { useState } from "react";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";

export default function GeminiChat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Halo Haikal! Naksu di sini. Ada yang bisa kubantu untuk urusan kampus, Komting, atau UPM hari ini? ✨" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // 1. Tampilkan pesan kamu di layar
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Kirim pesan ke otak Google (API Route)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // 3. Tampilkan balasan Naksu
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Error: " + data.error }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Koneksi terputus nih, coba lagi ya." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
      {/* Header */}
      <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-2">
        <Sparkles className="text-purple-500" size={18} />
        <h3 className="font-bold text-purple-900 text-sm">Naksu AI Assistant</h3>
      </div>

      {/* Area Balasan Obrolan */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            {/* whitespace-pre-wrap biar enter/paragraf dari AI gak nyambung jadi satu */}
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Animasi Loading saat Naksu Mikir */}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-purple-100 text-purple-600">
              <Bot size={16} />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-purple-500" />
              <span className="text-sm">Sedang berpikir...</span>
            </div>
          </div>
        )}
      </div>

      {/* Area Ketik Chat */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya Naksu..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}