# SupplyChainX - Trazabilidad de Cadena de Suministro

Aplicación full-stack para **rastrear productos a lo largo de toda la cadena de suministro**: desde el fabricante, pasando por los distribuidores, hasta el minorista que vende al cliente final. Cada movimiento de mercancía queda registrado y se visualiza geográficamente en un mapa interactivo.

> Proyecto desarrollado por **Jersy Baltazar** - Full-Stack Developer.


## El problema que resuelve

En una cadena de suministro real intervienen múltiples actores y un mismo producto puede pasar por varios almacenes antes de llegar al consumidor. Sin un sistema centralizado es difícil responder preguntas como:

- ¿Dónde está físicamente mi inventario en este momento?
- ¿Cuánto stock tengo en cada almacén?
- ¿Qué recorrido siguió un producto desde que se fabricó hasta que se vendió?

**SupplyChainX** modela este dominio con tres roles (**Fabricante**, **Distribuidor** y **Minorista**) y permite registrar productos, gestionar almacenes geolocalizados, mover inventario entre ellos (transferencias y ventas) y **visualizar el flujo completo del producto sobre un mapa**.

## Funcionalidades

- **Autenticación** con credenciales y Google (NextAuth).
- **Roles** de Fabricante, Distribuidor y Minorista, cada uno con su propio inventario.
- **Gestión de productos** con carga de imágenes.
- **Almacenes geolocalizados**: selección de ubicación en mapa interactivo y búsqueda de direcciones (centrado en Perú).
- **Movimiento de inventario**: agregar stock, transferir entre almacenes y registrar ventas.
- **Flujo del producto**: mapa que dibuja el recorrido (origen a destino) y las cantidades movidas entre almacenes, con leyenda explicativa.
- **Internacionalización ES/EN** con selector de idioma (next-intl).
- **Feedback de usuario** con notificaciones (toasts), estados de carga y validación de formularios en tiempo real.

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| UI | Tailwind CSS, Shadcn UI, diseño atómico (atoms/molecules/organisms), Sonner (toasts) |
| i18n | next-intl (ES/EN) |
| Mapas | Mapbox GL, react-map-gl |
| Backend | NestJS, GraphQL (Apollo) |
| Base de datos | PostgreSQL + Prisma ORM |
| Autenticación | NextAuth |
| Formularios | React Hook Form + Zod |
| Monorepo | Nx + pnpm workspaces |
| Almacenamiento | Firebase Storage (imágenes) |

## Arquitectura

Monorepo gestionado con **Nx**, separado en aplicaciones y librerías reutilizables:

```
apps/
  web/          # Frontend Next.js (puerto 3001)
  api/          # Backend NestJS + GraphQL + Prisma
libs/
  ui/           # Componentes de interfaz (diseño atómico)
  forms/        # Esquemas Zod + hooks de React Hook Form
  network/      # Cliente GraphQL, queries y server actions
  util/         # Hooks y utilidades compartidas
```

**Modelo de datos** (resumido): un `User` puede tener perfiles de `Manufacturer`, `Distributor` y `Retailer`. Cada perfil posee `Warehouse`s (con su `Location`), que contienen `Inventory` de `Product`s. Los movimientos generan `Transaction`s entre almacenes de origen y destino.

## Puesta en marcha (local)

### Requisitos previos
- Node.js
- pnpm
- Docker (para la base de datos PostgreSQL)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jersybaltazar/supply-chain-x
cd supply-chain-x

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno (ver seccion "Variables de entorno")
#    Copia cada .env.example a .env y completa los valores.
```

### Ejecutar en desarrollo

```bash
# Backend (API + base de datos) - desde apps/api
cd apps/api
docker compose up -d          # levanta PostgreSQL
pnpm prisma migrate dev       # aplica el esquema
npx prisma db seed            # (opcional) carga datos de ejemplo en Peru
pnpm dev                      # arranca la API (puerto 3000)

# Frontend - desde apps/web (en otra terminal)
cd apps/web
pnpm dev                      # http://localhost:3001
```

## Datos de ejemplo (seed)

El script `apps/api/prisma/seed/index.ts` carga una **cuenta demo** que actúa como
fabricante, distribuidor y minorista a la vez, con productos peruanos, almacenes en
Lima, Arequipa y Cusco, e inventario y transacciones que forman un flujo completo
(fabricante a distribuidor a minorista). Así el mapa de "Flujo del producto" se ve
poblado de inmediato.

Ejecutar desde `apps/api`:

```bash
npx prisma db seed
```

Características del seed:
- Es **idempotente**: solo gestiona los datos de la cuenta demo, no borra lo que crees a mano.
- Credenciales de la cuenta demo:
  - Correo: `demo@supplychainx.pe`
  - Contraseña: `demo123`

## Internacionalización

La interfaz soporta **español e inglés** mediante next-intl, con un selector de
idioma en la barra de navegación. La preferencia se guarda en una cookie
(`NEXT_LOCALE`). Los textos viven en `apps/web/messages/{es,en}.json`. Para agregar
un texto nuevo hay que añadir la clave en ambos archivos.

## Variables de entorno

### apps/web (frontend)

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL **base** de la API, SIN `/graphql` (el código lo agrega solo). Ej. `https://tu-api.onrender.com` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token público de Mapbox |
| `GOOGLE_CLIENT_ID` | OAuth de Google |
| `GOOGLE_CLIENT_SECRET` | OAuth de Google |
| `NEXTAUTH_SECRET` | Secreto de NextAuth. **Debe ser igual a `JWT_SECRET` de la API** |
| `NEXTAUTH_URL` | URL pública del frontend (ej. `https://tu-app.vercel.app`) |

