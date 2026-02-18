import { Command } from "commander";
import { showAllWalletNames, showWalletAddress } from "../lib/wallet.js";
import inquirer from "inquirer";
import { getSessionPassword, login } from "../utils/session.js";

export function registerShowWallet(program: Command) {
  program
    .command("show")
    .description("Get your wallet address")
    .action(async () => {
      const allWallets = showAllWalletNames();
      if (allWallets.length === 0) {
        return console.log("No wallet created or imported");
      }
      const sessionPass = await getSessionPassword();

      if (!sessionPass) {
        await login();
      }

      const { selectedWallet } = await inquirer.prompt([
        {
          type: "select",
          name: "selectedWallet",
          message: "Your all wallets:",
          choices: allWallets.map((name) => ({ name, value: name })),
        },
      ]);

      if (!selectedWallet || !sessionPass) {
        return;
      }

      const address = showWalletAddress(selectedWallet, sessionPass);
      console.log(address);
    });
}
