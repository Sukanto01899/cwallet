export type Wallet = {
  name: string;
  address: string;
  keystore: string;
  mnemonicEncrypted?: string;
};

export type Wallets = Wallet[];
