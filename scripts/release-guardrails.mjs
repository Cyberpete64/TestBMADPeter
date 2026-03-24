import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const tsconfigPath = new URL("../tsconfig.json", import.meta.url);
const originalTsconfig = readFileSync(tsconfigPath, "utf8");

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

try {
  run(npmCommand, ["run", "test"]);
  run(npmCommand, ["run", "typecheck"]);
  run(
    npxCommand,
    ["next", "build", "--webpack"],
    {
      ...process.env,
      NEXT_DIST_DIR: ".next-build-check",
    },
  );
} finally {
  writeFileSync(tsconfigPath, originalTsconfig);
}
