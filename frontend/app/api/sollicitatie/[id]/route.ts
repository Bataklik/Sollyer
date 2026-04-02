import { NextResponse } from "next/server";
import { getSollicitatie, updateSollicitatie, deleteSollicitatie } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sollicitatie = getSollicitatie(id);

  if (!sollicitatie) {
    return NextResponse.json(
      { error: "Sollicitatie not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(sollicitatie);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = updateSollicitatie(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Sollicitatie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteSollicitatie(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Sollicitatie not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
