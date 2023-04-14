pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MintNFT is ERC721 {
    constructor() ERC721("MintNFT", "MintNFT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

// NFT address is 0x9E4E8b56466B77EBaBA538eeFb3f90b52179CEef
