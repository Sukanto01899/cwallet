import { Command } from "commander";
import { logger } from "../lib/logger.js";
import { createWallet } from "../lib/wallet.js";
import { getSessionPassword, login } from "../utils/session.js";

export function registerCreateWallet(program: Command) {
  program
    .command("create")
    .description("Create new wallet")
    .option("-c, --chain <chain>", "create new wallet", "evm")
    .action(async (opt: { chain: "evm" | "sol" }) => {
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

        if (opt.chain === "evm") {
          const address = await createWallet(sessionPass);
          logger.info("Wallet created successfully.");
          logger.info(`Address: ${address}`);
          return;
        }

        logger.error("Unsupported chain. Use --chain evm");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error(`Create failed: ${message}`);
      }
    });
}
