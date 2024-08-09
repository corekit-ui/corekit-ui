import { APP_BASE_HREF } from '@angular/common'
import { CommonEngine } from '@angular/ssr'
import express from 'express'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import bootstrap from './src/main.server'

export function app(): express.Express {
  const server = express()
  const serverDistFolder = dirname(fileURLToPath(import.meta.url))
  const browserDistFolder = resolve(serverDistFolder, '../browser')
  const indexHtml = join(serverDistFolder, 'index.server.html')

  const commonEngine = new CommonEngine()

  server.set('view engine', 'html')
  server.set('views', browserDistFolder)

  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html'
    })
  )

  server.get('**', (request, response, next) => {
    const { protocol, originalUrl, baseUrl, headers } = request

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]
      })
      .then(html => response.send(html))
      .catch((error: unknown) => next(error))
  })

  return server
}

function run(): void {
  const port = process.env['PORT'] ?? 4000
  const server = app()

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

run()
