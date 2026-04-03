import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/sollicitatie`
  : 'http://localhost:5210/api/sollicitatie';

const statusToEnum: Record<string, string> = {
  'In behandeling': 'InBehandeling',
  'Gesprek gepland': 'GesprekGepland',
  'Technische test': 'TechnischeTest',
};

function mapStatusToEnum(status: string): string {
  return statusToEnum[status] ?? status;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (body.status) body.status = mapStatusToEnum(body.status);
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return new NextResponse(null, { status: res.status });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return new NextResponse(null, { status: 204 });
}
