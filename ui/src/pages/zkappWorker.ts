import { Mina, isReady, PublicKey, PrivateKey,fetchAccount } from 'snarkyjs';
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { BookReview } from '../../../contracts/src/BookReview';

const state = {
  BookReview: null as null | typeof BookReview,
  zkapp: null as null | BookReview,
  transaction: null as null | Transaction,
};

interface Functions {
  loadSnarkyJS: any,
  setActiveInstanceToBerkeley: any,
  loadContract: any,
  compileContract: any,
  fetchAccount: any,
  initZkappInstance: any,
  getAdminAcount: any,
  createUpdateTransaction: any,
  proveUpdateTransaction: any,
  getTransactionJSON: any,
}

// ---------------------------------------------------------------------------------------

const functions: Functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { BookReview } = await import('../../../contracts/build/src/BookReview.js');
    state.BookReview = BookReview;
  },
  compileContract: async (args: {}) => {
    await state.BookReview!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.BookReview!(publicKey);
  },
  getAdminAcount: async (args: {}) => {
    const currentPubKey = state.zkapp!.adminAccount.get();
    return currentPubKey;
  },
  createUpdateTransaction: async (args: {privateKey: string}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setAdminAccount(PrivateKey.fromBase58(args.privateKey));
    });
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};
if (process.browser) {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}