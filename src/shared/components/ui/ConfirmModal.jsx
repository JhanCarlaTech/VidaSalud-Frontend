import { useState } from 'react'
import { Alert } from './Alert'
import { Button } from './Button'
import { Modal } from './Modal'

/** Primer mensaje de error de campo enviado por el servidor, o el mensaje general. */
function mensajeDeError(error) {
  return Object.values(error.errors ?? {})[0]?.[0] ?? error.message
}

/**
 * Diálogo de confirmación para acciones como activar o desactivar registros.
 * Gestiona el estado de envío y muestra el error del servidor si la acción falla.
 *
 * @param {() => Promise<any>} onConfirmar  Ejecuta la acción; su resultado se pasa a onExito.
 * @param {(resultado) => void} onExito
 */
export function ConfirmModal({ titulo, textoConfirmar, onConfirmar, onExito, onCerrar, children }) {
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  async function confirmar() {
    setEnviando(true)
    setError('')
    try {
      onExito(await onConfirmar())
    } catch (err) {
      setError(mensajeDeError(err))
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto
      titulo={titulo}
      onCerrar={enviando ? () => {} : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button onClick={confirmar} cargando={enviando}>
            {textoConfirmar}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 text-sm">
        {error && <Alert variante="error">{error}</Alert>}
        {children}
      </div>
    </Modal>
  )
}
