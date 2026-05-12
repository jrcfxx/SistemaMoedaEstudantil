import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';

export const dashboardController = {
  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await dashboardService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },
};
