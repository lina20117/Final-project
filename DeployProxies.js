// scripts/deployProxies.js
const { ethers } = require("hardhat");
const fs = require('fs');

async function deployImplementationContract() {
    const ImplementationContract = await ethers.getContractFactory("ImplementationContract");
    const implementationContract = await ImplementationContract.deploy();
    await implementationContract.deployed();
    return implementationContract.address;
}

async function deployTransparentProxy(implementationAddress) {
    const TransparentProxy = await ethers.getContractFactory("TransparentProxy");
    const admin = (await ethers.getSigners())[0].address;
    const transparentProxy = await TransparentProxy.deploy(implementationAddress, admin);
    await transparentProxy.deployed();
    return transparentProxy.address;
}

async function deployUUPSProxy(implementationAddress) {
    const UUPSProxy = await ethers.getContractFactory("UUPSProxy");
    const uupsProxy = await UUPSProxy.deploy();
    await uupsProxy.deployed();
    await uupsProxy.upgradeTo(implementationAddress);
    return uupsProxy.address;
}

async function deployDiamondProxy() {
    const DiamondProxy = await ethers.getContractFactory("DiamondProxy");
    const diamondProxy = await DiamondProxy.deploy();
    await diamondProxy.deployed();
    return diamondProxy.address;
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const implementationAddress = await deployImplementationContract();
    console.log("ImplementationContract deployed to:", implementationAddress);

    const transparentProxyAddress = await deployTransparentProxy(implementationAddress);
    console.log("Transparent Proxy deployed to:", transparentProxyAddress);

    const uupsProxyAddress = await deployUUPSProxy(implementationAddress);
    console.log("UUPS Proxy deployed to:", uupsProxyAddress);

    const diamondProxyAddress = await deployDiamondProxy();
    console.log("Diamond Proxy deployed to:", diamondProxyAddress);

    // Log addresses to a file
    const addresses = {
        implementationAddress,
        transparentProxyAddress,
        uupsProxyAddress,
        diamondProxyAddress
    };
    fs.writeFileSync('deployed_addresses.json', JSON.stringify(addresses, null, 2), 'utf8');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main execution:", error);
        process.exit(1);
    });
