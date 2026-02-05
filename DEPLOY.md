# 🚀 Guía de Deploy - Calificador de Ascensores

## 📦 Arquitectura del Deploy

- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway.app (Express + Node.js)
- **Base de datos**: Archivo JSON (persistido en Railway)

---

## 🎯 PASO 1: Deploy del Backend en Railway

### 1.1 Crear cuenta en Railway
- Ve a https://railway.app
- Crea una cuenta (gratis)

### 1.2 Subir el código a GitHub
```bash
# Desde la raíz del proyecto
git add .
git commit -m "Preparar para deploy en Railway y Vercel"
git push origin main
```

### 1.3 Crear proyecto en Railway
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `calificador-ascensores`
5. Railway detectará automáticamente que es Node.js

### 1.4 Configurar el proyecto
1. En Railway, ve a Settings → Environment
2. Agrega la variable:
   ```
   PORT=3001
   ```

3. En Settings → Deploy, verifica:
   - **Build Command**: `npm install`
   - **Start Command**: `node src/api/server.js`

4. Click en "Deploy"

### 1.5 Obtener la URL de tu API
1. En Railway, ve a Settings → Domains
2. Click en "Generate Domain"
3. Copia la URL (algo como: `https://calificador-ascensores-production.up.railway.app`)
4. **Guarda esta URL**, la necesitarás en el siguiente paso

---

## 🌐 PASO 2: Deploy del Frontend en Vercel

### 2.1 Crear cuenta en Vercel
- Ve a https://vercel.com
- Crea cuenta con GitHub

### 2.2 Actualizar la URL de la API
```bash
# Edita el archivo web/.env.production
# Reemplaza con tu URL de Railway del paso 1.5
VITE_API_URL=https://TU-URL-DE-RAILWAY.up.railway.app/api
```

### 2.3 Commit y push
```bash
git add web/.env.production
git commit -m "Configurar URL de API para producción"
git push origin main
```

### 2.4 Importar proyecto en Vercel
1. En Vercel, click en "Add New..." → "Project"
2. Importa tu repositorio de GitHub
3. Configuración:
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Click en "Deploy"

### 2.5 Vercel te dará una URL
Algo como: `https://calificador-ascensores.vercel.app`

---

## ✅ PASO 3: Verificar que Todo Funciona

1. Abre tu URL de Vercel en el navegador
2. Intenta crear un nuevo ascensor
3. Verifica que se guarde correctamente
4. Revisa las estadísticas

---

## 🔧 Troubleshooting

### Error de CORS
Si ves errores de CORS, agrega esto en `src/api/server.ts`:

```typescript
app.use(cors({
  origin: 'https://tu-dominio.vercel.app',
  credentials: true
}));
```

### La API no responde
1. Ve a Railway → Logs
2. Revisa si hay errores
3. Verifica que la variable `PORT` esté configurada

### El frontend no encuentra la API
1. Verifica que `web/.env.production` tenga la URL correcta de Railway
2. Haz rebuild en Vercel (Deployments → ... → Redeploy)

---

## 🎨 URLs Finales

Después del deploy, tendrás:

- **Frontend**: `https://tu-proyecto.vercel.app`
- **Backend**: `https://tu-proyecto.up.railway.app`

¡Listo! Tu aplicación está en la nube. 🎉

---

## 💡 Comandos Útiles

### Ver logs del backend
```bash
railway logs
```

### Redeploy del frontend
- Ve a Vercel → Deployments → ... → Redeploy

### Actualizar el código
```bash
git add .
git commit -m "Actualización"
git push
# Railway y Vercel se actualizarán automáticamente
```
