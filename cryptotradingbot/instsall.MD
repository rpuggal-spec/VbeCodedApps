Here’s how to run and test your all-in-one BTC trading bot + UI locally on a Windows machine in read-only mode so it never sends real trades.

1. Install Required Tools
Install Docker Desktop

Download from https://www.docker.com/products/docker-desktop

Install and restart your PC.

Enable “Use the WSL 2 based engine” in Docker Desktop settings.

Make sure Docker Desktop is running.

Install Git

Download from https://git-scm.com/download/win

Install with default settings.

2. Open a Terminal

You can use:

PowerShell (recommended)

Command Prompt

3. Clone Your Bot Repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

4. Create .env for Local Testing

Keep READ_ONLY=true so no trades are sent.

notepad .env


Paste:

BROKER=coinbase
READ_ONLY=true
API_KEY=your_coinbase_api_key
API_SECRET=your_coinbase_api_secret
API_PASSPHRASE=your_coinbase_passphrase
SYMBOL=BTC-USD
SHORT_MA=5
LONG_MA=20
RISK_PER_TRADE=0.02
STOP_LOSS_PCT=0.01
TAKE_PROFIT_PCT=0.02


Save and close.

5. Build the Docker Image
docker build -t btc-bot-ui .

6. Run the Bot in Read-Only Mode
docker run -p 8000:8000 --env-file .env btc-bot-ui


This runs both FastAPI backend and React UI inside one container.

-p 8000:8000 → Maps container port 8000 to your local port 8000.

7. Open Dashboard in Browser

Visit:

http://localhost:8000


You’ll see:

Live BTC price (via broker API)

Current signal (BUY, SELL, STOP_LOSS, TAKE_PROFIT)

Balance (from broker API, read-only)

Position status

Equity curve chart

Trade history table

8. Interact with the Bot

Click Start Bot → Price & signal update in real-time.

READ_ONLY=true ensures no orders are sent.

9. Stop the Bot
docker ps
docker stop <container_id>
