# PokéApp

Explorador de Pokémon desarrollado como prueba técnica. Consulta los **1025 Pokémon** de las nueve generaciones, filtra por tipo y generación, busca por nombre (incluyendo cadenas evolutivas), marca favoritos, lleva un registro de vistos y abre fichas detalladas con estadísticas, descripción y evoluciones.

## Demo en línea

**[https://pokeapp-734252699708.europe-west1.run.app/](https://pokeapp-734252699708.europe-west1.run.app/)**

> La demo está desplegada en **Google Cloud Run** con `min-instances=0` (escala a cero cuando no hay tráfico para reducir costes). Si la app lleva un rato sin usarse, **la primera carga puede tardar 15–30 segundos** mientras el contenedor despierta. Las peticiones siguientes son inmediatas.

## Tecnologías

- **Next.js 15** — App Router, renderizado híbrido
- **TypeScript** — tipado estricto en todo el dominio
- **Tailwind CSS 4** — estilos utility-first
- **TanStack Query v5** — caché y gestión de datos en cliente
- **Zustand** — estado global de filtros y búsqueda
- **Docker + nginx** — contenedor con proxy inverso (sin puerto visible en la URL)
- **Google Cloud Run** — despliegue en producción

## Funcionalidades

- Listado completo de 1025 Pokémon con imagen, tipos y generación
- **Scroll infinito** — carga de 25 Pokémon por lote al desplazarse
- Búsqueda en tiempo real que incluye evoluciones (ej.: buscar *pichu* muestra también Pikachu y Raichu)
- Filtros por **tipo**, **generación**, **solo favoritos** y **solo vistos**
- **Favoritos** y **vistos** persistidos en `localStorage`
- Ficha de detalle en **pantalla completa superpuesta** (el listado permanece montado debajo)
- URL compartible: `/?pokemon=25` o `/pokemon/25` (redirige al modal)
- Cadena evolutiva navegable dentro del modal
- Estadísticas visuales, descripción Pokédex y habilidades
- Al cerrar una ficha, se conservan scroll, filtros y lotes ya cargados

## Cómo ejecutar

### Con Docker

Requisitos: Docker y Docker Compose.

```bash
docker compose up --build
```

Abre **[http://localhost](http://localhost)** (puerto 80, sin `:3000` en la URL).

- En la **primera ejecución**, el contenedor descarga todos los datos desde [PokéAPI](https://pokeapi.co/) y los guarda en volúmenes persistentes (~5–10 min). No hace falta instalar Node.js ni pnpm.
- En **ejecuciones posteriores**, los volúmenes conservan los datos y el arranque es casi inmediato.
- nginx escucha en el puerto **8080** del contenedor (mapeado al **80** del host) y reenvía a Next.js en el puerto 3000.

Para borrar la caché y forzar una nueva descarga:

```bash
docker compose down -v
docker compose up --build
```

### Sin Docker

Requisitos: Node.js 20+ y pnpm.

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). La primera vez descarga los datos a disco; después usa la caché local.

### Comandos útiles

```bash
pnpm sync-data    # Forzar nueva descarga completa de datos e imágenes
pnpm sync-images  # Descargar solo imágenes faltantes
pnpm build        # Compilar para producción
pnpm start        # Servidor de producción
pnpm lint         # Comprobar estilo y tipos con ESLint
```

## Decisiones técnicas

### Caché local sin dependencia externa en runtime

En la primera ejecución, un script de sincronización descarga desde PokéAPI:

- JSON con listado, fichas individuales y mapa de familias evolutivas
- Imágenes de artwork oficial en `/pokemon/{id}.png`

Los archivos se guardan en `public/data/` y `public/pokemon/` (excluidos de git). A partir de ahí, la aplicación sirve todo desde disco local. TanStack Query añade una capa de caché en memoria durante la sesión.

### Modal en lugar de navegación a otra página

Al abrir un Pokémon, se superpone una capa a pantalla completa sobre el listado (`/?pokemon=ID`). El listado **no se desmonta**, por lo que no hace falta guardar ni restaurar scroll ni estado de filtros manualmente.

### Búsqueda con evoluciones

Durante la sincronización se precalcula un mapa de familias evolutivas (~542 cadenas). Al buscar un Pokémon, se expanden los resultados con todos los miembros de su familia evolutiva.

### Estado del listado con Zustand

Filtros y búsqueda viven en un store global en memoria (sin `localStorage`, según el enunciado). Favoritos y vistos usan un store aparte persistido en `localStorage`.

### Generación calculada por ID

La generación se determina por rangos de ID numérico en lugar de consultar `/pokemon-species` para cada Pokémon, reduciendo peticiones durante la sincronización.

### Infraestructura

- **Docker Compose** — un solo comando para revisores locales; volúmenes separados para JSON e imágenes
- **Google Cloud Run** — despliegue en producción con escala a cero; datos incluidos en la imagen
- **nginx** — proxy inverso; URL HTTPS sin puerto visible
- Cabeceras `Cache-Control: immutable` en assets estáticos

### Herramientas de IA

Se utilizaron herramientas de IA para la planificación de arquitectura y la generación del código base. Todo el código fue revisado, ajustado y comprendido antes de la entrega.

## Estructura del proyecto

```
src/
├── app/                    # Páginas y layout (listado + modal por URL)
├── components/
│   ├── pokemon/            # Tarjetas, grid, filtros, modal, detalle
│   └── ui/                 # Botones, iconos, spinner, badge
├── hooks/                  # TanStack Query y lógica de filtrado/scroll
├── lib/                    # Cliente de datos locales y utilidades
├── store/                  # Zustand (filtros + progreso del usuario)
└── types/                  # Tipos TypeScript del dominio
scripts/                    # Sincronización de datos y despliegue Cloud Run
nginx/                      # Configuración del proxy inverso
public/data/                # Datos locales (generados en runtime, no en git)
public/pokemon/             # Imágenes locales (generadas en runtime, no en git)
```
