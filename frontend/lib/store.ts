const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/sollicitatie`
  : '/api/sollicitatie';

export async function getSollicitaties() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function getSollicitatie(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { cache: 'no-store' });
  if (!res.ok) return undefined;
  return res.json();
}

export async function createSollicitatie(data: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateSollicitatie(id: string, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteSollicitatie(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.ok;
}
