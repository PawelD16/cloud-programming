# Tworzy Virtual Private Cloud, które pozwala na DNS i nazwy hostów.
# Włącza wsparcie dla DNS i nazw hostów DNS wewnątrz VPC
resource "aws_vpc" "tic_tac_toe_vpc" {
    cidr_block           = "10.0.0.0/16"
    enable_dns_support   = true
    enable_dns_hostnames = true
    tags = {
        Name = "tic_tac_toe_vpc"
    }
}

# Tworzy podsieć w VPC z automatycznym przydzielaniem IP publicznych oraz dla EC2
resource "aws_subnet" "tic_tac_toe_subnet" {
    vpc_id                  = aws_vpc.tic_tac_toe_vpc.id
    cidr_block              = "10.0.1.0/24"
    map_public_ip_on_launch = true 
    tags = {
        Name = "tic_tac_toe_subnet"
    }
}

# Tworzy grupę bezpieczeństwa z regułami dla ruchu przychodzącego (ingress) i wychodzącego (egress), umożliwiając jedynie ruch na niezbędnych portach.
# Zapewnia to bezpieczeństwo przed atakami na wolne porty.
resource "aws_security_group" "tic_tac_toe_sg" {
    name        = "tic_tac_toe_sg"
    vpc_id      = aws_vpc.tic_tac_toe_vpc.id
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

# Brama umożliwiające łączenie się VPC z Internetem
resource "aws_internet_gateway" "tic_tac_toe_igw" {
    vpc_id = aws_vpc.tic_tac_toe_vpc.id
    tags = {
        Name = "tic_tac_toe_igw"
    }
}

# Tworzy tabelę routingu dla VPC, dodając trasę domyślną przez bramę 
resource "aws_route_table" "tic_tac_toe_rt" { 
    vpc_id = aws_vpc.tic_tac_toe_vpc.id

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