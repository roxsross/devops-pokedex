# Documentación de Infraestructura - DevOps Pokédex V2

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Requisitos Previos](#requisitos-previos)
- [infra/ — Infraestructura Docker con Terraform](#infra--infraestructura-docker-con-terraform)
- [infra-s3/ — Bucket S3 con LocalStack y Terraform](#infra-s3--bucket-s3-con-localstack-y-terraform)
- [Limpieza de Recursos](#limpieza-de-recursos)

---

## Visión General

Este proyecto cuenta con dos módulos de infraestructura como código (IaC) gestionados con **Terraform**:

| Carpeta    | Propósito                                          | Provider                |
|------------|-----------------------------------------------------|-------------------------|
| `infra/`   | Despliegue de contenedores Docker (backend + frontend) | `kreuzwerker/docker` 3.6.2 |
| `infra-s3/`| Creación de bucket S3 usando LocalStack              | `hashicorp/aws` ~> 5.0  |

---

## Requisitos Previos

- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 1.0
- [Docker](https://docs.docker.com/get-docker/) instalado y corriendo
- [Docker Compose](https://docs.docker.com/compose/) (para LocalStack en `infra-s3`)

---

## infra/ — Infraestructura Docker con Terraform

### Descripción

Despliega la aplicación Pokédex completa (backend + frontend) como contenedores Docker usando el provider de Terraform para Docker. Utiliza un módulo local ubicado en `infra/docker/`.

### Arquitectura

```
infra/
├── main.tf              # Módulo principal, invoca el módulo docker
├── output.tf            # Outputs del módulo raíz
├── terraform.tfvars     # Variables de entorno (vacío, usa defaults)
└── docker/
    ├── main.tf          # Recursos: network, images, containers
    ├── variables.tf     # Variables del módulo
    ├── output.tf        # Outputs del módulo
    └── provider.tf      # Provider kreuzwerker/docker
```

### Recursos Creados

| Recurso                        | Descripción                                      |
|--------------------------------|--------------------------------------------------|
| `docker_network.pokeverse`     | Red bridge para comunicación entre contenedores   |
| `docker_image.backend`         | Imagen Docker del backend (build desde `../backend`) |
| `docker_image.frontend`        | Imagen Docker del frontend (build desde `../frontend`) |
| `docker_container.backend`     | Contenedor del backend (FastAPI)                  |
| `docker_container.frontend`    | Contenedor del frontend (Nginx + React)           |

### Variables

| Variable        | Tipo   | Default               | Descripción                     |
|-----------------|--------|------------------------|---------------------------------|
| `app_version`   | string | `latest`              | Tag de versión de las imágenes  |
| `backend_path`  | string | —                     | Ruta al directorio del backend  |
| `frontend_path` | string | —                     | Ruta al directorio del frontend |
| `network_name`  | string | `pokeverse_network`   | Nombre de la red Docker         |
| `backend_port`  | number | `8080`                | Puerto expuesto del backend     |
| `frontend_port` | number | `3000`                | Puerto expuesto del frontend    |
| `url_pokeapi`   | string | `https://pokeapi.co/api/v2` | URL de la PokéAPI        |

### Outputs

| Output              | Descripción                |
|---------------------|----------------------------|
| `frontend_url`      | URL de acceso al frontend  |
| `backend_url`       | URL de acceso al backend   |
| `container_id_backend`  | ID del contenedor backend  |
| `container_id_frontend` | ID del contenedor frontend |

### Uso

```bash
# 1. Ir a la carpeta de infraestructura
cd infra

# 2. Inicializar Terraform (descarga el provider de Docker)
terraform init

# 3. Revisar el plan de ejecución
terraform plan

# 4. Aplicar la infraestructura
terraform apply

# 5. Ver los outputs (URLs de acceso)
terraform output
```

Tras aplicar, la aplicación estará disponible en:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080

---

## infra-s3/ — Bucket S3 con LocalStack y Terraform

### Descripción

Crea un bucket S3 simulado usando **LocalStack** como emulador de servicios AWS. Ideal para desarrollo y testing local sin necesidad de una cuenta AWS real.

### Arquitectura

```
infra-s3/
├── provider.tf          # Provider AWS apuntando a LocalStack
├── main.tf              # Recursos del bucket S3
├── variables.tf         # Variables configurables
├── output.tf            # Outputs del bucket
├── terraform.tfvars     # Valores de las variables
└── compose.yml          # Docker Compose para levantar LocalStack
```

### Recursos Creados

| Recurso                                              | Descripción                                  |
|------------------------------------------------------|----------------------------------------------|
| `aws_s3_bucket.pokedex`                              | Bucket S3 principal                          |
| `aws_s3_bucket_versioning.pokedex`                   | Versionado habilitado en el bucket           |
| `aws_s3_bucket_server_side_encryption_configuration`  | Encriptación server-side AES256              |
| `aws_s3_bucket_public_access_block.pokedex`          | Bloqueo total de acceso público              |

### Variables

| Variable              | Tipo   | Default                  | Descripción                    |
|-----------------------|--------|--------------------------|--------------------------------|
| `region`              | string | `us-east-1`             | Región AWS simulada            |
| `localstack_endpoint` | string | `http://localhost:4566`  | Endpoint de LocalStack         |
| `bucket_name`         | string | `pokedex-bucket`        | Nombre del bucket S3           |
| `environment`         | string | `dev`                   | Ambiente de despliegue         |

### Outputs

| Output              | Descripción                      |
|---------------------|----------------------------------|
| `bucket_id`         | ID del bucket S3                 |
| `bucket_arn`        | ARN del bucket S3                |
| `bucket_domain_name`| Domain name del bucket S3        |

### Configuración del Provider

El provider AWS está configurado para comunicarse con LocalStack:

- **`s3_use_path_style = true`** — Necesario para que LocalStack resuelva correctamente las peticiones S3 usando path-style (`http://localhost:4566/bucket`) en lugar de virtual-hosted-style.
- **Credenciales dummy** — `access_key` y `secret_key` con valor `test` (LocalStack no valida credenciales reales).
- **Endpoints personalizados** — S3 y STS apuntan al endpoint de LocalStack.

### Uso

```bash
# 1. Ir a la carpeta de infra-s3
cd infra-s3

# 2. Levantar LocalStack con Docker Compose
docker compose up -d

# 3. Verificar que LocalStack está corriendo
curl http://localhost:4566/_localstack/health

# 4. Inicializar Terraform
terraform init

# 5. Revisar el plan de ejecución
terraform plan

# 6. Aplicar la infraestructura
terraform apply

# 7. Verificar el bucket creado con AWS CLI (apuntando a LocalStack)
aws --endpoint-url=http://localhost:4566 s3 ls

# 8. Ver los outputs de Terraform
terraform output
```

### Verificación del Bucket

```bash
# Listar buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# Subir un archivo de prueba
aws --endpoint-url=http://localhost:4566 s3 cp README.md s3://pokedex-bucket/

# Listar contenido del bucket
aws --endpoint-url=http://localhost:4566 s3 ls s3://pokedex-bucket/
```

---

## Limpieza de Recursos

### Destruir infraestructura Docker (infra/)

```bash
cd infra
terraform destroy
```

### Destruir bucket S3 y detener LocalStack (infra-s3/)

```bash
cd infra-s3

# Destruir recursos de Terraform
terraform destroy

# Detener LocalStack
docker compose down
```

### Limpiar archivos generados por Terraform

Para eliminar archivos de caché y estado generados por Terraform en ambas carpetas:

```bash
# Desde la raíz del proyecto
rm -rf infra/.terraform infra-s3/.terraform
rm -f infra/.terraform.lock.hcl infra/terraform.tfstate infra/terraform.tfstate.backup
rm -f infra-s3/.terraform.lock.hcl infra-s3/terraform.tfstate infra-s3/terraform.tfstate.backup
```

> **Nota:** Eliminar `terraform.tfstate` hará que Terraform pierda el tracking de los recursos desplegados. Solo hazlo si ya destruiste la infraestructura o si es un entorno de desarrollo local.
