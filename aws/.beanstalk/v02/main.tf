# Definicja dostawcy i wersji konfiguracji 
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

module "network" {
  source = "./modules/network/"
}

module "beanstalk" {
  source        = "./modules/beanstalk/"
  cname_prefix  = var.cname_prefix
  vpc_id        = module.network.vpc_id
  subnet_id     = module.network.subnet_id
  backend_port  = var.backend_port 
  frontend_port = var.frontend_port
  method        = var.method
}
