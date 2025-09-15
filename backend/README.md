# Backend del Proyecto Lubricentro Renault

Este es el backend de la aplicación para el Lubricentro Renault, construido con Node.js, Express y TypeScript. Utiliza Prisma como ORM para interactuar con una base de datos PostgreSQL. Su función principal es gestionar usuarios, vehículos, servicios y reservas.

## Estructura del Proyecto

El código está organizado en las siguientes carpetas principales:

*   **`src/`**: Contiene el código fuente en TypeScript.
    *   `app.ts`: Punto de entrada de la aplicación.
    *   `config/`: Archivos de configuración, como el cliente de Prisma.
    *   `controllers/`: Lógica para manejar las solicitudes HTTP.
    *   `models/`: Interfaz con la base de datos a través de Prisma.
    *   `middlewares/`: Funciones que procesan las solicitudes antes de los controladores (ej. autenticación, validación).
    *   `routes/`: Define las rutas de la API.
    *   `types/`: Definiciones de tipos de TypeScript.
    *   `validations/`: Esquemas de validación de datos usando Zod.
*   **`prisma/`**: Contiene el esquema de la base de datos (`schema.prisma`) y las migraciones.
*   **`dist/`**: Código JavaScript transpilado, listo para ejecución.

## Instalación y Configuración

Para poner en marcha el backend:

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL_DEL_REPOSITORIO]
    cd [nombre_de_la_carpeta_backend]
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configuración de la Base de Datos:**
    *   Crea un archivo `.env` en la raíz de la carpeta `backend`.
    *   Define `DATABASE_URL` con la cadena de conexión a tu base de datos PostgreSQL.

    Ejemplo de `.env`:
    ```
    DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@db.tu_host_supabase.supabase.co:5432/postgres"
    ```
    Reemplaza `TU_CONTRASEÑA` con la contraseña real de tu base de datos.

4.  **Generar el cliente de Prisma y ejecutar migraciones:**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

## Ejecutar la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

## Validaciones de Datos con Zod

La API utiliza la librería **Zod** para la validación de esquemas. Esto asegura la integridad y seguridad de los datos al definir la estructura y restricciones esperadas para las entradas de la API.

Los esquemas de validación se encuentran en `src/validations/` y se aplican a los endpoints a través de un middleware genérico (`src/middlewares/validation.ts`), garantizando que solo los datos válidos sean procesados.

Esto mejora la robustez y fiabilidad de la API, previniendo errores y ataques de inyección de datos.
