// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("DocNFT", "DNFT") {}

    // mint an NFT
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }


   // transferring the Documents to the specific owner
   function transferNFT(
        address from,
        address to,
        uint256 tokenId
    ) public {
        _transfer(from, to, tokenId);
    }


// getting the list of tokens(documents) owned by a user
    function DocumentsOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerDocCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerDocCount);
    for (uint256 i; i < ownerDocCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }


     // check if the documents already exists
  function getDocumentExists(uint256 _tokenId) public view returns(bool) {
    bool tokenExists = _exists(_tokenId);
    return tokenExists;
  }

    // get total number of documents minted so far
  function getNumberOfDocumentsMinted() public view returns(uint256) {
    uint256 totalNumberOfTokensMinted = totalSupply();
    return totalNumberOfTokensMinted;
  }

 

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    //    destroy an NFT
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    //    return IPFS url of NFT metadata
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}