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

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new BookReview(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();
console.log(
  'the commentId on verifiedCId1:',
  zkAppInstance.verifiedCId1.get().toString()
);

// try {
//   const tx1 = await Mina.transaction(senderAccount, () => {
//     zkAppInstance.myinit();
//   });
//   await tx1.prove();
//   await tx1.sign([senderKey]).send();
// } catch (e) {
//   console.log(e);
// }

const secret1 = Encoding.stringToFields('secret')[0];

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.setSecret(
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1)
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
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
  console.log('the commentId on verifiedCId2:', cId4.toString());
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
  console.log('the commentId on verifiedCId2:', cId5.toString());
} catch (e) {
  console.log(e);
}

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.proveReading6(
      Field(6),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1)
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const cId6 = zkAppInstance.verifiedCId6.get();
  console.log('the commentId on verifiedCId2:', cId6.toString());
} catch (e) {
  console.log(e);
}

try {
  const tx1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.proveReading7(
      Field(7),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1),
      Field(secret1)
    );
  });
  await tx1.prove();
  await tx1.sign([senderKey]).send();
  const cId7 = zkAppInstance.verifiedCId7.get();
  console.log('the commentId on verifiedCId2:', cId7.toString());
} catch (e) {
  console.log(e);
}

await shutdown();
