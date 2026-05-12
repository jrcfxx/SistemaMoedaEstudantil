import { Router } from 'express';
import { instituicaoController } from '../controllers/instituicaoController';

export const instituicaoRoutes = Router();

instituicaoRoutes.get('/', instituicaoController.findAll);
instituicaoRoutes.get('/:id', instituicaoController.findById);
instituicaoRoutes.post('/', instituicaoController.create);
instituicaoRoutes.put('/:id', instituicaoController.update);
instituicaoRoutes.delete('/:id', instituicaoController.delete);
