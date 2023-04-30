import { useState, useCallback} from "react";
import { ethers } from "ethers";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { NFTList } from '../components/nft-list'
import { connectWallet as connectWalletFunc } from '../hooks/connect-wallet'

export default function NftList() {
  const address = useSelector((state: RootState) => state.wallet.address)
  const [userAddress, setUserAddress] = useState(address);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();

  const connectWallet = useCallback(async () => {
    const { provider, currentAccount } = await connectWalletFunc();
    currentAccount && setUserAddress(currentAccount);
    provider && setProvider(provider);
  }, [provider, userAddress]);

  return (
    <div>
      <NFTList
        provider={provider}
        connectWallet={connectWallet}
        currentAccount={userAddress}
      />
    </div>
  );
}
