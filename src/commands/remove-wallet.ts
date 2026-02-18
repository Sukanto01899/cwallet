import { Command } from "commander";
import inquirer from "inquirer";
import { logger } from "../lib/logger.js";
import { removeWalletByName, showAllWalletNames } from "../lib/wallet.js";

export function registerRemoveWallet(program: Command) {
  program
    .command("remove")
    .description("Remove a wallet")
    .option("-n, --name <wallet>", "wallet name to remove")
    .action(async (opt: { name?: string }) => {
      try {
        const allWallets = showAllWalletNames();
        if (allWallets.length === 0) {
          logger.error("No wallet found.");
          return;
        }

        let selectedWallet: string | undefined;
        if (opt.name) {
          if (!allWallets.includes(opt.name)) {
            logger.error("Wallet not found.");
            return;
          }
          selectedWallet = opt.name;
        } else {
          const result = await inquirer.prompt([
            {
              type: "select",
              name: "selectedWallet",
              message: "Select wallet to remove:",
              choices: allWallets.map((name) => ({ name, value: name })),
            },
          ]);
          selectedWallet = result.selectedWallet;
        }

        if (!selectedWallet) return;

        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: `Delete wallet \"${selectedWallet}\"?`,
            default: false,
          },
        ]);

        if (!confirm) {
          logger.info("Remove cancelled.");
          return;
        }

        const removed = removeWalletByName(selectedWallet);
        if (!removed) {
          logger.error("Wallet not found.");
          return;
        }

        logger.info("Wallet removed successfully.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error(`Remove failed: ${message}`);
      }
    });
}
