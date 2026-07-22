import type {
  GtPackageRegistration,
  KnowledgeObject,
} from "./types.ts";

export function buildGtPackageRegistry(objects: KnowledgeObject[]): GtPackageRegistration[] {
  const objectsById = new Map(objects.map((object) => [object.object_id, object]));
  return objects
    .filter((object) => object.object_type === "GT_PACKAGE")
    .map((object) => ({
      object_id: object.object_id,
      package_id: object.package_id,
      package_version: object.package_version,
      children: object.children.map((childId) => ({
        object_id: childId,
        member_type: objectsById.get(childId)?.package_member_type ?? null,
        registered: objectsById.has(childId),
      })),
    }))
    .sort((left, right) => left.object_id.localeCompare(right.object_id, "en", {numeric: true}));
}

export function validateGtPackageRegistry(
  objects: KnowledgeObject[],
  packages: GtPackageRegistration[],
): string[] {
  const errors: string[] = [];
  const objectsById = new Map(objects.map((object) => [object.object_id, object]));
  const packageIds = packages.map((entry) => entry.package_id).filter(Boolean);

  if (new Set(packageIds).size !== packageIds.length) {
    errors.push("GT Package Registry contains duplicate Package IDs.");
  }

  for (const entry of packages) {
    const root = objectsById.get(entry.object_id);
    if (!entry.package_id) errors.push(`${entry.object_id} is missing Package ID.`);
    if (!entry.package_version) errors.push(`${entry.object_id} is missing Package Version.`);
    if (root?.parent_object) errors.push(`${entry.object_id} cannot have a Parent Object.`);
    if (new Set(root?.children ?? []).size !== (root?.children.length ?? 0)) {
      errors.push(`${entry.object_id} contains duplicate Children.`);
    }

    for (const childEntry of entry.children) {
      const child = objectsById.get(childEntry.object_id);
      if (!child) {
        errors.push(`${entry.object_id} references missing child ${childEntry.object_id}.`);
        continue;
      }
      if (child.parent_object !== entry.object_id) {
        errors.push(`${child.object_id} does not reference parent ${entry.object_id}.`);
      }
      if (child.package_id !== entry.package_id) {
        errors.push(`${child.object_id} does not share Package ID ${entry.package_id}.`);
      }
      if (!child.package_member_type) {
        errors.push(`${child.object_id} is missing Package Member Type.`);
      }
    }
  }

  for (const object of objects) {
    if (!object.parent_object) continue;
    const parent = objectsById.get(object.parent_object);
    if (!parent) {
      errors.push(`${object.object_id} references missing Parent Object ${object.parent_object}.`);
      continue;
    }
    if (parent.object_type !== "GT_PACKAGE") {
      errors.push(`${object.object_id} parent ${parent.object_id} is not a GT_PACKAGE.`);
    }
    if (!parent.children.includes(object.object_id)) {
      errors.push(`${object.object_id} is not registered in parent ${parent.object_id} Children.`);
    }
  }

  return errors;
}
