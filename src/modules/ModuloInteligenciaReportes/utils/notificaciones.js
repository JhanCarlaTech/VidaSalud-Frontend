/** Estado del correo de una notificación (Notificacion::ESTADOS_CORREO). */
export const ETIQUETA_CORREO = Object.freeze({
  pendiente: 'Correo pendiente',
  enviado: 'Correo enviado',
  omitido: 'Solo en la app',
  fallido: 'Correo fallido',
})

/** @type {Record<string, 'advertencia' | 'exito' | 'neutro' | 'peligro'>} */
export const VARIANTE_CORREO = Object.freeze({
  pendiente: 'advertencia',
  enviado: 'exito',
  omitido: 'neutro',
  fallido: 'peligro',
})

/** Estados que Recepción puede reenviar (RN06). */
export const CORREO_REENVIABLE = Object.freeze(['pendiente', 'fallido'])
