import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Wajib: Jangan di-cache server

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    // 1. Validasi Input
    if (!username) {
      return NextResponse.json({ error: "Username wajib diisi" }, { status: 400 });
    }

    // 2. Tembak GitHub Public API
    // Kita ambil 15 event terakhir user ini
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=15`, {
      headers: {
        "User-Agent": "Academic-System-MVP", // GitHub butuh ini supaya sopan
        "Accept": "application/vnd.github.v3+json"
      },
      next: { revalidate: 0 } // No-cache
    });

    if (!response.ok) {
      return NextResponse.json({ error: "GitHub user tidak ditemukan" }, { status: 404 });
    }

    const events = await response.json();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD (Waktu Server UTC)
    
    // Perbaikan: Karena server biasanya UTC dan kita WIB (UTC+7), 
    // commit jam 00:00 - 06:59 pagi WIB bisa terhitung hari kemarin di UTC.
    // Untuk MVP, kita cek apakah ada commit yang created_at-nya mengandung tanggal hari ini (UTC).
    // *Catatan: Nanti kita perketat zona waktunya.

    // 3. Cari Bukti "PushEvent" Hari Ini
    const hasPushToday = events.some((event: any) => {
      if (event.type !== "PushEvent") return false;
      
      const eventDate = event.created_at.split("T")[0]; // Ambil tanggalnya saja
      return eventDate === today;
    });

    // 4. Berikan Vonis
    if (hasPushToday) {
      return NextResponse.json({ 
        valid: true, 
        message: "VALID! Commit ditemukan hari ini. Streak lanjut! 🔥" 
      });
    } else {
      return NextResponse.json({ 
        valid: false, 
        message: "ZONK! Belum ada commit hari ini. Push dulu sana! 🛑" 
      });
    }

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}