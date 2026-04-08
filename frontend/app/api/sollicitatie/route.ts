import { NextResponse } from "next/server";
import { getSheetsClient } from "@/utils/api-helpers";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

function mapStatus(status: string): string {
  const mapping: Record<string, string> = {
    'InBehandeling': 'In behandeling',
    'GesprekGepland': 'Gesprek gepland',
    'TechnischeTest': 'Technische test',
    "Verzonden": "Verzonden",
    "Afgewezen": "Afgewezen",
    "Aangeboden": "Aangeboden",
  };
  return mapping[status] || status;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export async function GET() {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Blad1!A2:Z",
    });

    const rows = response.data.values || [];
    const mapped = rows.map((row) => ({
      id: row[0] || '',
      datum: row[1] || '',
      bedrijfsnaam: row[2] || '',
      locatie: row[3] || '',
      functie: row[4] || '',
      status: row[5] || '',
      notities: row[6] || '',
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Blad1!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        generateId(),
        body.datum,
        body.bedrijfsnaam,
        body.locatie,
        body.functie,
        mapStatus(body.status),
        body.notities || '',
      ]],
    },
  });
  return NextResponse.json({ success: true });
}
