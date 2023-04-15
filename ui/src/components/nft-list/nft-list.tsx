import { FC, useEffect, useState } from 'react';
import {ethers} from "ethers";
import MintNFT from "../../abi/MintNFT.json";

export const NFTList: FC = () => {
  const contractAddress = "0x4fc13E05998A33dFC9067E2A201aCd9C8CaA2405";

  interface NFT  {
    tokenId: string;
    title: string;
    description: string;
    review: string;
    image: any
  }
  const [nfts, setNFTs] = useState<NFT[]>([])

  // -----------------------------------
  const [userAddress, setUserAddress] = useState('');
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

  // load -----------------------------------
    const loadNfts = async () => {
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

        const tokenIds = await contract.totalSupply();
        const nftList = await Promise.all(
          tokenIds.map(async (tokenId: number) => {
            const tokenURI = await contract.methods.tokenURI(tokenId - 1);
            const res = await fetch(tokenURI);
            const data = await res.json();
            return {
              tokenId,
              title: data.name,
              description: data.description,
              review: data.review,
              image: data.image,
            };
          })
        );
        setNFTs(nftList);
      } catch (e) {
        console.log('エラー', e)
      }
    }
    useEffect(() => {
      loadNfts()
    },[])
  // -----------------------------------

  // buy -----------------------------------
  // const buyNFT = async (tokenId: string) : Promise<void> => {
  //   try {
  //     const { ethereum } = window as any;
  //     if (!ethereum) {
  //       throw new Error('Please install MetaMask!');
  //     } else {
  //       console.log('MetaMask is installed!', ethereum);
  //     }

  //     const provider = new ethers.providers.Web3Provider(ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(contractAddress, MintNFT.abi, signer);
  //     const res = await contract.purchase(tokenId);
  //     await loadNfts();
  //     console.log(nfts)
  //     console.log("res: ", res)
  //   } catch (e) {
  //     console.log('エラー', e)
  //   }
  // }
  // -----------------------------------
  return <div>
      <h1>All NFTs</h1>
      {nfts?.map((nft) => (
        <div key={nft.tokenId}>
          <div>Token ID: {nft.tokenId}</div>
          {/* <button onClick={() => buyNFT(nft.tokenId)}>add</button> */}
        </div>
      ))}
  </div>
}
