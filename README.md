# Plataforma de Eventos e Inscripciones

### Proyecto del curso de Programación Backend II: Diseño y Arquitectura Backend de CoderHouse

### 1. Descripción del proyecto

Plataforma de Eventos e Inscripciones es una API REST desarrollada con Node.js y Express, orientada a la gestión de cursos, capacitaciones y actividades de formación, permitiendo administrar las actividades formativas y las inscripciones de los participantes.

El proyecto se desarrolla en el marco de la materia Backend II y tiene como objetivo construir una aplicación backend escalable, organizada mediante una arquitectura por capas y preparada para incorporar progresivamente nuevas funcionalidades relacionadas con la gestión de actividades de capacitación.

En esta tercera pre-entrega se incorpora el sistema de autenticación de usuarios. Sobre la funcionalidad de registro desarrollada en la entrega anterior, se implementa el inicio de sesión mediante JWT, el almacenamiento del token en una cookie HTTP Only, una ruta protegida para consultar el usuario autenticado y el cierre de sesión.

El flujo de autenticación implementado es:
```text
Registro
   │
   ▼
POST /api/sessions/register
   │
   ▼
Usuario almacenado en MongoDB
   │
   │
   ▼
Login
   │
   ▼
POST /api/sessions/login
   │
   ▼
Validación de credenciales
   │
   ▼
Generación de JWT
   │
   ▼
Cookie currentUser
   │
   ▼
GET /api/sessions/current
   │
   ▼
Middleware de autenticación
   │
   ▼
Usuario autenticado
```

El proyecto queda preparado para incorporar posteriormente autorización por roles, gestión de cursos y capacitaciones, inscripciones, control de cupos y otras funcionalidades de la plataforma.

### 2. Tecnologías utilizadas
  
+ Node.js: entorno de ejecución de JavaScript.
+ Express: framework para el desarrollo de la API REST.
+ MongoDB: base de datos utilizada para la persistencia de usuarios.
+ Mongoose: ODM utilizado para interactuar con MongoDB.
+ bcrypt: librería utilizada para realizar el hash seguro de las contraseñas.
+ dotenv: gestión de variables de entorno.
+ jsonwebtoken: librería utilizada para generar y verificar tokens JWT.
+ cookie-parser: middleware utilizado para gestionar cookies HTTP.

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
│ │   └── mongodb.config.js
│ ├── routes/
│ │   ├── events.router.js
│ │   ├── health.router.js
│ │   └── sessions.router.js
│ ├── controllers/
│ │   ├── events.controller.js
│ │   └── sessions.controller.js
│ ├── services/
│ │   └── sessions.service.js
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
│ │   └── auth.middleware.js
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

Para el registro de usuarios, el flujo de la información sigue la siguiente estructura:

```text
Request
│
▼
Route
│
▼
Controller
│
▼
Service
│ 
├──► Hash / JWT utilities
│
▼
Repository
│
▼
DAO
│
▼
Mongoose Model
│
▼
MongoDB
```

Para las rutas protegidas se incorpora además el middleware:
```text
Request
   │
   ▼
auth.middleware.js
   │
   ├── Token válido ──► req.user ──► Controller
   │
   └── Token inválido ──► 401
```

La lógica de negocio no se concentra en las rutas ni en los controladores, manteniendo la separación de responsabilidades establecida en la primera entrega.

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

### 5. Registro de usuarios 

**POST /api/sessions/register**

Permite registrar un nuevo usuario en la plataforma.

El endpoint realiza las siguientes operaciones:

+ Verifica que estén presentes los campos obligatorios.
+ Valida el formato del email.
+ Valida la longitud mínima de la contraseña.
+ Normaliza el email mediante trim y lowercase.
+ Comprueba que no exista otro usuario con el mismo email.
+ Genera un hash de la contraseña utilizando bcrypt.
+ Persiste el usuario en MongoDB.
+ Devuelve los datos del usuario registrado sin incluir la contraseña.

