const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Serve public visualization assets
app.use(express.static(path.join(__dirname, 'public')));

// ── CONNECT TO YOUR FIRMWARE'S PUBLIC HIVEMQ BROKER ──
const MQTT_BROKER = 'mqtt://broker.hivemq.com:1883';
const mqttClient = mqtt.connect(MQTT_BROKER);

// Array containing the exact topics matching your Bike Unit firmware definitions
const topics = [
    "smarthelmet/alcohol_value",
    "smarthelmet/alcohol_status",
    "smarthelmet/helmet_status",
    "smarthelmet/tilt_angle",
    "smarthelmet/helmet_led",
    "smarthelmet/latitude",
    "smarthelmet/longitude",
    "smarthelmet/gps_status",
    "smarthelmet/engine_status",
    "smarthelmet/gsm_status",
    "smarthelmet/relay_status",
    "smarthelmet/buzzer_status",
    "smarthelmet/emergency_msg",
    "smarthelmet/accident_status",
    "smarthelmet/espnow_status"
];

mqttClient.on('connect', () => {
    console.log('✔ Connected successfully to HiveMQ Broker.');
    mqttClient.subscribe(topics, (err) => {
        if (!err) {
            console.log('📡 Subscribed cleanly to all system telemetry loops.');
        } else {
            console.error('❌ Topic subscription fault encountered:', err);
        }
    });
});

// Process downstream messages and pass them smoothly down the WebSocket pipe
mqttClient.on('message', (topic, message) => {
    const payloadStr = message.toString();
    
    // Broadcast immediately down to all active frontend UI browser tabs
    io.emit('telemetryUpdate', {
        topic: topic,
        payload: payloadStr
    });
});

// WebSocket orchestration mapping loop
io.on('connection', (socket) => {
    console.log(`🔌 Live connection established with Client Console ID: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`🔌 Client console connection severed for ID: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 WEB CONSOLE RUNNING AT: http://localhost:${PORT}`);
    console.log(`====================================================`);
});