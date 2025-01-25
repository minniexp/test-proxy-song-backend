const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint
app.get('/api/playlist/:id', async (req, res) => {
  const playlistID = req.params.id;
  console.log("playlistID:", playlistID);
  const options = {
    method: 'GET',
    url: `https://deezerdevs-deezer.p.rapidapi.com/playlist/${playlistID}`,
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    res.status(500).json({ error: 'Error fetching playlist data' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});