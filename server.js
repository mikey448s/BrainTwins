const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
