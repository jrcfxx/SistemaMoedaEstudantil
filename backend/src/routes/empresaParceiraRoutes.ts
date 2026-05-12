import { Router } from 'express';
import { empresaParceiraController } from '../controllers/empresaParceiraController';

export const empresaParceiraRoutes = Router();

empresaParceiraRoutes.get('/', empresaParceiraController.findAll);
empresaParceiraRoutes.get('/:id', empresaParceiraController.findById);
empresaParceiraRoutes.post('/', empresaParceiraController.create);
empresaParceiraRoutes.put('/:id', empresaParceiraController.update);
empresaParceiraRoutes.delete('/:id', empresaParceiraController.delete);
