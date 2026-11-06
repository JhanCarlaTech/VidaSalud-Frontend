import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { Textarea } from '../../../../shared/components/ui/Textarea'
import { Toggle } from '../../../../shared/components/ui/Toggle'
import { ReporteDocumento } from '../../components/ReporteDocumento'
import { EJEMPLOS, useReportesVozPage } from './ReportesVozPage'

/** Micrófono (trazo simple, hereda el color del botón). */
function IconoMicrofono() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  )
}

/**
 * CU22 – Generar Reportes Generativos por Comando de Voz.
 */
export function ReportesVozPage() {
  const pagina = useReportesVozPage()
  const { dictado, lectura, resultado } = pagina

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Reportes por voz</h1>
        <p className="text-suave">Pida un reporte con sus palabras: el sistema lo interpreta, lo genera y le lee el resumen.</p>
      </header>

      <div className="flex flex-col gap-4 rounded-md border border-borde bg-white p-5">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {dictado.soportado ? (
            <button
              type="button"
              onClick={dictado.escuchando ? dictado.detener : dictado.iniciar}
              disabled={pagina.enviando}
              aria-pressed={dictado.escuchando}
              aria-label={dictado.escuchando ? 'Dejar de escuchar' : 'Dictar consulta'}
              className={`grid size-16 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                dictado.escuchando ? 'animate-pulse border-peligro bg-peligro text-white' : 'border-primario bg-primario text-white hover:bg-primario-hover'
              }`}
            >
              <IconoMicrofono />
            </button>
          ) : (
            <Alert>Su navegador no permite el dictado (pruebe con Chrome o Edge). Puede escribir la consulta.</Alert>
          )}
          <p className="text-sm text-suave" aria-live="polite">
            {dictado.escuchando ? 'Escuchando… hable ahora; la consulta se envía al terminar.' : dictado.soportado ? 'Pulse el micrófono y diga qué reporte necesita.' : ''}
          </p>
        </div>

        <Textarea
          etiqueta="Consulta"
          value={dictado.texto}
          maxLength={300}
          placeholder="Por ejemplo: ingresos de octubre por método de pago"
          onChange={(evento) => dictado.setTexto(evento.target.value)}
          disabled={dictado.escuchando}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {EJEMPLOS.map((ejemplo) => (
              <button
                key={ejemplo}
                type="button"
                onClick={() => pagina.usarEjemplo(ejemplo)}
                disabled={pagina.enviando}
                className="cursor-pointer rounded-full border border-borde px-3 py-1 text-xs hover:border-primario disabled:cursor-not-allowed"
              >
                {ejemplo}
              </button>
            ))}
          </div>
          <Button onClick={pagina.enviar} cargando={pagina.enviando} disabled={dictado.escuchando || !dictado.texto.trim()}>
            Generar reporte
          </Button>
        </div>

        {lectura.soportada && (
          <Toggle etiqueta="Leer el resultado en voz alta" activo={pagina.leerEnVoz} onCambiar={pagina.setLeerEnVoz} />
        )}
      </div>

      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}
      {pagina.enviando && !resultado && <Spinner mensaje="Interpretando la consulta…" />}

      {resultado && !resultado.entendido && (
        <div className="flex flex-col gap-3 rounded-md border border-borde bg-white p-5">
          <p className="font-medium">{resultado.mensaje}</p>
          {resultado.notas.map((nota) => (
            <p key={nota} className="text-sm text-suave">
              {nota}
            </p>
          ))}
          <p className="text-sm text-suave">Pruebe con alguno de los ejemplos de arriba.</p>
        </div>
      )}

      {resultado?.entendido && (
        <div className={`flex flex-col gap-6 ${pagina.enviando ? 'opacity-60' : ''}`}>
          {/* Lo que se entendió: el usuario puede comprobar la interpretación antes de usar los datos. */}
          <section className="flex flex-col gap-3 rounded-md border border-primario bg-white p-5" aria-label="Interpretación">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-suave">
                «{resultado.consulta}»
              </p>
              <Badge variante={resultado.interprete === 'ia' ? 'solido' : 'neutro'}>
                {resultado.interprete === 'ia' ? 'Interpretado con IA' : 'Interpretado por reglas'}
              </Badge>
            </div>
            <p className="font-medium">{resultado.resumen_hablado}</p>
            {resultado.notas.length > 0 && (
              <ul className="flex list-disc flex-col gap-0.5 pl-5 text-sm text-suave">
                {resultado.notas.map((nota) => (
                  <li key={nota}>{nota}</li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              {lectura.soportada && (
                <Button variante="secundario" tamano="sm" onClick={lectura.hablando ? lectura.callar : () => lectura.leer(resultado.resumen_hablado)}>
                  {lectura.hablando ? 'Detener lectura' : 'Escuchar resumen'}
                </Button>
              )}
              <Button variante="secundario" tamano="sm" onClick={pagina.exportar}>
                Exportar detalle (CSV)
              </Button>
              <Button variante="secundario" tamano="sm" onClick={pagina.imprimir}>
                Imprimir / PDF
              </Button>
            </div>
          </section>

          <ReporteDocumento reporte={resultado.reporte} />
        </div>
      )}
    </section>
  )
}
