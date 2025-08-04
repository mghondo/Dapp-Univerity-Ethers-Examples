require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const { ethers } = require("ethers");

// Import private key helper
const { promptForKey } = require("../helpers/prompt.js");

// Debug: Log environment variables
console.log("Resolved .env path:", require("path").resolve(__dirname, ".env"));
console.log("TENDERLY_RPC_URL:", process.env.TENDERLY_RPC_URL || "undefined");

// Setup connection
const URL = process.env.TENDERLY_RPC_URL;
if (!URL) {
  throw new Error("TENDERLY_RPC_URL is not set in .env file");
}
const provider = new ethers.JsonRpcProvider(URL);

const RECIEVER = "0xA4855Ad823735ae64bA1bF4278C694479aBFD36f"; // Replace with a valid test address

async function main() {
  try {
    // Prompt for private key
    const privateKey = await promptForKey();
    if (!privateKey || !privateKey.startsWith("0x") || privateKey.length !== 66) {
      throw new Error("Invalid private key format");
    }

    // Setup wallet
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Sender Address:", wallet.address);

    // Get network info
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name, network.chainId);

    // Validate receiver address
    if (!ethers.isAddress(RECIEVER)) {
      throw new Error("Invalid RECIEVER address");
    }

    // Get balances
    const senderBalanceBefore = await provider.getBalance(wallet.address);
    const recieverBalanceBefore = await provider.getBalance(RECIEVER);

    // Log balances
    console.log(`\nSender balance before: ${ethers.formatUnits(senderBalanceBefore, 18)} ETH`);
    console.log(`Reciever balance before: ${ethers.formatUnits(recieverBalanceBefore, 18)} ETH\n`);

    // Create transaction (small amount for testing)
    const transaction = await wallet.sendTransaction({
      
      to: RECIEVER,
      value: ethers.parseUnits("0.001", 18), // 0.001 ETH for testing
    });

    // Wait for transaction
    const receipt = await transaction.wait();
    console.log("Transaction:", transaction);
    console.log("Receipt:", receipt);

    // Get balances after
    const senderBalanceAfter = await provider.getBalance(wallet.address);
    const recieverBalanceAfter = await provider.getBalance(RECIEVER);

    // Log balances
    console.log(`\nSender balance after: ${ethers.formatUnits(senderBalanceAfter, 18)} ETH`);
    console.log(`Reciever balance after: ${ethers.formatUnits(recieverBalanceAfter, 18)} ETH\n`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();