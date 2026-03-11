variable "region" {
  description = "Region de AWS para LocalStack"
  type        = string
  default     = "us-east-1"
}

variable "localstack_endpoint" {
  description = "Endpoint de LocalStack"
  type        = string
  default     = "http://localhost:4566"
}

variable "bucket_name" {
  description = "Nombre del bucket S3"
  type        = string
  default     = "pokedex-bucket"
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
  default     = "dev"
}
