import inquirer from "inquirer";
import { verifyPassword } from "./password-manage.js";

let memPassword: string | null = null;

const SERVICE = "cwallet";
const ACCOUNT = "session";

// keytar fallback
async function getKeyter() {
  try {
    const mod = await import("keytar");
    return mod.default;
  } catch {
    return null;
  }
}

export async function setSessionPassword(pw: string) {
  memPassword = pw;

  const keytar = await getKeyter();
  if (keytar) {
    await keytar.setPassword(SERVICE, ACCOUNT, pw);
  }
}

export async function getSessionPassword() {
  if (memPassword) return memPassword;

  const keytar = await getKeyter();
  if (keytar) {
    const pw = await keytar.getPassword(SERVICE, ACCOUNT);
    if (pw) {
      memPassword = pw;
      return pw;
    }
  }

  return null;
}

export async function clearSessionPassword() {
  memPassword = null;

  const keytar = await getKeyter();
  if (keytar) {
    await keytar.deletePassword(SERVICE, ACCOUNT);
  }
}

export async function login() {
  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      message: "Password:",
      validate: (input) => {
        const isValidPassword = verifyPassword(input);

        return isValidPassword ? true : "Enter right pass";
      },
    },
  ]);

  setSessionPassword(password);
}
