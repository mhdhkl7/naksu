import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Mengambil kunci dari brankas .env
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "Kunci API belum dipasang!" }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // Menggunakan model Gemini 2.5 Flash sesuai realita sekarang!
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // <--- INI KUNCI UTAMANYA
      systemInstruction: "Kamu adalah Naksu, asisten pribadi virtual milik Haikal. Haikal adalah mahasiswa Informatika semester 4, Ketua UPM English Club, dan Komting kelas. Bicaralah dengan ramah, suportif, cerdas, dan sedikit gaul. Gunakan bahasa Indonesia. Jika diminta membuat pengumuman kelas atau ide proker, buatlah dengan format yang rapi dan menarik. Berikan jawaban yang ringkas tapi berdampak."
    });

    // Naksu berpikir dan menjawab
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
    
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Maaf Tuan, otakku sedang kusut." }, { status: 500 });
  }
}