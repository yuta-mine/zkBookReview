import { createReducer } from '@reduxjs/toolkit';
import { setAddress } from '../actions/set-address';

type WalletState = {
	address: string;
};

const initialState: WalletState = {
	address: '',
};

const walletReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAddress, (state, action) => {
    state.address = action.payload;
  });
});

export default walletReducer;
