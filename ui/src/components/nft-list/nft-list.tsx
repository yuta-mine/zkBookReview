import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Image,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

import styles from "./styles/style.module.css";
import MintNFT from "../../abi/MintNFT.json";
import { mintContractAddress } from '../../utils/address'

interface NFT {
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

type Props = {
  provider: ethers.providers.Web3Provider | undefined;
  connectWallet: () => Promise<void>
  currentAccount: string;
};

export const NFTList: FC<Props> = (props) => {
  const { provider, connectWallet, currentAccount } = props;
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [comments, setComments] = useState<string[][]>([]);

  // load -----------------------------------
  const loadNfts = async (provider: ethers.providers.Web3Provider | undefined) => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error("Please install MetaMask!");
      } else {
        console.log("MetaMask is installed!", ethereum);
      }
      if (!provider) {
        return
      }
      // const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        mintContractAddress,
        MintNFT.abi,
        signer
      );

      const books: NFT[] = await contract.getAllBooks();
      setNFTs(books);
      await getComments();
    } catch (e) {
      console.log("エラー", e);
    }
  };
  useEffect(() => {
    loadNfts(provider);
  }, [provider]);
  // -----------------------------------

  // buy -----------------------------------
  const buyNFT = async (tokenId: string): Promise<void> => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error("Please install MetaMask!");
      } else {
        console.log("MetaMask is installed!", ethereum);
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        mintContractAddress,
        MintNFT.abi,
        signer
      );
      const res = await contract.purchase(ethers.BigNumber.from(tokenId));
      await loadNfts(provider);
      console.log("res: ", res);
    } catch (e) {
      console.log("エラー", e);
    }
  };
  // -----------------------------------

  // comment -----------------------------------
  const getComments = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error("Please install MetaMask!");
      } else {
        console.log("MetaMask is installed!", ethereum);
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        mintContractAddress,
        MintNFT.abi,
        signer
      );
      const commentArray = await Promise.all(
        nfts?.map(async (nft) => {
          const commentIds: number[] = await contract.getCommentsByBook(nft.id);
          const comments: Comment[] = await contract.getCommentsByIds(
            commentIds
          );
          return comments.map((comment) => {
            return comment.content;
          });
        })
      );
      setComments(commentArray);
    } catch (e) {
      console.log("エラー", e);
    }
  };

  return (
    <div className={styles.list}>
      {currentAccount ? currentAccount : <Button onClick={connectWallet}>Connect</Button>}
      {nfts?.map((nft, i) => {
        const id = nft.id.toString();
        return <MyCards nft={nft} key={i} buy={() => buyNFT(id)} />;
      })}
    </div>
  );
};

// buyNFT.bind(nft.id)
interface CardProps {
  nft: NFT;
  buy: () => {};
}
function MyCards({ nft, buy }: CardProps) {
  return (
    <Card maxW="sm">
      <CardBody>
        <Image src={`${nft.id}.png`} />
        <Stack mt="6" spacing="3">
          <Heading size="md">{nft.title}</Heading>
          <Text>{nft.description}</Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="green" onClick={buy}>
            Buy now
          </Button>
          <Link href={`/post-review/${nft.id}`}>
            <Button>post review</Button>
          </Link>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
