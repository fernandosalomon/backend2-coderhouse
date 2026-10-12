# Plataforma de Eventos e Inscripciones

### Proyecto del curso de Programación Backend II: Diseño y Arquitectura Backend de CoderHouse

### 1. Descripción del proyecto

Plataforma de Eventos e Inscripciones es una API REST desarrollada con Node.js y Express, orientada a la gestión de cursos, capacitaciones y actividades de formación, permitiendo administrar las actividades formativas y las inscripciones de los participantes.

El proyecto se desarrolla en el marco de la materia Backend II y tiene como objetivo construir una aplicación backend escalable, organizada mediante una arquitectura por capas y preparada para incorporar progresivamente nuevas funcionalidades relacionadas con la gestión de actividades de capacitación.

El sistema utiliza JWT almacenados en cookies HTTP Only, Passport para centralizar las estrategias de autenticación y un middleware especifico para el manejo de los mecanismos de autorización de usuarios basado en roles.

### 2. Tecnologías utilizadas

- Node.js: entorno de ejecución de JavaScript.
- Express: framework para el desarrollo de la API REST.
- MongoDB: base de datos utilizada para la persistencia de usuarios.
- Mongoose: ODM utilizado para interactuar con MongoDB.
- bcrypt: librería utilizada para realizar el hash seguro de las contraseñas.
- dotenv: gestión de variables de entorno.
- jsonwebtoken: librería utilizada para generar y verificar tokens JWT.
- cookie-parser: middleware utilizado para gestionar cookies HTTP.
- Passport.js: framework utilizado para centralizar las estrategias de autenticación.
- Passport-local: estrategia utilizada para registro y autenticación mediante credenciales.
- Passport-jwt: estrategia utilizada para leer y extraer la información de los tokens JWT.

### 3. Arquitectura del proyecto

El proyecto utiliza una arquitectura organizada por capas, con el objetivo de separar responsabilidades y facilitar el mantenimiento, las pruebas y la incorporación de nuevas funcionalidades.

La estructura actual del proyecto es:

```text
proyecto-eventos/
├── src/
│ ├── app.js
│ ├── server.js
│ ├── config/
│ │   ├── env.config.js
│ │   ├── passport.config.js
│ │   └── mongodb.config.js
│ ├── routes/
│ │   ├── events.router.js
│ │   ├── health.router.js
│ │   ├── users.router.js
│ │   └── sessions.router.js
│ ├── controllers/
│ │   ├── events.controller.js
│ │   ├── users.controller.js
│ │   └── sessions.controller.js
│ ├── services/
│ │   ├── events.services.js
│ │   └── users.services.js
│ ├── repositories/
│ │   ├── index.js
│ │   ├── BaseRepository.js
│ │   ├── EventRepository.js
│ │   └── UserRepository.js
│ ├── dao/
│ │   ├── Events.dao.js
│ │   └── Users.dao.js
│ ├── models/
│ │   ├── User.js
│ │   └── Event.js
│ ├── middlewares/
│ │   ├── authorize.middleware.js
│ │   └── errorHandler.js
│ ├── dto/
│ │   ├── Event.dto.js
│ │   └── User.dto.js
│ ├── utils/
│ │   ├── customError.js
│ │   ├── validators.js
│ │   └── hash.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Responsabilidades de las capas

- **src/app.js**: Configuración de Express, middlewares y rutas.
- **src/server.js**: Inicialización del servidor HTTP y conexión con la base de datos.
- **src/config/**: Configuración de la aplicación y servicios externos.
- **src/routes/**: Definición de los endpoints y vinculación con los controladores.
- **src/controllers/**: Recepción de las solicitudes HTTP y construcción de las respuestas.
- **src/services/**: Implementación de la lógica de negocio.
- **src/repositories/**: Abstracción del acceso a los datos.
- **src/dao/**: Operaciones de acceso y persistencia de datos.
- **src/dto/**: Definición y control de los datos que entran o salen de una capa de tu aplicación.
- **src/models/**: Definición de los modelos de datos mediante Mongoose.
- **src/middlewares/**: Funciones intermedias utilizadas durante el procesamiento de solicitudes.
- **src/utils/**: Funciones auxiliares reutilizables, como el hash de contraseñas.

### 4. Modelos

#### 4.1 Modelo Usuarios

El modelo `UserModel` representa a los usuarios registrados en la plataforma.

Cuenta con los siguientes campos:

- **first_name**: Nombre del usuario (requerido).
- **last_name**: Apellido del usuario (requerido).
- **email**: Dirección de correo electrónico (requerido).
- **password**: Contraseña almacenada mediante un hash de bcrypt (requerido).
- **role**: Rol del usuario dentro de la plataforma.

El campo role utiliza _user_ como valor predeterminado y admite los siguientes valores:

- user
- organizer
- admin

El rol no puede ser definido ni modificado mediante el body del registro público. Todo usuario registrado mediante este endpoint obtiene inicialmente el rol _user_

Los roles _organizer_ y _admin_ quedan reservados para mecanismos de gestión y autorización que serán implementados en etapas posteriores.

#### 4.2 Modelo Eventos

El modelo `EventModel` representa a los eventos registrados en la plataforma.

Cuenta con los siguientes campos:

- title: Título del evento (requerido)
- description: Descripción detallada del evento (requerido)
- category: Categoría a la que pertenece el evento (requerido)
- date: Fecha y hora en que se realizará el evento (requerido)
- location: Lugar donde se realizará el evento (requerido)
- capacity: Cantidad máxima de asistentes permitidos (requerido)
- price: Precio de inscripción o asistencia al evento (por defecto: 0)
- status: Estado actual del evento. Puede ser draft, published, cancelled o finished (por defecto: draft)
- organizer: Identificador del usuario responsable de organizar el evento (requerido)

### 5. Inicialización de Passport

Passport se inicializa en `app.js`, mediante la linea `app.use(passport.initialize());`.

Las estrategias no se definen directamente en app.js. En cambio, se encuentran centralizadas en `src/config/passport.config.js`

Esto permite mantener `app.js` enfocado exclusivamente en la configuración de la aplicación y facilita agregar nuevas estrategias sin modificar el archivo principal.

La configuración sigue conceptualmente la siguiente estructura:

```text
app.js
  │
  └── passport.initialize()
          │
          ▼
   passport.config.js
          │
          ├── register
          ├── login
          └── current
