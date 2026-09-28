# Plataforma de Eventos e Inscripciones
### Proyecto del curso de Programación Backend II: Diseño y Arquitectura Backend de CoderHouse

## 1. Descripción del proyecto

**Plataforma de Eventos e Inscripciones** es una API REST desarrollada con Node.js y Express, orientada a la gestión de cursos, capacitaciones y actividades de formación, permitiendo administrar los eventos formativos y las inscripciones de los participantes.

El proyecto se desarrolla en el marco de la materia **Backend II** y tiene como objetivo construir una aplicación backend escalable, organizada mediante una arquitectura por capas y preparada para incorporar progresivamente nuevas funcionalidades.

Esta primera pre-entrega se centra en el refactor arquitectónico inicial y en la configuración de la infraestructura básica del servidor. Se establece la estructura de directorios, se separan las responsabilidades de la aplicación y se definen los primeros endpoints para verificar su funcionamiento.

## 2. Tecnologías utilizadas

* **Node.js:** entorno de ejecución de JavaScript.
* **Express:** framework para el desarrollo de la API REST.
* **ECMAScript Modules (ESM):** sistema de módulos mediante `import` y `export`.
* **dotenv:** gestión de variables de entorno.
* **MongoDB:** base de datos prevista para las próximas etapas del proyecto.

## 3. Arquitectura del proyecto

La aplicación utiliza una arquitectura organizada por capas, con el objetivo de separar las responsabilidades y facilitar el mantenimiento, las pruebas y la incorporación de nuevas funcionalidades.

La estructura inicial del proyecto es la siguiente:

```text
proyecto-eventos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── health.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   └── utils/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Responsabilidades de las capas

| Directorio / archivo | Responsabilidad                                                      |
| -------------------- | -------------------------------------------------------------------- |
| `src/app.js`         | Configuración de Express y registro de los middlewares y las rutas.  |
| `src/server.js`      | Inicialización del servidor HTTP y definición del puerto de escucha. |
| `src/config/`        | Configuración de la aplicación y de los servicios externos.          |
| `src/routes/`        | Definición de los endpoints y su vinculación con los controladores.  |
| `src/controllers/`   | Recepción de solicitudes HTTP y construcción de las respuestas.      |
| `src/services/`      | Implementación de la lógica de negocio.                              |
| `src/repositories/`  | Abstracción del acceso a los datos.                                  |
| `src/dao/`           | Implementación de las operaciones de acceso a datos.                 |
| `src/models/`        | Definición de las entidades principales del dominio.                 |
| `src/middlewares/`   | Funciones intermedias para el procesamiento de solicitudes.          |
| `src/utils/`         | Funciones auxiliares reutilizables.                                  |

La separación entre `app.js` y `server.js` permite mantener desacoplada la configuración de la aplicación del proceso de inicialización del servidor.

## 4. Requisitos previos

Para ejecutar el proyecto se requiere:

* Node.js.
* npm, incluido con Node.js.
* Git.

MongoDB se utilizará en las siguientes etapas, cuando se incorpore la persistencia de datos.

## 5. Instalación

Clonar el repositorio:

```bash
git clone https://github.com/fernandosalomon/backend2-coderhouse.git
```

Ingresar al directorio del proyecto:

```bash
cd backend2-coderhouse
```

Instalar las dependencias:

```bash
npm install
```

## 6. Configuración de variables de entorno

El proyecto utiliza `dotenv` para cargar las variables de entorno desde un archivo `.env`.

Crear el archivo a partir de la plantilla incluida en el repositorio:

```bash
cp .env.example .env
```

Configurar las siguientes variables:

```dotenv
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
```

### Descripción de las variables

| Variable     | Descripción                                              |
| ------------ | -------------------------------------------------------- |
| `PORT`       | Puerto en el que se ejecutará el servidor.               |
| `NODE_ENV`   | Entorno de ejecución de la aplicación.                   |
| `MONGO_URL`  | URL de conexión a MongoDB, prevista para futuras etapas. |
| `JWT_SECRET` | Clave secreta que se utilizará para firmar tokens JWT.   |

**Importante:** el archivo `.env` contiene configuración local y no debe subirse al repositorio. Para compartir la configuración necesaria se incluye `.env.example`, sin credenciales ni secretos reales.

## 7. Ejecución

Iniciar el servidor con el comando:

```bash
npm start
```

Para ejecutar el proyecto en modo desarrollo, si se encuentra configurado el script correspondiente:

```bash
npm run dev
```

El servidor utilizará el puerto definido mediante la variable de entorno `PORT`.

Si no se especifica un puerto, se utilizará el valor predeterminado definido en la aplicación.

## 8. Endpoints disponibles

En esta primera etapa se implementan los endpoints básicos para verificar el funcionamiento del servidor y establecer la estructura inicial de los recursos principales.

### 8.1. Health check

**Método:** `GET`

**Ruta:** `/api/health`

Permite verificar que el servidor se encuentra activo.

Respuesta exitosa — `200 OK`:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### 8.2. Listado de eventos

**Método:** `GET`

**Ruta:** `/api/events`

Devuelve el listado de eventos. En esta etapa inicial, el endpoint responde con una lista vacía, ya que todavía no se implementaron la persistencia ni la lógica de gestión de eventos.

Respuesta exitosa — `200 OK`:

```json
{
  "status": "success",
  "payload": []
}
```

### 8.3. Rutas de sesiones

Se establece la estructura inicial del recurso `sessions`, con su correspondiente archivo de rutas y controlador.

En esta pre-entrega no se implementan operaciones de autenticación ni gestión de sesiones. El recurso queda preparado para incorporar estas funcionalidades en las siguientes etapas.

## 9. Modelos iniciales

Se incluyen los archivos base correspondientes a las entidades principales del sistema.

### User

Representa a los usuarios de la plataforma.

Se prevé incorporar campos como:

* `firstname`: nombre del usuario.
* `lastname`: apellido del usuario.
* `email`: dirección de correo electrónico.
* `password`: contraseña almacenada mediante un mecanismo de hash.
* `role`: rol del usuario dentro de la plataforma.

### Event

Representa los eventos disponibles en la plataforma.

Se prevé incorporar campos como:

* `title`: título del evento.
* `description`: descripción del evento.
* `date`: fecha de realización.
* `location`: ubicación del evento.
* `capacity`: capacidad máxima de asistentes.
* `price`: precio del evento.

Estos campos constituyen una definición inicial del dominio y podrán ampliarse durante las siguientes etapas del desarrollo.

## 10. Próximas etapas

La arquitectura inicial permitirá incorporar progresivamente las siguientes funcionalidades:

1. Conexión con MongoDB y persistencia de datos.
2. Registro de usuarios y almacenamiento seguro de contraseñas.
3. Inicio de sesión y autenticación mediante JWT.
4. Gestión de sesiones, cookies y Passport.
5. Implementación de roles y autorización.
6. Operaciones CRUD para eventos.
7. Inscripciones, tickets y control de cupos.
8. Validaciones, manejo centralizado de errores y notificaciones.

## 11. Alcance de la pre-entrega N.º 1

Esta entrega contempla exclusivamente la configuración inicial del servidor Express, la organización del código en capas, la configuración mediante variables de entorno, los modelos base y la definición de los endpoints iniciales.

No se incluyen todavía la autenticación, la persistencia de datos, la gestión completa de eventos ni las inscripciones.

El objetivo es establecer una base arquitectónica clara, modular y extensible sobre la que se desarrollarán las funcionalidades de la Plataforma de Eventos e Inscripciones en las próximas entregas.