Body esperado

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
``` 

El email recibido será normalizado antes de almacenarse:

```text
Ana@Mail.com
↓
ana@mail.com
```

#### Respuesta exitosa

**HTTP 201 - Created**
```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```
La respuesta no contiene el campo password.

La contraseña tampoco se almacena en texto plano en MongoDB. Se almacena únicamente su hash generado mediante bcrypt.

**Campos obligatorios**

Los siguientes campos deben estar presentes en la solicitud:

+ first_name
+ last_name
+ email
+ password

El campo *role* no forma parte de los datos permitidos para establecer el rol durante el registro público.

#### Campos faltantes o email inválido

**HTTP 400 - Bad Request**

Ejemplo de respuesta:
```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```
También se devuelve un error 400 cuando el email no cumple con el formato esperado o cuando la contraseña no alcanza la longitud mínima establecida.

#### Email ya registrado

**HTTP 409 - Conflict**

Ejemplo de respuesta:
```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```
No se permite crear más de un usuario utilizando la misma dirección de email.

### 6. Seguridad de contraseñas

Las contraseñas de los usuarios nunca se almacenan en texto plano.

El proceso implementado es:

```text
Contraseña recibida
│
▼
bcrypt
│
▼
Hash de contraseña
│
▼
MongoDB
```

La funcionalidad de hash se encuentra encapsulada en un helper reutilizable dentro de `src/utils/hash.js`

De esta forma, la lógica relacionada con bcrypt no se encuentra directamente en las rutas ni en los controladores y puede reutilizarse posteriormente para el proceso de autenticación.

Además, el campo password no se incluye en la respuesta HTTP del registro, evitando exponer tanto la contraseña original como su hash.

### 7. MongoDB

La persistencia de los usuarios se realiza utilizando MongoDB y Mongoose.

La URL de conexión se configura mediante la variable de entorno:

MONGO_URL=mongodb://127.0.0.1:27017/eventos

La aplicación utiliza el modelo UserModel de Mongoose para interactuar con la colección correspondiente.

### 8. Login de usuarios
**POST /api/sessions/login**

Permite autenticar a un usuario previamente registrado.

El endpoint:

+ Valida la presencia de email y password.
+ Busca el usuario por email.
+ Compara la contraseña recibida con el hash almacenado mediante bcrypt.
+ Si las credenciales son incorrectas, devuelve un mensaje genérico.
+ Si las credenciales son correctas, genera un JWT.
+ Almacena el JWT en la cookie currentUser.
+ Devuelve una respuesta indicando que el login fue exitoso.

Request:
```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

**Response 200 - OK**
```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Además de la respuesta JSON, el servidor establece la cookie `currentUser`

La cookie contiene el JWT generado para el usuario autenticado.

**Credenciales inválidas**

Si el email no existe o la contraseña no coincide, el endpoint responde siempre con el mismo mensaje.

**HTTP 401 - Unauthorized**
```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```
No se especifica si el problema corresponde al email o a la contraseña. Esto evita proporcionar información que permita determinar qué usuarios se encuentran registrados.

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

### 11. Ruta protegida: usuario actual
**GET /api/sessions/current**

Permite obtener la información básica del usuario actualmente autenticado.

La ruta está protegida mediante el middleware: `src/middlewares/auth.middleware.js`

El middleware:

+ Obtiene la cookie currentUser.
+ Extrae el JWT.
+ Verifica la firma del token.
+ Comprueba su validez y expiración.
+ Guarda el payload decodificado en: `req.user`
+ Permite continuar con el controlador.

Request: No requiere un body.

La solicitud debe incluir la cookie de autenticación: `currentUser=<JWT>`

**Response 200 - OK**
```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```
La respuesta no contiene la contraseña.

**Sin autenticación**

Si la solicitud no contiene la cookie:

**HTTP 401 - Unauthorized**
```json
{
  "status": "error",
  "message": "No autenticado"
}
```

El mismo código de respuesta se utiliza cuando el token es inválido o se encuentra expirado.

### 12. Logout
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

### 13. Endpoints disponibles
|Método |	Ruta  | Descripción |	Autenticación |
|-------|-------|-------------|---------------|
|GET  | /api/health | Verifica que el servidor esté activo. | **No**  |
|GET  | /api/events | Obtiene los eventos disponibles.  | **No**  |
|POST | /api/sessions/register  | Registra un nuevo usuario.  | **No**  |
|POST | /api/sessions/login | Autentica un usuario y genera la cookie JWT.  | **No**  |
|GET  | /api/sessions/current | Obtiene el usuario autenticado. | **Sí** |
|POST | /api/sessions/logout  | Cierra la sesión y elimina la cookie. | **No**  |

### 14. Configuración de variables de entorno

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

### 15. Instalación

Clonar el repositorio:

`git clone https://github.com/USUARIO/proyecto-eventos.git`

