# Definicja dostawcy i wersji konfiguracji 
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.43"
    }
  }
}

# Definicja regionu, gdzie tworzone będą zasoby AWS'a
provider "aws" {
  region = "us-east-1"
}

# Tworzy Virtual Private Cloud, które pozwala na DNS i nazwy hostów.
# Włącza wsparcie dla DNS i nazw hostów DNS wewnątrz VPC
resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "app_vpc"
  }
}

# Brama umożliwiające łączenie się VPC z Internetem
resource "aws_internet_gateway" "tic_tac_toe_igw" {
  vpc_id = aws_vpc.app_vpc.id
  tags = {
    Name = "tic_tac_toe_igw"
  }
}

# Tworzy podsieć w VPC z automatycznym przydzielaniem IP publicznych oraz dla EC2
resource "aws_subnet" "tic_tac_toe_subnet" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true 
  tags = {
    Name = "tic_tac_toe_subnet"
  }
}

# Tworzy tabelę routingu dla VPC, dodając trasę domyślną przez bramę 
resource "aws_route_table" "tic_tac_toe_rt" { 
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.tic_tac_toe_igw.id
  }

  tags = {
    Name = "tic_tac_toe_rt"
  }
}

# Wiąże tabelę routingu z podsiecią, umożliwiając jej dostęp do internetu.
resource "aws_route_table_association" "tic_tac_toe_rta" {
  subnet_id      = aws_subnet.tic_tac_toe_subnet.id
  route_table_id = aws_route_table.tic_tac_toe_rt.id
}

# Tworzy grupę bezpieczeństwa z regułami dla ruchu przychodzącego (ingress) i wychodzącego (egress), umożliwiając jedynie ruch na niezbędnych portach.
# Zapewnia to bezpieczeństwo przed atakami na wolne porty.
resource "aws_security_group" "tic_tac_toe_sg" {
  name        = "tic_tac_toe_sg"
  vpc_id      = aws_vpc.app_vpc.id
  description = "Security group for accessing application and ec2 via SSH"

# HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

# HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

# backend
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

# frontend (możnaby w sumie dawać front na port 80/443, ale zrobiłem inaczej)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

# ssh
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Reguła dla całego ruchu wychodzącego, która go nie ogranicza
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "tic_tac_toe_sg"
  }
}

# Tworzy instancję EC2 z określonym obrazem AMI, typem instancji i grupą bezpieczeństwa.
# AMI zostało znalezione dzięki stronie https://api.netcubed.de/latest/ami/lookup?platform=amzn2&fbclid=IwAR0BKcf3D28DiuvttUfKMZE0WtwgWRv0kW9_XCCJwHBntSRfG1LbcFyYK10_aem_AWHs8WBIRtX7NEjqT6j_cNuemLt6UmXLj0LJI1Zhp8B1CU_acHz7FYUNf_YAMdEoUpdU0QfAvXFSdC-_Ml61ic2E
resource "aws_instance" "tic_tac_toe_ec2" {
  ami                      = "ami-0cf43e890af9e3351"
  instance_type            = "t2.micro"
  subnet_id              = aws_subnet.tic_tac_toe_subnet.id
  vpc_security_group_ids = [aws_security_group.tic_tac_toe_sg.id]
  key_name               = "vockey"

  tags = {
    Name = "tic_tac_toe_instance"
  }
}

# Definicja i powiązanie Elastic IP, które daje nam publiczny adres IP
resource "aws_eip" "app_eip" {
  domain     = "vpc"
  depends_on = [aws_vpc.app_vpc]
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.tic_tac_toe_ec2.id
  allocation_id = aws_eip.app_eip.id
}
