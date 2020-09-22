terraform {
  required_version = ">= 0.12"
}

provider aws {
    region = var.aws_region
}

resource "aws_s3_bucket" "build_bucket" {
  bucket = var.build_artifact_bucket
  acl    = "private"
}

resource "aws_elastic_beanstalk_application" "uniroster-app" {
  name        = var.ebs_app_name
  description = "Beanstalk application"
}

module "aws-ebs-app" {
  source                = "../aws-ebs"

  environment           = var.environment
  prefix                = var.prefix 

  /*RDS*/
  allocated_storage     = var.allocated_storage
  rds_family            = var.rds_family
  engine                = var.engine
  identifier            = var.identifier
  instance_class        = var.instance_class
  multi_az              = var.multi_az
  
  /*EBS config*/
  app_instance_type     = var.app_instance_type
  ebs_app_name          = var.ebs_app_name
  autoscaling_min_size  = var.autoscaling_min_size
  autoscaling_max_size  = var.autoscaling_max_size

  PATH_TO_PUBLIC_KEY    = var.public_key

  RDS_DB_NAME           = var.RDS_DB_NAME
  RDS_USERNAME          = var.RDS_USERNAME
  RDS_PASSWORD          = var.RDS_PASSWORD

  transit_gateway_id    = var.transit_gateway_id
}

output "name" {
  value = aws_elastic_beanstalk_application.oneroster-app.name
}

output "ebs-cname" {
  value = module.aws-ebs-app.ebs-cname
}