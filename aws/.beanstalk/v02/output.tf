output "public_dns" {
  value = aws_elastic_beanstalk_environment.tic_tac_toe_env.cname
}