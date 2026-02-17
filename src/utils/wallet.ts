import { Wallet } from "ethers";
import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import { Wallets } from "../types/types.js";
import { logger } from "../lib/logger.js";

const homeDir = os.homedir();
const walletDir = path.join(homeDir, ".cwallet");
const walletFileName = "wallets.json";

function encryptText(plainText: string, password: string) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(password, salt, 32);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export async function createWallet(name: string, password: string) {
  const wallet = Wallet.createRandom();
  const mnemonic = wallet.mnemonic?.phrase;

  const encrypted = await wallet.encrypt(password);

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
    address: wallet.address,
    keystore: encrypted,
    ...(mnemonic ? { mnemonicEncrypted: encryptText(mnemonic, password) } : {}),
  });

  fs.writeFileSync(walletFile, JSON.stringify(existing, null, 2));

  logger.info(`Wallet saved to ${walletFile}`);

  //   return encrypted;
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

export function showAllWalletNames() {
  const walletFile = path.join(walletDir, walletFileName);

  const readWalletFile = JSON.parse(fs.readFileSync(walletFile, "utf-8")) as Wallets;

  const walletNames = readWalletFile.map((wallet) => wallet.name);

  return walletNames;
}
