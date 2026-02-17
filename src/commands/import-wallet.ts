import { Command } from "commander";
import inquirer from "inquirer";

export function registerImportWallet(program: Command) {
  program
    .command("import")
    .description("Import you wallet")
    .action(async () => {
      const { name, password, confirmPassword, mnemonic } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Wallet name:",
          filter: (input: string) => input.trim(),
        },
        { type: "password", name: "password", message: "Password:" },
        {
          type: "password",
          name: "confirmPassword",
          message: "Confirm Password:",
        },
        { type: "password", name: "mnemonic", message: "Mnemonic phrase:" },
      ]);
    });
}
