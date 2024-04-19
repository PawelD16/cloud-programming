output "vpc_id" {
  value = aws_vpc.tic_tac_toe_vpc.id
}
output "subnet_id" {
  value = aws_subnet.tic_tac_toe_subnet.id
}
output "security_group_id" {
  value = aws_security_group.tic_tac_toe_sg.id
}