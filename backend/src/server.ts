import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { errorHandler } from './middlewares/errorHandler'
import alunoRoutes from './routes/alunoRoutes'
import empresaParceiraRoutes from './routes/empresaParceiraRoutes'

const app = express()

app.use(cors())
app.use(express.json())

// ── Rotas ──────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/alunos', alunoRoutes)
app.use('/api/empresas', empresaParceiraRoutes)

// ── Tratamento de erros (deve ser o último middleware) ──
app.use(errorHandler)

// ── Inicialização ───────────────────────────────────
const PORT = process.env.PORT ?? 3333

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})
