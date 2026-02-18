import { Command } from "commander";
import { showAllWalletNames, showWalletAddress } from "../lib/wallet.js";
import inquirer from "inquirer";
import { getSessionPassword, login } from "../utils/session.js";
import { logger } from "../lib/logger.js";

export function registerShowWallet(program: Command) {
  program
    .command("show")
    .description("Get your wallet address")
    .action(async () => {
      try {
        const allWallets = showAllWalletNames();
        if (allWallets.length === 0) {
          logger.error("No wallet created or imported.");
          return;
        }
        let sessionPass = await getSessionPassword();
        if (!sessionPass) {
          await login();
          sessionPass = await getSessionPassword();
        }
        if (!sessionPass) {
          logger.error("Login required.");
          return;
        }

        const { selectedWallet } = await inquirer.prompt([
          {
            type: "select",
            name: "selectedWallet",
            message: "Select a wallet to show:\n",
            choices: allWallets.map((name) => ({ name, value: name })),
          },
        ]);

        if (!selectedWallet) {
          return;
        }

        const address = await showWalletAddress(selectedWallet, sessionPass);
        logger.info(`Wallet: ${selectedWallet}`);
        logger.info(`Address: ${address}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error(`Failed to show wallet: ${message}`);
      }
    });
}
