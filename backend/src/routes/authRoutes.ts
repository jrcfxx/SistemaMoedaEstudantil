import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';

export const authRoutes = Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);
authRoutes.post('/register/aluno', authController.registerAluno);
authRoutes.post('/register/empresa', authController.registerEmpresa);
authRoutes.post('/register/admin', authMiddleware, requireRole('ADMIN'), authController.registerAdmin);
authRoutes.get('/me', authMiddleware, authController.me);
