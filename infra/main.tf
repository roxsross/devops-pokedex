terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.6.2"
    }
  }
}

provider "docker" {
}

module "pokeverse" {
  source        = "./docker"
  backend_path  = "../backend"
  frontend_path = "../frontend"
  backend_port  = 8080
  frontend_port = 3000
  network_name  = "pokeverse_network_v2"

}