#!/bin/bash
set -e

# EC2 User Data Script for t3.micro Ubuntu Instance
# Optimized for low-memory deployment of classifieds marketplace

# Log all output
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "=== Starting EC2 Instance Setup ==="
date

# Update system
apt-get update
apt-get upgrade -y

# Install essential packages
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    htop \
    unzip

# === Setup 2GB Swap File (Critical for t3.micro with 1GB RAM) ===
echo "=== Creating 2GB Swap File ==="
if [ ! -f /swapfile ]; then
    # Allocate 2GB swap file
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile

    # Make swap permanent
    echo '/swapfile none swap sw 0 0' >> /etc/fstab

    # Optimize swap settings for low memory
    sysctl vm.swappiness=10
    sysctl vm.vfs_cache_pressure=50
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf

    echo "Swap file created and configured"
    free -h
else
    echo "Swap file already exists"
fi

# === Install Docker ===
echo "=== Installing Docker ==="
if ! command -v docker &> /dev/null; then
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Start and enable Docker
    systemctl start docker
    systemctl enable docker

    echo "Docker installed successfully"
    docker --version
else
    echo "Docker already installed"
fi

# Add ubuntu user to docker group
usermod -aG docker ubuntu || true

# === Install Docker Compose (standalone) ===
echo "=== Installing Docker Compose ==="
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION="v2.24.5"
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

    echo "Docker Compose installed successfully"
    docker-compose --version
else
    echo "Docker Compose already installed"
fi

# === Install AWS CLI ===
echo "=== Installing AWS CLI ==="
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    ./aws/install
    rm -rf aws awscliv2.zip

    echo "AWS CLI installed successfully"
    aws --version
else
    echo "AWS CLI already installed"
fi

# === Configure UFW Firewall ===
echo "=== Configuring UFW Firewall ==="
apt-get install -y ufw

# Allow SSH (22), HTTP (80), HTTPS (443)
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Enable UFW (non-interactive)
echo "y" | ufw enable

ufw status verbose

# === Docker Memory Optimization for t3.micro ===
echo "=== Configuring Docker for Low Memory ==="
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
EOF

systemctl restart docker

# === Install Certbot for SSL ===
echo "=== Installing Certbot ==="
apt-get install -y certbot python3-certbot-nginx

# === System Optimization ===
echo "=== Applying System Optimizations ==="

# Increase file descriptor limits
cat >> /etc/security/limits.conf <<EOF
* soft nofile 65536
* hard nofile 65536
root soft nofile 65536
root hard nofile 65536
EOF

# Optimize network settings
cat >> /etc/sysctl.conf <<EOF
# Network optimizations
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
EOF

sysctl -p

# === Create application directory ===
echo "=== Setting up application directory ==="
mkdir -p /opt/marketplace
chown ubuntu:ubuntu /opt/marketplace

# === Setup automatic updates (security only) ===
echo "=== Configuring automatic security updates ==="
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# === Create deployment helper script ===
cat > /usr/local/bin/deploy-marketplace <<'SCRIPT'
#!/bin/bash
set -e

cd /opt/marketplace

echo "=== Deploying Marketplace Application ==="

# Pull latest code
if [ -d .git ]; then
    git pull origin main
else
    echo "Not a git repository. Skipping pull."
fi

# Stop existing containers
docker-compose down

# Pull/build images
docker-compose pull || true
docker-compose build

# Start services
docker-compose up -d

# Show status
docker-compose ps

echo "=== Deployment Complete ==="
echo "Run 'docker-compose logs -f' to view logs"
SCRIPT

chmod +x /usr/local/bin/deploy-marketplace

# === Final Status ===
echo "=== Setup Complete ==="
echo "Date: $(date)"
echo "Docker Version: $(docker --version)"
echo "Docker Compose Version: $(docker-compose --version)"
echo "AWS CLI Version: $(aws --version)"
echo "Memory Status:"
free -h
echo ""
echo "Firewall Status:"
ufw status numbered
echo ""
echo "=== Next Steps ==="
echo "1. Clone your repository to /opt/marketplace"
echo "2. Create .env file with required variables"
echo "3. Run: cd /opt/marketplace && docker-compose up -d"
echo "4. For SSL: certbot --nginx -d yourdomain.com"
echo ""
echo "Helper command available: deploy-marketplace"

# Reboot to ensure all settings take effect
echo "System will reboot in 10 seconds..."
sleep 10
reboot
