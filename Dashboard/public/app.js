const socket = io();

// Standard default geographical layout placeholder (Centered at project design space)
let map = L.map('map-viewport', { zoomControl: false }).setView([12.9716, 77.5946], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add custom telemetry dot location marker
let bikeIcon = L.divIcon({
    className: 'digital-marker-glow',
    html: '<div style="background-color: #00d2ff; width:14px; height:14px; border-radius:50%; box-shadow: 0 0 10px #00d2ff; border: 2px solid #fff;"></div>',
    iconSize: [14, 14]
});
let bikeMarker = L.marker([12.9716, 77.5946], { icon: bikeIcon }).addTo(map);

let currentLat = 0;
let currentLng = 0;

// Handle real-time network stream packets mapped out from server.js broker
socket.on('telemetryUpdate', (data) => {
    const { topic, payload } = data;

    if (topic === 'smarthelmet/alcoholValue') {
        document.getElementById('lbl-alcohol').innerHTML = `${payload.padStart(4, '0')} <span style="font-size:14px; color:var(--text-muted)">ADC</span>`;
    }

    if (topic === 'smarthelmet/helmet') {
        const el = document.getElementById('stat-helmet');
        el.innerText = payload;
        el.className = (payload === "WORN") ? "metric-val text-green" : "metric-val text-red";
    }

    if (topic === 'smarthelmet/engine') {
        const el = document.getElementById('stat-engine');
        el.innerText = payload;
        el.className = (payload === "RUNNING") ? "metric-val text-green" : "metric-val text-red";
    }

    if (topic === 'smarthelmet/relay') {
        const el = document.getElementById('stat-relay');
        el.innerText = (payload === "1") ? "CLOSED (ON)" : "OPEN (OFF)";
        el.className = (payload === "1") ? "metric-val text-green" : "metric-val text-gray";
    }

    if (topic === 'smarthelmet/accident') {
    const modal = document.getElementById('accident-modal');
    const tiltEl = document.getElementById('stat-tilt');
    
    if (payload === "CRASH") {
        modal.style.display = 'flex';
        tiltEl.innerHTML = `CRASH DETECTED (<span id="txt-angle">90</span>°)`;
        tiltEl.className = "metric-val text-red";
    } else {
        modal.style.display = 'none';
        // Dynamically tracks back to a safe nominal readout state
        tiltEl.innerHTML = `VERTICAL (<span id="txt-angle">0</span>°)`;
        tiltEl.className = "metric-val text-green";
    }
}

    if (topic === 'smarthelmet/state' && payload === "FAULT_DISCONNECT") {
        document.getElementById('stat-engine').innerText = "FAULT HALT";
        document.getElementById('stat-engine').className = "metric-val text-red";
    }

    if (topic === 'smarthelmet/gps/latitude')  { currentLat = parseFloat(payload); syncLocation(); }
    if (topic === 'smarthelmet/gps/longitude') { currentLng = parseFloat(payload); syncLocation(); }
});

function syncLocation() {
    if (currentLat !== 0 && currentLng !== 0) {
        const updatedPos = [currentLat, currentLng];
        bikeMarker.setLatLng(updatedPos);
        map.panTo(updatedPos);

        document.getElementById('txt-coords').innerText = `GPS LOCK: ${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`;
        
        // Dynamically assign coordinates into Google Maps external query path format layout
        document.getElementById('gmaps-link').href = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;
    }
}