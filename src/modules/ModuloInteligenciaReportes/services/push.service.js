import httpClient from '../../../core/api/http-client'

/**
 * CU20 – Notificaciones push (Web Push).
 *
 * El navegador se suscribe al servicio push (Google, Mozilla, Apple) con la clave
 * pública VAPID de la clínica, y la API guarda esa suscripción. El service worker
 * (public/sw.js) muestra los avisos aunque la página esté cerrada.
 */

const RUTA_SERVICE_WORKER = '/sw.js'

/** ¿El navegador admite notificaciones push? (En iPhone, solo con la web instalada en la pantalla de inicio.) */
export function pushSoportado() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

/** iPhone/iPad en Safari sin instalar: el push existe, pero solo dentro de la app instalada. */
export function esIosSinInstalar() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const instalada = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
  return ios && !instalada
}

/** @returns {Promise<{ habilitado: boolean, clave_publica: string|null, dispositivos: number }>} */
export async function obtenerConfiguracionPush() {
  const respuesta = await httpClient.get('/push/configuracion')
  return respuesta.data
}

export function enviarPrueba() {
  return httpClient.post('/push/prueba')
}

/** Clave VAPID en base64url → bytes, como la pide pushManager.subscribe(). */
function claveABytes(base64url) {
  const relleno = '='.repeat((4 - (base64url.length % 4)) % 4)
  const base64 = (base64url + relleno).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(base64), (caracter) => caracter.charCodeAt(0))
}

/** Codificación de contenido que usará el navegador (la moderna si la admite). */
function codificacion() {
  const admitidas = window.PushManager?.supportedContentEncodings ?? ['aesgcm']
  return admitidas.includes('aes128gcm') ? 'aes128gcm' : 'aesgcm'
}

async function registro() {
  return navigator.serviceWorker.getRegistration('/')
}

/** Suscripción push actual de este navegador, o null. */
export async function suscripcionActual() {
  if (!pushSoportado()) return null
  const reg = await registro()
  return reg ? reg.pushManager.getSubscription() : null
}

/** Guarda (o vuelve a vincular al usuario actual) la suscripción de este navegador. */
export function guardarSuscripcion(suscripcion) {
  return httpClient.post('/push/suscripciones', { ...suscripcion.toJSON(), content_encoding: codificacion() })
}

/**
 * Pide permiso, registra el service worker, suscribe el navegador y lo guarda en la API.
 * @returns {Promise<'activado' | 'denegado' | 'descartado'>}
 */
export async function activarPush(clavePublica) {
  const permiso = await Notification.requestPermission()
  if (permiso === 'denied') return 'denegado'
  if (permiso !== 'granted') return 'descartado'

  await navigator.serviceWorker.register(RUTA_SERVICE_WORKER, { scope: '/' })
  const reg = await navigator.serviceWorker.ready
  const opciones = { userVisibleOnly: true, applicationServerKey: claveABytes(clavePublica) }

  let suscripcion
  try {
    suscripcion = await reg.pushManager.subscribe(opciones)
  } catch (error) {
    // Suscripción anterior con otra clave VAPID (las claves del servidor cambiaron): se reemplaza.
    if (error.name !== 'InvalidStateError') throw error
    await (await reg.pushManager.getSubscription())?.unsubscribe()
    suscripcion = await reg.pushManager.subscribe(opciones)
  }

  await guardarSuscripcion(suscripcion)
  return 'activado'
}

/** Quita la suscripción de este navegador en la API y en el servicio push. */
export async function desactivarPush() {
  const suscripcion = await suscripcionActual()
  if (!suscripcion) return
  try {
    await httpClient.delete('/push/suscripciones', { data: { endpoint: suscripcion.endpoint } })
  } finally {
    await suscripcion.unsubscribe()
  }
}

/**
 * Al cerrar sesión: este navegador deja de recibir los avisos de esa cuenta
 * (importante en computadoras compartidas). Nunca impide cerrar la sesión.
 */
export async function desvincularDispositivo() {
  try {
    await desactivarPush()
  } catch {
    // Sin conexión o sin soporte: el cierre de sesión continúa igual.
  }
}
