#!/usr/bin/env bash
set -euo pipefail

PROJECT="personal-tests-501015"
REGION="europe-west1"
SERVICE="pokeapp"
REPO="pokeapp"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/${SERVICE}:latest"

echo "==> Proyecto: ${PROJECT} | Region: ${REGION}"

echo "==> Activando APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    --project="${PROJECT}"

echo "==> Artifact Registry..."
if ! gcloud artifacts repositories describe "${REPO}" \
    --location="${REGION}" --project="${PROJECT}" >/dev/null 2>&1; then
    gcloud artifacts repositories create "${REPO}" \
        --repository-format=docker \
        --location="${REGION}" \
        --project="${PROJECT}"
fi

echo "==> Build en Cloud Build (linux/amd64, incluye public/data si existe)..."
gcloud builds submit \
    --tag "${IMAGE}" \
    --project="${PROJECT}" \
    --region="${REGION}"

echo "==> Desplegando Cloud Run (min-instances=0, sin volumen GCS)..."
gcloud run deploy "${SERVICE}" \
    --project="${PROJECT}" \
    --region="${REGION}" \
    --image="${IMAGE}" \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --min-instances=0 \
    --max-instances=3 \
    --memory=1Gi \
    --cpu=1 \
    --timeout=3600 \
    --cpu-boost \
    --clear-volumes \
    --clear-volume-mounts \
    --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1"

URL="$(gcloud run services describe "${SERVICE}" \
    --project="${PROJECT}" \
    --region="${REGION}" \
    --format='value(status.url)')"

echo ""
echo "Desplegado: ${URL}"
