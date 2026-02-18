import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import { logger } from "../lib/logger.js";
import { clearSessionPassword } from "../utils/session.js";
import { cwalletDir } from "../utils/path-config.js";

export function registerReset(program: Command) {
  program
    .command("reset")
    .description("Clear all local data and sessions")
    .action(async () => {
      try {
        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "This will delete all wallets and config. Continue?",
            default: false,
          },
        ]);

        if (!confirm) {
          logger.info("Reset cancelled.");
          return;
        }

        await clearSessionPassword();

        if (fs.existsSync(cwalletDir)) {
          fs.rmSync(cwalletDir, { recursive: true, force: true });
        }

        logger.info("Reset complete. All local data removed.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error(`Reset failed: ${message}`);
      }
    });
}
