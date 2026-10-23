import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Select } from '../../../../shared/components/ui/Select'
import { RUTAS } from '../../../../shared/utils/constants'
import { CancelarCitaModal } from '../../components/CancelarCitaModal'
import { ReprogramarCitaModal } from '../../components/ReprogramarCitaModal'
import { ESTADOS_CITA, VARIANTE_ESTADO_CITA, fechaCorta, puedeModificar } from '../../utils/citas'
import { useCitasPage } from './CitasPage'

const OPCIONES_PERIODO = [
  { valor: 'proximas', etiqueta: 'Próximas' },
  { valor: 'historial', etiqueta: 'Anteriores' },
  { valor: 'todas', etiqueta: 'Todas' },
]

const OPCIONES_ESTADO = [{ valor: '', etiqueta: 'Todos' }, ...ESTADOS_CITA.map((estado) => ({ valor: estado, etiqueta: estado }))]

/**
 * CU14 – Gestión de citas del personal: búsqueda, reprogramación y cancelación.
 */
export function CitasPage() {
  const navigate = useNavigate()
  const pagina = useCitasPage()
  const { filtros, modal } = pagina

  const columnas = [
    {
      clave: 'cita',
      titulo: 'Cita',
      className: 'whitespace-nowrap',
      render: (cita) => (
        <div className="flex flex-col">
          <span className="font-semibold capitalize">{fechaCorta(cita.fecha)}</span>
          <span className="text-suave tabular-nums">
            {cita.hora_inicio} – {cita.hora_fin} · {cita.codigo}
          </span>
        </div>
      ),
    },
    {
      clave: 'paciente',
      titulo: 'Paciente',
      render: (cita) => (
        <div className="flex flex-col">
          <span className="font-medium">{cita.paciente.nombre_completo}</span>
          <span className="text-suave">{cita.paciente.codigo}</span>
        </div>
      ),
    },
    {
      clave: 'medico',
      titulo: 'Médico',
      render: (cita) => (
        <div className="flex flex-col">
          <span>{cita.medico.nombre_completo}</span>
          <span className="text-suave">{cita.medico.especialidades.join(', ')}</span>
        </div>
      ),
    },
    { clave: 'modalidad', titulo: 'Modalidad', render: (cita) => cita.modalidad.nombre },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (cita) => <Badge variante={VARIANTE_ESTADO_CITA[cita.estado] ?? 'neutro'}>{cita.estado}</Badge>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (cita) =>
        puedeModificar(cita, true).permitido ? (
          <div className="flex justify-end gap-2">
            <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirReprogramacion(cita)}>
              Reprogramar
            </Button>
            <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirCancelacion(cita)}>
              Cancelar
            </Button>
          </div>
        ) : (
          <span className="text-xs text-suave">Sin acciones</span>
        ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Citas</h1>
          <p className="text-suave">Busque citas por código, paciente o médico para reprogramarlas o cancelarlas.</p>
        </div>
        <Button onClick={() => navigate(RUTAS.CITAS_NUEVA)}>Agendar cita</Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
        <Input
          etiqueta="Buscar"
          name="buscar"
          type="search"
          placeholder="Código, paciente (nombre, CI) o médico"
          value={filtros.buscar}
          onChange={pagina.cambiarFiltro}
        />
        <Select etiqueta="Periodo" name="periodo" value={filtros.periodo} onChange={pagina.cambiarFiltro} opciones={OPCIONES_PERIODO} />
        <Select etiqueta="Estado" name="estado" value={filtros.estado} onChange={pagina.cambiarFiltro} opciones={OPCIONES_ESTADO} />
        <Input etiqueta="Fecha" name="fecha" type="date" value={filtros.fecha} onChange={pagina.cambiarFiltro} />
        <Button variante="secundario" onClick={pagina.limpiarFiltros} disabled={!pagina.hayFiltros}>
          Limpiar
        </Button>
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.citas}
        obtenerClave={(cita) => cita.id}
        cargando={pagina.cargando}
        mensajeVacio="No hay citas que coincidan con la búsqueda."
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {modal?.tipo === 'reprogramar' && (
        <ReprogramarCitaModal cita={modal.cita} onCerrar={pagina.cerrarModal} onReprogramada={pagina.finalizarOperacion} />
      )}
      {modal?.tipo === 'cancelar' && (
        <CancelarCitaModal cita={modal.cita} onCerrar={pagina.cerrarModal} onCancelada={pagina.finalizarOperacion} />
      )}
    </section>
  )
}
