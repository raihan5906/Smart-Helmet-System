const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Connect to your local or target cloud MQTT Broker infrastructure instance 
const mqttClient = mqtt.connect('mqtt://localhost:1883'); 

mqttClient.on('connect', () => {
    console.log('Connected to target MQTT Broker Channel successfully.');
    mqttClient.subscribe('smarthelmet/#', (err) => {
        if (!err) console.log('Subscribed to all structured telemetry feeds.');
    });
});

// Pass topics through to Socket.IO clients instantly
mqttClient.on('message', (topic, message) => {
    io.emit('telemetryUpdate', { topic, payload: message.toString() });
});

io.on('connection', (socket) => {
    console.log('Web Dashboard visualization node synchronized.');
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Industrial Server rendering active on port ${PORT}`));