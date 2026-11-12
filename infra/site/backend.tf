terraform {
  backend "s3" {
    bucket       = "oladayo-portfolio-tfstate"
    key          = "site/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
