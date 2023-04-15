// "SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintNFT is ERC721Enumerable {
    uint256 public tokenId;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MintNFT", "MintNFT") {
         owner = msg.sender;
    }

     struct Book {
         uint256 id;
         string title;
         string description;
         string imageId;
     }

     struct Comment {
         uint256 id;
         uint256 bookId;
         string content;
         address reviewer;
     }

     mapping(uint256 => string[]) private _verifiedBlockAddressList; // bookid =>
     mapping(uint256 => Book) public books;
     mapping(uint256 => Comment) public comments;
     Book[] public allBooks;

     address public owner;
     uint256 private nextBookId = 1;
     uint256 private nextCommentId = 1;

     modifier onlyOwner() {
         require(msg.sender == owner, "Caller is not the owner.");
         _;
     }

     function addBook(string memory _title, string memory _description, string memory _imageId) public onlyOwner returns (uint256){
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);
        Book memory book = Book(newTokenId, _title, _description, _imageId);
        books[newTokenId] = book;
        allBooks.push(book);
        return newTokenId;
     }

    function purchase(uint256 _tokenId) public {
        require(owner != address(0), "NFT is not minted yet");
        require(msg.sender != owner, "You can't purchase your own NFT");
        transferFrom(owner, msg.sender, tokenId);
        owner = msg.sender;
    }


    function tokensOfOwner() external view returns (uint[] memory) {
        uint tokenCount = balanceOf(owner);
        uint[] memory tokensId = new uint256[](tokenCount);
        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokensId;
    }

    function addVerifiedBlockAddress(uint256 _bookId, string memory _blockAddress) public onlyOwner {
         _verifiedBlockAddressList[_bookId].push(_blockAddress);
    }

     function addComment(uint256 _bookId, string memory _content, address _reviewer) public {
         require(_bookId > 0 && _bookId < nextBookId, "Invalid Book ID.");

         uint256 commentId = nextCommentId++;
         comments[commentId] = Comment(commentId, _bookId, _content, _reviewer);
     }

     function isMintNFTed(uint256 _bookId) public view returns (bool) {
         for (uint256 i = 1; i < nextCommentId; i++) {
             if (comments[i].bookId == _bookId) {
                 return true;
             }
         }
         return false;
     }

     function getCommentsByBook(uint256 _bookId) public view returns (uint256[] memory) {
         uint256[] memory commentIds = new uint256[](nextCommentId);
         uint256 counter = 0;

         for (uint256 i = 1; i < nextCommentId; i++) {
             if (comments[i].bookId == _bookId) {
                 commentIds[counter] = i;
                 counter++;
             }
         }

         uint256[] memory result = new uint256[](counter);
         for (uint256 i = 0; i < counter; i++) {
             result[i] = commentIds[i];
         }
         return result;
     }

    function getCommentsByIds(uint256[] memory ids) public view returns (Comment[] memory) {
        uint256 validCommentsCount = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] > 0 && ids[i] < nextCommentId) {
                validCommentsCount++;
            }
        }

        Comment[] memory result = new Comment[](validCommentsCount);
        uint256 counter = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] > 0 && ids[i] < nextCommentId) {
                result[counter] = comments[ids[i]];
                counter++;
            }
        }
        return result;
    }

    function getAllBooks() public view returns (Book[] memory) {
        return allBooks;
    }
 }
