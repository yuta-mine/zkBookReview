import { ethers } from 'ethers';

type ConnectWalletResponse = {
	provider: ethers.providers.Web3Provider | undefined;
	currentAccount: string | undefined;
};

export const connectWallet = async (): Promise<ConnectWalletResponse> => {
	try {
		const { ethereum } = window as any;
		if (!ethereum) {
			throw new Error('Please install MetaMask!');
		} else {
			console.log('MetaMask is installed!', ethereum);
		}

		const provider = new ethers.providers.Web3Provider(ethereum);
    console.log('provider', provider);
    const accounts = await provider.listAccounts();
    console.log('accounts', accounts);
		const currentAccount = accounts[0];

		const connectedChainId = await provider
			.getNetwork()
      .then((network) => network.chainId);
    console.log('connectedChainId', connectedChainId);
		await ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: ethers.utils.hexValue(connectedChainId) }],
    });

		return {
			provider: provider,
			currentAccount: currentAccount,
		};
	} catch (e) {
		console.log(e);
		return {
			provider: undefined,
			currentAccount: undefined,
		};
	}
};
