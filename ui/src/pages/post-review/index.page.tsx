
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
    x: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  const [secret1, setSecret1] = useState<string>();
  const [secret2, setSecret2] = useState<string>();
  const [secret3, setSecret3] = useState<string>();
  const [secret4, setSecret4] = useState<string>();
  const [secret5, setSecret5] = useState<string>();
  const [cId, setCId] = useState<number>();

  console.log(secret1, typeof secret1);
  console.log(secret2, typeof secret2);
  console.log(secret3, typeof secret3);
  console.log(secret4, typeof secret4);
  console.log(secret5, typeof secret5);

  useEffect(() => {
    (async () => {
      await isReady;
      const { BookReview } = await import('../../../../contracts/build/src/');

      const zkAppAddress = 'B62qrNeaM6SZBdqizf7PcQw488DPLvJGTeFKwEgp71yZZuMYDQikptv';
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
          'B62qrNeaM6SZBdqizf7PcQw488DPLvJGTeFKwEgp71yZZuMYDQikptv'
        );
        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey })
        const x = await zkappWorkerClient.getX();

        console.log('current state:', x);
        setState({
            ...state,
            zkappWorkerClient,
            hasWallet: true,
            hasBeenSetup: true,
            publicKey,
            zkappPublicKey,
            accountExists,
            x
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
  const onSendSetSecretTransaction = async () => {
    setState({ ...state, creatingTransaction: true });
    console.log('sending a transaction...');
    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.publicKey!
    });
    if(!secret1 || !secret2 || !secret3 || !secret4 || !secret5)return;
    await state.zkappWorkerClient!.createSetSecretTransaction({secret1,secret2,secret3,secret4,secret5});
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

    // Send a transaction
    const onSendProveReadingTransaction = async () => {
      setState({ ...state, creatingTransaction: true });
      console.log('sending a transaction...');
      await state.zkappWorkerClient!.fetchAccount({
        publicKey: state.publicKey!
      });
      if(!secret1 || !secret2 || !secret3 || !secret4 || !secret5 || !cId)return;
      await state.zkappWorkerClient!.createProveReadingTransaction({cId, secret1,secret2,secret3,secret4,secret5});
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


  const handleChange1 = (e: { target: { value: string | undefined; }; }) => {
    setSecret1(() => e.target.value)
  }
  const handleChange2 = (e: { target: { value: string | undefined; }; }) => {
    setSecret2(() => e.target.value)
  }
  const handleChange3 = (e: { target: { value: string | undefined; }; }) => {
    setSecret3(() => e.target.value)
  }
  const handleChange4 = (e: { target: { value: string | undefined; }; }) => {
    setSecret4(() => e.target.value)
  }
  const handleChange5 = (e: { target: { value: string | undefined; }; }) => {
    setSecret5(() => e.target.value)
  }
  const handleChangeCId = (e: { target: { value: string | undefined; }; }) => {
    setCId(() => Number(e.target.value))
  }
  // -------------------------------------------------------

  // -------------------------------------------------------
  // Refresh the current state
  const onRefreshCurrentNum = async () => {
    console.log('getting zkApp state...');
    await state.zkappWorkerClient!.fetchAccount({
         publicKey: state.zkappPublicKey!
    })
    const x = await state.zkappWorkerClient!.getX();
    console.log('current state:', x);
    setState({ ...state, x });
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
        <h3>set secret</h3>
        <input value={secret1} onChange={handleChange1} type="text"/>
        <input value={secret2} onChange={handleChange2} type="text"/>
        <input value={secret3} onChange={handleChange3} type="text"/>
        <input value={secret4} onChange={handleChange4} type="text"/>
        <input value={secret5} onChange={handleChange5} type="text"/>
        <button
          onClick={onSendSetSecretTransaction}
          disabled={state.creatingTransaction}
        >
          {' '}
          Send Transaction{' '}
        </button>
        <div> Current Number in zkApp: {state.x?.toString()} </div>
        <button onClick={onRefreshCurrentNum}> Get Latest State </button>
        <h3>prove reading</h3>
        <input value={cId} onChange={handleChangeCId} type="text"/>
        <button
          onClick={onSendProveReadingTransaction}
          disabled={state.creatingTransaction}
        >
          {' '}
          Send Transaction{' '}
        </button>
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

