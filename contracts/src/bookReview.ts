import { Field, SmartContract, state, State, method } from 'snarkyjs';

export class BookReview extends SmartContract {
  // On-chain state definitions
  @state(Field) message = State<Field>();

  init() {
    super.init();
    this.message.set(Field(0));
  }

  @method updateMessage(_message: Field) {
    const currentMessage = this.message.get();
    this.message.assertEquals(currentMessage); // precondition that links this.num.get() to the actual on-chain state
    this.message.set(_message);
  }
}
