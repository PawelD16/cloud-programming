output "vpc_id" {
  value = aws_vpc.tic-tac-toe-vpc.id
}
output "subnet_id" {
  value = aws_subnet.tic-tac-toe-subnet.id
}
output "security_group_id" {
  value = aws_security_group.tic-tac-toe-sg.id
}
