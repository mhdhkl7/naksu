import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const drafts = await prisma.draft.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(drafts);
}

export async function POST(req: Request) {
  const { content } = await req.json();
  const newDraft = await prisma.draft.create({ data: { content } });
  return NextResponse.json(newDraft);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.draft.delete({ where: { id } });
  return NextResponse.json({ success: true });
}