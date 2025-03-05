// scripts/whale-listener.ts

import { ethers } from "ethers";
import { addTransaction } from "../lib/whaleTransactions";

// Use your provided Base RPC URL
const BASE_RPC_URL = "https://base-mainnet.g.alchemy.com/v2/8KR6qwxbLlIISgrMCZfsrYeMmn6-S-bN";
const provider = new ethers.providers.JsonRpcProvider(BASE_RPC_URL);

// Get CoinGecko API URL from environment or use default
const COINGECKO_API_URL = process.env.NEXT_PUBLIC_COINGECKO_API_URL || "https://api.coingecko.com/api/v3";

// List of token addresses from your screener
const tokenAddresses = [
  "0x3c8cd0db9a01efa063a7760267b822a129bc7dca",
  "0x1bc0c42215582d5a085795f4badbac3ff36d1bcb",
  "0x9704d2adbc02c085ff526a37ac64872027ac8a50",
  "0xbc45647ea894030a4e9801ec03479739fa2485f0",
  "0x1185cb5122edad199bdbc0cbd7a0457e448f23c7",
  "0xb33ff54b9f7242ef1593d2c9bcd8f9df46c77935",
  "0x20dd04c17afd5c9a8b3f2cdacaa8ee7907385bef",
  "0x2676e4e0e2eb58d9bdb5078358ff8a3a964cedf5",
  "0x6921B130D297cc43754afba22e5EAc0FBf8Db75b",
  "0x79dacb99A8698052a9898E81Fdf883c29efb93cb",
  "0xA6f774051dFb6b54869227fDA2DF9cb46f296c09",
  "0xBA5E66FB16944Da22A62Ea4FD70ad02008744460",
  "0xC438B0c0E80A8Fa1B36898d1b36A3fc2eC371C54",
  "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  "0xB1a03EdA10342529bBF8EB700a06C60441fEf25d",
  "0xD461A534AF11EF58E9F9add73129a1f45485A8dc",
  "0xB3B32F9f8827D4634fE7d973Fa1034Ec9fdDB3B3",
  "0x4F9Fd6Be4a90f2620860d680c0d4d5Fb53d1A825",
  "0x4B6104755AfB5Da4581B81C552DA3A25608c73B8",
  "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
  "0x9a26F5433671751C3276a065f57e5a02D2817973",
  "0x768BE13e1680b5ebE0024C42c896E3dB59ec0149",
  "0x6797B6244fA75F2e78cDFfC3a4eb169332b730cc",
  "0x1f1c695f6b4a3f8b05f2492cef9474afb6d6ad69",
  "0xeb476e9ab6b1655860b3f40100678d0c1cedb321",
  "0xf878e27afb649744eec3c5c0d03bc9335703cfe3",
  "0x57edc3f1fd42c0d48230e964b1c5184b9c89b2ed",
  "0x52b492a33e447cdb854c7fc19f1e57e8bfa1777d",
  "0x5b5dee44552546ecea05edea01dcd7be7aa6144a",
  "0x20d704099b62ada091028bcfc44445041ed16f09",
  "0x55cd6469f597452b5a7536e2cd98fde4c1247ee4",
  "0x0d97f261b1e88845184f678e2d1e7a98d9fd38de",
  "0xba0dda8762c24da9487f5fa026a9b64b695a07ea",
  "0x2f6c17fa9f9bc3600346ab4e48c0701e1d5962ae",
  "0x62d0b7ea8aa059f0154692435050cecedf8d3e99",
  "0x0578d8a44db98b23bf096a382e016e29a5ce0ffe",
  "0xf5bc3439f53a45607ccad667abc7daf5a583633f",
  "0xb8d98a102b0079b69ffbc760c8d857a31653e56e",
  "0x18b6f6049A0af4Ed2BBe0090319174EeeF89f53a",
  "0x6dba065721435cfCa05CAa508f3316B637861373",
  "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b",
  "0x1B23819885FcE964A8B39D364b7462D6E597ae8e",
  "0xc655C331d1Aa7f96c252F1f40CE13D80eAc53504",
  "0x10f434B3d1cC13A4A79B062Dcc25706f64D10D47",
  "0xa1832f7F4e534aE557f9B5AB76dE54B1873e498B",
  "0x02D4f76656C2B4f58430e91f8ac74896c9281Cb9",
  "0x2D57C47BC5D2432FEEEdf2c9150162A9862D3cCf",
  "0x3054E8F8fBA3055a42e5F5228A2A4e2AB1326933",
  "0x62Ff28a01AbD2484aDb18C61f78f30Fb2E4A6fDb",
  "0xFbB75A59193A3525a8825BeBe7D4b56899E2f7e1",
  "0xbDF317F9C153246C429F23f4093087164B145390",
  "0x6d3B8C76c5396642960243Febf736C6BE8b60562",
  "0x1b6A569DD61EdCe3C383f6D565e2f79Ec3a12980",
  "0xd07379a755A8f11B57610154861D694b2A0f615a",
  "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9",
  "0x3849cC93e7B71b37885237cd91a215974135cD8D",
  "0x08c81699F9a357a9F0d04A09b353576ca328d60D",
  "0xebfF2db643Cf955247339c8c6bCD8406308ca437",
  "0xFad8CB754230dbFd249Db0E8ECCb5142DD675a0d",
  "0x6e2c81b6c2C0e02360F00a0dA694e489acB0b05e",
  "0x18A8BD1fe17A1BB9FFB39eCD83E9489cfD17a022",
  "0xcDE90558fc317C69580DeeAF3eFC509428Df9080",
  "0x15aC90165f8B45A80534228BdCB124A011F62Fee",
  "0x749e5334752466CdA899B302ed4176B8573dC877"
];

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

