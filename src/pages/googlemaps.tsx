import { onMount } from 'solid-js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Geocoder CSS
import 'leaflet-control-geocoder';
import Chart from 'chart.js/auto';

const Maps = () => {
  let map;
  let chartOverlay;
  let kabupatenLayerGroup = L.layerGroup();
  let kecamatanLayerGroup = L.layerGroup();
  let currentChart; // To store the current chart instance

  // Data for kabupaten and kecamatan
  const kecamatanOptions = {
    "Kota Administratif Jakarta Pusat": [
      { name: "Gambir", area: "8.72 km²", lat: -6.1754, lng: 106.8272 },
      { name: "Menteng", area: "7.72 km²", lat: -6.2088, lng: 106.8434 },
    ],
  };

  const kabupatenOptions = {
    "DKI Jakarta": [
      { name: "Kota Administratif Jakarta Pusat", lat: -6.1779, lng: 106.8352, area: "48.13 km²" },
    ],
    "Jawa Barat": [
      { name: "Kabupaten Bandung", lat: -6.9218, lng: 107.6078, area: "2,384.15 km²" },
    ],
  };

  const provinces = [
    { name: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, area: "662.33 km²" },
    { name: 'Jawa Barat', lat: -6.9175, lng: 107.6191, area: "35,377.76 km²" },
    { name: 'Jawa Tengah', lat: -7.1500, lng: 110.1403, area: "32,548.57 km²" },
    { name: 'Jawa Timur', lat: -7.2504, lng: 112.7688, area: "47,922.45 km²" },
  ];

  const addMarkers = (locations, group, type, clickHandler) => {
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng]);

      marker.on('mouseover', async () => {
        if (chartOverlay) {
          map.removeLayer(chartOverlay); // Remove any chart overlay
        }

        const popupContent = L.DomUtil.create('div', 'popup-content');
        popupContent.style.maxWidth = '300px'; // Set max-width for the popup
        popupContent.style.maxHeight = '200px'; // Set max-height for the popup
        popupContent.style.overflow = 'hidden'; // Hide overflow
        popupContent.style.overflowY = 'auto'; // Add scroll if needed

        const locationNameDiv = L.DomUtil.create('div', 'location-name', popupContent);
        locationNameDiv.innerHTML = `<h4>${type}: ${location.name}</h4><p>Luas Wilayah: ${location.area}</p>`;

        const chartCanvas = L.DomUtil.create('canvas', 'chart-canvas', popupContent);
        chartCanvas.width = 200; // Adjust width
        chartCanvas.height = 120; // Adjust height

        // Fetch gender data based on location
        const url =
          type === 'Kabupaten'
            ? `http://127.0.0.1:8080/gender/kabupaten/${location.name}`
            : type === 'Kecamatan'
            ? `http://127.0.0.1:8080/gender/kecamatan/${location.name}`
            : `http://127.0.0.1:8080/gender/provinsi/${location.name}`;

        const response = await fetch(url);
        const userData = await response.json();
        const chartData = [userData.laki_laki, userData.perempuan];

        // Destroy previous chart if it exists
        if (currentChart) {
          currentChart.destroy();
        }

        // Create a new chart
        currentChart = new Chart(chartCanvas, {
          type: 'pie',
          data: {
            labels: ['Laki-laki', 'Perempuan'],
            datasets: [
              {
                label: 'User',
                data: chartData,
                backgroundColor: ['#36A2EB', '#FF6384'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false, // Hide legend if not needed
              },
            },
          },
        });

        chartOverlay = L.popup({
          maxWidth: 300, // Adjust as needed
          minWidth: 100, // Adjust as needed
          maxHeight: 100, // Adjust to fit content and chart
          autoPanPaddingTopLeft: [0, 0], // Adjust for better positioning
        })
          .setLatLng([location.lat, location.lng])
          .setContent(popupContent)
          .openOn(map);
      });

      marker.on('click', () => {
        if (clickHandler) {
          clickHandler(location);
        }
      });

      marker.bindTooltip(`<strong>${location.name}</strong><br>Luas Wilayah: ${location.area}`).openTooltip();
      marker.addTo(group);
    });
  };

  onMount(async () => {
    map = L.map('map').setView([-2.5489, 118.0149], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const provinceGroup = L.layerGroup().addTo(map);
    addMarkers(provinces, provinceGroup, 'Provinsi', (province) => {
      kabupatenLayerGroup.clearLayers(); // Clear existing kabupaten markers
      kecamatanLayerGroup.clearLayers(); // Clear existing kecamatan markers
      map.setView([province.lat, province.lng], 7);
    
      const kabupatens = kabupatenOptions[province.name]; // Mendapatkan kabupaten dari provinsi
      if (kabupatens) {
        addMarkers(kabupatens, kabupatenLayerGroup, 'Kabupaten', (kabupaten) => {
          kecamatanLayerGroup.clearLayers(); // Clear existing kecamatan markers
          map.setView([kabupaten.lat, kabupaten.lng], 10);
    
          const kecamatans = kecamatanOptions[kabupaten.name]; // Mendapatkan kecamatan dari kabupaten
          if (kecamatans) {
            addMarkers(kecamatans, kecamatanLayerGroup, 'Kecamatan', () => {});
          }
        });
      }
    });
    
  });

  return <div id="map" style="height: 550px;"></div>;
};

export default Maps;
