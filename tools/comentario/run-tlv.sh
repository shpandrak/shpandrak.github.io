gcloud run deploy comentario-service \
  --image  me-west1-docker.pkg.dev/shpankids/my-docker-repo/comentario:v3.14.0-right \
  --platform managed \
  --region me-west1 \
  --port=80 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=1 \
  --update-env-vars="BASE_URL=https://comentario-service-181747930793.me-west1.run.app"






#  --set-secrets="/secrets.yaml=comentario-secrets:latest" \
#  --set-env-vars="SECRET_DATABASE_URL=postgresql://neondb_owner:npg_moVOwA9KcRD0@ep-rapid-snow-a213fi7y-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" \
#  --set-env-vars="COMENTARIO_ORIGIN=https://shpandrak.github.io" \
#  --set-env-vars="COMENTARIO_SECRET_KEY=caa38b9dc7c89c5a350d40045cefb921fc14dcedb28e01ff30b63e4a9dc06b04" \
#  --set-env-vars="SECRETS_FILE=/secrets.yaml"