### apps/api (backend)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (Supabase) |
| `JWT_SECRET` | Secreto para verificar el token. **Debe ser igual a `NEXTAUTH_SECRET`** |
| `INTERNAL_API_SECRET` | Secreto para llamadas internas servidor a servidor |

## Despliegue (monorepo)

El proyecto se despliega en tres servicios: base de datos en **Supabase**, API en
**Render** y frontend en **Vercel**. La clave en un monorepo pnpm es indicar a cada
plataforma el directorio correcto y que use pnpm con corepack.

### 1. Base de datos - Supabase

1. Crea un proyecto en Supabase.
2. En Project Settings, Database, copia la connection string (usa la URL de
   "Connection pooling" para producción).
3. Ese valor será `DATABASE_URL` en la API.

### 2. API - Render

1. New, Web Service, conecta el repositorio de GitHub.
2. **Root Directory:** deja la raíz del repo (es un monorepo).
3. **Build Command** (NO uses `corepack enable`: el filesystem de Render es de
   solo lectura y falla con `EROFS`. Se compila `@foundation/util` primero porque
   la API la importa en runtime):
   ```bash
   pnpm install && pnpm --filter @foundation/util build && pnpm --filter @foundation/api exec prisma generate && pnpm --filter @foundation/api exec prisma migrate deploy && pnpm --filter @foundation/api build
   ```
4. **Start Command:**
   ```bash
   node apps/api/dist/main.js
   ```
5. **Variables de entorno:** `DATABASE_URL`, `JWT_SECRET`, `INTERNAL_API_SECRET`.
6. **Versión de Node:** el repo incluye un archivo `.node-version` con `20.18.1`.
   Es importante NO usar Node 24: NestJS 9 utiliza APIs que Node 24 ya removió y el
   build falla con `(0, util_1.isObject) is not a function`.
7. La API queda expuesta en una URL tipo `https://tu-api.onrender.com`. En Vercel,
   `NEXT_PUBLIC_API_URL` debe ser esa URL base **sin** `/graphql` (el código lo
   agrega automáticamente).

Nota: el `migrate deploy` del build aplica las migraciones en la base de Supabase.
El seed no se ejecuta automáticamente; si quieres datos demo en producción, corre
`npx prisma db seed` una vez de forma manual (por ejemplo desde una shell de Render
o localmente apuntando `DATABASE_URL` a Supabase).

### 3. Frontend - Vercel

1. Importa el repositorio en Vercel.
2. **Root Directory:** `apps/web`.
3. El repo incluye `apps/web/vercel.json` que fuerza pnpm y Next.js:
   ```json
   { "framework": "nextjs", "installCommand": "pnpm install", "buildCommand": "next build" }
   ```
   Esto evita que la autodetección de Nx use `npm install --prefix=../..` (que falla
   con "No Next.js version detected", porque npm no entiende las dependencias
   `workspace:*`).
4. **Variables de entorno:** `NEXT_PUBLIC_API_URL` (URL base de Render, **sin**
   `/graphql`), `NEXT_PUBLIC_MAPBOX_TOKEN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
5. Recuerda que `NEXTAUTH_SECRET` (Vercel) y `JWT_SECRET` (Render) deben tener el
   mismo valor, de lo contrario la API rechazará los tokens.

> Importante: este es un proyecto **pnpm**. No debe existir `package-lock.json`
> en el repo; si aparece, Vercel asumirá npm e instalará desde la raíz, fallando
> con "No Next.js version detected".

### Orden recomendado   

1. Crear la base en Supabase y obtener `DATABASE_URL`.
2. Desplegar la API en Render (con migraciones) y obtener su URL pública.
3. Desplegar el frontend en Vercel apuntando `NEXT_PUBLIC_API_URL` a la API.
4. En la consola de Google Cloud, agregar la URL de Vercel a los "Authorized redirect
   URIs" del cliente OAuth (`https://tu-app.vercel.app/api/auth/callback/google`).

## Roadmap

- [x] Internacionalización ES/EN con next-intl.
- [x] Datos de ejemplo (seed) y manejo de errores con toasts.
- [ ] Deploy público (Vercel + Render + Supabase).
- [ ] Dashboard con métricas y gráficos (stock total, alertas de bajo inventario, transacciones por mes).
- [ ] Pruebas automatizadas (Vitest / Playwright) e integración continua.

## Licencia

Proyecto de portafolio con fines educativos y demostrativos.

---

Hecho por **Jersy Baltazar** - [jersy.baltazar.c@gmail.com](mailto:jersy.baltazar.c@gmail.com)
