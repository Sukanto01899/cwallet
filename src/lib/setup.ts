import fs from "fs";
import { configFile, cwalletDir } from "../utils/path-config.js";
import { hashedPassword } from "../utils/password-manage.js";
import inquirer from "inquirer";
import { logger } from "./logger.js";
import { ExitPromptError } from "@inquirer/core";

export function isSetupCompleted() {
  const isDirExist = fs.existsSync(cwalletDir);
  const isFileExist = fs.existsSync(configFile);

  return isFileExist && isDirExist;
}

export async function setup() {
  logger.info("Setting up cwallet: \n");
  try {
    const { password } = await inquirer.prompt([
      { type: "password", name: "password", message: "Enter password: " },
    ]);
    const { confirmPassword } = await inquirer.prompt([
      {
        type: "password",
        name: "confirmPassword",
        message: "Confirm password: ",
        validate: (input) => {
          if (input !== password) {
            return "Require confirm pass";
          }
          return true;
        },
      },
    ]);
    const hashedPass = hashedPassword(confirmPassword);

    const config = {
      password: hashedPass,
    };

    fs.mkdirSync(cwalletDir);
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

    console.log(config);
  } catch (err) {
    if (err instanceof ExitPromptError) {
      console.log("\nCancelled by user. Exiting...");
      process.exit(130);
    }
    throw err;
  }
}
