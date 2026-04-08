import { google } from "googleapis";


export async function getSheetsClient() {
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
