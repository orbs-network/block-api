
const express = require('express')
const getBlockTime = require('./block')

const app = express()
const port = 3000




app.get('/api/blocktime', async (req, res) => {
  const block = req.query.block
  if (!block) {
    return res.send("Missing 'block' query parameter", 400);
  }

  const blocktime = await getBlockTime(block)
  if (blocktime.error) {
    return blocktime.send(blocktime.error, blocktime.status);
  }

  res.send(blocktime, 200)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})