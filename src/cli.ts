#!/usr/bin/env node
import { Command } from "commander";
import { registerHelloCommand } from "./commands/hello.js";
import { version } from "./index.js";

const program = new Command();

program.name("cwallet").description("CWallet CLI").version(version);

registerHelloCommand(program);

program.parseAsync(process.argv);
