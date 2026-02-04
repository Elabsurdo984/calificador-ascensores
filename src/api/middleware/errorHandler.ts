import { Request, Response, NextFunction } from 'express';

/**
 * Middleware global de manejo de errores
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
}

/**
 * Middleware para rutas no encontradas
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
}
