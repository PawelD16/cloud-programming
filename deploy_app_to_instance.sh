#!/bin/bash

# Update your system's package index
cd ~
sudo yum update -y
sudo yum install -y git

# Install Docker
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Autostart docker
sudo chkconfig docker on

sudo yum install -y git

# Install Docker Compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

cd ~/

# Clone the application repository
git clone https://github.com/PawelD16/cloud-programming.git
cd cloud-programming

# Run the dockerized applications
sudo docker-compose up

echo "Application deployment script executed successfully."

