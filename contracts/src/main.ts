import { BookReview } from './BookReview.js';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
  Encoding,
} from 'snarkyjs';

await isReady;

console.log('SnarkyJS loaded');

const useProof = false;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

const salt = Field.random();

// ----------------------------------------------------

// create a destination we will deploy the smart contract to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new BookReview(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

console.log('the message on chain is:', zkAppInstance.message.get().toString());

// ----------------------------------------------------

const txn1 = await Mina.transaction(senderAccount, () => {
  zkAppInstance.updateMessage(
    Field(Encoding.stringToFields('Hello Mina!!')[0])
  );
});
await txn1.prove();
await txn1.sign([senderKey]).send();

const updatedMessage = zkAppInstance.message.get();
console.log('state after txn1:', Encoding.stringFromFields([updatedMessage]));

// ----------------------------------------------------

console.log('Shutting down');

await shutdown();
