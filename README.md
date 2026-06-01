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

---

Hecho por **Jersy Baltazar** - [jersy.baltazar.c@gmail.com](mailto:jersy.baltazar.c@gmail.com)
