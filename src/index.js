
const express = require('express')
const getBlockTime = require('./block')

const app = express()
const port = process.env.PORT || 3000;


let error = false;

app.get('/api/health', async (req, res) => {
  res.status(error ? 500 : 200).send(error ? "error" : "OK");
})

app.get('/api/blocktime', async (req, res) => {
  const block = req.query.block
  if (!block) {
    error = true;
    return res.status(400).send("Missing 'block' query parameter");
  }

  const blocktime = await getBlockTime(block)
  if (blocktime.error) {
    error = true;
    return res.status(blocktime.status).send(blocktime.error);
  }

  error = false;
  res.status(200).send(blocktime);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})