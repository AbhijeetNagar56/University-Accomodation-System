provider "aws" {
  region = "us-east-1" # Or your closest free-tier region
}

# 1. Create a VPC
resource "aws_vpc" "uas_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "uas-vpc" }
}

# 2. Public Subnet
resource "aws_subnet" "uas_public_subnet" {
  vpc_id                  = aws_vpc.uas_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags = { Name = "uas-public-subnet" }
}

# 3. Internet Gateway for Traffic
resource "aws_internet_gateway" "uas_gw" {
  vpc_id = aws_vpc.uas_vpc.id
  tags = { Name = "uas-igw" }
}

# 4. Route Table
resource "aws_route_table" "uas_rt" {
  vpc_id = aws_vpc.uas_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.uas_gw.id
  }
}

resource "aws_route_table_association" "uas_rta" {
  subnet_id      = aws_subnet.uas_public_subnet.id
  route_table_id = aws_route_table.uas_rt.id
}

# 5. Security Group (Allows SSH, HTTP, and your custom app ports)
resource "aws_security_group" "uas_sg" {
  name   = "uas-security-group"
  vpc_id = aws_vpc.uas_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For learning purposes. Restrict to your IP for prod safety!
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 6. EC2 Instance (Free Tier Eligible)
resource "aws_instance" "uas_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS in us-east-1 (Verify for your region)
  instance_type = "t3.micro"             # Change to "t3.micro" if your region defaults to t3 for free tier
  subnet_id     = aws_subnet.uas_public_subnet.id
  vpc_security_group_ids = [aws_security_group.uas_sg.id]
  key_name      = "uas-key"              # Create this key-pair inside your AWS Console first

  root_block_device {
    volume_size = 20 # Up to 30GB is completely free tier eligible
    volume_type = "gp3"
  }

  tags = { Name = "uas-production-server" }
}

# 7. S3 Bucket (Free Tier up to 5GB storage)
resource "aws_s3_bucket" "uas_assets" {
  bucket        = "university-system-assets-unique-suffix-2026" # S3 names must be globally unique
  force_destroy = true
}

# Outputs for our Ansible integration script
output "server_public_ip" {
  value = aws_instance.uas_server.public_ip
}