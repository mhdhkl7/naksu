import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const links = await prisma.classLink.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const { title, url } = await req.json();
  const newLink = await prisma.classLink.create({ data: { title, url } });
  return NextResponse.json(newLink);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.classLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}