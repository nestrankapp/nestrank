import { auth } from '../../../auth';
import { getSavedSearches, saveSearch } from '../../../lib/savedSearchStore';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return json({ error: 'Unauthorized' }, 401);
  return json({ items: getSavedSearches(session.user.id) });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) return json({ error: 'Unauthorized' }, 401);
  const body = await request.json();
  const item = {
    id: crypto.randomUUID(),
    name: body.name,
    address: body.address,
    createdAt: new Date().toISOString()
  };
  return json({ items: saveSearch(session.user.id, item) });
}
