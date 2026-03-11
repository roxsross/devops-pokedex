####### recursos #########

##crear recurso de red docker " docker network"
resource "docker_network" "pokeverse" {
  name = var.network_name
  driver = "bridge"
}

##crear recurso para construir imagen docker "docker build" para backend y frontend

resource "docker_image" "backend" {
  name         = "backend:${var.app_version}"
  build {
    context    = var.backend_path
    dockerfile = "Dockerfile"
  }
}

resource "docker_image" "frontend" {
  name         = "frontend:${var.app_version}"
  build {
    context    = var.frontend_path
    dockerfile = "Dockerfile"
  }
}

### crear recurso para corre el contenedor de backend y frontend "docker run" docker run -d -p 8080:8080 --name backend --network pokeverse_network backend:latest

resource "docker_container" "backend" {
  name  = "backend"
  image = docker_image.backend.name
  networks_advanced {
    name = docker_network.pokeverse.name
  }
  env = [
    "POKEAPI_BASE_URL=${var.url_pokeapi}",
    "CACHE_TTL=300",
    "WORKERS=2"
  ]
  ports {
    internal = 8000
    external = var.backend_port
  }
}

resource "docker_container" "frontend" {
  name  = "frontend"
  image = docker_image.frontend.name
  networks_advanced {
    name = docker_network.pokeverse.name
  }
  ports {
    internal = 80
    external = var.frontend_port
  }
  depends_on = [docker_image.backend]
}