import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import elevatorRoutes from './routes/elevatorRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Calificador de Ascensores API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/elevators', elevatorRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API REST corriendo en http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`   - POST /api/auth/register - Crear cuenta`);
  console.log(`   - POST /api/auth/login - Iniciar sesión`);
  console.log(`   - GET /api/auth/me - Obtener perfil (requiere token)`);
  console.log(`📊 Elevators API: http://localhost:${PORT}/api/elevators`);
  console.log(`   - GET /api/elevators/my - Mis ascensores (requiere token)\n`);
});

export default app;
