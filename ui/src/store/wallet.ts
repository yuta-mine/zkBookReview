import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type WalletState = {
  address: string
}

const initialState: WalletState = {
  address: '',
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<string>) {
      state.address = action.payload
    }
  }
})

export const { setAddress } = walletSlice.actions
export default walletSlice.reducer;
