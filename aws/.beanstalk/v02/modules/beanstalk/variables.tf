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
        METHOD          = var.method
        IP_ADDRESS      = aws_elastic_beanstalk_environment.tic_tac_toe_env.cname
        FRONTEND_PORT   = var.frontend_port
        BACKEND_PORT    = var.backend_port
  }
}