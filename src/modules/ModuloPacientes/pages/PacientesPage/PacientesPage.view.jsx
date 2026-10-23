import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Select } from '../../../../shared/components/ui/Select'
import { CambiarEstadoPacienteModal } from './components/CambiarEstadoPacienteModal'
import { PacienteFormModal } from './components/PacienteFormModal'
import { usePacientesPage } from './PacientesPage'

const OPCIONES_ESTADO = [
  { valor: '', etiqueta: 'Todos' },
  { valor: '1', etiqueta: 'Activos' },
  { valor: '0', etiqueta: 'Inactivos' },
]

/**
 * CU11 – Gestionar Pacientes (Administrador y Recepcionista).
 */
export function PacientesPage() {
  const pagina = usePacientesPage()
  const { filtros, modal } = pagina

  const columnas = [
    {
      clave: 'paciente',
      titulo: 'Paciente',
      render: (paciente) => (
        <div className="flex flex-col">
          <span className="font-semibold">{paciente.usuario.nombre_completo}</span>
          <span className="text-suave">
            {paciente.codigo} · CI {paciente.usuario.ci}
          </span>
        </div>
      ),
    },
    {
      clave: 'edad',
      titulo: 'Edad',
      className: 'whitespace-nowrap',
      render: (paciente) => `${paciente.edad} ${paciente.edad === 1 ? 'año' : 'años'}`,
    },
    {
      clave: 'tipo_sangre',
      titulo: 'Sangre',
      render: (paciente) => (paciente.tipo_sangre ? <Badge>{paciente.tipo_sangre}</Badge> : <span className="text-suave">—</span>),
    },
    {
      clave: 'contacto',
      titulo: 'Contacto de emergencia',
      render: (paciente) =>
        paciente.contacto ? (
          <div className="flex flex-col">
            <span>
              {paciente.contacto.nombre} {paciente.contacto.apellido} <span className="text-suave">({paciente.contacto.parentesco})</span>
            </span>
            <span className="text-suave">{paciente.contacto.telefono}</span>
          </div>
        ) : (
          <span className="text-suave">Sin contacto</span>
        ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (paciente) => <Badge variante={paciente.activo ? 'solido' : 'contorno'}>{paciente.activo ? 'Activo' : 'Inactivo'}</Badge>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (paciente) => (
        <div className="flex justify-end gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(paciente)}>
            Editar
          </Button>
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirCambioEstado(paciente)}>
            {paciente.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Pacientes</h1>
          <p className="text-suave">Registro de pacientes, sus datos médicos base y contactos de emergencia.</p>
        </div>
        <Button onClick={pagina.abrirNuevo}>Nuevo paciente</Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <Input
          etiqueta="Buscar"
          name="buscar"
          type="search"
          placeholder="CI, nombre, código o correo"
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
        filas={pagina.pacientes}
        obtenerClave={(paciente) => paciente.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.hayFiltros ? 'Ningún paciente coincide con la búsqueda.' : 'Aún no hay pacientes registrados.'}
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {modal?.tipo === 'formulario' && (
        <PacienteFormModal paciente={modal.paciente} onCerrar={pagina.cerrarModal} onGuardado={pagina.finalizarOperacion} />
      )}

      {modal?.tipo === 'estado' && (
        <CambiarEstadoPacienteModal paciente={modal.paciente} onCerrar={pagina.cerrarModal} onCambiado={pagina.finalizarOperacion} />
      )}
    </section>
  )
}
