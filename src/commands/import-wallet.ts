import { Command } from "commander";
import { importMnemonic } from "../lib/wallet.js";
import { logger } from "../lib/logger.js";
import { getSessionPassword, login } from "../utils/session.js";

export function registerImportWallet(program: Command) {
  program
    .command("import")
    .description("Import your wallet")
    .action(async () => {
      try {
        let sessionPass = await getSessionPassword();
        if (!sessionPass) {
          await login();
          sessionPass = await getSessionPassword();
        }
        if (!sessionPass) {
          logger.error("Login required.");
          return;
        }

        const address = await importMnemonic(sessionPass);
        logger.info("Wallet imported successfully.");
        logger.info(`Address: ${address}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error(`Import failed: ${message}`);
      }
    });
}
