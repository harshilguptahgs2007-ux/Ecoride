#!/bin/bash
# ==============================================================================
# AWS EC2 Automated Deployment Script for ZapBus (Ubuntu 22.04 / 24.04 LTS)
# ==============================================================================

set -e

echo "=== 1. Updating System Packages ==="
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y git curl ufw python3-pip python3-venv nginx certbot python3-certbot-nginx

echo "=== 2. Installing Redis ==="
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

echo "=== 3. Setting Up Project Environment ==="
APP_DIR="/opt/zapbus"
if [ ! -d "$APP_DIR" ]; then
    sudo git clone https://github.com/harshilguptahgs2007-ux/Zap_bus.git "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
else
    cd "$APP_DIR"
    git checkout redis_usage
    git pull origin redis_usage
fi

cd "$APP_DIR/backend"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "=== 4. Configuring Systemd Service ==="
sudo tee /etc/systemd/system/zapbus-backend.service > /dev/null <<EOF
[Unit]
Description=ZapBus FastAPI Backend Service
After=network.target redis-server.service

[Service]
User=$USER
WorkingDirectory=$APP_DIR/backend
Environment="PATH=$APP_DIR/backend/venv/bin"
EnvironmentFile=-$APP_DIR/backend/.env
ExecStart=$APP_DIR/backend/venv/bin/gunicorn backend:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable zapbus-backend
sudo systemctl restart zapbus-backend

echo "=== 5. Configuring Nginx Reverse Proxy ==="
sudo tee /etc/nginx/sites-available/zapbus > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/zapbus /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "=== 6. Configuring Firewall ==="
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

echo "=== Deployment Successful! ==="
echo "Check service: sudo systemctl status zapbus-backend"
echo "Check health:  curl http://localhost/health"
