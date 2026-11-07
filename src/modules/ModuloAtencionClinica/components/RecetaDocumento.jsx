import { formatearFecha, formatearFechaHora } from '../../../shared/utils/formatters'

/**
 * Receta médica con formato de documento (CU18): encabezado de la clínica, datos del
 * paciente y del médico, medicamentos, indicaciones y firma. Está pensada para
 * imprimirse en A4 o guardarse como PDF desde el navegador.
 */
export function RecetaDocumento({ receta }) {
  const { clinica, paciente, medico, consulta } = receta

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 bg-superficie p-8 text-texto print:max-w-none print:p-0">
      <header className="flex flex-col gap-4 border-b-2 border-primario pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold">{clinica.nombre}</p>
          <p className="text-sm text-suave">{clinica.direccion}</p>
          <p className="text-sm text-suave">Tel. {clinica.telefono}</p>
        </div>
        <div className="flex flex-col gap-1 sm:text-right">
          <p className="text-xs font-medium tracking-wider text-suave uppercase">Receta médica</p>
          <p className="font-mono text-lg font-semibold">{receta.numero}</p>
          <p className="text-sm">{formatearFechaHora(receta.fecha_emision)}</p>
        </div>
      </header>

      <section className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wider text-suave uppercase">Paciente</p>
          <p className="font-semibold">{paciente.nombre_completo}</p>
          <p>
            CI {paciente.ci} · {paciente.codigo}
            {paciente.edad !== null && ` · ${paciente.edad} años`}
          </p>
          <p className="text-suave">Expediente {consulta.nro_expediente}</p>
        </div>
        <div className="flex flex-col gap-1 sm:text-right">
          <p className="text-xs font-medium tracking-wider text-suave uppercase">Médico</p>
          <p className="font-semibold">Dr(a). {medico.nombre_completo}</p>
          <p>{medico.especialidades.join(', ')}</p>
          <p className="text-suave">
            {medico.codigo} · Consulta del {formatearFecha(consulta.fecha_atencion)}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Rp.</h2>
        <ol className="flex flex-col divide-y divide-borde border-y border-borde">
          {receta.medicamentos.map((linea, indice) => (
            <li key={`${linea.medicamento}-${indice}`} className="flex gap-4 py-3 break-inside-avoid">
              <span className="w-6 shrink-0 font-semibold tabular-nums">{indice + 1}.</span>
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold">
                  {linea.medicamento} <span className="font-normal">— {linea.dosis}</span>
                </p>
                <p className="text-sm">
                  {linea.frecuencia}, durante {linea.duracion_dias} {linea.duracion_dias === 1 ? 'día' : 'días'}.
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {receta.indicaciones_generales && (
        <section className="flex flex-col gap-2 break-inside-avoid">
          <h2 className="text-sm font-semibold">Indicaciones generales</h2>
          <p className="text-sm whitespace-pre-line">{receta.indicaciones_generales}</p>
        </section>
      )}

      <footer className="mt-12 flex justify-end break-inside-avoid">
        <div className="flex w-64 flex-col items-center gap-1 border-t border-primario pt-2 text-center text-sm">
          <span className="font-semibold">Dr(a). {medico.nombre_completo}</span>
          <span className="text-suave">{medico.codigo}</span>
          <span className="text-xs text-suave">Firma y sello</span>
        </div>
      </footer>
    </article>
  )
}
