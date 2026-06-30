# Despliegue Cloud Run — personal-tests-501015

## Desplegar

```bash
./scripts/deploy-cloudrun.sh
```

Usa **Cloud Build** (linux/amd64). No uses `docker build` en Mac sin `--platform linux/amd64` o obtendrás `exec format error` en Cloud Run.

## Local con Docker (revisores)

Sin cambios:

```bash
docker compose up --build
```

Abre [http://localhost](http://localhost). Datos en volúmenes Docker; primera ejecución sincroniza desde PokéAPI.

## Qué falló antes

| Error | Causa |
|-------|--------|
| GCSFuse + `Application exec likely failed` | Volumen GCS rompía el arranque → eliminado |
| `exec format error` en entrypoint | Imagen ARM (Mac) en Cloud Run amd64 → Cloud Build |
| `PERMISSION_DENIED` en Cloud Build | Transitorio; como Owner funciona |

## Configuración actual

- **min-instances=0** — escala a cero, despierta con petición
- **Datos** — dentro de la imagen (`public/data` + `public/pokemon` en build)
- **Sin volumen GCS** — más simple y estable
- **nginx** — puerto 8080, URL sin puerto visible

## URL

https://pokeapp-734252699708.europe-west1.run.app
