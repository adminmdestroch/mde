import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { parse as parseQS } from 'querystring'
import handlebars from 'vite-plugin-handlebars'

const requireCjs = createRequire(resolve(__dirname, 'package.json'))

function apiDev() {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\/+|\/+$/g, '')
        if (!/^[\w-]+$/.test(name) || name.startsWith('_')) return next()

        const file = resolve(__dirname, 'api', name + '.js')
        if (!existsSync(file)) return next()

        // Helpers façon Express/Vercel
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }

        // Parse urlencoded / JSON (le multipart est laissé au handler)
        const type = req.headers['content-type'] || ''
        if (type.includes('application/x-www-form-urlencoded') || type.includes('application/json')) {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const raw = Buffer.concat(chunks).toString()
          try {
            req.body = type.includes('json') ? JSON.parse(raw || '{}') : parseQS(raw)
          } catch {
            req.body = {}
          }
        }

        try {
          delete requireCjs.cache[requireCjs.resolve(file)] // recharge à chaque appel
          await requireCjs(file)(req, res)
        } catch (e) {
          console.error(e)
          res.status(500).json({ erreur: e.message })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Charge mde/.env dans process.env pour les handlers (RH_EMAIL, SMTP_USER, etc.)
  const env = loadEnv(mode, __dirname, '')
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v
  }

  return {
    root: 'frontend',
    plugins: [
      vue(),
      handlebars({ partialDirectory: resolve(__dirname, 'frontend/partials') }),
      apiDev(),
    ],
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'frontend/index.html'),
          services: resolve(__dirname, 'frontend/services.html'),
          soutenir: resolve(__dirname, 'frontend/soutenir.html'),
          benevolatEmploi: resolve(__dirname, 'frontend/benevolat-emploi.html'),
          publications: resolve(__dirname, 'frontend/publications.html'),
          joindre: resolve(__dirname, 'frontend/joindre.html'),
          confirmation: resolve(__dirname, 'frontend/confirmation.html'),
        },
      },
    },
  }
})