/**
 * Look up the USD price of a token using CoinGecko API.
 * The API is queried by contract address.
 */
async function getTokenUSDPrice(tokenAddress: string): Promise<number> {
  try {
    const url = `${COINGECKO_API_URL}/simple/token_price/base?contract_addresses=${tokenAddress}&vs_currencies=usd`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error fetching price for ${tokenAddress}: ${res.status}`);
      return 0;
    }
    const data = await res.json();
    // CoinGecko returns an object with the contract address in lowercase as the key.
    const priceObj = data[tokenAddress.toLowerCase()];
    if (priceObj && priceObj.usd) {
      return priceObj.usd;
    }
    return 0;
  } catch (error) {
    console.error(`Error in getTokenUSDPrice for ${tokenAddress}:`, error);
    return 0;
  }
}

/**
 * Set up a listener for Transfer events for a specific token.
 */
async function setupTokenListener(tokenAddress: string) {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  
  // Retrieve token details (decimals, symbol, totalSupply)
  const [decimals, symbol, totalSupply] = await Promise.all([
    contract.decimals(),
    contract.symbol(),
    contract.totalSupply()
  ]);
  
  console.log(`Listening for ${symbol} (${tokenAddress}) transfers...`);
  
  contract.on("Transfer", async (from: string, to: string, value: any, event: any) => {
    try {
      // Convert the raw transfer value using token decimals.
      const amount = parseFloat(ethers.utils.formatUnits(value, decimals));
      const totalSupplyNum = parseFloat(ethers.utils.formatUnits(totalSupply, decimals));
      const percentage = (amount / totalSupplyNum) * 100;
      
      // Get the USD price from CoinGecko
      const tokenPrice = await getTokenUSDPrice(tokenAddress);
      const usdValue = amount * tokenPrice;
      
      // Check if this transfer qualifies as a whale transaction:
      // Minimum $5,000 and at least 0.2% of the token's total supply.
      if (usdValue >= 5000 && percentage >= 0.2) {
        const tx = {
          id: event.transactionHash,
          wallet: from,
          token: symbol,
          amount,
          value: usdValue,
          type: "N/A", // Additional logic can be implemented to determine Buy vs Sell
          tokenSupply: totalSupplyNum,
          time: new Date().toISOString()
        };
        console.log("Detected whale transaction:", tx);
        addTransaction(tx);
      }
    } catch (error) {
      console.error(`Error processing Transfer event for ${symbol} (${tokenAddress}):`, error);
    }
  });
}

/**
 * Initialize listeners for all tokens in the list.
 */
async function main() {
  for (const tokenAddress of tokenAddresses) {
    try {
      await setupTokenListener(tokenAddress);
      console.log(`Listener set up for token at address: ${tokenAddress}`);
    } catch (error) {
      console.error(`Failed to set up listener for ${tokenAddress}:`, error);
    }
  }
}

main().catch(console.error);

