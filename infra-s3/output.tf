output "bucket_id" {
  description = "ID del bucket S3"
  value       = aws_s3_bucket.pokedex.id
}

output "bucket_arn" {
  description = "ARN del bucket S3"
  value       = aws_s3_bucket.pokedex.arn
}

output "bucket_domain_name" {
  description = "Domain name del bucket S3"
  value       = aws_s3_bucket.pokedex.bucket_domain_name
}
