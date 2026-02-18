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
      try {
        const sessionPass = await getSessionPassword();

        if (!sessionPass) {
          await login();
        }

        if (opt.chain === "evm" && sessionPass) {
          const en = await createWallet(sessionPass);
        } else {
          // later will generate sol wallet
        }
      } catch (err) {
        console.log(err);
      }
    });
}
