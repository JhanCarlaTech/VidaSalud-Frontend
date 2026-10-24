import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { VARIANTE_ESTADO_CITA } from '../../utils/citas' // Reutilizamos las variantes de color
import { useAgendaPage } from './AgendaPage'

/**
 * CU16 – Consultar Agenda Médica.
 */
export function AgendaPage() {
  const pagina = useAgendaPage()

  const columnas = [
    {
      clave: 'hora',
      titulo: 'Hora',
      className: 'whitespace-nowrap',
      render: (cita) => (
        <div className="flex flex-col">
          <span className="font-semibold tabular-nums">{cita.hora_inicio} – {cita.hora_fin}</span>
          <span className="text-xs text-suave">{cita.codigo}</span>
        </div>
      ),
    },
    {
      clave: 'paciente',
      titulo: 'Paciente',
      render: (cita) => (
        <div className="flex flex-col">
          <span className="font-medium">{cita.paciente?.nombre_completo}</span>
          <span className="text-suave">{cita.paciente?.codigo}</span>
        </div>
      ),
    },
    {
      clave: 'medico',
      titulo: 'Médico',
      render: (cita) => (
        <div className="flex flex-col">
          <span>{cita.medico?.nombre_completo}</span>
          <span className="text-suave">{cita.modalidad?.nombre}</span>
        </div>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (cita) => <Badge variante={VARIANTE_ESTADO_CITA[cita.estado] ?? 'neutro'}>{cita.estado}</Badge>,
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Agenda Médica</h1>
        <p className="text-suave">Visualice las citas programadas para el día.</p>
      </header>

      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <Input 
          etiqueta="Fecha" 
          type="date" 
          value={pagina.fecha} 
          onChange={(evento) => pagina.cambiarFecha(evento.target.value)} 
        />
        <Input 
          etiqueta="ID Médico (opcional)" 
          type="number" 
          placeholder="Ej. 2"
          value={pagina.idMedico} 
          onChange={pagina.cambiarMedico} 
        />
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.citas}
        obtenerClave={(cita) => cita.id}
        cargando={pagina.cargando}
        mensajeVacio="No hay citas programadas para esta fecha."
      />
    </section>
  )
}