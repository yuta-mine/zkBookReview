import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  fetchAccount,
  Field,
} from "snarkyjs";
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { BookReview } from "../../../contracts/src/BookReview";

const state = {
  BookReview: null as null | typeof BookReview,
  zkapp: null as null | BookReview,
  transaction: null as null | Transaction,
};

interface Functions {
  loadSnarkyJS: any;
  setActiveInstanceToBerkeley: any;
  loadContract: any;
  compileContract: any;
  fetchAccount: any;
  initZkappInstance: any;
  getX: any;
  getVerifiedCId1: any;
  getVerifiedCId2: any;
  getVerifiedCId3: any;
  getVerifiedCId4: any;
  getVerifiedCId5: any;
  getVerifiedCId6: any;
  getVerifiedCId7: any;
  createSetSecretTransaction: any;
  createProveReadingTransaction: any;
  proveUpdateTransaction: any;
  getTransactionJSON: any;
}

// ---------------------------------------------------------------------------------------

const functions: Functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { BookReview } = await import(
      "../../../contracts/build/src/BookReview.js"
    );
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
  getX: async (args: {}) => {
    const x = state.zkapp!.x.get();
    return JSON.stringify(x.toJSON());
  },
  getVerifiedCId1: async (args: {}) => {
    const verifiedCId1 = state.zkapp!.verifiedCId1.get();
    return JSON.stringify(verifiedCId1.toJSON());
  },
  getVerifiedCId2: async (args: {}) => {
    const verifiedCId2 = state.zkapp!.verifiedCId2.get();
    return JSON.stringify(verifiedCId2.toJSON());
  },
  getVerifiedCId3: async (args: {}) => {
    const verifiedCId3 = state.zkapp!.verifiedCId3.get();
    return JSON.stringify(verifiedCId3.toJSON());
  },
  getVerifiedCId4: async (args: {}) => {
    const verifiedCId4 = state.zkapp!.verifiedCId4.get();
    return JSON.stringify(verifiedCId4.toJSON());
  },
  getVerifiedCId5: async (args: {}) => {
    const verifiedCId5 = state.zkapp!.verifiedCId5.get();
    return JSON.stringify(verifiedCId5.toJSON());
  },
  getVerifiedCId6: async (args: {}) => {
    const verifiedCId6 = state.zkapp!.verifiedCId6.get();
    return JSON.stringify(verifiedCId6.toJSON());
  },
  getVerifiedCId7: async (args: {}) => {
    const verifiedCId7 = state.zkapp!.verifiedCId7.get();
    return JSON.stringify(verifiedCId7.toJSON());
  },
  createSetSecretTransaction: async (args: {
    secret1: Field;
    secret2: Field;
    secret3: Field;
    secret4: Field;
    secret5: Field;
  }) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setSecret(
        args.secret1,
        args.secret2,
        args.secret3,
        args.secret4,
        args.secret5
      );
    });
    state.transaction = transaction;
  },
  createProveReadingTransaction: async (args: {
    cId: Field;
    secret1: Field;
    secret2: Field;
    secret3: Field;
    secret4: Field;
    secret5: Field;
  }) => {
    const verifiedCId1 = state.zkapp!.verifiedCId1.get();
    const verifiedCId2 = state.zkapp!.verifiedCId2.get();
    const verifiedCId3 = state.zkapp!.verifiedCId3.get();
    const verifiedCId4 = state.zkapp!.verifiedCId4.get();
    const verifiedCId5 = state.zkapp!.verifiedCId5.get();
    const verifiedCId6 = state.zkapp!.verifiedCId6.get();
    const verifiedCId7 = state.zkapp!.verifiedCId7.get();

    if (verifiedCId1.equals(Field(0))) {
      const transaction = await Mina.transaction(() => {
        state.zkapp!.proveReading1(
          args.cId,
          args.secret1,
          args.secret2,
          args.secret3,
          args.secret4,
          args.secret5
        );
      });
      state.transaction = transaction;
    } else if (verifiedCId2.equals(Field(0))) {
      const transaction = await Mina.transaction(() => {
        state.zkapp!.proveReading2(
          args.cId,
          args.secret1,
          args.secret2,
          args.secret3,
          args.secret4,
          args.secret5
        );
      });
      state.transaction = transaction;
    } else if (verifiedCId3.equals(Field(0))) {
      const transaction = await Mina.transaction(() => {
        state.zkapp!.proveReading3(
          args.cId,
          args.secret1,
          args.secret2,
          args.secret3,
          args.secret4,
          args.secret5
        );
      });
      state.transaction = transaction;
    } else if (verifiedCId4.equals(Field(0))) {
      const transaction = await Mina.transaction(() => {
        state.zkapp!.proveReading4(
          args.cId,
          args.secret1,
          args.secret2,
          args.secret3,
          args.secret4,
          args.secret5
        );
      });
      state.transaction = transaction;
    } else if (verifiedCId5.equals(Field(0))) {
      const transaction = await Mina.transaction(() => {
        state.zkapp!.proveReading5(
          args.cId,
          args.secret1,
          args.secret2,
          args.secret3,
          args.secret4,
          args.secret5
        );
      });
      state.transaction = transaction;
    } else if (verifiedCId6.equals(Field(0))) {
      const transaction = await Mina.transaction(() => {
        state.zkapp!.proveReading6(
          args.cId,
          args.secret1,
          args.secret2,
          args.secret3,
          args.secret4,
          args.secret5
        );
      });
      state.transaction = transaction;
    } else if (verifiedCId7.equals(Field(0))) {
      const transaction = await Mina.transaction(() => {
        state.zkapp!.proveReading7(
          args.cId,
          args.secret1,
          args.secret2,
          args.secret3,
          args.secret4,
          args.secret5
        );
      });
      state.transaction = transaction;
    }
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
    "message",
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
