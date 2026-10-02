# Plataforma de Eventos e Inscripciones

### Proyecto del curso de Programación Backend II: Diseño y Arquitectura Backend de CoderHouse

### 1. Descripción del proyecto

Plataforma de Eventos e Inscripciones es una API REST desarrollada con Node.js y Express, orientada a la gestión de cursos, capacitaciones y actividades de formación, permitiendo administrar las actividades formativas y las inscripciones de los participantes.

El proyecto se desarrolla en el marco de la materia Backend II y tiene como objetivo construir una aplicación backend escalable, organizada mediante una arquitectura por capas y preparada para incorporar progresivamente nuevas funcionalidades relacionadas con la gestión de actividades de capacitación.

En esta cuarta pre-entrega se realiza un refactor del sistema de autenticación implementado en las entregas anteriores mediante la incorporación de Passport.js.

El objetivo de esta etapa no es modificar el comportamiento externo de la API, sino mejorar la organización interna de la autenticación. Las rutas y respuestas existentes se mantienen, mientras que las operaciones de registro, login y validación del usuario autenticado pasan a estar organizadas mediante estrategias de Passport.

El sistema continúa utilizando JWT almacenados en cookies HTTP Only, pero ahora Passport centraliza las estrategias de autenticación y deja preparada la arquitectura para incorporar posteriormente otros mecanismos de autenticación, como proveedores externos OAuth.

### 2. Tecnologías utilizadas
  
+ Node.js: entorno de ejecución de JavaScript.
+ Express: framework para el desarrollo de la API REST.
+ MongoDB: base de datos utilizada para la persistencia de usuarios.
+ Mongoose: ODM utilizado para interactuar con MongoDB.
+ bcrypt: librería utilizada para realizar el hash seguro de las contraseñas.
+ dotenv: gestión de variables de entorno.
+ jsonwebtoken: librería utilizada para generar y verificar tokens JWT.
+ cookie-parser: middleware utilizado para gestionar cookies HTTP.
+ Passport.js: framework utilizado para centralizar las estrategias de autenticación.
+ Passport-local: estrategia utilizada para registro y autenticación mediante credenciales.
+ Passport-jwt: estrategia utilizada para leer y extraer la información de los tokens JWT.

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
│ │   └── sessions.router.js
│ ├── controllers/
│ │   ├── events.controller.js
│ │   └── sessions.controller.js
│ ├── services/
│ ├── repositories/
│ │   ├── index.js
│ │   ├── BaseRepository.js
│ │   └── UserRepository.js
│ ├── dao/
│ │   └── Users.dao.js
│ ├── models/
│ │   ├── User.js
│ │   └── Event.js
│ ├── middlewares/
│ │   └── errorHandler.js
│ └── utils/
│ │   ├── customError.js
│ │   ├── validators.js
│     └── hash.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Responsabilidades de las capas

