Your current all-in-one Docker build now:

Serves React UI + FastAPI API/WebSocket from a single container.

Displays live price, signal, balance, position status.

Plots real-time equity curve.

Shows trade history table.

Supports start/stop control and read-only mode.

It’s ready to deploy to any Docker-capable cloud host and will run fully in the browser without separate frontend/backend hosting or CORS setup.


npm install chart.js react-chartjs-2

docker build -t btc-bot-ui .
docker run -p 8000:8000 --env-file .env btc-bot-ui

In cloud (Railway, DigitalOcean, etc.) → This container serves:

/ → React UI

/ws → WebSocket data feed

/start, /stop → Bot control

