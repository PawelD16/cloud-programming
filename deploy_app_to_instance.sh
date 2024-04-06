#!/bin/bash

# Update your system's package index
sudo yum update -y

# Install required packages
sudo yum install -y yum-utils device-mapper-persistent-data lvm2 git

# Install Docker
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add the current user to the Docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone the application repository
git clone https://github.com/PawelD16/cloud-programming.git
cd cloud-programming

# Run the dockerized applications
docker-compose up -d

echo "Application deployment script executed successfully."

