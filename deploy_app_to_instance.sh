#!/bin/bash

# Update the system
sudo yum update -y

# Install Docker
sudo amazon-linux-extras install docker

# Start Docker and enable it to start on boot
sudo service docker start
sudo systemctl enable docker

# Add the current user to the Docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# You may need to log out and log back in at this point for the usermod change to take effect

# Install Git
sudo yum install -y git

# Clone the application repository
git clone https://github.com/PawelD16/cloud-programming.git
cd cloud-programming

# Run the dockerized applications
docker-compose up -d

echo "Application deployment script executed successfully."

