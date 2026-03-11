import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.upmProker.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}
export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.upmProker.create({ data: body });
  return NextResponse.json(data);
}
export async function PUT(req: Request) {
  const { id, title, date, status } = await req.json();
  const data = await prisma.upmProker.update({ where: { id }, data: { title, date, status } });
  return NextResponse.json(data);
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await prisma.upmProker.delete({ where: { id: id as string } });
  return NextResponse.json({ success: true });
}