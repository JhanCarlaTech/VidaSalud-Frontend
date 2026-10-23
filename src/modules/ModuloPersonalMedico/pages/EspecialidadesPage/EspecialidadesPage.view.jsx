import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Select } from '../../../../shared/components/ui/Select'
import { CambiarEstadoEspecialidadModal } from './components/CambiarEstadoEspecialidadModal'
import { EspecialidadFormModal } from './components/EspecialidadFormModal'
import { useEspecialidadesPage } from './EspecialidadesPage'

const OPCIONES_ESTADO = [
  { valor: '', etiqueta: 'Todas' },
  { valor: '1', etiqueta: 'Activas' },
  { valor: '0', etiqueta: 'Inactivas' },
]

/**
 * CU07 – Gestionar Especialidades Médicas.
 */
export function EspecialidadesPage() {
  const pagina = useEspecialidadesPage()
  const { filtros, modal } = pagina

  const columnas = [
    {
      clave: 'especialidad',
      titulo: 'Especialidad',
      render: (especialidad) => (
        <div className="flex max-w-md flex-col gap-1">
          <span className="font-semibold">{especialidad.nombre}</span>
          {especialidad.descripcion && <span className="text-suave">{especialidad.descripcion}</span>}
        </div>
      ),
    },
    {
      clave: 'medicos',
      titulo: 'Médicos activos',
      render: (especialidad) =>
        especialidad.medicos_activos === 0 ? (
          <span className="text-suave">Ninguno</span>
        ) : (
          <span>
            {especialidad.medicos_activos} {especialidad.medicos_activos === 1 ? 'médico' : 'médicos'}
          </span>
        ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (especialidad) => (
        <Badge variante={especialidad.activo ? 'solido' : 'contorno'}>{especialidad.activo ? 'Activa' : 'Inactiva'}</Badge>
      ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (especialidad) => (
        <div className="flex justify-end gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(especialidad)}>
            Editar
          </Button>
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirCambioEstado(especialidad)}>
            {especialidad.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Especialidades</h1>
          <p className="text-suave">Catálogo de especialidades médicas que ofrece la clínica.</p>
        </div>
        <Button onClick={pagina.abrirNueva}>Nueva especialidad</Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <Input
          etiqueta="Buscar"
          name="buscar"
          type="search"
          placeholder="Nombre o descripción"
          value={filtros.buscar}
          onChange={pagina.cambiarFiltro}
        />
        <Select etiqueta="Estado" name="activo" value={filtros.activo} onChange={pagina.cambiarFiltro} opciones={OPCIONES_ESTADO} />
        <Button variante="secundario" onClick={pagina.limpiarFiltros} disabled={!pagina.hayFiltros}>
          Limpiar
        </Button>
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.especialidades}
        obtenerClave={(especialidad) => especialidad.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.hayFiltros ? 'Ninguna especialidad coincide con los filtros.' : 'Aún no hay especialidades registradas.'}
      />

      {modal?.tipo === 'formulario' && (
        <EspecialidadFormModal especialidad={modal.especialidad} onCerrar={pagina.cerrarModal} onGuardado={pagina.finalizarOperacion} />
      )}

      {modal?.tipo === 'estado' && (
        <CambiarEstadoEspecialidadModal
          especialidad={modal.especialidad}
          onCerrar={pagina.cerrarModal}
          onCambiado={pagina.finalizarOperacion}
        />
      )}
    </section>
  )
}
