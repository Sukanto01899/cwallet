import type { Command } from "commander";
import { logger } from "../lib/logger.js";

export function registerHelloCommand(program: Command) {
  program
    .command("hello")
    .description("Print a friendly greeting")
    .option("-n, --name <name>", "Name to greet", "world")
    .action((opts: { name: string }) => {
      logger.info(`Hello, ${opts.name}!`);
    });
}
