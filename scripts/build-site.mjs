import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["vitepress", "build", "site"], { stdio: "inherit", shell: true });
process.exit(result.status ?? 1);
