import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { RUTAS } from '../../../../shared/utils/constants'
import { formatearDia, formatearFecha } from '../../../../shared/utils/formatters'
import { useMisPacientesPage } from './MisPacientesPage'

/**
 * CU19 – Pacientes del médico, para abrir su historial clínico.
 */
export function MisPacientesPage() {
  const pagina = useMisPacientesPage()
  const navigate = useNavigate()

  const columnas = [
    {
      clave: 'paciente',
      titulo: 'Paciente',
      render: (paciente) => (
        <div className="flex flex-col">
          <span className="flex flex-wrap items-center gap-2 font-semibold">
            {paciente.nombre_completo}
            {!paciente.activo && <Badge variante="contorno">Inactivo</Badge>}
          </span>
          <span className="text-suave">
            {paciente.codigo} · CI {paciente.ci}
            {paciente.edad !== null && ` · ${paciente.edad} años`}
          </span>
        </div>
      ),
    },
    {
      clave: 'proxima',
      titulo: 'Próxima cita con usted',
      render: (paciente) => (paciente.proxima_cita ? formatearDia(paciente.proxima_cita, { dateStyle: 'medium' }) : <span className="text-suave">—</span>),
    },
    {
      clave: 'ultima',
      titulo: 'Última atención',
      render: (paciente) => (paciente.ultima_atencion ? formatearFecha(paciente.ultima_atencion) : <span className="text-suave">Sin consultas</span>),
    },
    {
      clave: 'acciones',
      titulo: 'Historial',
      className: 'text-right',
      render: (paciente) => (
        <Button variante="secundario" tamano="sm" onClick={() => navigate(RUTAS.MEDICO_HISTORIAL_PACIENTE.replace(':id', paciente.id))}>
          Ver historial
        </Button>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Mis pacientes</h1>
        <p className="text-suave">Pacientes con citas atendidas o pendientes con usted. Abra su historial clínico antes o después de atenderlos.</p>
      </header>

      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="max-w-md">
        <Input etiqueta="Buscar" name="buscar" type="search" placeholder="Nombre, CI o código" value={pagina.buscar} onChange={pagina.cambiarBusqueda} />
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.pacientes}
        obtenerClave={(paciente) => paciente.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.buscar ? 'Ninguno de sus pacientes coincide con la búsqueda.' : 'Aún no tiene pacientes con citas.'}
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />
    </section>
  )
}
