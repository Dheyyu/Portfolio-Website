output "github_deploy_role_arn" {
  description = "IAM role GitHub Actions assumes to deploy the site"
  value       = aws_iam_role.github_deploy.arn
}

output "site_bucket_name" {
  description = "S3 bucket that holds the site files"
  value       = aws_s3_bucket.website.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution to invalidate after deploys"
  value       = aws_cloudfront_distribution.website.id
}
