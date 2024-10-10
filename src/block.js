const axios = require('axios');
const RPC_URL = process.env.RPC_URL;

async function getBlockTime(blocknum) {

  // Retrieve the RPC Project ID from secr
  if (!RPC_URL) {
    const msg = "Error RPC URL is not set"
    console.erro(msg, res);
    return { error: msg, status: 500 };
  }

  let hexBlock;
  if (blocknum.startsWith("0x")) {
    hexBlock = blocknum;
  } else {
    // Convert decimal to hexadecimal
    const blockInt = parseInt(blocknum, 10);
    if (isNaN(blockInt)) {
      return { error: `Invalid 'block' query parameter`, status: 400 };
    }
    hexBlock = "0x" + blockInt.toString(16);
  }

  // Make the POST request to RPC
  let res;
  try {

    res = await axios({
      method: 'post',
      url: RPC_URL,
      data: { "jsonrpc": "2.0", "method": "eth_getBlockByNumber", "params": [hexBlock, false], "id": 1 }
    });
  } catch (error) {
    console.error("Error contacting RPC", error);
    return { error: error.message, status: 502 };
  }

  if (res.status !== 200) {
    console.erro("Error in RPC response", res);
    return { error: res.statusText, status: res.status };
  }

  if (res.data.error) {
    console.erro("Error in RPC data", res.data.error);
    return { error: res.data.error, status: 500 };
  }


  // Extract the timestamp field
  const timestampHex = res.data.result?.timestamp;
  if (!timestampHex) {
    return { error: "timestamp not found in block response", status: 500 };
  }

  // Convert hexadecimal timestamp to decimal
  const timestampInt = parseInt(timestampHex, 16);

  // return string
  return timestampInt.toString()
}

module.exports = getBlockTime