import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/sollicitatie`
  : 'http://localhost:5210/api/sollicitatie';

function mapStatus(status: string): string {
  const mapping: Record<string, string> = {
    'InBehandeling': 'In behandeling',
    'GesprekGepland': 'Gesprek gepland',
    'TechnischeTest': 'Technische test',
  };
  return mapping[status] || status;
}

const statusToEnum: Record<string, string> = {
  'In behandeling': 'InBehandeling',
  'Gesprek gepland': 'GesprekGepland',
  'Technische test': 'TechnischeTest',
};

export async function GET() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  const data = await res.json();
  const mapped = Array.isArray(data)
    ? data.map(item => ({ ...item, status: mapStatus(item.status) }))
    : [];
  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.status) body.status = statusToEnum[body.status] ?? body.status;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
