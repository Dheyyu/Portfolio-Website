resource "aws_s3_bucket" "website" {
  bucket = var.site_bucket_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {

    bucket_key_enabled       = true
    blocked_encryption_types = ["SSE-C"]

    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode(
    {
      Statement = [
        {
          Action    = "s3:GetObject"
          Effect    = "Allow"
          Principal = "*"
          Resource  = "${aws_s3_bucket.website.arn}/*"
          Sid       = "PublicReadForWebsite"
        },

        {
          Sid       = "AllowCloudFrontOAC"
          Effect    = "Allow"
          Principal = { Service = "cloudfront.amazonaws.com" }
          Action    = "s3:GetObject"
          Resource  = "${aws_s3_bucket.website.arn}/*"
          Condition = {
            StringEquals = {
              "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
            }
          }
        },
      ]
      Version = "2012-10-17"
    }
  )
}