const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for SPA-like behavior (optional, good for direct links)
// Removed because Express 5 path-to-regexp syntax changed and this is a single page anyway.

app.listen(port, () => {
  console.log(`Excellence Detail server running at http://localhost:${port}`);
});
