import { Command } from "commander";
import inquirer from "inquirer";
import { loadMnemonic, loadWallet, showAllWalletNames } from "../lib/wallet.js";
import { logger } from "../lib/logger.js";
import { getSessionPassword, login } from "../utils/session.js";

export function registerExportWallet(program: Command) {
  program
    .command("export")
    .description("Select a wallet to export")
    .option("-n, --name <name>", "export wallet")
    .action(async (opt: { name: string }) => {
      try {
        const allWallets = showAllWalletNames();
        if (!allWallets || allWallets.length === 0) {
          logger.error("No wallets found.");
          return;
        }

        let walletName: string | undefined;
        if (opt.name) {
          if (allWallets.includes(opt.name)) {
            walletName = opt.name;
          } else {
            logger.error("Wallet not found.");
            return;
          }
        } else {
          const { selectedWallet } = await inquirer.prompt([
            {
              type: "select",
              name: "selectedWallet",
              message: "Select a wallet:",
              choices: allWallets.map((name) => ({ name, value: name })),
            },
          ]);
          walletName = selectedWallet;
        }

        if (!walletName) return;

        const { selectedType } = await inquirer.prompt([
          {
            type: "select",
            name: "selectedType",
            message: "Select export type:",
            choices: [
              { name: "Private key", value: "privatekey" },
              { name: "Mnemonic phrase", value: "mnemonic" },
              { name: "Both", value: "both" },
            ],
          },
        ]);

        let password = await getSessionPassword();
        if (!password) {
          await login();
          password = await getSessionPassword();
        }
        if (!password) {
          logger.error("Login required.");
          return;
        }

        const wallet = await loadWallet(walletName, password);

        if (selectedType === "privatekey") {
          logger.info(`Private key:\n${wallet.privateKey}`);
        } else if (selectedType === "mnemonic") {
          logger.info(`Mnemonic:\n${loadMnemonic(walletName, password)}`);
        } else {
          logger.info(`Private key:\n${wallet.privateKey}`);
          logger.info(`Mnemonic:\n${loadMnemonic(walletName, password)}`);
        }

        logger.info("Wallet exported.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.error(`Export failed: ${message}`);
      }
    });
}
