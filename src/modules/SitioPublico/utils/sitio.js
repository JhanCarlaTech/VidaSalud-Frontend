/**
 * Contenido editable de la página principal.
 *
 * Imágenes: copie el archivo en 'Frontend/public/img/' y escriba aquí su ruta,
 * por ejemplo '/img/portada.jpg'. Mientras sea null se muestra un espacio
 * reservado con el tamaño recomendado.
 */
export const IMAGENES_SITIO = Object.freeze({
  portada: null, // 1200 × 1400, fachada o equipo médico
  nosotros: null, // 1200 × 900, recepción o sala de espera
  galeria: [null, null, null], // 800 × 600 cada una: consultorios, laboratorio, equipos
  mapa: null, // 1200 × 700, captura del mapa de ubicación
})

/** Datos de contacto que se muestran en la sección "Contáctanos". */
export const CONTACTO_CLINICA = Object.freeze({
  direccion: 'Av. Principal #123, Santa Cruz de la Sierra, Bolivia',
  telefono: '+591 3 3000000',
  whatsapp: '+591 70000000',
  correo: 'contacto@vidasalud.com',
  horario: [
    { dias: 'Lunes a viernes', horas: '07:00 – 20:00' },
    { dias: 'Sábados', horas: '08:00 – 13:00' },
    { dias: 'Emergencias', horas: 'Las 24 horas' },
  ],
})

/** Anclas de las secciones, en el orden del menú superior. */
export const SECCIONES_SITIO = Object.freeze([
  { id: 'especialidades', etiqueta: 'Especialidades' },
  { id: 'nosotros', etiqueta: 'Nosotros' },
  { id: 'agendar', etiqueta: 'Agendar cita' },
  { id: 'contacto', etiqueta: 'Contáctanos' },
])

/** Desplaza la página hasta una sección por su id. */
export function irASeccion(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