```

### 6. Estrategias de Passport

Esta entrega implementa tres estrategias principales: **register**, **login** y **current**. Todas se encuentran centralizadas en `src/config/passport.config.js`.

### 6.1. Registro de usuarios (estrategia register)

La estrategia register se utiliza para el endpoint: **POST /api/sessions/register**

La estrategia concentra la lógica necesaria para crear un nuevo usuario:

- Validación de campos obligatorios.
- Normalización del email.
- Verificación de email duplicado.
- Hash de la contraseña mediante bcrypt.
- Asignación del rol por defecto user.
- Creación y persistencia del usuario.

La ruta queda encargada de delegar la autenticación en Passport mediante `passport.authenticate('register', ...)`. De esta manera, la lógica de registro no se encuentra directamente dentro de la ruta.

#### Flujo

```text
POST /api/sessions/register
             │
             ▼
      sessions.router.js
             │
             ▼
 passport.authenticate('register')
             │
             ▼
     register strategy
             │
       ┌─────┴─────┐
       ▼           ▼
   Validación    bcrypt
       │           │
       └─────┬─────┘
             ▼
          MongoDB
             │
             ▼
         Controller
             │
             ▼
          Response
```

La solicitud al endpoint **POST /api/sessions/register** debe contener los siguientes campos obligatorios:

- first_name
- last_name
- email
- password

El campo _role_ no forma parte de los datos permitidos para establecer el rol durante el registro público.

#### Email existente

Si el email ya se encuentra registrado en la base de datos, la API responde con el mensaje:
**409 Conflict**

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

Captura de Postman:
![alt text](/public/img/email-existente-postman.png)

### 6.2 Login de usuarios (estrategia login)

La estrategia login se utiliza para el endpoint **POST /api/sessions/login**.

La estrategia concentra la lógica necesaria para validar las credenciales recibidas:

- Recibir email y contraseña.
- Buscar el usuario.
- Comparar la contraseña mediante bcrypt.
- Rechazar las credenciales inválidas.
- Pasar el usuario autenticado al controller.

Si las credenciales son correctas, la estrategia no genera el JWT. La generación del JWT y la configuración de la cookie `currentUser` son responsabilidad del controller.

#### Flujo

```text
Passport
   │
   └──► Autentica al usuario
             │
             ▼
        Controller
             │
             ├──► Genera JWT
             │
             └──► Setea cookie
