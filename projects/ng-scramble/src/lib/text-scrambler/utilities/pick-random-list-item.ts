export function pickRandomListItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  const t = items[index];
  return t;
}
