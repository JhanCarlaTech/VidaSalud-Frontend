import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Select } from '../../../../shared/components/ui/Select'
import { RUTAS } from '../../../../shared/utils/constants'
import { eliminarLicencia } from '../../services/licencias.service'
import { describirPeriodo, ETIQUETA_ESTADO, OPCIONES_PERIODO } from '../../utils/licencias'
import { CitasLicenciaModal } from './components/CitasLicenciaModal'
import { LicenciaFormModal } from './components/LicenciaFormModal'
import { useLicenciasPage } from './LicenciasPage'

const VARIANTE_ESTADO = { vigente: 'solido', proxima: 'neutro', finalizada: 'contorno' }

/**
 * CU10 – Gestionar Licencias y Bloqueos de Agenda.
 * @param {boolean} propias  "Mis licencias" del Médico (true) o vista del Administrador (false).
 */
export function LicenciasPage({ propias = false }) {
  const pagina = useLicenciasPage(propias)
  const { modal } = pagina
  // El Administrador elige el médico en el formulario; hasta que carga la lista no puede registrar.
  const medicosFormulario = propias ? null : (pagina.medicos ?? [])

  const columnas = [
    ...(propias
      ? []
      : [
          {
            clave: 'medico',
            titulo: 'Médico',
            render: (licencia) => (
              <div className="flex flex-col">
                <span className="font-semibold">{licencia.medico.nombre_completo}</span>
                <span className="text-suave">{licencia.medico.codigo}</span>
              </div>
            ),
          },
        ]),
    {
      clave: 'periodo',
      titulo: 'Periodo',
      render: (licencia) => (
        <div className="flex flex-col">
          <span className="font-medium">{describirPeriodo(licencia)}</span>
          <span className="text-suave">{licencia.motivo}</span>
        </div>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (licencia) => <Badge variante={VARIANTE_ESTADO[licencia.estado]}>{ETIQUETA_ESTADO[licencia.estado]}</Badge>,
    },
    {
      clave: 'citas',
      titulo: 'Citas pendientes',
      render: (licencia) =>
        licencia.citas_afectadas > 0 ? (
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirCitas(licencia)}>
            {licencia.citas_afectadas === 1 ? 'Ver 1 cita' : `Ver ${licencia.citas_afectadas} citas`}
          </Button>
        ) : (
          <span className="text-suave">Ninguna</span>
        ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      // RN04: las finalizadas son historial; las que ya empezaron solo se editan (se acorta o extiende su fin).
      render: (licencia) =>
        licencia.estado === 'finalizada' ? (
          <span className="text-xs text-suave">Historial</span>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(licencia)}>
              Editar
            </Button>
            {licencia.estado === 'proxima' && (
              <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEliminacion(licencia)}>
                Eliminar
              </Button>
            )}
          </div>
        ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          {!propias && (
            <Link to={RUTAS.ADMIN_MEDICOS} className="text-sm text-suave hover:text-texto hover:underline">
              ← Volver a médicos
            </Link>
          )}
          <h1 className="text-3xl font-semibold">{propias ? 'Mis licencias' : 'Licencias y bloqueos'}</h1>
          <p className="text-suave">
            Vacaciones, bajas, capacitaciones y otras ausencias. Durante una licencia los turnos no se ofrecen para reservar.
          </p>
        </div>
        <Button onClick={pagina.abrirNueva} disabled={!propias && pagina.medicos === null}>
          Registrar licencia
        </Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className={`grid gap-4 ${propias ? 'sm:max-w-xs' : 'sm:grid-cols-2 lg:max-w-2xl'}`}>
        {!propias && (
          <Select
            etiqueta="Médico"
            name="medico"
            value={pagina.medico}
            onChange={pagina.cambiarMedico}
            opciones={[
              { valor: '', etiqueta: 'Todos los médicos' },
              ...(pagina.medicos ?? []).map((medico) => ({
                valor: String(medico.id),
                etiqueta: `${medico.nombre_completo}${medico.activo ? '' : ' (inactivo)'}`,
              })),
            ]}
          />
        )}
        <Select etiqueta="Periodo" name="periodo" value={pagina.periodo} onChange={pagina.cambiarPeriodo} opciones={OPCIONES_PERIODO} />
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.licencias}
        obtenerClave={(licencia) => licencia.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.periodo === 'finalizadas' ? 'No hay licencias finalizadas.' : 'No hay licencias en este periodo.'}
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {modal?.tipo === 'formulario' && (
        <LicenciaFormModal
          licencia={modal.licencia}
          medicos={medicosFormulario}
          idMedicoInicial={pagina.medico}
          onCerrar={pagina.cerrarModal}
          onGuardado={pagina.finalizarGuardado}
        />
      )}

      {modal?.tipo === 'citas' && <CitasLicenciaModal licencia={modal.licencia} onCerrar={pagina.cerrarModal} />}

      {modal?.tipo === 'resultado' && <CitasLicenciaModal citas={modal.citas} mensaje={modal.mensaje} onCerrar={pagina.cerrarModal} />}

      {modal?.tipo === 'eliminar' && (
        <ConfirmModal
          titulo="Eliminar licencia"
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarLicencia(modal.licencia.id)}
          onExito={pagina.finalizarEliminacion}
          onCerrar={pagina.cerrarModal}
        >
          <p>
            Se eliminará la licencia del <strong className="font-semibold">{describirPeriodo(modal.licencia)}</strong>
            {!propias && <> de {modal.licencia.medico.nombre_completo}</>} ({modal.licencia.motivo}). Los turnos de ese periodo
            volverán a estar disponibles para reservar.
          </p>
        </ConfirmModal>
      )}
    </section>
  )
}
