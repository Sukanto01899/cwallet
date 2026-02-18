import { Wallet } from "ethers";
import fs, { existsSync } from "fs";
import os from "os";
import path from "path";
import { Wallets } from "../types/types.js";
import { logger } from "../lib/logger.js";
import { decryptText, encryptText } from "../lib/encode-decode.js";
import inquirer from "inquirer";
import { verifyPassword } from "../utils/password-manage.js";

const homeDir = os.homedir();
const walletDir = path.join(homeDir, ".cwallet");
const walletFileName = "wallets.json";

function saveWallet({
  name,
  address,
  encryptedKey,
  encryptedMnemonic,
}: {
  name: string;
  address: string;
  encryptedKey: string;
  encryptedMnemonic: string;
}) {
  if (!fs.existsSync(walletDir)) {
    fs.mkdirSync(walletDir);
  }

  const walletFile = path.join(walletDir, walletFileName);

  let existing = [];

  if (fs.existsSync(walletFile)) {
    existing = JSON.parse(fs.readFileSync(walletFile, "utf-8"));
  }

  existing.push({
    name,
    address: address,
    keystore: encryptedKey,
    mnemonicEncrypted: encryptedMnemonic,
  });
  fs.writeFileSync(walletFile, JSON.stringify(existing, null, 2));

  return true;
}

async function walletNameInput() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter Wallet name:",
      validate: (input) => {
        const allWalletsName = showAllWalletNames();
        if (allWalletsName.length === 0) {
          return true;
        }
        if (allWalletsName.includes(input)) {
          return "Enter unique wallet name";
        }
        return true;
      },
      filter: (input: string) => {
        return input.trim();
      },
    },
  ]);

  return name;
}

export async function createWallet(password: string) {
  const isPasswordValid = verifyPassword(password);
  if (!isPasswordValid) {
    return console.log("Password wrong");
  }

  const walletName = await walletNameInput();

  let wallet = Wallet.createRandom();
  let mnemonic = wallet.mnemonic?.phrase;

  while (!mnemonic) {
    wallet = Wallet.createRandom();
    mnemonic = wallet.mnemonic?.phrase;
  }

  const encrypted = await wallet.encrypt(password);
  const encryptedMnemonic = encryptText(mnemonic, password);

  const save = saveWallet({
    name: walletName,
    address: wallet.address,
    encryptedKey: encrypted,
    encryptedMnemonic,
  });

  logger.info(`Your wallet address: ${wallet.address}`);
}

export async function loadWallet(name: string, password: string) {
  const walletFile = path.join(walletDir, walletFileName);

  const readWalletFile = JSON.parse(fs.readFileSync(walletFile, "utf-8")) as Wallets;

  const wallets = readWalletFile ? readWalletFile : [];

  const found = wallets.find((wallet) => wallet.name === name);

  if (!found) {
    throw new Error("Wallet not found");
  }

  const wallet = await Wallet.fromEncryptedJson(found.keystore, password);

  //   console.log("wallet unlocked", wallet);

  return wallet;
}

export function loadMnemonic(name: string, password: string) {
  const walletFile = path.join(walletDir, walletFileName);

  const readWalletFile = JSON.parse(fs.readFileSync(walletFile, "utf-8")) as Wallets;

  const wallets = readWalletFile ? readWalletFile : [];

  const found = wallets.find((wallet) => wallet.name === name);

  if (!found || !found?.mnemonicEncrypted) {
    throw new Error("Wallet not found");
  }

  const mnemonic = decryptText(found.mnemonicEncrypted, password);

  return mnemonic;
}

export function showAllWalletNames() {
  const walletFile = path.join(walletDir, walletFileName);

  if (!existsSync(walletFile)) {
    return [];
  }

  const readWalletFile = JSON.parse(fs.readFileSync(walletFile, "utf-8")) as Wallets;

  const walletNames = readWalletFile.map((wallet) => wallet.name);

  return walletNames;
}

export async function importMnemonic(password: string) {
  const isPasswordValid = verifyPassword(password);
  if (!isPasswordValid) {
    return console.log("Password wrong");
  }
  const walletName = await walletNameInput();

  const { mnemonic } = await inquirer.prompt([
    { type: "password", name: "mnemonic", message: "Enter mnemonic" },
  ]);

  const wallet = Wallet.fromPhrase(mnemonic);
  const encrypted = await wallet.encrypt(password);
  const encryptedMnemonic = encryptText(mnemonic, password);
  const save = saveWallet({
    name: walletName,
    address: wallet.address,
    encryptedKey: encrypted,
    encryptedMnemonic,
  });

  logger.info(`Your wallet address: ${wallet.address}`);
}

export async function showWalletAddress(name: string, password: string) {
  const isPasswordValid = verifyPassword(password);
  if (!isPasswordValid) {
    return console.log("Password wrong");
  }
  const walletFile = path.join(walletDir, walletFileName);

  const readWalletFile = JSON.parse(fs.readFileSync(walletFile, "utf-8")) as Wallets;

  const wallets = readWalletFile ? readWalletFile : [];

  const found = wallets.find((wallet) => wallet.name === name);

  if (!found || !found?.mnemonicEncrypted) {
    throw new Error("Wallet not found");
  }

  const address = found.address;

  return address;
}
