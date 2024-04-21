variable "cname_prefix" {
  type = string
}

variable "backend_port" {
  type    = number
  default = 8080
}

variable "frontend_port" {
  type    = number
  default = 80
}

variable "method" {
  type    = string
  default = "http"
}
