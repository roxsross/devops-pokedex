output "frontend_url" {
  description = "url del frontend"
  value = "http://localhost:${var.frontend_port}"
}

output "backend_url" {
  description = "url del backend"
  value = "http://localhost:${var.backend_port}"
}

output "container_id_backend" {
  description = "container id del backend"
  value = docker_container.backend.id
}

output "container_id_frontend" {
  description = "container id del frontend"
  value = docker_container.frontend.id
}