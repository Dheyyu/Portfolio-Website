resource "aws_acm_certificate" "website" {
  domain_name               = var.domain_name
  key_algorithm             = "RSA_2048"
  region                    = "us-east-1" #Required for CloudFront because CloudFront only supports certificates in the us-east-1 region
  subject_alternative_names = [var.domain_name, "www.${var.domain_name}", "*.${var.domain_name}"]
  validation_method         = "DNS"
  options {
    certificate_transparency_logging_preference = "ENABLED"
    export                                      = "DISABLED"
  }
}
