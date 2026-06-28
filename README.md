# Smart Helmet & Intelligent Connected Bike System

An IoT-driven safety and telemetry framework featuring real-time data streaming, automatic accident identification, automated emergency dispatch pipelines, and an industrial-grade monitoring dashboard.

## 📌 Architecture Overview

The system architecture is divided into three major operational layers:

1. **Edge Sensor Node (Helmet Unit)**: Monitors driver safety via a tilt sensor (accident detection), MQ-3 alcohol sensor, and IR proximity sensor (helmet placement verification). It communicates directly over an ultra-low-latency, local connection using the **ESP-NOW** protocol.
2. **Central Processing Gateway (Bike Unit)**: Powered by an ESP32 microcontroller acting as the system's runtime state machine. It manages the ignition interlock relay, processes TinyGPS++ NMEA data feeds, handles direct GSM/SIM800L hardware SMS routines, and coordinates a throttled dual-uplink interface.
3. **Telemetry & Presentation Layer**:
   - **Local Web Dashboard**: Powered by Node.js, Express, Socket.io, and Leaflet.js map rendering. Connects to a local, zero-lag **Eclipse Mosquitto MQTT broker**.
   - **Cloud Management Node**: Powered by the **Blynk IoT Cloud Engine** to handle remote tracking and automated rule handling.

---

## 📊 Dual-Interval Telemetry Interface

To balance high-fidelity local tracking with cloud API quota limits, the central gateway splits data transmissions into two isolated, throttled pipelines:
* **Local MQTT Web Dashboard Sync (1-Second Interval)**: Completely free, offline telemetry pipeline ensuring ultra-responsive UI marker updates during live project evaluation.
* **Cloud Blynk Sync (5-Second Interval)**: Intentionally throttled pipeline designed to minimize message resource depletion and preserve daily developer credits while maintaining active cloud visibility.

---

## 🎛️ Real-Time Dashboard Features

* **Leaflet.js Map Tracking Grid**: Centered dynamically with a custom dark-aesthetic spatial inversion matrix filter applied.
* **Blink-Free Live Updating**: Leverages active duplex WebSockets (`Socket.io`) to stream telemetry variables directly to the virtual instrument panels without full-page document DOM cycles.
* **One-Click Simulation Engine**: Built-in testing button directly inside the frontend layer allows users to simulate a comprehensive `90° CRASH HALT` event layout instantly (spoofing mock coordinate entries, showing the alarm modal box, and locking hardware updates) without re-flashing physical edge microcontrollers.
* **Dynamic Direct Map Linkage**: Generates standard Google Maps navigation paths instantly to provide real-time routing vectors to the precise coordinates of the accident location.

---

## 📁 Repository Structure

```text
├── Bike_Unit/
│   └── Bike_Unit.ino          # Core ESP32 Gateway Firmware (C++)
├── Dashboard/
│   ├── public/
│   │   ├── index.html         # Frontend Single Page Console Application
│   │   └── logo.png           # Hardware Icon Asset (Local Logo Ref)
│   ├── .gitignore             # Formatted Staging Block Exclusion Filters
│   ├── package.json           # Node Dependency & NPM Execution Registry
│   └── server.js              # Back-end Duplex Gateway Server
└── README.md                  # System Documentation Node