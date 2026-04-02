import { NextResponse } from "next/server";
import { getSollicitaties, createSollicitatie } from "@/lib/store";
import type { Sollicitatie } from "@/lib/types";

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const sollicitaties = getSollicitaties();
  return NextResponse.json(sollicitaties);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<Sollicitatie, "id">;

    const newSollicitatie = createSollicitatie(body);
    return NextResponse.json(newSollicitatie, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
