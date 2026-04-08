import { NextResponse } from "next/server";
import { google } from "googleapis";

// Verplaats de logica die afhankelijk is van process.env naar een helper-functie
async function getSheetsClient() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!keyPath) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is missing in environment variables");
  }

  const credentials = JSON.parse(keyPath);
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function findRowIndexById(sheets: any, id: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Blad1!A:A",
  });
  const rows = response.data.values || [];
  const index = rows.findIndex((row: any) => row[0] === id);
  return index !== -1 ? index + 1 : null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Initialiseer de client pas wanneer de route wordt aangeroepen
    const sheets = await getSheetsClient();
    const rowIndex = await findRowIndexById(sheets, id);

    if (!rowIndex) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Blad1!A${rowIndex}:G${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          id,
          body.datum,
          body.bedrijfsnaam,
          body.locatie,
          body.functie,
          body.status,
          body.notities || "",
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sheets = await getSheetsClient();
    const rowIndex = await findRowIndexById(sheets, id);

    if (!rowIndex) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetInternalId = spreadsheet.data.sheets?.[0].properties?.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetInternalId,
              dimension: "ROWS",
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        }],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
