import { Router } from 'express'
import { empresaParceiraController } from '../controllers/empresaParceiraController'

const router = Router()

router.get('/', empresaParceiraController.index)
router.get('/:id', empresaParceiraController.show)
router.post('/', empresaParceiraController.store)
router.put('/:id', empresaParceiraController.update)
router.delete('/:id', empresaParceiraController.destroy)

export default router
