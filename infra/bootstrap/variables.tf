variable "state_bucket_name" {
  description = "Name of the S3 bucket that stores Terraform state"
  type        = string
  default     = "oladayo-portfolio-tfstate"
}

variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}