resource "aws_s3_bucket" "tic-tac-toe-bucket-resource" {
  bucket = "tic-tac-toe-docker-compose-bucket"
  # acl    = "private"
  tags = {
    Name = "tic-tac-toe-s3"
  }
}

data "archive_file" "docker-compose-zip" {
  type        = "zip"
  source_file = "${path.module}/docker-compose.yml"
  output_path = "${path.module}/docker-compose.zip"
}

resource "aws_s3_object" "tic-tac-toe-deployment" {
  bucket = aws_s3_bucket.tic-tac-toe-bucket-resource.bucket
  source = data.archive_file.docker-compose-zip.output_path
  key    = "docker-compose.zip"

  metadata = {
    last_updated = timestamp()
  }

  depends_on = [data.archive_file.docker-compose-zip]
}

resource "aws_elastic_beanstalk_application" "tic-tac-toe-app" {
  name        = "tic-tac-toe-eb-app"
  description = "Simple ASP .NET Core + React tic tac toe game"
}

resource "aws_elastic_beanstalk_application_version" "tic-tac-toe-app-version" {
  name        = "tic-tac-toe-app-version"
  application = aws_elastic_beanstalk_application.tic-tac-toe-app.name
  description = "Simple ASP .NET Core + React tic tac toe game"
  key         = "docker-compose.zip"
  bucket      = aws_s3_bucket.tic-tac-toe-bucket-resource.bucket
  depends_on  = [aws_s3_object.tic-tac-toe-deployment]
}

resource "aws_elastic_beanstalk_environment" "tic-tac-toe-env" {
  name                = "tic-tac-toe-eb-env"
  application         = aws_elastic_beanstalk_application.tic-tac-toe-app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.3.0 running Docker"
  tier                = "WebServer"
  version_label       = aws_elastic_beanstalk_application_version.tic-tac-toe-app-version.name
  cname_prefix        = var.cname_prefix

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "LabInstanceProfile"
  }

  # Add vpc and subnet
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = var.subnet_id
  }

  # Define instanceType
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  # Service role
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "LabRole"
  }

  # Key pair
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "EC2KeyName"
    value     = "vockey"
  }

  # Listener setting for backend and frontend
  setting {
    namespace = "aws:elb:listener:${var.backend_port}"
    name      = "ListenerProtocol"
    value     = "HTTP"
    resource  = "AWSEBV2LoadBalancerListener"
  }
  
  setting {
    namespace = "aws:elb:listener:${var.frontend_port}"
    name      = "ListenerProtocol"
    value     = "HTTP"
    resource  = "AWSEBV2LoadBalancerListener"
  }

  # Define public IP
  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }

  # environment variables for docker-compose.yml
  dynamic "setting" {
    for_each = local.env_variables
    content {
      namespace = "aws:elasticbeanstalk:application:environment"
      name      = setting.key
      value     = setting.value
    }
  }
}

resource "null_resource" "update_eb_env" {
  triggers = {
    cname = aws_elastic_beanstalk_environment.tic-tac-toe-env.cname
  }

  provisioner "local-exec" {
    command = "aws elasticbeanstalk update-environment --environment-name '${aws_elastic_beanstalk_environment.tic-tac-toe-env.name}' --option-settings '[{\"Namespace\":\"aws:elasticbeanstalk:application:environment\",\"OptionName\":\"IP_ADDRESS_ENV\",\"Value\":\"${aws_elastic_beanstalk_environment.tic-tac-toe-env.cname}\"}]'"
  }
}
