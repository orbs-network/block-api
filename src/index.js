
const express = require('express')
const getBlockTime = require('./block')

const app = express()
const port = 3000

let error = false;

app.get('/api/health', async (req, res) => {
  res.send(error ? "error" : "OK", error ? 500 : 200)
})

app.get('/api/blocktime', async (req, res) => {
  const block = req.query.block
  if (!block) {
    error = true;
    return res.send("Missing 'block' query parameter", 400);
  }

  const blocktime = await getBlockTime(block)
  if (blocktime.error) {
    error = true;
    return blocktime.send(blocktime.error, blocktime.status);
  }

  error = false;
  res.send(blocktime, 200)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})