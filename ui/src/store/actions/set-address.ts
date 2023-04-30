import { createAction } from '@reduxjs/toolkit'

export const setAddress = createAction<string>('wallet/setAddress')
