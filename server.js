import 'dotenv/config'
import { createApp } from './src/app.js'
import { connectDB } from './src/config/db.js'

const PORT = process.env.PORT || 4000

async function start() {
  await connectDB()
  const app = createApp()
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('[server] failed to start:', err.message)
  process.exit(1)
})
