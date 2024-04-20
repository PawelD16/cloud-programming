version: '3.8'

services:
  backend:
    image: paweld16/cloud-programming-backend:latest
    container_name: backend
    environment:
      - METHOD=${METHOD}
      - IP_ADDRESS=${IP_ADDRESS}
      - FRONTEND_PORT=${FRONTEND_PORT}
      - BACKEND_PORT=${BACKEND_PORT}
    ports:
      - "${BACKEND_PORT}:${BACKEND_PORT}"
    networks:
      - app-network

  frontend:
    image: paweld16/cloud-programming-frontend:latest
    container_name: frontend
    environment:
      - REACT_APP_METHOD=${METHOD}
      - REACT_APP_IP_ADDRESS=${IP_ADDRESS}
      - REACT_APP_FRONTEND_PORT=${FRONTEND_PORT}
      - REACT_APP_BACKEND_PORT=${BACKEND_PORT}
    ports:
      - "${FRONTEND_PORT}:${FRONTEND_PORT}"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
