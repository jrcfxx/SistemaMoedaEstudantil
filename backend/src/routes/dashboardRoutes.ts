import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', dashboardController.getStats);
