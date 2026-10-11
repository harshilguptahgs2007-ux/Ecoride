# ==============================================================================
# AWS Architecture & Deployment Guide: ZapBus / EcoRide
# ==============================================================================

This document outlines how to host the **ZapBus FastAPI logic on AWS EC2** and connect it to a managed database (**AWS RDS** or a persistent SQLite volume).

---

## 1. Important Note on SQLite vs AWS RDS

> **Important**: **AWS RDS is a managed service for network databases** (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server). AWS RDS **does not support SQLite**, because SQLite is an *in-process, file-based database engine*, not a network server.
>
> You have two standard AWS production options:
>
> 1. **Option A (Recommended for AWS RDS)**: Create an **AWS RDS PostgreSQL** (or MySQL) instance and connect via `DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/zapbus_db`. The SQLAlchemy backend has already been updated to dynamically support this!
> 2. **Option B (Keeping SQLite on AWS EC2)**: Store `database.db` on an **AWS EBS volume** attached to your EC2 instance so that your SQLite data persists across server reboots.

---

## 2. Architecture Overview

```
 [ Mobile App (React Native / Expo) / Browser ]
                       │
                       ▼ (HTTPS / Port 443)
              ┌─────────────────┐
              │   AWS EC2       │
              │  (Ubuntu 22.04) │
              │                 │
              │  Nginx Reverse  │
              │     Proxy       │
              │        │        │
              │        ▼        │
              │  Gunicorn +     │
              │  FastAPI (8000) │
              │    │       │    │
              │    │       ▼    │
              │    │   Redis    │
              └────┼────────────┘
                   │
                   ▼ (Port 5432 / 3306)
         ┌───────────────────┐
         │     AWS RDS       │
         │  PostgreSQL/MySQL │
         └───────────────────┘
```

---

## 3. Step-by-Step EC2 Setup

### Step 3.1: Launch an EC2 Instance
1. In the AWS Console, go to **EC2** → **Launch Instance**.
2. **Name**: `zapbus-backend`
3. **OS**: **Ubuntu Server 22.04 LTS** or **24.04 LTS** (64-bit x86).
4. **Instance Type**: `t3.small` or `t3.medium` (or `t2.micro` for testing).
5. **Key Pair**: Select or create an SSH `.pem` key.
6. **Network Settings (Security Group)**:
   - Allow **SSH (22)** from your IP.
   - Allow **HTTP (80)** from Anywhere (`0.0.0.0/0`).
   - Allow **HTTPS (443)** from Anywhere (`0.0.0.0/0`).
   - *Optional:* Port `8000` if you want direct access without Nginx.

---

### Step 3.2: Automated EC2 Provisioning
SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>
```

Clone the repository and run the automated deployment script:
```bash
git clone https://github.com/harshilguptahgs2007-ux/Zap_bus.git -b redis_usage
cd Zap_bus/backend
chmod +x deploy_ec2.sh
./deploy_ec2.sh
```

This script will automatically:
- Install Python, Nginx, Redis, and build essentials.
- Set up a Python virtual environment and install `requirements.txt`.
- Configure and start Redis.
- Create a systemd service (`zapbus-backend.service`) managed with Gunicorn workers.
- Configure Nginx reverse proxy so port 80 routes to FastAPI port 8000.

---

## 4. Connecting to AWS RDS (PostgreSQL / MySQL)

### Step 4.1: Create RDS Instance
1. In the AWS Console, go to **RDS** → **Create Database**.
2. **Engine**: Select **PostgreSQL** (Recommended) or **MySQL**.
3. **Templates**: **Free tier** or **Production**.
4. **DB Instance Identifier**: `zapbus-db`
5. **Master Username**: `postgres` (or `admin`)
6. **Master Password**: Set a strong password.
7. **VPC Security Group**: Make sure it allows inbound traffic on port `5432` from your EC2 Security Group.
8. **Initial Database Name**: `zapbus_db`

### Step 4.2: Configure Environment Variables on EC2
On your EC2 instance, edit `/opt/zapbus/backend/.env`:
```bash
# If using AWS RDS PostgreSQL:
DATABASE_URL=postgresql://postgres:YourPassword@zapbus-db.cxxxxxxx.us-east-1.rds.amazonaws.com:5432/zapbus_db

# If using AWS RDS MySQL:
# DATABASE_URL=mysql+pymysql://admin:YourPassword@zapbus-db.cxxxxxxx.us-east-1.rds.amazonaws.com:3306/zapbus_db

# If keeping SQLite on EC2:
# DATABASE_URL=sqlite:///database.db

SECRET_KEY=generate_a_random_32_char_secret_here
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGINS=*
```

Restart the service to apply changes:
```bash
sudo systemctl restart zapbus-backend
```

Verify health:
```bash
curl http://localhost/health
```
Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "database_engine": "postgresql",
  "redis": "connected",
  "timestamp": "2026-10-11T13:30:00Z"
}
```

---

## 5. Alternative: 1-Command Docker Deployment on EC2

If you prefer Docker on EC2:
```bash
# Install Docker on EC2
sudo apt-get update && sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
# Log out and log back in

# Run the app
cd /opt/zapbus
docker-compose up -d --build
```

---

## 6. Point Frontend to AWS EC2

In your local or deployed frontend:
Edit `frontend/.env`:
```env
EXPO_PUBLIC_API_URL=http://<YOUR-EC2-PUBLIC-IP-OR-DOMAIN>
```

Rebuild or restart Expo:
```bash
cd frontend
npm start
```
The app will now route all authentication, rides, and Redis fast visibility through your live AWS cloud backend!