+ **src/app.js**: Configuración de Express, middlewares y rutas.
+ **src/server.js**: Inicialización del servidor HTTP y conexión con la base de datos.
+ **src/config/**: Configuración de la aplicación y servicios externos.
+ **src/routes/**: Definición de los endpoints y vinculación con los controladores.
+ **src/controllers/**: Recepción de las solicitudes HTTP y construcción de las respuestas.
+ **src/services/**: Implementación de la lógica de negocio.
+ **src/repositories/**: Abstracción del acceso a los datos.
+ **src/dao/**: Operaciones de acceso y persistencia de datos.
+ **src/models/**: Definición de los modelos de datos mediante Mongoose.
+ **src/middlewares/**: Funciones intermedias utilizadas durante el procesamiento de solicitudes.
+ **src/utils/**: Funciones auxiliares reutilizables, como el hash de contraseñas.

### 4. Modelo UserModel

El modelo UserModel representa a los usuarios registrados en la plataforma.

Cuenta con los siguientes campos:

+ **first_name**: Nombre del usuario.
+ **last_name**: Apellido del usuario.
+ **email**: Dirección de correo electrónico.
+ **password**: Contraseña almacenada mediante un hash de bcrypt.
+ **role**: Rol del usuario dentro de la plataforma.

El campo role utiliza *user* como valor predeterminado y admite los siguientes valores:

+ user
+ organizer
+ admin

El rol no puede ser definido ni modificado mediante el body del registro público. Todo usuario registrado mediante este endpoint obtiene inicialmente el rol *user*

Los roles *organizer* y *admin* quedan reservados para mecanismos de gestión y autorización que serán implementados en etapas posteriores.

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

+ Validación de campos obligatorios.
+ Normalización del email.
+ Verificación de email duplicado.
+ Hash de la contraseña mediante bcrypt.
+ Asignación del rol por defecto user.
+ Creación y persistencia del usuario.

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

+ first_name
+ last_name
+ email
+ password

El campo *role* no forma parte de los datos permitidos para establecer el rol durante el registro público.

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

+ Recibir email y contraseña.
+ Buscar el usuario.
+ Comparar la contraseña mediante bcrypt.
+ Rechazar las credenciales inválidas.
+ Pasar el usuario autenticado al controller.

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

+ Obtiene el token.
+ Verifica la firma.
+ Comprueba la validez del token.
+ Obtiene el payload.
+ Deja la información disponible mediante `req.user`.
+ Permite que el controller genere la respuesta.

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

+ **httpOnly**:true
+ **sameSite**:lax
+ **maxAge**:3600000 ms
+ **secure**:true (únicamente en producción)

El uso de httpOnly evita que la cookie pueda ser accedida directamente mediante JavaScript ejecutado en el navegador.

La configuración de secure permite utilizar HTTP durante el desarrollo local y exigir HTTPS en producción.

### 11. Endpoints disponibles
|Método |	Ruta  | Descripción |	Autenticación |
|-------|-------|-------------|---------------|
|GET  | /api/health | Verifica que el servidor esté activo. | **No**  |
|GET  | /api/events | Obtiene los eventos disponibles.  | **No**  |
|POST | /api/sessions/register  | Registra un nuevo usuario.  | **No**  |
|POST | /api/sessions/login | Autentica un usuario y genera la cookie JWT.  | **No**  |
|GET  | /api/sessions/current | Obtiene el usuario autenticado. | **Sí** |
|POST | /api/sessions/logout  | Cierra la sesión y elimina la cookie. | **No**  |

### 12. Configuración de variables de entorno

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

### 13. Instalación

Clonar el repositorio:

`git clone https://github.com/USUARIO/proyecto-eventos.git`

Ingresar al directorio:

`cd proyecto-eventos`

Instalar las dependencias:

`npm install`

Configurar las variables de entorno:

`cp .env.example .env`

Verificar que MongoDB se encuentre disponible y que MONGO_URI apunte a la instancia correspondiente.

### 14. Ejecución

Iniciar el servidor:

`npm start`

Para desarrollo, si el proyecto tiene configurado el script correspondiente:

`npm run dev`

El servidor utilizará el puerto definido en la variable de entorno PORT.

### 15. Pruebas del flujo register → login → /current (200) → logout → /current (401).

#### 15.1 Registro exitoso
**Request**:
```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```
Captura Postman:
![alt text](/public/img/register-postman.png)

Captura MongoDB:
![alt text](/public/img/register-mongodb.png)

#### 15.2 Login
**Request**:
```json
{
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```
Captura Postman:
![alt text](/public/img/login-postman.png)

#### 15.3 /current (HTTP 200)
![alt text](/public/img/current-postman.png)

#### 15.4 Logout
![alt text](/public/img/logout-postman.png)

#### 15.5 /current (HTTP 401)
![alt text](/public/img/current-not-valid-postman.png)

### 16. Preparación para futuros providers

Una de las ventajas de centralizar las estrategias de autenticación en `src/config/passport.config.js` es que permite incorporar nuevos mecanismos de autenticación sin modificar app.js.

La arquitectura queda preparada para incorporar, por ejemplo:
```text
passport.config.js
│
├── register
├── login
├── current
├── Google
├── GitHub
└── futuras estrategias
```

De esta forma, los mecanismos de autenticación pueden evolucionar sin modificar la configuración principal de Express. La incorporación de providers externos como Google o GitHub queda prevista para futuras etapas del proyecto.

### 17.  Próximas etapas

La arquitectura actual permite continuar desarrollando la plataforma sobre la misma base. Entre las próximas funcionalidades se encuentran:

+ Autorización basada en roles.
+ Protección de rutas según permisos.
+ Gestión de usuarios.
+ Gestión de cursos y capacitaciones.
+ CRUD de eventos.
+ Inscripciones de participantes.
+ Control de cupos.
+ Tickets.
+ Notificaciones.
+ Integración con providers externos mediante Passport.

### 18. Alcance de la Pre-entrega N.º 4

Esta entrega refactoriza el sistema de autenticación desarrollado anteriormente mediante la incorporación de Passport.js.

Se mantienen las funcionalidades y el contrato externo de la Pre-entrega N.º 3, incorporando:

+ Inicialización de Passport en app.js.
+ Configuración centralizada de estrategias.
+ Estrategia register.
+ Estrategia login.
+ Estrategia current.
+ Validación de credenciales mediante Passport.
+ Validación del JWT mediante Passport.
+ Disponibilidad del usuario autenticado mediante req.user.
+ Generación del JWT en el controller.
+ Configuración de la cookie currentUser en el controller.
+ Logout mediante eliminación de la cookie.
+ Mantenimiento de bcrypt para la protección de contraseñas.
+ Preparación para futuros providers de autenticación.
+ Mantenimiento de las rutas y respuestas existentes.

El cambio principal respecto de la Pre-entrega N.º 3 es interno y arquitectónico: Passport.js centraliza las estrategias de autenticación sin modificar el comportamiento externo de la API.

La autorización basada en roles, la gestión completa de cursos y capacitaciones, las inscripciones y los providers externos quedan preparados para futuras etapas del proyecto.
