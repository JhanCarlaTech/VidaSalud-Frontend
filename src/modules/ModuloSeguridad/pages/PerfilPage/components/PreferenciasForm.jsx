import { useState } from 'react'
import { Alert } from '../../../../../shared/components/ui/Alert'
import { Button } from '../../../../../shared/components/ui/Button'
import { Select } from '../../../../../shared/components/ui/Select'
import { Toggle } from '../../../../../shared/components/ui/Toggle'
import { actualizarPreferencias } from '../../../services/perfil.service'

const OPCIONES_ANTICIPACION = [2, 12, 24, 48].map((horas) => ({ valor: horas, etiqueta: `${horas} horas antes` }))

/**
 * Preferencias de notificación de las citas (CU05, flujo 4 / RN06).
 * Las usará el envío de recordatorios de CU20.
 */
export function PreferenciasForm({ preferencias, onGuardado }) {
  const [valores, setValores] = useState(preferencias)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const sinCambios = Object.keys(preferencias).every((clave) => preferencias[clave] === valores[clave])
  const sinCanales = !valores.notificar_email && !valores.notificar_push

  function cambiar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const respuesta = await actualizarPreferencias(valores)
      onGuardado(respuesta.message)
    } catch (err) {
      setError(Object.values(err.errors ?? {})[0]?.[0] ?? err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Recordatorios de citas</h2>
        <p className="text-sm text-suave">Elija cómo y con cuánta anticipación desea recibir los avisos de sus citas.</p>
      </div>

      {error && <Alert variante="error">{error}</Alert>}

      <Toggle
        etiqueta="Correo electrónico"
        descripcion="Confirmaciones y recordatorios en su correo."
        activo={valores.notificar_email}
        onCambiar={(valor) => cambiar('notificar_email', valor)}
        disabled={enviando}
      />
      <Toggle
        etiqueta="Notificaciones push"
        descripcion="Avisos en el navegador o la aplicación móvil."
        activo={valores.notificar_push}
        onCambiar={(valor) => cambiar('notificar_push', valor)}
        disabled={enviando}
      />

      <div className="max-w-xs">
        <Select
          etiqueta="Anticipación del recordatorio"
          name="horas_anticipacion"
          value={valores.horas_anticipacion}
          onChange={(evento) => cambiar('horas_anticipacion', Number(evento.target.value))}
          opciones={OPCIONES_ANTICIPACION}
          disabled={enviando || sinCanales}
        />
      </div>

      {sinCanales && <Alert>Con ambos canales desactivados no recibirá recordatorios de sus citas.</Alert>}

      <div className="flex justify-end">
        <Button type="submit" cargando={enviando} disabled={sinCambios}>
          Guardar preferencias
        </Button>
      </div>
    </form>
  )
}
