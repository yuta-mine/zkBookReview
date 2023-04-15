import { FC, useEffect, useState } from 'react';
import {ethers} from "ethers";
import MintNFT from "../../abi/MintNFT.json";

export const AddBook: FC = () => {
  const contractAddress = "0x1dbb068EF9c4C73F086DBec28aAa6F79CCb5F499";

  // -----------------------------------
  const [userAddress, setUserAddress] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageTitle, setImageTitle] = useState<string | null>(null);
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
  }, [userAddress])


  // add -----------------------------------
  const addBook = async (title: string, description: string, imageId: string) : Promise<void> => {
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
      const res = await contract.addBook(title, description, imageId);
      console.log("res: ", res)
    } catch (e) {
      console.log('エラー', e)
    }
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setImageTitle(file?.name || '')
  };
  // -----------------------------------

  return <div>
    <h1>Add NFTs</h1>
    <input type="text" value={title} onChange={handleTitleChange} />
    <input type="text" value={description} onChange={handleDescriptionChange} />
    <input type="file"  onChange={handleImageChange}/>
    <button onClick={() => addBook(title, description, imageTitle ?? '')}>add</button>
  </div>
}
