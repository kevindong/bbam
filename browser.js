function initializeMap() {
  let map = L.map('map', {
    minZoom: 12,
    maxZoom: 18,
    maxBounds: [
      [33.231943, -111.891210],
      [33.294085, -111.751815],
    ]
  }).setView([33.25, -111.8], 14);
  
  let tileUrl = 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=3c0d7c0f2de749deabab6bdf6b6dfbbb';
  let layer = new L.TileLayer(tileUrl, {
    maxZoom: 18,
    attribution: 'Maps © <a href="http://www.thunderforest.com">Thunderforest</a>, Data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  });
  map.addLayer(layer);
  return map
}

async function getData() {
  let response = await fetch('/api');
  return await response.json();
}

async function refreshMarkers() {
  if (this.markerLayer !== undefined) {
    this.markerLayer.clearLayers();
  }
  this.markerLayer = new L.layerGroup().addTo(this.map);
  
  let minimumPoints = document.getElementById("minimumPoints").value;
  let showLowPointStations = document.getElementById("showLowPointStations").checked;
  let data = await this.data;
  for (const point of data.features) {
    let bikesAvailable = point.properties.station.bikes_available;
    let docksAvailable = point.properties.station.docks_available;
    let tooltipText = `${point.properties.station.name}<br>Bikes Available: ${bikesAvailable}<br>Docks Available: ${docksAvailable}`;

    let bikeAngelsAction = point.properties.bike_angels_action;
    let bikeAngelsPoints = point.properties.bike_angels_points || 0;

    let text = "";
    let color = "";
    // The station is disabled
    if (bikesAvailable === 0 && docksAvailable === 0) {
      continue;
    } else if (!showLowPointStations && bikeAngelsPoints < minimumPoints) {
      continue;
    // The station has no incentive
    } else if (!["give", "take"].includes(bikeAngelsAction)) {
      color = "gray-dot";
      text = "0";
    } else {
      color = bikeAngelsPoints >= minimumPoints ? "green-dot" : "gray-dot";
      let arrow = "";
      // Points are granted for a rider taking a bike / station giving a bike
      if (bikeAngelsAction === "give") {
        color += docksAvailable === 0 ? " red-border" : "";
        arrow = "⬇";
      // Points are granted for a rider giving a bike / station taking a bike
      } else {
        color += bikesAvailable === 0 ? " red-border" : "";
        arrow = "⬆";
      }
      text = `${arrow} ${bikeAngelsPoints}`;
    }

    text += `<br/>B${bikesAvailable} - D${docksAvailable}`;

    L.marker(point.geometry.coordinates.sort().reverse(), {icon: new L.DivIcon({
      className: color,
      html: `<div style=\"text-align: center; margin: 5px; white-space: nowrap;\">${text}</div>`
    })}).bindTooltip(tooltipText).addTo(this.markerLayer);
  }
}
