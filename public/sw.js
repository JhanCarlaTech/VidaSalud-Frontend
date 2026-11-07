/*
 * Service worker de Clínica Vida Salud – notificaciones push (CU20).
 * Recibe los avisos del servicio push del navegador y los muestra aunque la
 * página esté cerrada. Al tocar un aviso abre (o enfoca) la bandeja de notificaciones.
 */

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (evento) => evento.waitUntil(self.clients.claim()))

self.addEventListener('push', (evento) => {
  let datos
  try {
    datos = evento.data ? evento.data.json() : {}
  } catch {
    datos = { cuerpo: evento.data ? evento.data.text() : '' }
  }

  const titulo = datos.titulo || 'Clínica Vida Salud'
  evento.waitUntil(
    self.registration.showNotification(titulo, {
      body: datos.cuerpo || '',
      icon: '/icons/icono-192.png',
      badge: '/icons/insignia-96.png',
      lang: 'es',
      // La misma etiqueta reemplaza el aviso anterior (p. ej., la misma cita) y vuelve a sonar.
      tag: datos.etiqueta || undefined,
      renotify: Boolean(datos.etiqueta),
      data: { url: datos.url || '/' },
    }),
  )
})

self.addEventListener('notificationclick', (evento) => {
  evento.notification.close()
  const destino = new URL(evento.notification.data?.url || '/', self.location.origin).href

  evento.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const abierta = ventanas.find((ventana) => ventana.url.startsWith(self.location.origin))
      if (abierta) {
        await abierta.focus()
        try {
          await abierta.navigate(destino)
        } catch {
          // Pestaña no controlada por este service worker: basta con enfocarla.
        }
        return
      }
      await self.clients.openWindow(destino)
    })(),
  )
})
