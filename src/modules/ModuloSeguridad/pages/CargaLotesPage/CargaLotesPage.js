import { useState } from 'react'
import { descargarArchivo } from '../../../../shared/utils/archivos'
import { descargarPlantilla, importarArchivo, validarImportacion } from '../../services/importacion.service'

/** Igual que ImportLoteRequest en el backend: CSV de hasta 2 MB. */
const EXTENSIONES_PERMITIDAS = ['csv', 'txt']
const TAMANO_MAXIMO_BYTES = 2 * 1024 * 1024

/** Tipos de carga (ImportLoteService::TIPOS) con las columnas de su plantilla. */
export const TIPOS_CARGA = Object.freeze({
  personal: {
    etiqueta: 'Personal administrativo',
    descripcion: 'Administradores y recepcionistas. Los médicos se registran en Personal médico.',
    obligatorias: ['ci', 'nombre', 'apellido', 'correo', 'roles'],
    opcionales: ['telefono', 'sexo', 'contrasena'],
  },
  pacientes: {
    etiqueta: 'Pacientes',
    descripcion: 'Cuentas de pacientes con su ficha médica y contacto de emergencia.',
    obligatorias: ['ci', 'nombre', 'apellido', 'correo', 'fecha_nacimiento'],
    opcionales: ['telefono', 'sexo', 'tipo_sangre', 'contacto_nombre', 'contacto_apellido', 'contacto_parentesco', 'contacto_telefono', 'contrasena'],
  },
})

/** E1 detectado antes de enviar el archivo (el servidor lo vuelve a validar), o null. */
function validarArchivoLocal(archivo) {
  const extension = archivo.name.split('.').pop()?.toLowerCase()
  if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
    return 'El archivo debe ser CSV. En Excel use "Guardar como" → "CSV (delimitado por comas)".'
  }
  if (archivo.size > TAMANO_MAXIMO_BYTES) return 'El archivo no debe superar los 2 MB.'
  if (archivo.size === 0) return 'El archivo está vacío.'
  return null
}

/**
 * Lógica de la carga por lotes (CU04). El flujo tiene tres pasos:
 * elegir tipo y archivo → revisar la vista previa → confirmar la importación.
 * Cambiar el tipo o el archivo descarta la vista previa, porque ya no corresponde.
 */
export function useCargaLotesPage() {
  const [tipo, setTipo] = useState('personal')
  const [archivo, setArchivo] = useState(null)
  const [errorArchivo, setErrorArchivo] = useState('')
  const [error, setError] = useState('')
  const [vistaPrevia, setVistaPrevia] = useState(null)
  const [validando, setValidando] = useState(false)
  const [descargando, setDescargando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [resultado, setResultado] = useState(null)
  // Cambia para vaciar el <input type="file"> al empezar una carga nueva.
  const [claveSelector, setClaveSelector] = useState(0)

  function descartarVistaPrevia() {
    setVistaPrevia(null)
    setError('')
  }

  function cambiarTipo(evento) {
    setTipo(evento.target.value)
    descartarVistaPrevia()
  }

  function seleccionarArchivo(evento) {
    const elegido = evento.target.files?.[0] ?? null
    descartarVistaPrevia()
    setArchivo(elegido)
    setErrorArchivo(elegido ? (validarArchivoLocal(elegido) ?? '') : '')
  }

  async function bajarPlantilla() {
    setDescargando(true)
    setError('')
    try {
      descargarArchivo(await descargarPlantilla(tipo), `plantilla_${tipo}.csv`)
    } catch (err) {
      setError(err.message)
    } finally {
      setDescargando(false)
    }
  }

  async function validar() {
    if (!archivo) {
      setErrorArchivo('Seleccione el archivo a cargar.')
      return
    }
    if (errorArchivo) return

    setValidando(true)
    descartarVistaPrevia()
    try {
      setVistaPrevia(await validarImportacion(tipo, archivo))
    } catch (err) {
      // E1/E2: los problemas del archivo completo llegan en el campo 'archivo'.
      if (err.errors?.archivo || err.errors?.tipo) setErrorArchivo((err.errors.archivo ?? err.errors.tipo)[0])
      else setError(err.message)
    } finally {
      setValidando(false)
    }
  }

  /** Respuesta de POST /importaciones: se pasa del modal de confirmación al resultado. */
  function finalizarImportacion(respuesta) {
    setConfirmando(false)
    setResultado({ mensaje: respuesta.message, ...respuesta.data })
  }

  function nuevaCarga() {
    setArchivo(null)
    setErrorArchivo('')
    setResultado(null)
    descartarVistaPrevia()
    setClaveSelector((clave) => clave + 1)
  }

  return {
    tipo,
    configuracion: TIPOS_CARGA[tipo],
    archivo,
    errorArchivo,
    error,
    vistaPrevia,
    // E3: no se puede importar mientras alguna fila tenga errores.
    puedeImportar: vistaPrevia !== null && vistaPrevia.resumen.con_errores === 0 && vistaPrevia.resumen.validas > 0,
    validando,
    descargando,
    confirmando,
    resultado,
    claveSelector,
    cambiarTipo,
    seleccionarArchivo,
    bajarPlantilla,
    validar,
    abrirConfirmacion: () => setConfirmando(true),
    cerrarConfirmacion: () => setConfirmando(false),
    importar: () => importarArchivo(tipo, archivo),
    finalizarImportacion,
    nuevaCarga,
  }
}
