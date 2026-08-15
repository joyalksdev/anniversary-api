import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import authRoutes from './routes/auth.routes.js'
import answersRoutes from './routes/answers.routes.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN,
      credentials: true, // required so the browser sends/receives the httpOnly cookie
    })
  )
  app.use(cookieParser())
  app.use(express.json())
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
  }

  app.get('/api/health', (req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRoutes)
  app.use('/api/answers', answersRoutes)

  // 404
  app.use((req, res) => res.status(404).json({ error: 'Not found.' }))

  // central error handler — keeps stack traces out of the response
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({ error: err.publicMessage || 'Something went wrong.' })
  })

  return app
}
