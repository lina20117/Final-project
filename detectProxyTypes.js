// scripts/detectProxyTypes.js
const { ethers } = require("hardhat");
const fs = require('fs');

async function detectTransparentProxy(proxyAddress) {
    const TransparentProxy = await ethers.getContractAt("TransparentProxy", proxyAddress);
    try {
        const implementation = await TransparentProxy.implementation();
        return implementation !== ethers.constants.AddressZero
            ? `Transparent Proxy at ${proxyAddress} is initialized with implementation: ${implementation}`
            : `Transparent Proxy at ${proxyAddress} is uninitialized! Implementation address is not set.`;
    } catch (error) {
        throw new Error("Not a Transparent Proxy");
    }
}

async function detectUUPSProxy(proxyAddress) {
    const UUPSProxy = await ethers.getContractAt("UUPSProxy", proxyAddress);
    try {
        const implementation = await UUPSProxy.implementation();
        return implementation !== ethers.constants.AddressZero
            ? `UUPS Proxy at ${proxyAddress} is initialized with implementation: ${implementation}`
            : `UUPS Proxy at ${proxyAddress} is uninitialized! Implementation address is not set.`;
    } catch (error) {
        throw new Error("Not a UUPS Proxy");
    }
}

async function detectDiamondProxy(proxyAddress) {
    const DiamondProxy = await ethers.getContractAt("DiamondProxy", proxyAddress);
    try {
        const facet = await DiamondProxy.facets("0x01ffc9a7"); // Example function selector
        return facet !== ethers.constants.AddressZero
            ? `Diamond Proxy at ${proxyAddress} has facets configured.`
            : `Diamond Proxy at ${proxyAddress} has no facets configured.`;
    } catch (error) {
        throw new Error("Not a Diamond Proxy");
    }
}

async function detectProxies(proxyAddresses) {
    const results = [];

    for (let address of proxyAddresses) {
        let detected = false;

        try {
            const result = await detectTransparentProxy(address);
            results.push(result);
            console.log(result);
            detected = true;
        } catch (error) {}

        if (!detected) {
            try {
                const result = await detectUUPSProxy(address);
                results.push(result);
                console.log(result);
                detected = true;
            } catch (error) {}
        }

        if (!detected) {
            try {
                const result = await detectDiamondProxy(address);
                results.push(result);
                console.log(result);
            } catch (error) {
                const errorMessage = `Failed to check proxy at ${address}: Unknown type or error occurred.`;
                console.error(errorMessage);
                results.push(errorMessage);
            }
        }
    }

    fs.writeFileSync('proxy_check_results.log', results.join('\n'), 'utf8');
}

async function main() {
    // Read the addresses from the file
    const addresses = JSON.parse(fs.readFileSync('deployed_addresses.json', 'utf8'));

    const proxyAddresses = [
        addresses.transparentProxyAddress,
        addresses.uupsProxyAddress,
        addresses.diamondProxyAddress
    ];

    await detectProxies(proxyAddresses);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in main execution:", error);
        process.exit(1);
    });
