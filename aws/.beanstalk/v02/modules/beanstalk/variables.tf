variable "cname_prefix" {
  type = string
}

variable "backend_port" {
  type = number
}

variable "frontend_port" {
  type = number
}

variable "method" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

locals {
  env_variables = {
    METHOD_ENV        = var.method
    FRONTEND_PORT_ENV = var.frontend_port
    BACKEND_PORT_ENV  = var.backend_port
  }
}
