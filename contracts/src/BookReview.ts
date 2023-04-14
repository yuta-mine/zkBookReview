import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PrivateKey,
  PublicKey,
  Poseidon,
  Circuit,
} from 'snarkyjs';

export class BookReview extends SmartContract {
  // On-chain state definitions
  @state(Field) x = State<Field>();
  @state(Field) verifiedCId1 = State<Field>();
  @state(Field) verifiedCId2 = State<Field>();
  @state(Field) verifiedCId3 = State<Field>();
  @state(Field) verifiedCId4 = State<Field>();
  @state(Field) verifiedCId5 = State<Field>();
  @state(Field) verifiedCId6 = State<Field>();
  @state(Field) verifiedCId7 = State<Field>();

  @method setSecret(
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    this.x.set(Poseidon.hash([secret1, secret2, secret3, secret4, secret5]));
  }

  @method proveReading1(
    cId: Field,
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret1, secret2, secret3, secret4, secret5]).assertEquals(
      x
    );

    const verifiedCId1 = this.verifiedCId1.get();
    this.verifiedCId1.assertEquals(verifiedCId1);
    this.verifiedCId1.assertEquals(Field(0));

    this.verifiedCId1.set(cId);
  }

  @method proveReading2(
    cId: Field,
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret1, secret2, secret3, secret4, secret5]).assertEquals(
      x
    );

    const verifiedCId2 = this.verifiedCId2.get();
    this.verifiedCId2.assertEquals(verifiedCId2);
    this.verifiedCId2.assertEquals(Field(0));

    this.verifiedCId2.set(cId);
  }

  @method proveReading3(
    cId: Field,
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret1, secret2, secret3, secret4, secret5]).assertEquals(
      x
    );

    const verifiedCId3 = this.verifiedCId3.get();
    this.verifiedCId3.assertEquals(verifiedCId3);
    this.verifiedCId3.assertEquals(Field(0));

    this.verifiedCId3.set(cId);
  }

  @method proveReading4(
    cId: Field,
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret1, secret2, secret3, secret4, secret5]).assertEquals(
      x
    );

    const verifiedCId4 = this.verifiedCId4.get();
    this.verifiedCId4.assertEquals(verifiedCId4);
    this.verifiedCId4.assertEquals(Field(0));

    this.verifiedCId4.set(cId);
  }

  @method proveReading5(
    cId: Field,
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret1, secret2, secret3, secret4, secret5]).assertEquals(
      x
    );

    const verifiedCId5 = this.verifiedCId5.get();
    this.verifiedCId5.assertEquals(verifiedCId5);
    this.verifiedCId5.assertEquals(Field(0));

    this.verifiedCId5.set(cId);
  }

  @method proveReading6(
    cId: Field,
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret1, secret2, secret3, secret4, secret5]).assertEquals(
      x
    );

    const verifiedCId6 = this.verifiedCId6.get();
    this.verifiedCId6.assertEquals(verifiedCId6);
    this.verifiedCId6.assertEquals(Field(0));

    this.verifiedCId6.set(cId);
  }

  @method proveReading7(
    cId: Field,
    secret1: Field,
    secret2: Field,
    secret3: Field,
    secret4: Field,
    secret5: Field
  ) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret1, secret2, secret3, secret4, secret5]).assertEquals(
      x
    );

    const verifiedCId7 = this.verifiedCId7.get();
    this.verifiedCId7.assertEquals(verifiedCId7);
    this.verifiedCId7.assertEquals(Field(0));

    this.verifiedCId7.set(cId);
  }
}
