locals {
  s3_origin_id = "s3-${var.site_bucket_name}"
}

resource "aws_cloudfront_distribution" "website" {
  default_root_object = "index.html"
  aliases             = [var.domain_name, "www.${var.domain_name}", "*.${var.domain_name}"]
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  retain_on_delete    = false
  staging             = false
  wait_for_deployment = true

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    default_ttl            = 0
    max_ttl                = 0
    min_ttl                = 0
    smooth_streaming       = false
    target_origin_id       = local.s3_origin_id
    trusted_key_groups     = []
    trusted_signers        = []
    viewer_protocol_policy = "redirect-to-https"
    grpc_config {
      enabled = false
    }
  }
  origin {
    connection_attempts         = 3
    connection_timeout          = 10
    domain_name                 = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                   = local.s3_origin_id
    origin_access_control_id    = aws_cloudfront_origin_access_control.website.id
    response_completion_timeout = 0
  }
  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.website.arn
    cloudfront_default_certificate = false
    minimum_protocol_version       = "TLSv1.2_2021"
    ssl_support_method             = "sni-only"
  }
}

resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.site_bucket_name}-oac"
  description                       = "OAC for the portfolio site bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
