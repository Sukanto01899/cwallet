import fs from "fs";
import { chainsFile, tokensFile } from "./path-config.js";
import { Chain, Token } from "../types/types.js";

export function getChains(): Record<string, Chain> {
  const chains = JSON.parse(fs.readFileSync(chainsFile, "utf-8")) as Record<string, Chain>;
  return chains || {};
}
export function getTokens(): Token[] {
  const tokens = JSON.parse(fs.readFileSync(tokensFile, "utf-8")) as Token[];
  return tokens;
}
