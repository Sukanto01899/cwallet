#!/usr/bin/env node
import { Command } from "commander";
import { registerHelloCommand } from "./commands/hello.js";
import { registerCreateWallet } from "./commands/create-wallet.js";
import { version } from "./index.js";
import { registerExportWallet } from "./commands/export-wallet.js";

const program = new Command();

program.name("cwallet").description("CWallet CLI").version(version);

registerHelloCommand(program);
registerCreateWallet(program);
registerExportWallet(program);

program.parseAsync(process.argv);
