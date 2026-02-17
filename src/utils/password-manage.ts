import crypto from "crypto";

export function hashedPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword() {}
