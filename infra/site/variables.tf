variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "site_bucket_name" {
  description = "Name of the S3 bucket for my portfolio website"
  type        = string
  default     = "oladayo-portfolio-website"
}

variable "domain_name" {
  description = "Root domain name for the portfolio website"
  type        = string
  default     = "oladayoayorinde.com"
}
