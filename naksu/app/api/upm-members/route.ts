import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.upmMember.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (Array.isArray(body)) {
      const newMembers = await prisma.upmMember.createMany({ data: body });
      return NextResponse.json(newMembers);
    } else {
      const newMember = await prisma.upmMember.create({ data: body });
      return NextResponse.json(newMember);
    }
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, nim, phone, email } = await req.json();
    const updated = await prisma.upmMember.update({
      where: { id },
      data: { name, nim, phone, email },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID kosong" }, { status: 400 });
    
    await prisma.upmMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}