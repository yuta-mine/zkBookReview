
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import {
  Mina,
  isReady,
  Field,
  PublicKey,
  fetchAccount,
  PrivateKey,
} from 'snarkyjs';
import "../reactCOIServiceWorker";

import ZkappWorkerClient from "../zkappWorkerClient";
import { log } from 'console';

const transactionFee = 0.1;
export default function PostReview() {
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentAdminAccount: null as null | PublicKey,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  const [privateKey, setPrivateKey] = useState<string>();

  useEffect(() => {
    (async () => {
      await isReady;
      const { BookReview } = await import('../../../../contracts/build/src/');

      const zkAppAddress = 'B62qjiXpQjApqs9tKwnwthZExPgMKJKKGpYYfLkep7Rs5aYScZLrKhC';
      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
        );
      }

      const zkApp = new BookReview(PublicKey.fromBase58(zkAppAddress));

    })();

    (async () => {
      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();

        console.log("Loading SnarkyJS...");
        await zkappWorkerClient.loadSnarkyJS();
        console.log("done");

      
        await zkappWorkerClient.setActiveInstanceToBerkeley();
        const mina = (window as any).mina;
        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }
        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);
        console.log(publicKey);
        
        console.log('using key', publicKey.toBase58());
        console.log('checking if account exists...');
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!
        });
        const accountExists = res.error == null;
    
        await zkappWorkerClient.loadContract();
        console.log('compiling zkApp');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');
        const zkappPublicKey = PublicKey.fromBase58(
          'B62qjiXpQjApqs9tKwnwthZExPgMKJKKGpYYfLkep7Rs5aYScZLrKhC'
        );
        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey })
        const currentAdminAccount = await zkappWorkerClient.getAdminAccount();

        console.log('current state:', currentAdminAccount);
        setState({
            ...state,
            zkappWorkerClient,
            hasWallet: true,
            hasBeenSetup: true,
            publicKey,
            zkappPublicKey,
            accountExists,
            currentAdminAccount
        });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't
  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          console.log('checking if account exists...');
          const res = await state.zkappWorkerClient!.fetchAccount({ 
            publicKey: state.publicKey!
          })
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasBeenSetup]);

  // -------------------------------------------------------
  // Send a transaction
  const onSendTransaction = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log('sending a transaction...');
    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!
    });

    console.log(privateKey);
    
    if(!privateKey)return;
    await state.zkappWorkerClient!.createUpdateTransaction({privateKey: privateKey});
    console.log('creating proof...');
    await state.zkappWorkerClient!.proveUpdateTransaction();
    console.log('getting Transaction JSON...');
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON()
    console.log('requesting send transaction...');
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });
    console.log(
      'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
    );
    setState({ ...state, creatingTransaction: false });
  }

  const handleChange = (e: { target: { value: string | undefined; }; }) => {
    setPrivateKey(() => e.target.value)
  }
  // -------------------------------------------------------

  // -------------------------------------------------------
  // Refresh the current state
  const onRefreshCurrentNum = async () => {
    console.log('getting zkApp state...');
    await state.zkappWorkerClient!.fetchAccount({
         publicKey: state.zkappPublicKey!
    })
    const currentAdminAccount = await state.zkappWorkerClient!.getAdminAccount();
    console.log('current state:', currentAdminAccount);
    setState({ ...state, currentAdminAccount });
  }
  // -------------------------------------------------------...

  
 // -------------------------------------------------------
  // Create UI elements

  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = 'https://www.aurowallet.com/';
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        {' '}
        [Link]{' '}
      </a>
    );
    hasWallet = (
      <div>
        {' '}
        Could not find a wallet. Install Auro wallet here: {auroLinkElem}
      </div>
    );
  }

  let setupText = state.hasBeenSetup
    ? 'SnarkyJS Ready'
    : 'Setting up SnarkyJS...';
  let setup = (
    <div>
      {' '}
      {setupText} {hasWallet}
    </div>
  );

  let accountDoesNotExist;
  if (state.hasBeenSetup && !state.accountExists) {
    const faucetLink =
      'https://faucet.minaprotocol.com/?address=' + state.publicKey!.toBase58();
    accountDoesNotExist = (
      <div>
        Account does not exist. Please visit the faucet to fund this account
        <a href={faucetLink} target="_blank" rel="noreferrer">
          {' '}
          [Link]{' '}
        </a>
      </div>
    );
  }

  let mainContent;
  if (state.hasBeenSetup && state.accountExists) {
    mainContent = (
      <div>
        <h3>set admin account</h3>
        <input value={privateKey} onChange={handleChange} type="text"/>
        <button
          onClick={onSendTransaction}
          disabled={state.creatingTransaction}
        >
          {' '}
          Send Transaction{' '}
        </button>
        {/* <div> Current Number in zkApp: {state.currentAdminAccount?.toBase58()} </div> */}
        <button onClick={onRefreshCurrentNum}> Get Latest State </button>
        <h3>set secret</h3>

      </div>
    );
  }

  return (
    <div>
      {setup}
      {accountDoesNotExist}
      {mainContent}
    </div>
  );
}

