docker build -t comentario-with-add-secrets .
docker tag comentario-with-add-secrets me-west1-docker.pkg.dev/shpankids/my-docker-repo/comentario:v3.14.0-add-secrets
docker push  me-west1-docker.pkg.dev/shpankids/my-docker-repo/comentario:v3.14.0-add-secrets