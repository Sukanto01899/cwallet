#!/usr/bin/env node
import { Command } from "commander";
import { registerHelloCommand } from "./commands/hello.js";
import { registerCreateWallet } from "./commands/create-wallet.js";
import { version } from "./index.js";
import { registerExportWallet } from "./commands/export-wallet.js";
import { registerImportWallet } from "./commands/import-wallet.js";
import { registerSetup } from "./commands/setup.js";
import { isSetupCompleted } from "./lib/setup.js";

process.on("SIGINT", () => {
  console.log("\nCancelled by user. Exiting...");
  process.exit(130);
});

const program = new Command();

program.name("cwallet").description("Command line wallet").version(version);

const bypass = new Set(["setup", "help"]);

program.hook("preAction", (thisCommand, actionCommand) => {
  const cmd = actionCommand.name() ?? thisCommand.args?.[0];

  if (bypass.has(cmd)) return;

  if (!isSetupCompleted()) {
    console.error("Please run first: cwallet setup");
    process.exit(1);
  }
});

registerSetup(program);
registerHelloCommand(program);
registerCreateWallet(program);
registerExportWallet(program);
registerImportWallet(program);

program.parseAsync(process.argv);
