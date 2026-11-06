import { Badge } from '../../../shared/components/ui/Badge'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { formatearDia, formatearFecha } from '../../../shared/utils/formatters'
import { VARIANTE_RIESGO } from '../../ModuloPacientes/utils/enfermedades'
import { ConsultaHistorial } from './ConsultaHistorial'

const SEXO = { F: 'Femenino', M: 'Masculino', O: 'Otro' }

/** Dato breve de la ficha. */
function Dato({ etiqueta, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium tracking-wider text-suave uppercase">{etiqueta}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

/**
 * Historial clínico completo (CU19): ficha y resumen, antecedentes (CU12) y la
 * línea de tiempo de consultas (CU17) con sus recetas (CU18). Lo usan el médico
 * y el propio paciente.
 */
export function HistorialClinico({ historial, cargandoConsultas, onCambiarPagina }) {
  const { paciente, resumen, antecedentes, consultas } = historial

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-md border border-borde bg-white p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold">{paciente.nombre_completo}</h2>
          {!paciente.activo && <Badge variante="contorno">Inactivo</Badge>}
        </div>
        <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Dato etiqueta="Código">{paciente.codigo}</Dato>
          <Dato etiqueta="CI">{paciente.ci}</Dato>
          <Dato etiqueta="Edad">{paciente.edad !== null ? `${paciente.edad} años` : '—'}</Dato>
          <Dato etiqueta="Nacimiento">{formatearDia(paciente.fecha_nacimiento, { dateStyle: 'medium' })}</Dato>
          <Dato etiqueta="Sexo">{SEXO[paciente.sexo] ?? '—'}</Dato>
          <Dato etiqueta="Tipo de sangre">{paciente.tipo_sangre ?? '—'}</Dato>
        </dl>
        <dl className="grid gap-4 border-t border-borde pt-4 sm:grid-cols-4">
          <Dato etiqueta="Expediente">{resumen.expediente ?? 'Sin consultas'}</Dato>
          <Dato etiqueta="Consultas">{resumen.consultas}</Dato>
          <Dato etiqueta="Recetas">{resumen.recetas}</Dato>
          <Dato etiqueta="Última atención">{resumen.ultima_atencion ? formatearFecha(resumen.ultima_atencion) : '—'}</Dato>
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Antecedentes</h2>
        {antecedentes.length === 0 ? (
          <p className="text-sm text-suave">No hay antecedentes registrados.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-borde rounded-md border border-borde bg-white">
            {antecedentes.map((antecedente) => (
              <li key={antecedente.enfermedad.id} className="flex flex-col gap-1 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{antecedente.enfermedad.nombre}</span>
                  {antecedente.enfermedad.nivel_riesgo && (
                    <Badge variante={VARIANTE_RIESGO[antecedente.enfermedad.nivel_riesgo] ?? 'neutro'}>Riesgo {antecedente.enfermedad.nivel_riesgo.toLowerCase()}</Badge>
                  )}
                  <span className="text-sm text-suave">
                    {antecedente.fecha_diagnostico ? `Diagnosticada el ${formatearDia(antecedente.fecha_diagnostico, { dateStyle: 'medium' })}` : 'Sin fecha de diagnóstico'}
                  </span>
                </div>
                {antecedente.observaciones && <p className="text-sm whitespace-pre-line">{antecedente.observaciones}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Consultas</h2>
        {consultas.meta.total === 0 ? (
          <p className="text-sm text-suave">Aún no hay consultas registradas.</p>
        ) : (
          <>
            <ol className={`flex flex-col gap-4 ${cargandoConsultas ? 'opacity-60' : ''}`} aria-busy={cargandoConsultas || undefined}>
              {consultas.items.map((consulta) => (
                <li key={consulta.id}>
                  <ConsultaHistorial consulta={consulta} />
                </li>
              ))}
            </ol>
            <Pagination meta={consultas.meta} onCambiarPagina={onCambiarPagina} deshabilitado={cargandoConsultas} />
          </>
        )}
      </section>
    </div>
  )
}
