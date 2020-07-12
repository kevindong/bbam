const express = require('express');
const PORT = process.env.PORT || 8080;
const path = require('path');
const fetch = require('node-fetch');

express()
  .get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')))
  .get('/leaflet/leaflet.css', (req, res) => res.sendFile(path.join(__dirname + '/leaflet/leaflet.css')))
  .get('/leaflet/leaflet.js', (req, res) => res.sendFile(path.join(__dirname + '/leaflet/leaflet.js')))
  .get('/browser.js', (req, res) => res.sendFile(path.join(__dirname + '/browser.js')))
  .get('/api', (req, res) => {
    fetch("https://layer.bicyclesharing.net/map/v1/nyc/map-inventory")
      .then(response => response.json())
      .then(data => {
        res.send(data);
      })
  })
  .listen(PORT, () => {
    console.log(`Listening on :${PORT}`);
  });