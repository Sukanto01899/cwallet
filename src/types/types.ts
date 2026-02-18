export type Wallet = {
  name: string;
  address: string;
  keystore: string;
  mnemonicEncrypted?: string;
};

export type Wallets = Wallet[];

export type Chain = {
  rpc: string;
  chianId: number;
  currency: string;
  network: string;
};
export type Token = {
  symbol: string;
  contract: string;
  name: string;
  chain: Chain[];
};
