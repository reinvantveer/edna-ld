/**
 * Created by rein on 12/2/16.
 */
import express from 'express';
const app = express();

import logger from 'bunyan';
const log = bunyan.createLogger({name: "transformer interface"});

app.get('/go', (req, res) => {
  res.send('ok');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
