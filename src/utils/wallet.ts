import { Wallet } from "ethers";
import fs from "fs";
import os from "os";
import path from "path";
import { Wallets } from "../types/types.js";
import { logger } from "../lib/logger.js";
import { decryptText, encryptText } from "../lib/encode-decode.js";

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

export async function createWallet(name: string, password: string) {
  let wallet = Wallet.createRandom();
  let mnemonic = wallet.mnemonic?.phrase;

  while (!mnemonic) {
    wallet = Wallet.createRandom();
    mnemonic = wallet.mnemonic?.phrase;
  }

  const encrypted = await wallet.encrypt(password);
  const encryptedMnemonic = encryptText(mnemonic, password);

  const save = saveWallet({
    name,
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

  const readWalletFile = JSON.parse(fs.readFileSync(walletFile, "utf-8")) as Wallets;

  const walletNames = readWalletFile.map((wallet) => wallet.name);

  return walletNames;
}

export async function importMnemonic(name: string, password: string, mnemonic: string) {
  const wallet = Wallet.fromPhrase(mnemonic);
  const encrypted = await wallet.encrypt(password);
  const encryptedMnemonic = encryptText(mnemonic, password);
  const save = saveWallet({
    name,
    address: wallet.address,
    encryptedKey: encrypted,
    encryptedMnemonic,
  });

  logger.info(`Your wallet address: ${wallet.address}`);
}
