# CWallet CLI

Command-line wallet manager for creating, importing, exporting, and managing EVM wallets.

**Install**

```bash
npm install -g cwallet
```

Or run without install:

```bash
npx cwallet <command>
```

**Quick Start**

```bash
cwallet setup
cwallet create
cwallet show
```

**How It Works**

1. Run `setup` once to create local config and set the master password.
2. Use `create` to generate a new wallet, or `import` to bring an existing one.
3. Use `show` and `export` to view address or export secrets.
4. Use `remove` to delete a wallet, and `reset` to clear everything.

**Commands**

1. `cwallet setup`  
   Initializes config and asks you to create or import a wallet.

2. `cwallet create`  
   Creates a new wallet.  
   Options: `--chain evm`

3. `cwallet import`  
   Imports a wallet from a mnemonic phrase.

4. `cwallet show`  
   Select a wallet and show its address.

5. `cwallet export`  
   Export private key and/or mnemonic.  
   Options: `--name <wallet>`

6. `cwallet remove`  
   Remove a wallet by selection or by name.  
   Options: `--name <wallet>`

7. `cwallet reset`  
   Clears all local data and session info.
