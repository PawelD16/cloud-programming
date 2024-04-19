variable "cname_prefix" {
  type = string
}

variable "backend_port" {
  type    = number
  default = 8080
}

variable "frontend_port" {
    type    = number
    default = 3000
}

variable "method" {
    type    = string
    default = "http"
}

variable "vpc_id" {
    type = string
}

variable "subnet_id" {
    type = string
}

locals {
    app_env = {
        METHOD          = "http"
        IP_ADDRESS      = "${var.cname_prefix}.us-east-1.console.aws.amazon.com"
        FRONTEND_PORT   = var.frontend_port
        BACKEND_PORT    = var.backend_port
  }
}