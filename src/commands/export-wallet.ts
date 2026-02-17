import { Command } from "commander";
import inquirer from "inquirer";
import { loadMnemonic, loadWallet, showAllWalletNames } from "../utils/wallet.js";
import { logger } from "../lib/logger.js";

export async function registerExportWallet(program: Command) {
  program
    .command("export")
    .description("Select a wallet to export")
    .option("-n, --name <name>", "export wallet")
    .action(async (opt: { name: string }) => {
      const allWallets = showAllWalletNames();
      let walletName;

      if (!allWallets || allWallets.length === 0) {
        logger.error("No wallets found.");
        return;
      }

      if (opt.name) {
        if (allWallets.includes(opt.name)) {
          walletName = opt.name;
        } else {
          console.log("Wallet not found");
          return;
        }
      } else {
        const { selectedWallet } = await inquirer.prompt([
          {
            type: "select",
            name: "selectedWallet",
            message: "Select a wallet: ",
            choices: allWallets.map((name) => ({ name, value: name })),
          },
        ]);
        walletName = selectedWallet;
      }

      //   Select type (privatekey, seed, both)
      const { selectedType } = await inquirer.prompt([
        {
          type: "select",
          name: "selectedType",
          message: "Select a wallet: ",
          choices: [
            { name: "Private key", value: "privatekey" },
            { name: "Mnemonic phrase", value: "mnemonic" },
            { name: "Both", value: "both" },
          ],
        },
      ]);

      const answer = await inquirer.prompt([
        { type: "password", name: "password", message: "Password:" },
      ]);

      const wallet = await loadWallet(walletName, answer.password);

      if (selectedType === "privatekey") {
        console.log(wallet.privateKey);
      } else if (selectedType === "mnemonic") {
        console.log(loadMnemonic(walletName, answer.password));
      } else {
        console.log(wallet.privateKey);
        console.log(loadMnemonic(walletName, answer.password));
      }

      logger.info(`Wallet exported`);
    });
}
