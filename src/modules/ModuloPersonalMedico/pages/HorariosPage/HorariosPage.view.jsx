import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { RUTAS } from '../../../../shared/utils/constants'
import { HorarioGrid } from '../../components/HorarioGrid'
import { eliminarHorario } from '../../services/horarios.service'
import { DisponibilidadDia } from './components/DisponibilidadDia'
import { HorarioFormModal } from './components/HorarioFormModal'
import { useHorariosPage } from './HorariosPage'

/**
 * CU09 – Gestionar Horarios y Disponibilidad Médica.
 */
export function HorariosPage() {
  const pagina = useHorariosPage()
  const { medico, modal } = pagina

  if (!medico) {
    return pagina.error ? <Alert variante="error">{pagina.error}</Alert> : <Spinner pantallaCompleta mensaje="Cargando horarios…" />
  }

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        {!pagina.esPropia && (
          <Link to={RUTAS.ADMIN_MEDICOS} className="text-sm text-suave hover:text-texto hover:underline">
            ← Volver a médicos
          </Link>
        )}
        <h1 className="text-3xl font-semibold">{pagina.esPropia ? 'Mis horarios' : 'Horarios de atención'}</h1>
        <p className="flex flex-wrap items-center gap-2 text-suave">
          {medico.nombre_completo} · {medico.codigo} · {medico.especialidades.join(', ')}
          {!medico.activo && <Badge variante="contorno">Médico inactivo</Badge>}
        </p>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Grilla semanal</h2>
          <p className="text-sm text-suave">Bloques de atención de cada día. Cada bloque se divide en turnos de la duración indicada.</p>
        </div>
        <HorarioGrid
          horarios={pagina.horarios}
          editable
          onAgregar={pagina.abrirNuevo}
          onEditar={pagina.abrirEdicion}
          onEliminar={pagina.abrirEliminacion}
        />
      </section>

      {/* La disponibilidad se recalcula cuando cambia la grilla, conservando la fecha elegida. */}
      <DisponibilidadDia idMedico={pagina.idMedico} actualizacion={JSON.stringify(pagina.horarios)} />

      {modal?.tipo === 'formulario' && (
        <HorarioFormModal
          idMedico={pagina.idMedico}
          horario={modal.horario}
          diaInicial={modal.dia}
          onCerrar={pagina.cerrarModal}
          onGuardado={pagina.finalizarOperacion}
        />
      )}

      {modal?.tipo === 'eliminar' && (
        <ConfirmModal
          titulo="Eliminar bloque"
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarHorario(pagina.idMedico, modal.horario.id)}
          onExito={(respuesta) => pagina.finalizarOperacion(respuesta.message)}
          onCerrar={pagina.cerrarModal}
        >
          <p>
            Se eliminará el bloque del <strong className="font-semibold">{modal.horario.dia.toLowerCase()}</strong> de{' '}
            {modal.horario.hora_inicio} a {modal.horario.hora_fin}. Las citas ya agendadas no se modifican; si hay citas pendientes
            en este bloque, primero deberá reprogramarlas.
          </p>
        </ConfirmModal>
      )}
    </section>
  )
}
