import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { formatearDia } from '../../../../shared/utils/formatters'
import { eliminarAntecedente } from '../../services/enfermedades.service'
import { VARIANTE_RIESGO } from '../../utils/enfermedades'
import { AntecedenteFormModal } from './components/AntecedenteFormModal'
import { BuscadorPaciente } from './components/BuscadorPaciente'
import { useAntecedentesPage } from './AntecedentesPage'

/** Cabecera con los datos de identificación del paciente elegido. */
function FichaPaciente({ paciente, onCambiar }) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-borde bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="flex flex-wrap items-center gap-2 text-lg font-semibold">
          {paciente.nombre_completo}
          {!paciente.activo && <Badge variante="contorno">Inactivo</Badge>}
        </p>
        <p className="text-sm text-suave">
          {paciente.codigo} · CI {paciente.ci}
          {paciente.fecha_nacimiento && ` · ${paciente.edad} años (nació el ${formatearDia(paciente.fecha_nacimiento)})`}
        </p>
      </div>
      <Button variante="secundario" onClick={onCambiar}>
        Cambiar paciente
      </Button>
    </div>
  )
}

/**
 * CU12 – Antecedentes patológicos del paciente.
 */
export function AntecedentesPage() {
  const pagina = useAntecedentesPage()
  const { paciente, modal } = pagina

  const columnas = [
    {
      clave: 'enfermedad',
      titulo: 'Enfermedad',
      render: ({ enfermedad }) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{enfermedad.nombre}</span>
          {!enfermedad.activo && <Badge variante="contorno">Fuera del catálogo</Badge>}
        </div>
      ),
    },
    {
      clave: 'riesgo',
      titulo: 'Riesgo',
      render: ({ enfermedad }) =>
        enfermedad.nivel_riesgo ? <Badge variante={VARIANTE_RIESGO[enfermedad.nivel_riesgo] ?? 'neutro'}>{enfermedad.nivel_riesgo}</Badge> : '—',
    },
    {
      clave: 'fecha',
      titulo: 'Diagnóstico',
      className: 'whitespace-nowrap',
      render: (antecedente) => (antecedente.fecha_diagnostico ? formatearDia(antecedente.fecha_diagnostico, { dateStyle: 'medium' }) : <span className="text-suave">Sin fecha</span>),
    },
    {
      clave: 'observaciones',
      titulo: 'Observaciones',
      render: (antecedente) => <span className="block max-w-md whitespace-pre-line">{antecedente.observaciones || <span className="text-suave">—</span>}</span>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (antecedente) => (
        <div className="flex justify-end gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(antecedente)}>
            Editar
          </Button>
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEliminacion(antecedente)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Antecedentes de pacientes</h1>
          <p className="text-suave">Enfermedades diagnosticadas de cada paciente, con su fecha y observaciones.</p>
        </div>
        {paciente && <Button onClick={pagina.abrirNuevo}>Registrar antecedente</Button>}
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      {pagina.idPaciente === null && (
        <div className="max-w-xl">
          <BuscadorPaciente onElegir={pagina.elegirPaciente} />
        </div>
      )}

      {pagina.cargando && !paciente && <Spinner mensaje="Cargando antecedentes…" />}

      {/* Paciente inexistente en la URL: se ofrece volver a buscar. */}
      {pagina.idPaciente !== null && !pagina.cargando && !paciente && (
        <div>
          <Button variante="secundario" onClick={pagina.cambiarPaciente}>
            Buscar otro paciente
          </Button>
        </div>
      )}

      {paciente && (
        <>
          <FichaPaciente paciente={paciente} onCambiar={pagina.cambiarPaciente} />
          <DataTable
            columnas={columnas}
            filas={pagina.antecedentes}
            obtenerClave={(antecedente) => antecedente.enfermedad.id}
            cargando={pagina.cargando}
            mensajeVacio="El paciente no tiene antecedentes registrados."
          />
        </>
      )}

      {modal?.tipo === 'formulario' && paciente && (
        <AntecedenteFormModal
          paciente={paciente}
          antecedente={modal.antecedente}
          registradas={pagina.registradas}
          onCerrar={pagina.cerrarModal}
          onGuardado={pagina.finalizarOperacion}
        />
      )}

      {modal?.tipo === 'eliminar' && paciente && (
        <ConfirmModal
          titulo="Eliminar antecedente"
          textoConfirmar="Eliminar"
          onConfirmar={() => eliminarAntecedente(paciente.id, modal.antecedente.enfermedad.id)}
          onExito={(respuesta) => pagina.finalizarOperacion(respuesta.message)}
          onCerrar={pagina.cerrarModal}
        >
          <p>
            Se quitará <strong className="font-semibold">{modal.antecedente.enfermedad.nombre}</strong> de los antecedentes de{' '}
            {paciente.nombre_completo}. Use esta opción solo si se registró por error: el cambio queda en la bitácora.
          </p>
        </ConfirmModal>
      )}
    </section>
  )
}
