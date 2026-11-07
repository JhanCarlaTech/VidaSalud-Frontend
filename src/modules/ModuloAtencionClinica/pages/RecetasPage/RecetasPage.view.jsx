import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { formatearFechaHora } from '../../../../shared/utils/formatters'
import { EmitirRecetaModal } from './components/EmitirRecetaModal'
import { rutaImprimir } from '../../utils/recetas'
import { RecetasConsultaModal } from './components/RecetasConsultaModal'
import { useRecetasPage } from './RecetasPage'

/**
 * CU18 – Emitir Receta Médica.
 */
export function RecetasPage() {
  const pagina = useRecetasPage()
  const { modal } = pagina

  const columnas = [
    {
      clave: 'fecha',
      titulo: 'Atención',
      className: 'whitespace-nowrap',
      render: (consulta) => formatearFechaHora(consulta.fecha_atencion),
    },
    {
      clave: 'paciente',
      titulo: 'Paciente',
      render: (consulta) => (
        <div className="flex flex-col">
          <span className="font-semibold">{consulta.paciente.nombre_completo}</span>
          <span className="text-suave">
            {consulta.paciente.codigo} · {consulta.nro_expediente}
          </span>
        </div>
      ),
    },
    {
      clave: 'motivo',
      titulo: 'Motivo',
      render: (consulta) => <span className="line-clamp-2 max-w-xs">{consulta.motivo}</span>,
    },
    {
      clave: 'recetas',
      titulo: 'Recetas',
      render: (consulta) =>
        consulta.recetas > 0 ? (
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirRecetas(consulta)}>
            {consulta.recetas === 1 ? 'Ver 1 receta' : `Ver ${consulta.recetas} recetas`}
          </Button>
        ) : (
          <span className="text-suave">Ninguna</span>
        ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      // RN03: pasado el plazo ya no se emiten recetas para la consulta.
      render: (consulta) =>
        consulta.puede_emitir ? (
          <Button tamano="sm" onClick={() => pagina.abrirEmision(consulta)}>
            Emitir receta
          </Button>
        ) : (
          <Badge variante="contorno">Plazo vencido</Badge>
        ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Recetas</h1>
        <p className="text-suave">
          Emita recetas de sus consultas atendidas (hasta {pagina.diasParaEmitir} días después de la atención) e imprímalas para el paciente.
        </p>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.ultimaReceta && (
        <div className="flex flex-col gap-3 rounded-xl border border-primario bg-superficie p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            Receta <strong className="font-mono font-semibold">{pagina.ultimaReceta.numero}</strong> emitida para{' '}
            {pagina.ultimaReceta.paciente.nombre_completo}.
          </p>
          <div className="flex gap-2">
            <Link
              to={rutaImprimir(pagina.ultimaReceta.id)}
              className="inline-flex min-h-9 items-center rounded-lg border border-primario bg-primario px-3 py-1.5 text-sm font-semibold text-sobre-primario hover:bg-primario-hover"
            >
              Imprimir receta
            </Link>
            <Button variante="secundario" tamano="sm" onClick={pagina.cerrarUltimaReceta}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="max-w-md">
        <Input
          etiqueta="Buscar"
          name="buscar"
          type="search"
          placeholder="Paciente, CI, código o expediente"
          value={pagina.buscar}
          onChange={pagina.cambiarBusqueda}
        />
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.consultas}
        obtenerClave={(consulta) => consulta.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.buscar ? 'Ninguna consulta coincide con la búsqueda.' : 'Aún no tiene consultas atendidas.'}
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {modal?.tipo === 'emitir' && <EmitirRecetaModal consulta={modal.consulta} onCerrar={pagina.cerrarModal} onEmitida={pagina.finalizarEmision} />}
      {modal?.tipo === 'recetas' && <RecetasConsultaModal consulta={modal.consulta} onCerrar={pagina.cerrarModal} />}
    </section>
  )
}
