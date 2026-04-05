const mockSavedSearches = new Map();

export function getSavedSearches(userId) {
  return mockSavedSearches.get(userId) || [];
}

export function saveSearch(userId, search) {
  const current = mockSavedSearches.get(userId) || [];
  const next = [search, ...current].slice(0, 20);
  mockSavedSearches.set(userId, next);
  return next;
}
