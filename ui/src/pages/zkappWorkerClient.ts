import { fetchAccount, PublicKey, PrivateKey, Field, Encoding } from "snarkyjs";

import type {
  ZkappWorkerRequest,
  ZkappWorkerReponse,
  WorkerFunctions,
} from "./zkappWorker";

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  loadSnarkyJS() {
    return this._call("loadSnarkyJS", {});
  }

  setActiveInstanceToBerkeley() {
    return this._call("setActiveInstanceToBerkeley", {});
  }

  loadContract() {
    return this._call("loadContract", {});
  }

  compileContract() {
    return this._call("compileContract", {});
  }

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    const result = this._call("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call("initZkappInstance", {
      publicKey58: publicKey.toBase58(),
    });
  }

  async getX(): Promise<Field> {
    const result = await this._call("getX", {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  createSetSecretTransaction({
    secret1,
    secret2,
    secret3,
    secret4,
    secret5,
  }: {
    secret1: string;
    secret2: string;
    secret3: string;
    secret4: string;
    secret5: string;
  }) {
    return this._call("createSetSecretTransaction", {
      secret1: Encoding.stringToFields(secret1)[0],
      secret2: Encoding.stringToFields(secret2)[0],
      secret3: Encoding.stringToFields(secret3)[0],
      secret4: Encoding.stringToFields(secret4)[0],
      secret5: Encoding.stringToFields(secret5)[0],
    });
  }

  createProveReadingTransaction({
    cId,
    secret1,
    secret2,
    secret3,
    secret4,
    secret5,
  }: {
    cId: number;
    secret1: string;
    secret2: string;
    secret3: string;
    secret4: string;
    secret5: string;
  }) {
    return this._call("createProveReadingTransaction", {
      cId: Field(cId),
      secret1: Encoding.stringToFields(secret1)[0],
      secret2: Encoding.stringToFields(secret2)[0],
      secret3: Encoding.stringToFields(secret3)[0],
      secret4: Encoding.stringToFields(secret4)[0],
      secret5: Encoding.stringToFields(secret5)[0],
    });
  }

  proveUpdateTransaction() {
    return this._call("proveUpdateTransaction", {});
  }

  async getTransactionJSON() {
    const result = await this._call("getTransactionJSON", {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./zkappWorker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
