import { NextResponse } from "next/server";
import { google } from "googleapis";

// Gebruik dezelfde auth configuratie als in je andere route
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Helper om de rij-index te vinden op basis van het ID in kolom A
async function findRowIndexById(id: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Blad1!A:A",
  });
  const rows = response.data.values || [];
  // Zoek de index van het ID (rij 1 is index 0, dus we doen +1 voor Sheets-index)
  const index = rows.findIndex(row => row[0] === id);
  return index !== -1 ? index + 1 : null;
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Type aanpassen naar Promise
) {
  try {
    // CRUCIAL: Eerst de params awaiten voordat je .id gebruikt
    const { id } = await params;

    const body = await request.json();
    const rowIndex = await findRowIndexById(id);

    if (!rowIndex) {
      return NextResponse.json({ error: "Sollicitatie niet gevonden" }, { status: 404 });
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
    return NextResponse.json({ error: "Update mislukt" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Ook hier aanpassen
) {
  try {
    const { id } = await params; // Awaiten

    const rowIndex = await findRowIndexById(id);
    if (!rowIndex) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetInternalId = spreadsheet.data.sheets?.[0].properties?.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetInternalId,
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Verwijderen mislukt" }, { status: 500 });
  }
}
