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

module "network" {
  source = "./modules/network/"
}

module "beanstalk" {
  source            = "./modules/beanstalk/"
  cname_prefix      = var.cname_prefix
  ssh_key           = var.ssh_key
  vpc_id            = module.network.vpc_id
  subnet_id         = module.network.subnet_id
}
