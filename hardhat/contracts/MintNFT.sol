pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MintNFT is ERC721 {
    constructor() ERC721("MintNFT", "MintNFT") {
         owner = msg.sender;
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
     struct Book {
         uint256 id;
         string title;
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

     address public owner;
     uint256 private nextBookId = 1;
     uint256 private nextCommentId = 1;

     modifier onlyOwner() {
         require(msg.sender == owner, "Caller is not the owner.");
         _;
     }

     function addBook(string memory _title) public onlyOwner {
         uint256 bookId = nextBookId++;
         books[bookId] = Book(bookId, _title);
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
 }
