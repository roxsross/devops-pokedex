output "frontend_url" {
  description = "url del front"
  value       = module.pokeverse.frontend_url
}

output "backend_url" {
  description = "url del backend"
  value       = module.pokeverse.backend_url
}

output "container_id_backend" {
  description = "container id del backend"
  value       = module.pokeverse.container_id_backend
}

output "container_id_frontend" {
  description = "container id del frontend"
  value       = module.pokeverse.container_id_frontend
}