```

#### Credenciales inválidas

Cuando el email no existe o la contraseña no coincide, la API responde con el mismo mensaje:
**401 Unauthorized**

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

No se diferencia entre usuario inexistente y contraseña incorrecta.

Captura de Postman:
![alt text](/public/img/credenciales-invalidas-postman.png)

### 6.3 Estrategia current

La estrategia current se utiliza en el endpoint **GET /api/sessions/current**

Esta estrategia obtiene el JWT desde la cookie `currentUser`. Luego:

- Obtiene el token.
- Verifica la firma.
- Comprueba la validez del token.
- Obtiene el payload.
- Deja la información disponible mediante `req.user`.
- Permite que el controller genere la respuesta.

El payload contiene la siguiente información:

```json
{
  "id": "665f2a...",
  "email": "ana@mail.com",
  "role": "user"
}
```

#### Token inválido o inexistente

Si no existe una cookie válida o el JWT es inválido o expiró, el servidor responde con **401 Unauthorized**

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### 7. Logout

**POST /api/sessions/logout**

Permite cerrar la sesión del usuario.

El endpoint elimina la cookie: `currentUser`

Request: No requiere body.

**Response 200 - OK**

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después de ejecutar el logout, una solicitud posterior a **GET /api/sessions/current** debe responder: **401 - Unauthorized**

### 8. MongoDB

La persistencia de los usuarios se realiza utilizando MongoDB y Mongoose.

La URL de conexión se configura mediante la variable de entorno:

MONGO_URI=mongodb://127.0.0.1:27017/eventos

La aplicación utiliza el modelo UserModel de Mongoose para interactuar con la colección correspondiente.

### 9. JWT

Los tokens de autenticación se generan mediante jsonwebtoken.

La lógica relacionada con JWT se encuentra centralizada en `src/utils/jwt.js`

El token contiene únicamente la información mínima necesaria para identificar al usuario:

```json
{
  "id": "665f2a...",
  "email": "ana@mail.com",
  "role": "user"
}
```

El JWT se firma utilizando la variable de entorno:

JWT_SECRET=change_this_secret

La duración del token es configurable mediante:

JWT_EXPIRES_IN=1h

El secreto utilizado para firmar el token no se encuentra hardcodeado en el código fuente.

El JWT no contiene la contraseña del usuario.

### 10. Cookie de autenticación

El JWT se almacena en una cookie denominada `currentUser`

La cookie se configura con las siguientes propiedades:

- **httpOnly**:true
- **sameSite**:lax
- **maxAge**:3600000 ms
- **secure**:true (únicamente en producción)

El uso de httpOnly evita que la cookie pueda ser accedida directamente mediante JavaScript ejecutado en el navegador.

La configuración de secure permite utilizar HTTP durante el desarrollo local y exigir HTTPS en producción.

### 11. Endpoints disponibles

| Método  | Endpoint                 | Descripción                           | Autorización                                               |
| ------- | ------------------------ | ------------------------------------- | ---------------------------------------------------------- |
| `GET`   | `/api/health/`           | Verifica que el servidor esté activo  | Pública                                                    |
| `GET`   | `/api/events/`           | Obtiene todos los eventos             | Pública                                                    |
| `GET`   | `/api/events/:eid`       | Obtiene un evento por su ID           | Pública                                                    |
| `POST`  | `/api/events/`           | Crea un evento nuevo                  | Requiere autenticación y rol `organizer` o `admin`         |
| `PUT`   | `/api/events/:eid`       | Actualiza un evento completo          | Requiere usuario autenticado con rol `organizer` o `admin` |
| `PATCH` | `/api/events/:eid`       | Actualiza el estado de un evento      | Requiere usuario autenticado con rol `organizer` o `admin` |
| `POST`  | `/api/sessions/register` | Registra un nuevo usuario             | Pública                                                    |
| `POST`  | `/api/sessions/login`    | Inicia sesión de usuario              | Pública                                                    |
| `GET`   | `/api/sessions/current`  | Obtiene el usuario autenticado actual | Requiere usuario autenticado                               |
| `POST`  | `/api/sessions/logout`   | Cierra la sesión del usuario          | Pública / según lógica del controlador                     |
| `GET`   | `/api/users/`            | Lista todos los                       |                                                            |

### 12 Eventos

La ruta base es `/api/events`.

| Método  | Ruta    | Función                                                                                                                |
| ------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `GET`   | `/`     | Lista eventos. Admite filtros `category`, `status`, `location`, `fromDate`, `toDate`, `page` y `limit`.                |
| `GET`   | `/:eid` | Obtiene un evento por ID.                                                                                              |
| `POST`  | `/`     | Crea un evento. Requiere autenticación y rol `organizer` o `admin`.                                                    |
| `PUT`   | `/:eid` | Actualiza un evento. Requiere autenticación y rol `organizer` o `admin`.                                               |
| `PATCH` | `/:eid` | Cambia el estado (`draft`, `published`, `cancelled` o `finished`). Requiere autenticación y rol `organizer` o `admin`. |

Para crear un evento, enviar `title`, `description`, `category`, `date`, `location` y `capacity`; `price` es opcional y vale `0` por defecto. El organizador se asigna al usuario autenticado.
El rol `organizer` solo puede modificar sus propios eventos; `admin` puede modificar cualquiera.

### 13. Autorización

#### 13.1 Sistema de roles

Los tres roles disponibles representan diferentes niveles de permisos.

##### `user`: Usuario registrado de la plataforma.

Puede:

- Consultar eventos publicados.
- Acceder a sus recursos privados.
- Realizar las acciones permitidas para participantes.

No puede:

- Crear eventos.
- Modificar eventos.
- Cancelar eventos.
- Administrar usuarios.

##### `organizer`: Usuario encargado de organizar cursos, capacitaciones y actividades de formación.

Puede:

- Consultar eventos publicados.
- Crear eventos.
- Modificar sus propios eventos.
- Cancelar sus propios eventos.

No puede:

- Modificar eventos pertenecientes a otros organizadores.
- Administrar usuarios.
- Realizar acciones exclusivas de admin.

##### `admin`: Administrador de la plataforma.

Puede:

- Consultar eventos.
- Crear eventos.
- Modificar cualquier evento.
- Cancelar cualquier evento.
- Acceder a rutas administrativas.
- Consultar todos los usuarios.

#### 13.2 Matriz de permisos

La autorización de la plataforma se define mediante la siguiente matriz:

| Acción                       | user | organizer | admin |
| ---------------------------- | :--: | :-------: | :---: |
| Consultar eventos publicados |  ✅  |    ✅     |  ✅   |
| Crear eventos                |  ❌  |    ✅     |  ✅   |
| Modificar eventos propios    |  ❌  |    ✅     |  ✅   |
| Cancelar eventos propios     |  ❌  |    ✅     |  ✅   |
| Modificar cualquier evento   |  ❌  |    ❌     |  ✅   |
| Cancelar cualquier evento    |  ❌  |    ❌     |  ✅   |
| Ver todos los usuarios       |  ❌  |    ❌     |  ✅   |

#### 13.3 Middleware de autorización

El middleware de autorización (`src/middlewares/authorize.middleware.js`) recibe los roles permitidos como parámetros.

Su utilización tiene la siguiente forma: `authorize("organizer", "admin")`

El middleware compara los roles permitidos con: `req.user.role`

Si el rol no está autorizado, responde `403`.

Esto permite reutilizar el mismo middleware en diferentes rutas sin hardcodear la lógica de autorización en cada endpoint.

### 14. Ruta administrativa

El endpoint `GET /api/users` devuelve una lista de todos los usuarios registrados en la plataforma.

Este endpoint solo es accesible para usuarios `admin`. Para usuarios `organizer` y `user`, el servidor responde `403`.

### 15. Configuración de variables de entorno

El proyecto utiliza dotenv para cargar las variables de entorno desde .env.

Crear el archivo de configuración a partir de la plantilla:

´cp .env.example .env´

El archivo .env.example contiene:

PORT=
NODE_ENV=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
COOKIE_SECRET=

##### Descripción de las variables

**PORT**: Puerto en el que se ejecutará el servidor.
**NODE_ENV** Entorno de ejecución de la aplicación.
**MONGO_URI**: URL de conexión a la base de datos MongoDB.
**JWT_SECRET**:Secreto utilizado para firmar y verificar los JWT.
**JWT_EXPIRES_IN**:Tiempo de expiración de los JWT.
**COOKIE_SECRET**:Secreto utilizado para firmar y verificar las cookies.

El repositorio incluye .env.example como plantilla de configuración.

### 16. Instalación

Clonar el repositorio:

`git clone https://github.com/USUARIO/proyecto-eventos.git`

