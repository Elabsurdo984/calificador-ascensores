import { Router, Request, Response } from 'express';
import { PrismaElevatorRepository } from '../../infra';
import { CreateElevatorDTO } from '../../domain';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();
const repository = new PrismaElevatorRepository();

/**
 * GET /api/elevators
 * Obtiene todos los ascensores (públicos)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const elevators = await repository.findAll();
    res.json(elevators);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ascensores' });
  }
});

/**
 * GET /api/elevators/my
 * Obtiene los ascensores del usuario autenticado
 */
router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  try {
    const elevators = await repository.findByUserId(req.userId!);
    res.json(elevators);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tus ascensores' });
  }
});

/**
 * GET /api/elevators/:id
 * Obtiene un ascensor por ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const elevator = await repository.findById(id);
    if (!elevator) {
      return res.status(404).json({ error: 'Ascensor no encontrado' });
    }
    res.json(elevator);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ascensor' });
  }
});

/**
 * GET /api/elevators/city/:city
 * Busca ascensores por ciudad
 */
router.get('/city/:city', async (req: Request, res: Response) => {
  try {
    const city = String(req.params.city);
    const elevators = await repository.findByCity(city);
    res.json(elevators);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar por ciudad' });
  }
});

/**
 * GET /api/elevators/type/:type
 * Busca ascensores por tipo
 */
router.get('/type/:type', async (req: Request, res: Response) => {
  try {
    const type = String(req.params.type);
    const elevators = await repository.findByType(type);
    res.json(elevators);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar por tipo' });
  }
});

/**
 * GET /api/elevators/top/:limit
 * Obtiene los top N ascensores mejor calificados
 */
router.get('/top/:limit', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(String(req.params.limit));
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Límite inválido' });
    }
    const elevators = await repository.findTopRated(limit);
    res.json(elevators);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener top ascensores' });
  }
});

/**
 * POST /api/elevators
 * Crea un nuevo ascensor (requiere autenticación)
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const dto: CreateElevatorDTO = req.body;

    // Validación básica
    if (!dto.location?.name || !dto.speedMeasurement || !dto.rating) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const elevator = await repository.save(dto, req.userId!);
    res.status(201).json(elevator);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al crear ascensor' });
  }
});

/**
 * PUT /api/elevators/:id
 * Actualiza un ascensor existente (requiere autenticación y ser el dueño)
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    // Verificar que el usuario sea el dueño
    const isOwner = await repository.isOwner(id, req.userId!);
    if (!isOwner) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este ascensor' });
    }

    const updated = await repository.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Ascensor no encontrado' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al actualizar ascensor' });
  }
});

/**
 * DELETE /api/elevators/:id
 * Elimina un ascensor (requiere autenticación y ser el dueño)
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    // Verificar que el usuario sea el dueño
    const isOwner = await repository.isOwner(id, req.userId!);
    if (!isOwner) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este ascensor' });
    }

    const deleted = await repository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ascensor no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ascensor' });
  }
});

export default router;
