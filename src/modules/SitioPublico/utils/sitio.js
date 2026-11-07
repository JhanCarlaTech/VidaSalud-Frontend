/**
 * Contenido editable de la página principal.
 *
 * Imágenes: están en 'Frontend/public/img/', recortadas y escaladas al tamaño
 * exacto de su espacio (los originales están en 'Backend/Imagenes/'). Para
 * cambiar una, reemplace el archivo respetando el tamaño indicado. Con null se
 * muestra un espacio reservado con el tamaño recomendado.
 */
export const IMAGENES_SITIO = Object.freeze({
  portada: '/img/portada.jpg', // 1200 × 1400, fachada de la clínica
  nosotros: '/img/nosotros-recepcion.jpg', // 1200 × 900, recepción o sala de espera
  // 800 × 600 cada una, en el orden de la galería: consultorios, laboratorio, equipamiento
  galeria: ['/img/consultorios.jpg', '/img/laboratorio.jpg', '/img/equipamiento.jpg'],
  mapa: '/img/mapa-ubicacion.jpg', // 1200 × 700, captura del mapa de ubicación
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
