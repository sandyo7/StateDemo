export type Hotel = { id: number; title: string; body: string };

export async function fetchHotels(): Promise<Hotel[]> {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=30',
  );
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
