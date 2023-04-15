import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

// const { MNEMONIC, INFURA_KEY } = process.env;
// if (!MNEMONIC) {
//   throw "must specify MNEMONIC and INFURA_KEY as env variable";
// }

// const mnWallet = ethers.Wallet.fromMnemonic(MNEMONIC);


const config: HardhatUserConfig = {
	solidity: '0.8.18',
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {},
		scrollAlpha: {
		  url: 'https://alpha-rpc.scroll.io/12' || '',
		  accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		  chainId: 534353,
		},
		localhost: {
			url: 'http://localhost:8545',
		},
	},
};

export default config;
