// contracts/TransparentProxy.sol
pragma solidity ^0.8.0;

contract TransparentProxy {
    address public implementation;
    address public admin;

    constructor(address _implementation, address _admin) {
        implementation = _implementation;
        admin = _admin;
    }

    fallback() external payable {
        if (msg.sender == admin) {
            // Admin-specific logic
        } else {
            address impl = implementation;
            require(impl != address(0), "Implementation not set");

            assembly {
                let ptr := mload(0x40)
                calldatacopy(ptr, 0, calldatasize())
                let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
                let size := returndatasize()
                returndatacopy(ptr, 0, size)

                switch result
                case 0 { revert(ptr, size) }
                default { return(ptr, size) }
            }
        }
    }

    function setImplementation(address _implementation) public {
        require(msg.sender == admin, "Only admin can set implementation");
        implementation = _implementation;
    }
}
