import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["scripts/generate-geo-mvp.mjs", "pages"], { stdio: "inherit" });
process.exit(result.status ?? 1);
