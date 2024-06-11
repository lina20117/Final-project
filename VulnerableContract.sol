// contracts/VulnerableContract.sol
pragma solidity ^0.8.0;

contract VulnerableContract {
    address public console;
    address public rng;
    address public vault;
    address public gameProvider;
    uint16 public minPos;
    uint16 public maxPos;
    bool public initialized;

    function initialize(
        address _console,
        address _rng,
        address _vault,
        address _gameProvider,
        uint16 _minPos,
        uint16 _maxPos
    ) public {
        require(!initialized, "Initializable: contract is already initialized");

        console = _console;
        rng = _rng;
        vault = _vault;
        gameProvider = _gameProvider;
        minPos = _minPos;
        maxPos = _maxPos;
        initialized = true;
    }
}
