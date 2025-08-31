# Dockerfile
# Use the official amd64 Comentario image as a base
FROM --platform=linux/amd64 registry.gitlab.com/comentario/comentario:v3.14.0

# Copy your configuration files into the correct directory inside the container
#COPY comentario.conf /etc/comentario/comentario.conf
COPY secrets-gcloud.yaml /etc/comentario/secrets.yaml
COPY secrets-gcloud.yaml /secrets.yaml
COPY secrets-gcloud.yaml secrets.yaml