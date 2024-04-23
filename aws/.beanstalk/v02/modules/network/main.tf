# Tworzy Virtual Private Cloud, które pozwala na DNS i nazwy hostów.
# Włącza wsparcie dla DNS i nazw hostów DNS wewnątrz VPC
resource "aws_vpc" "tic-tac-toe-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "tic-tac-toe-vpc"
  }
}

# Tworzy podsieć w VPC z automatycznym przydzielaniem IP publicznych oraz dla EC2
resource "aws_subnet" "tic-tac-toe-subnet" {
  vpc_id                  = aws_vpc.tic-tac-toe-vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "tic-tac-toe-subnet"
  }
}

# Tworzy grupę bezpieczeństwa z regułami dla ruchu przychodzącego (ingress) i wychodzącego (egress), umożliwiając jedynie ruch na niezbędnych portach.
# Zapewnia to bezpieczeństwo przed atakami na wolne porty.
resource "aws_security_group" "tic-tac-toe-sg" {
  name        = "tic-tac-toe-sg"
  vpc_id      = aws_vpc.tic-tac-toe-vpc.id
  description = "Security group for accessing application and ec2 via SSH"

  # backend
  ingress {
    from_port   = var.backend_port
    to_port     = var.backend_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # frontend
  ingress {
    from_port   = var.frontend_port
    to_port     = var.frontend_port
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
    Name = "tic-tac-toe-sg"
  }
}

# Brama umożliwiające łączenie się VPC z Internetsem
resource "aws_internet_gateway" "tic-tac-toe-igw" {
  vpc_id = aws_vpc.tic-tac-toe-vpc.id
  tags = {
    Name = "tic-tac-toe-igw"
  }
}

# Tworzy tabelę routingu dla VPC, dodając trasę domyślną przez bramę 
resource "aws_route_table" "tic-tac-toe-rt" {
  vpc_id = aws_vpc.tic-tac-toe-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.tic-tac-toe-igw.id
  }

  tags = {
    Name = "tic-tac-toe-rt"
  }
}

# Wiąże tabelę routingu z podsiecią, umożliwiając jej dostęp do internetu.
resource "aws_route_table_association" "tic-tac-toe-rta" {
  subnet_id      = aws_subnet.tic-tac-toe-subnet.id
  route_table_id = aws_route_table.tic-tac-toe-rt.id
}
