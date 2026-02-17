import crypto from "crypto";
import fs from "fs";
import { configFile } from "./path-config.js";

export function hashedPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 32);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(inputPassword: string) {
  const { password } = JSON.parse(fs.readFileSync(configFile, "utf-8"));

  const [saltHex, hashHex] = password.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const hash = Buffer.from(hashHex, "hex");
  const verify = crypto.scryptSync(inputPassword, salt, 32);
  return crypto.timingSafeEqual(hash, verify);
}
