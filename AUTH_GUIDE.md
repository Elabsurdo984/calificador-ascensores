# Guía de Autenticación - Calificador de Ascensores

## 🔐 Sistema de Autenticación

El sistema ahora incluye autenticación completa con JWT (JSON Web Tokens). Cada usuario puede crear su cuenta y gestionar sus propios ascensores.

## 🚀 Endpoints de Autenticación

### 1. Registrar nueva cuenta

```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "miPassword123",
  "name": "Nombre del Usuario"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "name": "Nombre del Usuario",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Iniciar sesión

```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "miPassword123"
}
```

**Respuesta exitosa:**
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Obtener perfil actual

```bash
GET http://localhost:3001/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🏢 Endpoints de Ascensores (Protegidos)

### Crear ascensor (requiere autenticación)

```bash
POST http://localhost:3001/api/elevators
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "location": {
    "name": "Torre Central",
    "city": "Madrid",
    "country": "España",
    "type": "office",
    ...
  },
  "speedMeasurement": { ... },
  "rating": { ... }
}
```

### Obtener mis ascensores

```bash
GET http://localhost:3001/api/elevators/my
Authorization: Bearer TU_TOKEN_AQUI
```

### Actualizar/Eliminar ascensor

Solo puedes modificar o eliminar ascensores que tú creaste.

```bash
PUT http://localhost:3001/api/elevators/:id
Authorization: Bearer TU_TOKEN_AQUI

DELETE http://localhost:3001/api/elevators/:id
Authorization: Bearer TU_TOKEN_AQUI
```

## 🔑 Uso del Token

Una vez que inicies sesión o te registres, recibirás un token JWT. Debes incluir este token en el header `Authorization` de todas las peticiones protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El token tiene una validez de **7 días**.

## 🛡️ Seguridad

- Las contraseñas se hashean con bcrypt antes de guardarse
- El token JWT está firmado con una clave secreta (configurable en `.env`)
- Solo el creador de un ascensor puede modificarlo o eliminarlo
- Los ascensores están asociados al usuario mediante relación en la base de datos

## 📋 Endpoints Públicos

Estos endpoints NO requieren autenticación:

- `GET /api/elevators` - Ver todos los ascensores
- `GET /api/elevators/:id` - Ver un ascensor específico
- `GET /api/elevators/city/:city` - Buscar por ciudad
- `GET /api/elevators/type/:type` - Buscar por tipo
- `GET /api/elevators/top/:limit` - Top ascensores

## 🔧 Configuración

Asegúrate de tener estas variables en tu archivo `.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
JWT_SECRET="tu-clave-secreta-super-segura"
```

**IMPORTANTE:** Cambia `JWT_SECRET` en producción por una clave única y segura.

## 💾 Persistencia

Los ascensores se guardan en la base de datos SQLite (Prisma) y están asociados al usuario que los creó. Esto significa que:

- ✅ Los ascensores persisten aunque cambies de base de datos
- ✅ Cada usuario solo puede ver/modificar sus propios ascensores
- ✅ Si eliminas un usuario (CASCADE), se eliminan sus ascensores
- ✅ Los datos están estructurados y relacionados correctamente

## 🧪 Ejemplo de Flujo Completo

```bash
# 1. Registrarse
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'

# 2. Guardar el token que recibes
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Crear un ascensor
curl -X POST http://localhost:3001/api/elevators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ ... datos del ascensor ... }'

# 4. Ver mis ascensores
curl http://localhost:3001/api/elevators/my \
  -H "Authorization: Bearer $TOKEN"
```

## ❗ Validaciones

- **Email:** Debe tener formato válido
- **Contraseña:** Mínimo 6 caracteres
- **Nombre:** Requerido
- **Token:** Debe ser válido y no expirado
- **Ownership:** Solo puedes modificar tus propios ascensores
