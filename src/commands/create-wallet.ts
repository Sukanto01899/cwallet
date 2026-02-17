import { Command } from "commander";
import { logger } from "../lib/logger.js";
import inquirer from "inquirer";
import { createWallet } from "../lib/wallet.js";
import { clearSessionPassword, getSessionPassword, login } from "../utils/session.js";

export function registerCreateWallet(program: Command) {
  program
    .command("create")
    .description("create mew wallet")
    .option("-c, --chain <chain>", "create new wallet", "evm")
    .action(async (opt: { chain: "evm" | "sol" }) => {
      const sessionPass = await getSessionPassword();

      if (!sessionPass) {
        console.log(getSessionPassword());
        await login();
      }
      const answers = await inquirer.prompt([
        { type: "input", name: "name", message: "Wallet name:" },
        { type: "password", name: "password", message: "Password:" },
      ]);

      if (opt.chain === "evm") {
        const en = await createWallet(answers.name, answers.password);
      } else {
        // later will generate sol wallet
      }
    });
}