Ingresar al directorio:

`cd proyecto-eventos`

Instalar las dependencias:

`npm install`

Configurar las variables de entorno:

`cp .env.example .env`

Verificar que MongoDB se encuentre disponible y que MONGO_URI apunte a la instancia correspondiente.

### 17. Ejecución

Iniciar el servidor:

`npm start`

Para desarrollo, si el proyecto tiene configurado el script correspondiente:

`npm run dev`

El servidor utilizará el puerto definido en la variable de entorno PORT.

### 18. Pre-entrega N.º 6

#### Crear evento con rol user→ 403

![alt text](/public/img/createEvent-roleUser.png)

#### Crear evento con fecha pasada → error de validación

![alt text](/public/img/createEvent-prevDate.png)

#### Crear evento con capacity: 0→ error de validación

![alt text](/public/img/createEvent-capacity0.png)

#### organizer modifica evento propio → éxito
![alt text](/public/img/modifyEvent-organizer.png)

#### organizer modifica evento ajeno → 403
![alt text](/public/img/modifyEvent-organizerNotOwn.png)

#### admin modifica evento de otro organizador → éxito
![alt text](/public/img/modifyEvent-admin.png)

#### Cambiar estado de evento cancelado → error
![alt text](/public/img/changeStatus-cancelledEvent.png)

#### Listar con filtros: ?status=published&category=workshop&page=2&limit=5
![alt text](/public/img/getEventWithFilters.png)

#### Consultar evento inexistente → 404
![alt text](/public/img/GetEventNotExists.png)