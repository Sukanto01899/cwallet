import fs from "fs";
import os from "os";
import path from "path";

const cwalletDirName = ".cwallet";
const walletFileName = "wallets.json";
const configFileName = "config.json";

export const cwalletDir = path.join(os.homedir(), cwalletDirName);
export const walletFile = path.join(cwalletDir, walletFileName);
export const configFile = path.join(cwalletDir, configFileName);
