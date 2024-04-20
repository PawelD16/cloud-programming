resource "aws_s3_bucket" "tic-tac-toe-app" {
    bucket = "tic-tac-toe-terraform"
    acl    = "private"
    tags = {
        Name = "tic-tac-toe-s3"
    }
}

data "template_file" "docker-compose" {
  template = file("${path.module}/docker-compose.tpl")

  vars = {
    METHOD          = var.method
    IP_ADDRESS      = var.cname_prefix
    FRONTEND_PORT   = var.frontend_port
    BACKEND_PORT    = var.backend_port
  }
}

resource "local_file" "docker-compose-yml" {
  content  = data.template_file.docker-compose.rendered
  filename = "${path.module}/docker-compose.yml"
}

resource "aws_s3_bucket_object" "tic-tac-toe-deployment" {
    bucket = aws_s3_bucket.tic-tac-toe-app.bucket
    source = local_file.docker-compose-yml.filename
    key    = "docker-compose.yml"
    depends_on = [local_file.docker-compose-yml]
}

resource "aws_elastic_beanstalk_application" "tic-tac-toe-app" {
    name        = "tic-tac-toe-app"
    description = "Simple ASP .NET Core + React tic tac toe game"
}

resource "aws_elastic_beanstalk_application_version" "tic-tac-toe-app" {
    name        = "tic-tac-toe-app"
    application = aws_elastic_beanstalk_application.tic-tac-toe-app.name
    description = "Simple ASP .NET Core + React tic tac toe game"
    key         = "docker-compose.yml"
    bucket      = aws_s3_bucket.tic-tac-toe-app.bucket
    depends_on  = [aws_s3_bucket_object.tic-tac-toe-deployment]
}


resource "aws_elastic_beanstalk_environment" "tic-tac-toe-env" {
    name                = "tic-tac-toe-env"
    application         = aws_elastic_beanstalk_application.tic-tac-toe-app.id
    solution_stack_name = "64bit Amazon Linux 2023 v4.3.0 running Docker"
    tier                = "WebServer"
    version_label       = aws_elastic_beanstalk_application_version.tic-tac-toe-app.name
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

    ## Service role
    setting {
        namespace = "aws:elasticbeanstalk:environment"
        name      = "ServiceRole"
        value     = "LabRole"
    }

    ## Key pair
    setting {
        namespace = "aws:autoscaling:launchconfiguration"
        name      = "EC2KeyName"
        value     = "vockey"
    }

    # Add listener port for backend 
    setting {
        namespace = "aws:elb:listener:8080"
        name      = "ListenerProtocol"
        value     = "HTTP"
    }

    # Define public IP
    setting {
        namespace = "aws:ec2:vpc"
        name      = "AssociatePublicIpAddress"
        value     = "true"
    }

    # dynamic "setting" {
    #    for_each = local.app_env
    #    content {
    #        namespace = "aws:elasticbeanstalk:application:environment"
    #        name      = setting.key
    #        value     = setting.value
    #    }
    # }
}
