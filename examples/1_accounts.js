require("dotenv").config();
const { ethers } = require("ethers");

// Setup connection
const URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const provider = new ethers.JsonRpcProvider(URL);

const ADDRESS = "0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e";

// Minimal ABI for ERC-20/ERC-721 contract metadata (name and symbol)
const ERC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
];

async function main() {
  try {
    // Get balance
    const balance = await provider.getBalance(ADDRESS);
    console.log(`ETH Balance of ${ADDRESS}: ${ethers.formatUnits(balance, 18)} ETH`);

    // Get transaction count
    const txCount = await provider.getTransactionCount(ADDRESS);
    console.log(`Transaction Count of ${ADDRESS}: ${txCount}`);

    // Check if address is a contract
    const code = await provider.getCode(ADDRESS);
    const isContract = code !== "0x";
    console.log(`Is ${ADDRESS} a contract? ${isContract ? "Yes" : "No"}`);

    // If it's a contract, try to get name and symbol
    if (isContract) {
      const contract = new ethers.Contract(ADDRESS, ERC_ABI, provider);
      try {
        const name = await contract.name();
        console.log(`Contract Name: ${name}`);
      } catch (error) {
        console.log(`Contract Name: Not available or non-standard contract`);
      }
      try {
        const symbol = await contract.symbol();
        console.log(`Contract Symbol: ${symbol}`);
      } catch (error) {
        console.log(`Contract Symbol: Not available or non-standard contract`);
      }
    }

    // Check ENS name
    try {
      const ensName = await provider.lookupAddress(ADDRESS);
      console.log(`ENS Name for ${ADDRESS}: ${ensName || "None"}`);
    } catch (error) {
      console.log(`ENS Name: Not available or provider does not support ENS`);
    }
  } catch (error) {
    console.error(`Error querying address: ${error.message}`);
  }
}

main();