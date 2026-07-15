import type {LifecycleConfig} from "./types.ts";

export function validateLifecycleConfig(config: LifecycleConfig): string[] {
  const errors: string[] = [];
  const statusIds = config.statuses.map((status) => status.id);
  const knownStatuses = new Set(statusIds);

  if (statusIds.length !== knownStatuses.size) {
    errors.push("Lifecycle config contains duplicate status IDs.");
  }

  for (const status of config.statuses) {
    if (!Object.hasOwn(config.transitions, status.id)) {
      errors.push(`Lifecycle status ${status.id} has no transitions entry.`);
    }
  }

  for (const [from, targets] of Object.entries(config.transitions)) {
    if (!knownStatuses.has(from)) {
      errors.push(`Lifecycle transition source ${from} is not configured.`);
    }
    for (const target of targets) {
      if (!knownStatuses.has(target)) {
        errors.push(`Lifecycle transition target ${target} is not configured.`);
      }
    }
  }

  return errors;
}

export function isKnownLifecycleStatus(
  status: string | null,
  config: LifecycleConfig,
): boolean {
  return status === null || config.statuses.some((definition) => definition.id === status);
}

export function canTransition(
  from: string,
  to: string,
  config: LifecycleConfig,
): boolean {
  return config.transitions[from]?.includes(to) ?? false;
}

export function isFoundationReady(
  status: string | null,
  foundationId: string | null,
  config: LifecycleConfig,
): boolean {
  const definition = config.statuses.find((candidate) => candidate.id === status);
  return Boolean(definition?.foundation_eligible && foundationId);
}
