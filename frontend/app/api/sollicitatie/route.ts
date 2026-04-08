import { NextResponse } from "next/server";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
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

// Helper functie om de rij-index te vinden op basis van ID
async function findRowIndexById(id: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Blad1!A:A",
  });
  const rows = response.data.values || [];
  const index = rows.findIndex(row => row[0] === id);
  return index !== -1 ? index + 1 : null; // +1 omdat Sheets 1-based is
}

export async function GET() {
  try {
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
