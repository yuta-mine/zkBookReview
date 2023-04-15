import { FC, useEffect, useState } from 'react';
import {ethers} from "ethers";
import MintNFT from "../../abi/MintNFT.json";

export const NFTList: FC = () => {
  const contractAddress = "0x4fc13E05998A33dFC9067E2A201aCd9C8CaA2405";

  // -----------------------------------
  const [userAddress, setUserAddress] = useState('');
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window as any;
        if (!ethereum) {
          throw new Error('Please install MetaMask!');
        } else {
          console.log('MetaMask is installed!', ethereum);
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        setProvider(provider);

        const accounts = await provider.listAccounts();
        const currentAccount = accounts[0];
        setUserAddress(currentAccount);

        const connectedChainId = await provider.getNetwork().then((network) => network.chainId);
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(connectedChainId) }],
        });
      } catch (e) {
        console.log(e)
      }
    }
    connectWallet()
    console.log(userAddress)
  }, [userAddress])


  // add -----------------------------------
  const addBook = async (title: string) : Promise<void> => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('Please install MetaMask!');
      } else {
        console.log('MetaMask is installed!', ethereum);
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MintNFT.abi, signer);
      const res = await contract.addBook(title);
      console.log("res: ", res)
    } catch (e) {
      console.log('エラー', e)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  // -----------------------------------
  return <div>
    <h1>add NFTs</h1>
    <input type="text" value={title} onChange={handleChange}/>
      <button onClick={() => addBook(title)}>add</button>
  </div>
}
