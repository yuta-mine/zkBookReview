import { combineReducers,  configureStore } from '@reduxjs/toolkit'
import walletReducer from './reducers/wallet';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

const store = configureStore({
	reducer: rootReducer,
});


export type RootState = ReturnType<typeof rootReducer>;
export default store;
