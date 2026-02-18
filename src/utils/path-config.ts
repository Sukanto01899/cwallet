import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(import.meta.url);

const cwalletDirName = ".cwallet";
const walletFileName = "wallets.json";
const configFileName = "config.json";

export const cwalletDir = path.join(os.homedir(), cwalletDirName);
export const walletFile = path.join(cwalletDir, walletFileName);
export const configFile = path.join(cwalletDir, configFileName);
export const dataDir = path.resolve(__dirname, "../..", "data");
export const chainsFile = path.join(dataDir, "chains.json");
export const tokensFile = path.join(dataDir, "tokens.json");
