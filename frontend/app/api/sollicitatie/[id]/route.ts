import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/sollicitatie`
  : 'http://localhost:5210/api/sollicitatie';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const res = await fetch(`${API_URL}/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await fetch(`${API_URL}/${params.id}`, { method: 'DELETE' });
  return new NextResponse(null, { status: 204 });
}
