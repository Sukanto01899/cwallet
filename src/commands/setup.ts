import { Command } from "commander";
import { isSetupCompleted, setup } from "../lib/setup.js";

export function registerSetup(program: Command) {
  program
    .command("setup")
    .description("Set your cwallet")
    .action(async () => {
      if (isSetupCompleted()) {
        return console.log("You are already set up wallet");
      }
      await setup();
    });
}
