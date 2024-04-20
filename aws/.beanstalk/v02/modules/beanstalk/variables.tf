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