Ingresar al directorio:

`cd proyecto-eventos`

Instalar las dependencias:

`npm install`

Configurar las variables de entorno:

`cp .env.example .env`

Verificar que MongoDB se encuentre disponible y que MONGO_URI apunte a la instancia correspondiente.

### 16. Ejecución

Iniciar el servidor:

`npm start`

Para desarrollo, si el proyecto tiene configurado el script correspondiente:

`npm run dev`

El servidor utilizará el puerto definido en la variable de entorno PORT.

### 12. Pruebas del registro

#### 1. Registro exitoso
##### Enviar un usuario con todos los campos válidos.

Resultado esperado:

+ HTTP **201**.
+ Usuario almacenado en MongoDB.
+ Email normalizado.
+ Rol establecido como user.
+ Contraseña almacenada mediante hash.
+ Contraseña ausente en la respuesta. 

#### 2. Campos faltantes

##### Enviar una solicitud sin uno o más campos obligatorios.

Resultado esperado:

+ HTTP 400.
+ Mensaje indicando que faltan campos obligatorios. 

Captura de Postman:
![alt text](/public/img/001.png)

Captura de MongoDB:
![alt text](/public/img/002.png)

#### 3. Email inválido

Enviar un email que no cumpla con el formato esperado.

Resultado esperado:

+ HTTP 400.
+ Usuario no almacenado. 

Captura de Postman:
![alt text](/public/img/003.png)

#### 4. Email ya registrado

Intentar registrar nuevamente un email existente.

Resultado esperado:

+ HTTP 409.
+ No se crea un segundo usuario. 

Captura de Postman:
![alt text](/public/img/004.png)

### 13. Pruebas del login

#### 1. Login exitoso

```json
{
  "email": "Ana@Mail.com ", 
  "password": "Secreta123" 
}
```
Captura de Postman:
![alt text](/public/img/007.png)

#### 2. /current de un usuario autenticado

Captura de Postman:
![alt text](/public/img/008.png)

#### 3. Login con email inexistente

Request:
```json
{
  "email": "noexiste@mail.com",
  "password": "Secreta123"
}
```

![alt text](/public/img/010.png)

#### 4. Login con contraseña incorrecta

Enviar un email registrado junto con una contraseña incorrecta.

![alt text](/public/img/005.png)

#### 5. /current sin cookie

**401 - Unauthorized**
![alt text](/public/img/006.png)

### 14. Pruebas de logout
Captura de Postman:
![alt text](/public/img/009.png)


### 15.  Próximas etapas

La arquitectura implementada permite continuar desarrollando la plataforma sobre la misma base.

Entre las próximas funcionalidades se encuentran:

+ Autorización basada en roles.
+ Gestión de usuarios.
+ Creación y administración de cursos y capacitaciones.
+ CRUD de eventos.
+ Inscripciones de participantes.
+ Control de cupos.
+ Gestión de tickets.
+ Middleware de autorización.
+ Integración de Passport.
+ Notificaciones.

### 16. Alcance de la Pre-entrega N.º 3

Esta entrega incorpora el sistema de autenticación sobre la base arquitectónica desarrollada en las pre-entregas anteriores.

Las funcionalidades implementadas son:

+ Registro seguro de usuarios.
+ Persistencia de usuarios en MongoDB.
+ Validación de datos.
+ Normalización de emails.
+ Hash de contraseñas mediante bcrypt.
+ Prevención de emails duplicados.
+ Login de usuarios.
+ Comparación segura de contraseñas.
+ Generación de JWT.
+ Payload JWT con id, email y role.
+ Expiración configurable del JWT.
+ Cookie de autenticación currentUser.
+ Cookie HttpOnly.
+ Middleware de autenticación.
+ Ruta protegida /api/sessions/current.
+ Logout mediante eliminación de la cookie.
+ Manejo de credenciales inválidas mediante mensajes genéricos.
+ Configuración mediante variables de entorno.
+ Documentación de los endpoints.
