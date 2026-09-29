# Plataforma de Eventos e Inscripciones

### Proyecto del curso de Programación Backend II: Diseño y Arquitectura Backend de CoderHouse

### 1. Descripción del proyecto

Plataforma de Eventos e Inscripciones es una API REST desarrollada con Node.js y Express, orientada a la gestión de cursos, capacitaciones y actividades de formación, permitiendo administrar las actividades formativas y las inscripciones de los participantes.

El proyecto se desarrolla en el marco de la materia Backend II y tiene como objetivo construir una aplicación backend escalable, organizada mediante una arquitectura por capas y preparada para incorporar progresivamente nuevas funcionalidades relacionadas con la gestión de actividades de capacitación.

En esta segunda pre-entrega se implementa el primer flujo real de usuarios de la plataforma: el registro seguro de nuevos usuarios. Para ello se incorpora la persistencia de datos en MongoDB mediante Mongoose, la validación y normalización de los datos recibidos y el almacenamiento seguro de las contraseñas mediante bcrypt.

La arquitectura desarrollada en la primera entrega se mantiene y se extiende para incorporar la lógica correspondiente al registro de usuarios.

### 2. Tecnologías utilizadas
  
+ Node.js: entorno de ejecución de JavaScript.
+ Express: framework para el desarrollo de la API REST.
+ MongoDB: base de datos utilizada para la persistencia de usuarios.
+ Mongoose: ODM utilizado para interactuar con MongoDB.
+ bcrypt: librería utilizada para realizar el hash seguro de las contraseñas.
+ dotenv: gestión de variables de entorno.

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
│ │   ├── BaseRepository.js
│ │   └── UserRepository.js
│ ├── dao/
│ │   └── Users.dao.js
│ ├── models/
│ │   ├── User.js
│ │   └── Event.js
│ ├── middlewares/
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

### 8. Configuración de variables de entorno

El proyecto utiliza dotenv para cargar las variables de entorno desde .env.

Crear el archivo de configuración a partir de la plantilla:

´cp .env.example .env´

El archivo .env.example contiene:

PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/eventos

##### Descripción de las variables

**PORT**: Puerto en el que se ejecutará el servidor.
**NODE_ENV** Entorno de ejecución de la aplicación.
**MONGO_URI**: URL de conexión a la base de datos MongoDB.

El repositorio incluye .env.example como plantilla de configuración.

### 9. Instalación

Clonar el repositorio:

`git clone https://github.com/USUARIO/proyecto-eventos.git`

Ingresar al directorio:

`cd proyecto-eventos`

Instalar las dependencias:

`npm install`

Configurar las variables de entorno:

`cp .env.example .env`

Verificar que MongoDB se encuentre disponible y que MONGO_URI apunte a la instancia correspondiente.

### 10. Ejecución

Iniciar el servidor:

`npm start`

Para desarrollo, si el proyecto tiene configurado el script correspondiente:

`npm run dev`

El servidor utilizará el puerto definido en la variable de entorno PORT.

### 11. Endpoints disponibles

#### Health check

**GET /api/health**

Permite comprobar que el servidor se encuentra activo.

Respuesta de ejemplo:
```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```
#### Listado de eventos

**GET /api/events**

Devuelve el listado de eventos disponibles.

En esta etapa inicial todavía no se implementó la gestión completa de eventos, por lo que puede devolver una lista vacía:
```json
{
  "status": "success",
  "payload": []
}
```
#### Registro de usuarios

**POST /api/sessions/register**

Registra un nuevo usuario validando y normalizando sus datos y almacenando la contraseña de forma segura.

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
![alt text](/public/img/image.png)

Captura de MongoDB:
![alt text](/public/img/image-1.png)

#### 3. Email inválido

Enviar un email que no cumpla con el formato esperado.

Resultado esperado:

+ HTTP 400.
+ Usuario no almacenado. 

Captura de Postman:
![alt text](/public/img/image-2.png)

#### 4. Email ya registrado

Intentar registrar nuevamente un email existente.

Resultado esperado:

+ HTTP 409.
+ No se crea un segundo usuario. 

Captura de Postman:
![alt text](/public/img/image-3.png)

### 12.  Seguridad y buenas prácticas

En esta etapa se aplican las siguientes medidas:

+ Las contraseñas no se almacenan en texto plano.
+ Se utiliza bcrypt para generar el hash.
+ El email se normaliza antes de persistirlo.
+ Se evita el registro de emails duplicados.
+ El rol no puede ser establecido desde el registro público.
+ La contraseña no se devuelve en las respuestas HTTP.
+ Las credenciales y variables sensibles se mantienen fuera del repositorio.
+ La lógica de negocio se mantiene separada de las rutas.
+ El hash de contraseñas se encuentra encapsulado en un helper reutilizable. 14. Próximas etapas

Esta entrega incorpora el primer flujo funcional de usuarios de la Plataforma de Eventos e Inscripciones.

Sobre la arquitectura establecida en la Pre-entrega N.º 1 se agrega:

+ Modelo User persistente mediante Mongoose.
+ Conexión con MongoDB.
+ Endpoint POST /api/sessions/register.
+ Validación de datos.
+ Normalización de emails.
+ Detección de usuarios duplicados.
+ Hash de contraseñas mediante bcrypt.
+ Helper reutilizable para el hash.
+ Protección del campo role.
+ Exclusión de la contraseña de las respuestas.

La autenticación y autorización todavía no forman parte de esta entrega y serán desarrolladas en etapas posteriores.
