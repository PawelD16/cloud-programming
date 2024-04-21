output "public_dns" {
  value = aws_elastic_beanstalk_environment.tic-tac-toe-env.cname
}
