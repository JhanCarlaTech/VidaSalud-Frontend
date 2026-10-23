import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { ESTADOS_CITA, VARIANTE_ESTADO_CITA, etiquetaAccionAsistencia, fechaLarga } from '../../utils/citas'
import { useAsistenciaPage } from './AsistenciaPage'

/**
 * CU15 – Registrar Control de Asistencia.
 */
export function AsistenciaPage() {
  const pagina = useAsistenciaPage()

  const columnas = [
    {
      clave: 'hora',
      titulo: 'Hora',
      className: 'whitespace-nowrap',
      render: (cita) => (
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">{cita.hora_inicio}</span>
          <span className="text-xs text-suave">{cita.codigo}</span>
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
          <span className="text-suave">{cita.modalidad.nombre}</span>
        </div>
      ),
    },
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
        cita.acciones_asistencia.length === 0 ? (
          <span className="text-xs text-suave">Sin acciones</span>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            {cita.acciones_asistencia.map((destino) => (
              <Button
                key={destino}
                tamano="sm"
                // La llegada es la acción principal del día; el resto, secundarias.
                variante={destino === 'En Sala de Espera' && cita.estado !== 'Inasistencia' ? 'primario' : 'secundario'}
                cargando={pagina.procesando === cita.id}
                disabled={pagina.procesando !== null}
                onClick={() => pagina.registrar(cita, destino)}
              >
                {etiquetaAccionAsistencia(cita.estado, destino)}
              </Button>
            ))}
          </div>
        ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Asistencia</h1>
        <p className="text-suave">Confirme las citas, registre la llegada de los pacientes y las inasistencias.</p>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-end gap-2">
          <Button variante="secundario" onClick={pagina.diaAnterior} aria-label="Día anterior">
            ‹
          </Button>
          <div className="w-44">
            <Input etiqueta="Fecha" type="date" value={pagina.fecha} onChange={(evento) => pagina.cambiarFecha(evento.target.value)} />
          </div>
          <Button variante="secundario" onClick={pagina.diaSiguiente} aria-label="Día siguiente">
            ›
          </Button>
          <Button variante="secundario" onClick={pagina.irAHoy} disabled={pagina.esHoy}>
            Hoy
          </Button>
        </div>
        <div className="lg:w-80">
          <Input
            etiqueta="Buscar"
            type="search"
            placeholder="Paciente, médico o código"
            value={pagina.busqueda}
            onChange={pagina.cambiarBusqueda}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold capitalize">{fechaLarga(pagina.fecha)}</p>
        <ul className="flex flex-wrap gap-2" aria-label="Resumen por estado">
          {ESTADOS_CITA.filter((estado) => pagina.resumen[estado]).map((estado) => (
            <li key={estado}>
              <Badge variante={VARIANTE_ESTADO_CITA[estado]}>
                {estado}: {pagina.resumen[estado]}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <DataTable
        columnas={columnas}
        filas={pagina.citas}
        obtenerClave={(cita) => cita.id}
        cargando={pagina.cargando && pagina.citas.length === 0}
        mensajeVacio="No hay citas para esta fecha."
      />
    </section>
  )
}
