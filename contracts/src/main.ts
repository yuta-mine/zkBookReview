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

// If you want to cause error, please use senderKey2 as setSecret() parameter
// const { privateKey: senderKey2, publicKey: senderAccount2 } = Local.testAccounts[2];

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new BookReview(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.setAdminAccount(senderKey);
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const adminAccount = zkAppInstance.adminAccount.get();
  console.log('adminAccount is:', adminAccount.toBase58());
} catch (e) {
  console.log(e);
}

const secret1 = Encoding.stringToFields('secret')[0];

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.setSecret(
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      senderKey // if you want to cause error, please use signerKey2 as setSecret() parameter
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const x = zkAppInstance.x.get();
  console.log('x is:', x.toString());
} catch (e) {
  console.log(e);
}

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.proveReading1(
      Field(1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1)
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const cId1 = zkAppInstance.verifiedCId1.get();
  console.log('the commentId on verifiedCId1:', cId1.toString());
} catch (e) {
  console.log(e);
}

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.proveReading2(
      Field(2),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1)
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const cId2 = zkAppInstance.verifiedCId2.get();
  console.log('the commentId on verifiedCId2:', cId2.toString());
} catch (e) {
  console.log(e);
}

try {
  const cId2 = zkAppInstance.verifiedCId2.get();
  if (cId2.toString() === '0') {
    const tx1 = await Mina.transaction(senderAccount, () => {
      zkAppInstance.proveReading2(
        Field(2),
        Field(secret1),
        Field(secret1),
        Field(secret1),
        Field(secret1),
        Field(secret1)
      );
    });
    await tx1.prove();
    await tx1.sign([senderKey]).send();

    const _cId2 = zkAppInstance.verifiedCId2.get();
    console.log('the commentId on verifiedCId2:', _cId2.toString());
  } else {
    const tx1 = await Mina.transaction(senderAccount, () => {
      zkAppInstance.proveReading3(
        Field(3),
        Field(secret1),
        Field(secret1),
        Field(secret1),
        Field(secret1),
        Field(secret1)
      );
    });
    await tx1.prove();
    await tx1.sign([senderKey]).send();
    const cId3 = zkAppInstance.verifiedCId3.get();
    console.log('the commentId on verifiedCId3:', cId3.toString());
  }
} catch (e) {
  console.log(e);
}

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.proveReading4(
      Field(4),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1)
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const cId4 = zkAppInstance.verifiedCId4.get();
  console.log('the commentId on verifiedCId4:', cId4.toString());
} catch (e) {
  console.log(e);
}

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.proveReading5(
      Field(5),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1)
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const cId5 = zkAppInstance.verifiedCId5.get();
  console.log('the commentId on verifiedCId5:', cId5.toString());
} catch (e) {
  console.log(e);
}

await shutdown();
