import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Select } from '../../../../shared/components/ui/Select'
import { RUTAS } from '../../../../shared/utils/constants'
import { formatearMoneda } from '../../../../shared/utils/formatters'
import { CambiarEstadoMedicoModal } from './components/CambiarEstadoMedicoModal'
import { MedicoFormModal } from './components/MedicoFormModal'
import { useMedicosPage } from './MedicosPage'

const OPCIONES_ESTADO = [
  { valor: '', etiqueta: 'Todos' },
  { valor: '1', etiqueta: 'Activos' },
  { valor: '0', etiqueta: 'Inactivos' },
]

/**
 * CU08 – Gestionar Personal Médico.
 */
export function MedicosPage() {
  const navigate = useNavigate()
  const pagina = useMedicosPage()
  const { filtros, modal } = pagina

  const columnas = [
    {
      clave: 'medico',
      titulo: 'Médico',
      render: (medico) => (
        <div className="flex flex-col">
          <span className="font-semibold">{medico.usuario.nombre_completo}</span>
          <span className="text-suave">{medico.usuario.correo}</span>
        </div>
      ),
    },
    { clave: 'codigo', titulo: 'Código', className: 'whitespace-nowrap' },
    {
      clave: 'especialidades',
      titulo: 'Especialidades',
      render: (medico) => (
        <div className="flex flex-wrap gap-1">
          {medico.especialidades.map((especialidad) => (
            <Badge key={especialidad.id} variante={especialidad.activo ? 'neutro' : 'contorno'}>
              {especialidad.nombre}
              {!especialidad.activo && ' (inactiva)'}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      clave: 'salario',
      titulo: 'Salario',
      className: 'text-right whitespace-nowrap',
      render: (medico) => formatearMoneda(medico.salario),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (medico) => <Badge variante={medico.activo ? 'solido' : 'contorno'}>{medico.activo ? 'Activo' : 'Inactivo'}</Badge>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (medico) => (
        <div className="flex justify-end gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(medico)}>
            Editar
          </Button>
          {/* CU09: grilla semanal del médico */}
          <Button variante="secundario" tamano="sm" onClick={() => navigate(RUTAS.ADMIN_MEDICO_HORARIOS.replace(':id', medico.id))}>
            Horarios
          </Button>
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirCambioEstado(medico)}>
            {medico.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Médicos</h1>
          <p className="text-suave">Legajo del personal médico: datos, especialidades y salario.</p>
        </div>
        <Button onClick={pagina.abrirNuevo}>Nuevo médico</Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
        <Input
          etiqueta="Buscar"
          name="buscar"
          type="search"
          placeholder="Nombre, CI, código o correo"
          value={filtros.buscar}
          onChange={pagina.cambiarFiltro}
        />
        <Select
          etiqueta="Especialidad"
          name="especialidad"
          value={filtros.especialidad}
          onChange={pagina.cambiarFiltro}
          opciones={[{ valor: '', etiqueta: 'Todas' }, ...pagina.especialidades.map((e) => ({ valor: e.id, etiqueta: e.nombre }))]}
        />
        <Select etiqueta="Estado" name="activo" value={filtros.activo} onChange={pagina.cambiarFiltro} opciones={OPCIONES_ESTADO} />
        <Button variante="secundario" onClick={pagina.limpiarFiltros} disabled={!pagina.hayFiltros}>
          Limpiar
        </Button>
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.medicos}
        obtenerClave={(medico) => medico.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.hayFiltros ? 'Ningún médico coincide con los filtros.' : 'Aún no hay médicos registrados.'}
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {modal?.tipo === 'formulario' && (
        <MedicoFormModal
          medico={modal.medico}
          especialidades={pagina.especialidades}
          onCerrar={pagina.cerrarModal}
          onGuardado={pagina.finalizarOperacion}
        />
      )}

      {modal?.tipo === 'estado' && (
        <CambiarEstadoMedicoModal medico={modal.medico} onCerrar={pagina.cerrarModal} onCambiado={pagina.finalizarOperacion} />
      )}
    </section>
  )
}
