# Catálogo FSO

Catálogo digital y panel de administración para FSO Productos de Limpieza.

- **Público** (`/`): catálogo de productos por categoría/subcategoría, sin precios, con botón de contacto por WhatsApp.
- **Admin** (`/admin`): panel protegido por contraseña para cargar, editar y borrar productos, subcategorías y categorías, y generar un PDF imprimible del catálogo.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Supabase](https://supabase.com) (Postgres) como base de datos
- Desplegado en [Vercel](https://vercel.com)

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Necesita un archivo `.env.local` con las variables de Supabase y de autenticación del admin — ver `.env.example`.

## Historia del proyecto

El registro de decisiones original (antes de la migración a Next.js) está en [`readme.txt`](./readme.txt). La versión estática original (HTML/CSS/JS puro, sin base de datos) quedó archivada en [`legacy/`](./legacy).
