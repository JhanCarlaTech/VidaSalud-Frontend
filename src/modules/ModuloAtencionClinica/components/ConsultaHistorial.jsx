import { Link } from 'react-router-dom'
import { Badge } from '../../../shared/components/ui/Badge'
import { formatearFechaHora } from '../../../shared/utils/formatters'
import { rutaImprimir } from '../utils/recetas'

const SIN_DATO = '—'

/** Dato de los signos vitales. */
function Signo({ etiqueta, valor, unidad }) {
  return (
    <div className="flex flex-col rounded-lg border border-borde px-3 py-2">
      <span className="text-xs text-suave">{etiqueta}</span>
      <span className="font-semibold tabular-nums">{valor === null || valor === undefined ? SIN_DATO : `${valor}${unidad ? ` ${unidad}` : ''}`}</span>
    </div>
  )
}

/** Texto clínico con su título; no se muestra si está vacío. */
function Seccion({ titulo, texto }) {
  if (!texto) return null
  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-xs font-medium tracking-wider text-suave uppercase">{titulo}</h4>
      <p className="text-sm whitespace-pre-line">{texto}</p>
    </div>
  )
}

/**
 * Una consulta del historial (CU19): fecha, médico, signos vitales, evolución y recetas (CU18).
 */
export function ConsultaHistorial({ consulta }) {
  const { signos_vitales: signos } = consulta

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold">{formatearFechaHora(consulta.fecha_atencion)}</p>
          <p className="text-sm text-suave">
            Dr(a). {consulta.medico.nombre_completo} · {consulta.medico.especialidades.join(', ')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {consulta.es_propia && <Badge variante="solido">Atendida por usted</Badge>}
          <Badge variante="contorno">{consulta.codigo_cita}</Badge>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Signo etiqueta="Peso" valor={signos.peso} unidad="kg" />
        <Signo etiqueta="Estatura" valor={signos.estatura} unidad="cm" />
        <Signo etiqueta="IMC" valor={signos.imc} />
        <Signo etiqueta="Dolor (0–10)" valor={signos.escala_del_dolor} />
      </div>

      <div className="flex flex-col gap-3">
        <Seccion titulo="Motivo de consulta" texto={consulta.motivo} />
        <Seccion titulo="Evolución" texto={consulta.orden_cronologico} />
        <Seccion titulo="Síntomas" texto={consulta.sintomas} />
        <Seccion titulo="Tratamiento" texto={consulta.tratamiento} />
      </div>

      {consulta.recetas.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-medium tracking-wider text-suave uppercase">Recetas</h4>
          <ul className="flex flex-col gap-2">
            {consulta.recetas.map((receta) => (
              <li key={receta.id} className="flex flex-col gap-2 rounded-lg bg-superficie-subtil px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-semibold">{receta.numero}</span>
                  <span className="text-sm">
                    {receta.medicamentos.map((linea) => `${linea.medicamento} ${linea.dosis} (${linea.frecuencia}, ${linea.duracion_dias} d)`).join(' · ')}
                  </span>
                </div>
                <Link to={rutaImprimir(receta.id)} className="shrink-0 text-sm font-semibold underline hover:text-suave">
                  Ver e imprimir
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
