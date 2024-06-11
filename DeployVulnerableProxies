const { ethers } = require("hardhat");
const fs = require("fs");

async function deployVulnerableContract() {
    const VulnerableContract = await ethers.getContractFactory("VulnerableContract");
    const vulnerableContract = await VulnerableContract.deploy();
    await vulnerableContract.deployed();
    return vulnerableContract.address;
}

async function deployUninitializedProxy() {
    const UninitializedProxy = await ethers.getContractFactory("UninitializedProxy");
    const uninitializedProxy = await UninitializedProxy.deploy();
    await uninitializedProxy.deployed();
    return uninitializedProxy.address;
}

async function detectUninitializedProxies(proxyAddresses) {
    const Proxy = await ethers.getContractFactory("Proxy");
    const results = [];

    for (let address of proxyAddresses) {
        try {
            const proxy = Proxy.attach(address);
            const implementation = await proxy.implementation();

            if (implementation === ethers.constants.AddressZero) {
                const message = `Proxy at ${address} is uninitialized: Implementation address is not set.`;
                console.log(message);
                results.push(message);
            } else {
                const message = `Proxy at ${address} is initialized: Implementation address is ${implementation}.`;
                console.log(message);
                results.push(message);
            }
        } catch (error) {
            const errorMessage = `Failed to check proxy at ${address}: ${error.message}`;
            console.error(errorMessage);
            results.push(errorMessage);
        }
    }

    fs.writeFileSync("proxy_check_results.log", results.join("\n"), "utf8");
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy VulnerableContract
    const vulnerableContractAddress = await deployVulnerableContract();
    console.log("VulnerableContract deployed to:", vulnerableContractAddress);

    // Deploy Uninitialized Proxies
    const uninitializedProxyAddress1 = await deployUninitializedProxy();
    console.log("Uninitialized Proxy 1 deployed to:", uninitializedProxyAddress1);

    const uninitializedProxyAddress2 = await deployUninitializedProxy();
    console.log("Uninitialized Proxy 2 deployed to:", uninitializedProxyAddress2);

    // Log addresses to a file
    const addresses = {
        vulnerableContractAddress,
        uninitializedProxyAddress1,
        uninitializedProxyAddress2
    };

    fs.writeFileSync("deployed_addresses.json", JSON.stringify(addresses, null, 2), "utf8");

    // Detect uninitialized proxies
    await detectUninitializedProxies([
        uninitializedProxyAddress1,
        uninitializedProxyAddress2
    ]);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Error in main execution:", error);
        process.exit(1);
    });
