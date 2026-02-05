import { promises as fs } from 'fs';
import { dirname } from 'path';

/**
 * Utilidades para leer y escribir archivos JSON
 */

/**
 * Lee un archivo JSON y lo parsea
 */
export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Archivo no existe
      return null;
    }
    throw error;
  }
}

/**
 * Escribe datos en un archivo JSON
 */
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  // Asegurarse de que el directorio existe
  const dir = dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  // Escribir el archivo con formato legible
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Lee un archivo JSON o devuelve un valor por defecto si no existe
 */
export async function readJsonFileOrDefault<T>(
  filePath: string,
  defaultValue: T
): Promise<T> {
  const data = await readJsonFile<T>(filePath);
  return data ?? defaultValue;
}
