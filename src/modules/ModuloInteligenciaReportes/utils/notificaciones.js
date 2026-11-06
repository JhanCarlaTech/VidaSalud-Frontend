/** Estado del correo de una notificación (Notificacion::ESTADOS_CORREO). */
export const ETIQUETA_CORREO = Object.freeze({
  pendiente: 'Correo pendiente',
  enviado: 'Correo enviado',
  omitido: 'Solo en la app',
  fallido: 'Correo fallido',
})

/** @type {Record<string, 'solido' | 'neutro' | 'contorno'>} */
export const VARIANTE_CORREO = Object.freeze({
  pendiente: 'neutro',
  enviado: 'contorno',
  omitido: 'contorno',
  fallido: 'solido',
})

/** Estados que Recepción puede reenviar (RN06). */
export const CORREO_REENVIABLE = Object.freeze(['pendiente', 'fallido'])
