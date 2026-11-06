import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Select } from '../../../../shared/components/ui/Select'
import { NIVELES_RIESGO, VARIANTE_RIESGO } from '../../utils/enfermedades'
import { CambiarEstadoEnfermedadModal } from './components/CambiarEstadoEnfermedadModal'
import { EnfermedadFormModal } from './components/EnfermedadFormModal'
import { useEnfermedadesPage } from './EnfermedadesPage'

const OPCIONES_ESTADO = [
  { valor: '', etiqueta: 'Todas' },
  { valor: '1', etiqueta: 'Activas' },
  { valor: '0', etiqueta: 'Inactivas' },
]

const OPCIONES_RIESGO = [{ valor: '', etiqueta: 'Todos' }, ...NIVELES_RIESGO.map((nivel) => ({ valor: nivel, etiqueta: nivel }))]

/**
 * CU12 – Gestionar Catálogo de Enfermedades.
 */
export function EnfermedadesPage() {
  const pagina = useEnfermedadesPage()
  const { filtros, modal } = pagina

  const columnas = [
    {
      clave: 'enfermedad',
      titulo: 'Enfermedad',
      render: (enfermedad) => (
        <div className="flex max-w-md flex-col gap-1">
          <span className="font-semibold">{enfermedad.nombre}</span>
          {enfermedad.descripcion && <span className="text-suave">{enfermedad.descripcion}</span>}
        </div>
      ),
    },
    {
      clave: 'riesgo',
      titulo: 'Riesgo',
      render: (enfermedad) =>
        enfermedad.nivel_riesgo ? <Badge variante={VARIANTE_RIESGO[enfermedad.nivel_riesgo] ?? 'neutro'}>{enfermedad.nivel_riesgo}</Badge> : <span className="text-suave">—</span>,
    },
    {
      clave: 'pacientes',
      titulo: 'Pacientes',
      render: (enfermedad) =>
        enfermedad.pacientes === 0 ? (
          <span className="text-suave">Ninguno</span>
        ) : (
          <span>
            {enfermedad.pacientes} {enfermedad.pacientes === 1 ? 'paciente' : 'pacientes'}
          </span>
        ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (enfermedad) => <Badge variante={enfermedad.activo ? 'solido' : 'contorno'}>{enfermedad.activo ? 'Activa' : 'Inactiva'}</Badge>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (enfermedad) => (
        <div className="flex justify-end gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(enfermedad)}>
            Editar
          </Button>
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirCambioEstado(enfermedad)}>
            {enfermedad.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Enfermedades</h1>
          <p className="text-suave">Catálogo clínico con su nivel de riesgo. Es la base de los antecedentes de los pacientes.</p>
        </div>
        <Button onClick={pagina.abrirNueva}>Nueva enfermedad</Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
        <Input etiqueta="Buscar" name="buscar" type="search" placeholder="Nombre o descripción" value={filtros.buscar} onChange={pagina.cambiarFiltro} />
        <Select etiqueta="Nivel de riesgo" name="nivel_riesgo" value={filtros.nivel_riesgo} onChange={pagina.cambiarFiltro} opciones={OPCIONES_RIESGO} />
        <Select etiqueta="Estado" name="activo" value={filtros.activo} onChange={pagina.cambiarFiltro} opciones={OPCIONES_ESTADO} />
        <Button variante="secundario" onClick={pagina.limpiarFiltros} disabled={!pagina.hayFiltros}>
          Limpiar
        </Button>
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.enfermedades}
        obtenerClave={(enfermedad) => enfermedad.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.hayFiltros ? 'Ninguna enfermedad coincide con los filtros.' : 'Aún no hay enfermedades registradas.'}
      />

      {modal?.tipo === 'formulario' && <EnfermedadFormModal enfermedad={modal.enfermedad} onCerrar={pagina.cerrarModal} onGuardado={pagina.finalizarOperacion} />}

      {modal?.tipo === 'estado' && (
        <CambiarEstadoEnfermedadModal enfermedad={modal.enfermedad} onCerrar={pagina.cerrarModal} onCambiado={pagina.finalizarOperacion} />
      )}
    </section>
  )
}
