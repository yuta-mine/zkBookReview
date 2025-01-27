import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import { ChakraProvider } from '@chakra-ui/react'
import { Header } from '../components/header'
import './reactCOIServiceWorker';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Header/>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}
