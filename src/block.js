const axios = require('axios');

async function getBlockTime(blocknum) {

  // Retrieve the Infura Project ID from secr
  const url = process.env.RPC_URL || `https://mainnet.infura.io/v3/572a08067371446795af6725be59bb46`;

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
  // Remove the host from the URL, use only the path
  //const infuraUrl = `/v3/${INFURA_PROJECT_ID}`;
  //const infuraUrl = ;
  //const infuraUrl = `/v3/${INFURA_PROJECT_ID}`;


  // Make the POST request to Infura
  let res;
  try {
    // res = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: `{ "jsonrpc": "2.0", "method": "eth_getBlockByNumber", "params": ["${blocknum}", false], "id": 1 }`,
    //   //body: requestBody,
    // });
    res = await axios({
      method: 'post',
      url: url,
      data: { "jsonrpc": "2.0", "method": "eth_getBlockByNumber", "params": [hexBlock, false], "id": 1 }
    });
  } catch (error) {
    console.error("Error contacting Infura", error);
    return { error: error.message, status: 502 };
  }

  if (res.status !== 200) {
    console.erro("Error in Infura response", res);
    return { error: res.statusText, status: res.status };
  }

  if (res.data.error) {
    console.erro("Error in Infura data", res.data.error);
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
