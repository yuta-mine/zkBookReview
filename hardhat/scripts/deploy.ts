import { ethers } from "hardhat";

async function main() {
  const MintNFT = await ethers.getContractFactory('MintNFT');
  const mintNFT = await MintNFT.deploy();
  console.log('MyNFT deployed to:', mintNFT.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
