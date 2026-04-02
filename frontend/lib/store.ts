import type { Sollicitatie } from "./types";

// In-memory store for demo purposes
// In production, this would be a database
let sollicitaties: Sollicitatie[] = [
  {
    id: "1",
    bedrijfsnaam: "Vercel",
    locatie: "Amsterdam",
    functie: "Frontend Developer",
    datum: "2026-03-15",
    status: "Gesprek gepland",
    link: "https://vercel.com/careers",
    notities: "Eerste gesprek op 25 maart om 14:00",
  },
  {
    id: "2",
    bedrijfsnaam: "Spotify",
    locatie: "Stockholm",
    functie: "Full Stack Engineer",
    datum: "2026-03-10",
    status: "In behandeling",
    link: "https://spotify.com/jobs",
    notities: "Sollicitatie verstuurd via LinkedIn",
  },
  {
    id: "3",
    bedrijfsnaam: "Stripe",
    locatie: "Dublin",
    functie: "Software Engineer",
    datum: "2026-03-01",
    status: "Technische test",
    link: "https://stripe.com/jobs",
    notities: "Technische test voltooid, wachten op feedback",
  },
  {
    id: "4",
    bedrijfsnaam: "GitHub",
    locatie: "Remote",
    functie: "DevOps Engineer",
    datum: "2026-02-20",
    status: "Verzonden",
    link: "https://github.com/careers",
  },
  {
    id: "5",
    bedrijfsnaam: "Booking.com",
    locatie: "Amsterdam",
    functie: "Backend Developer",
    datum: "2026-02-15",
    status: "Afgewezen",
    notities: "Niet genoeg ervaring met Java",
  },
  {
    id: "6",
    bedrijfsnaam: "Coolblue",
    locatie: "Rotterdam",
    functie: "React Developer",
    datum: "2026-03-20",
    status: "Aangeboden",
    link: "https://coolblue.nl/vacatures",
    notities: "Aanbod ontvangen: €5000/maand",
  },
];

export function getSollicitaties(): Sollicitatie[] {
  return [...sollicitaties];
}

export function getSollicitatie(id: string): Sollicitatie | undefined {
  return sollicitaties.find((s) => s.id === id);
}

export function createSollicitatie(data: Omit<Sollicitatie, "id">): Sollicitatie {
  const newSollicitatie: Sollicitatie = {
    ...data,
    id: Date.now().toString(),
  };
  sollicitaties.push(newSollicitatie);
  return newSollicitatie;
}

export function updateSollicitatie(
  id: string,
  data: Partial<Omit<Sollicitatie, "id">>
): Sollicitatie | null {
  const index = sollicitaties.findIndex((s) => s.id === id);
  if (index === -1) return null;

  sollicitaties[index] = { ...sollicitaties[index], ...data };
  return sollicitaties[index];
}

export function deleteSollicitatie(id: string): boolean {
  const index = sollicitaties.findIndex((s) => s.id === id);
  if (index === -1) return false;

  sollicitaties.splice(index, 1);
  return true;
}
