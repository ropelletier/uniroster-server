variable "solution_stack_name"    { default = "64bit Amazon Linux 2018.03 v2.15.4 running Docker 19.03.6-ce" }
variable "autoscaling_min_size"   { default = 1 }
variable "autoscaling_max_size"   { default = 10 }
variable "elb_scheme"             { default = "internal" }
variable "app_port_protocol"      { default = "tcp" }
variable "name"                   { }
variable "app_name"               { }
variable "vpc_id"                 { }
variable "subnet_ids"             { }
variable "app_port"               { }
variable "ingress_app_cidr"       { }
variable "ingress_elb_cidr"       { }
variable "app_instance_type"      { }
variable "elb_subnet_ids"         { }
variable "db_hostname"            { }
variable "db_username"            { }
variable "db_password"            { }