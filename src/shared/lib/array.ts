/**
 * Reasigna el campo `order` de cada item según su posición en `orderedIds`.
 * Retorna un nuevo array con los items actualizados (no muta el original).
 * Items cuyo id no aparece en `orderedIds` conservan su order original.
 */
export function upsertItem<T extends { id: string }>(items: T[], item: T): T[] {
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    return [...items.slice(0, index), item, ...items.slice(index + 1)];
  }
  return [...items, item];
}

export function reorderById<T extends { id: string; order?: number }>(
  items: T[],
  orderedIds: string[],
): T[] {
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  return items.map((item) => {
    const newOrder = orderMap.get(item.id);
    if (newOrder === undefined) return item;
    return { ...item, order: newOrder };
  });
}
