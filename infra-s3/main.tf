resource "aws_s3_bucket" "pokedex" {
  bucket = var.bucket_name

  tags = {
    Name        = var.bucket_name
    Environment = var.environment
    Project     = "devops-pokedex-v2"
    ManagedBy   = "terraform"
  }
}

resource "aws_s3_bucket_versioning" "pokedex" {
  bucket = aws_s3_bucket.pokedex.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "pokedex" {
  bucket = aws_s3_bucket.pokedex.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "pokedex" {
  bucket = aws_s3_bucket.pokedex.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
