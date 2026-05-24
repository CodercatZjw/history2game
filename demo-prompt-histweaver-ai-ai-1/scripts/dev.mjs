import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const viteArgs = process.argv.slice(2);

const processes = [
  spawn(npmCommand, ["run", "dev:api"], { stdio: "inherit", shell: false }),
  spawn(npmCommand, ["run", "dev:client", "--", ...viteArgs], { stdio: "inherit", shell: false }),
];

function shutdown(code = 0) {
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

for (const child of processes) {
  child.on("exit", (code) => {
    if (code && code !== 0) shutdown(code);
  });
}
