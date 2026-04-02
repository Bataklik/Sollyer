export type SollicitatieStatus =
  | "Verzonden"
  | "In behandeling"
  | "Gesprek gepland"
  | "Technische test"
  | "Afgewezen"
  | "Aangeboden";

export interface Sollicitatie {
  id: string;
  bedrijfsnaam: string;
  locatie: string;
  functie: string;
  datum: string;
  status: SollicitatieStatus;
  link?: string;
  notities?: string;
}

export const STATUS_OPTIONS: SollicitatieStatus[] = [
  "Verzonden",
  "In behandeling",
  "Gesprek gepland",
  "Technische test",
  "Afgewezen",
  "Aangeboden",
];

export const STATUS_COLORS: Record<SollicitatieStatus, { bg: string; text: string }> = {
  "Verzonden": { bg: "bg-[#AAC4FF]", text: "text-slate-800" },
  "In behandeling": { bg: "bg-amber-200", text: "text-amber-900" },
  "Gesprek gepland": { bg: "bg-[#B1B2FF]", text: "text-slate-800" },
  "Technische test": { bg: "bg-teal-200", text: "text-teal-900" },
  "Afgewezen": { bg: "bg-red-200", text: "text-red-900" },
  "Aangeboden": { bg: "bg-green-200", text: "text-green-900" },
};
