import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. Fungsi MENGAMBIL semua tugas (GET)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" }, // Urutkan dari yang paling baru
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data tugas" }, { status: 500 });
  }
}

// 2. Fungsi MENAMBAH tugas baru (POST)
export async function POST(req: Request) {
  try {
    const { title, category, deadline } = await req.json();
    const newTask = await prisma.task.create({
      data: { title, category, deadline },
    });
    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah tugas" }, { status: 500 });
  }
}

// 3. Fungsi UPDATE status centang (PUT)
export async function PUT(req: Request) {
  try {
    const { id, isDone } = await req.json();
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isDone },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate tugas" }, { status: 500 });
  }
}