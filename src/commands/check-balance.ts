//balance checker

import { Command } from "commander";
import { getChains, getTokens } from "../utils/helper.js";

export function registerBalanceChecker(program: Command) {
  program
    .command("balance")
    .description("Check your wallet balance")
    .option("-c, --chain <chain>", "Select chain", "ether")
    .option("-t, --token <token>", "Select token", "native")
    .action((opt: { chain: string; token: string }) => {
      const inChain = opt.chain ? opt.chain.trim().toLowerCase() : null;
      const inToken = opt.token ? opt.token.trim().toLowerCase() : null;
      const chains = getChains();
      const tokens = getTokens();

      let selectedChain;
      let selectedToken;

      if (!inChain || !chains.hasOwnProperty("chain")) {
        console.log("chain not found");
      }

      if (!inToken || !tokens.some((t) => t.symbol === inToken)) {
        console.log("Token not found");
      }
    });
}
