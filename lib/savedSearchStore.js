import { ensureSavedSearchesTable, query } from './db';

export async function getSavedSearches(userId) {
  await ensureSavedSearchesTable();
  const result = await query(
    `SELECT id, name, address, created_at
     FROM saved_searches
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 20`,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    createdAt: row.created_at,
  }));
}

export async function saveSearch(userId, search) {
  await ensureSavedSearchesTable();
  await query(
    `INSERT INTO saved_searches (id, user_id, name, address, created_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [search.id, userId, search.name, search.address, search.createdAt]
  );

  return getSavedSearches(userId);
}
