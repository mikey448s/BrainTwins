const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory (e.g., HTML, CSS, client-side JS)
app.use(express.static('public'));

// Importing routes from endpoint.js (assuming it exports a function that takes an app)
require('./endpoint')(app);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
