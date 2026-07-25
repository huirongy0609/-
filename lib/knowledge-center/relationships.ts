export type RelatedTopicCandidate = {
  id: string;
  type: string;
};

export function resolvePublishedRelatedTopics<T extends RelatedTopicCandidate>(
  current: {id: string; relatedIds: string[]},
  objects: T[],
): T[] {
  const byId = new Map(
    objects
      .filter((object) => object.type === 'JD' && object.id.toLowerCase() !== current.id.toLowerCase())
      .map((object) => [object.id.toLowerCase(), object]),
  );

  return unique(current.relatedIds)
    .map((id) => byId.get(id.toLowerCase()))
    .filter((object): object is T => Boolean(object));
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
