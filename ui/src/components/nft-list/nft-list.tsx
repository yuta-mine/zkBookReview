import Link from 'next/link';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import {ethers} from "ethers";
import { Button } from "@chakra-ui/react"

import styles  from './styles/style.module.css';
import MintNFT from "../../abi/MintNFT.json";

export const NFTList: FC = () => {
  const contractAddress = "0x1dbb068EF9c4C73F086DBec28aAa6F79CCb5F499";

  interface NFT  {
    id: string;
    title: string;
    description: string;
    imageId: string;
  }
    interface Comment {
      id: string;
      bookId: string;
      content: string;
    }

  const [nfts, setNFTs] = useState<NFT[]>([])
  const [comments, setComments] = useState<string[]>([]);

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

        const books = await contract.getAllBooks();
        setNFTs(books);
        books.map((book: NFT) => {
          getComments(book.id)
        })
        ()
      } catch (e) {
        console.log('エラー', e)
      }
    }
    useEffect(() => {
      loadNfts()
    },[])
  // -----------------------------------

  // buy -----------------------------------
  const buyNFT = async (tokenId: string) : Promise<void> => {
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
      const res = await contract.purchase(tokenId);
      await loadNfts();
      console.log(nfts)
      console.log("res: ", res)
    } catch (e) {
      console.log('エラー', e)
    }
  }
  // -----------------------------------

  // comment -----------------------------------
  const getComments = async (tokenId: string) : Promise<void> => {
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
      const commentsByBook = await contract.getCommentsByBook(tokenId);
      const comments: Comment[] =  await contract.getCommentsByIds(commentsByBook);
      setComments([...comments.map((comment) => { return comment.content })])
    } catch (e) {
      console.log('エラー', e)
    }
  }

  return <div className={styles.list}>
      {nfts?.map((nft, i) => (
        <div key={i} className={styles.element}>
          <Image src={`${nft.id}.png`} width={200} height={200} alt="logo" className={styles.img}/>
          <p className={styles.text}>title: {nft.title}</p>
          <p className={styles.text}>description: {nft.description}</p>
          <p className={styles.text}>image: {nft.imageId}</p>
          {/* TODO チェックマーク */}
          <p className={styles.text}>comment: {[...comments]}</p>
          <Button onClick={() => buyNFT(nft.id)}>buy</Button>
          <Link href={`/post-review/${nft.id}`}>
            <Button>post review</Button> 
          </Link>
        </div>
      ))}
  </div>
}
