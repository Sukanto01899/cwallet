import { Command } from "commander";
import { setup } from "../lib/setup.js";

export function registerSetup(program: Command) {
  program
    .command("setup")
    .description("Set your cwallet")
    .action(async () => {
      await setup();
    });
}
