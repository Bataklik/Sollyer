import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/sollicitatie`
  : 'http://localhost:5210/api/sollicitatie';

// in app/api/sollicitatie/route.ts
function mapStatus(status: string): string {
  const mapping: Record<string, string> = {
    'InBehandeling': 'In behandeling',
    'GesprekGepland': 'Gesprek gepland',
    'TechnischeTest': 'Technische test',
  };
  return mapping[status] || status;
}

export async function GET() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  const data = await res.json();
  const mapped = Array.isArray(data)
    ? data.map(item => ({ ...item, status: mapStatus(item.status) }))
    : [];
  return NextResponse.json(mapped);
}
