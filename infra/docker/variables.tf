#### variables de terraform 

variable "app_version" {
  description = "Version of the application"
  type        = string
  default     = "latest"
}

variable "backend_path" {
    description = "path de directorio donde esta el backend"
    type        = string
}

variable "frontend_path" {
    description = "path de directorio donde esta el frontend"
    type        = string
}

variable "network_name" {
    description = "Name of the Docker network"
    type        = string
    default     = "pokeverse_network"
}

variable "backend_port" {
    description = "Puerto interno del backend"
    type        = number
    default     = 8080
}

variable "frontend_port" {
    description = "Puerto interno del frontend"
    type        = number
    default     = 3000
}

variable "url_pokeapi" {
  description = "api de pokemon"
  type = string
  default = "https://pokeapi.co/api/v2"
}