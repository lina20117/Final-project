// contracts/DiamondProxy.sol
pragma solidity ^0.8.0;

contract DiamondProxy {
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    mapping(bytes4 => address) public facets;

    fallback() external payable {
        address facet = facets[msg.sig];
        require(facet != address(0), "Function does not exist");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), facet, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    function addFacet(address _facetAddress, bytes4[] memory _functionSelectors) external {
        for (uint256 i = 0; i < _functionSelectors.length; i++) {
            facets[_functionSelectors[i]] = _facetAddress;
        }
    }
}
