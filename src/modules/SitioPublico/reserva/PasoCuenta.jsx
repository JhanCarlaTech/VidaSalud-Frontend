import { useState } from 'react'
import { primerErrorPorCampo } from '../../../core/api/error-handler'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { fechaISO } from '../../../shared/utils/formatters'
import { validarFechaNacimiento } from '../../ModuloPacientes/utils/validacionPaciente'
import { CamposContrasena, CamposDatosPersonales } from '../../ModuloSeguridad/components/CamposCuenta'
import { useAuth } from '../../ModuloSeguridad/hooks/useAuth'
import {
  datosCuentaParaEnviar,
  datosPersonalesIniciales,
  PATRON_CORREO,
  validarDatosCuenta,
} from '../../ModuloSeguridad/utils/validacionCuenta'

const MODOS = [
  { valor: 'registro', etiqueta: 'Soy nuevo: crear cuenta' },
  { valor: 'login', etiqueta: 'Ya tengo cuenta' },
]

/**
 * Formulario compartido: estado, cambio de campos y envío con errores del servidor.
 * @param {(valores: object) => object} validar  Errores locales por campo.
 * @param {(valores: object) => Promise<object>} enviar  Devuelve el contexto de la sesión.
 */
function useFormularioCuenta(valoresIniciales, validar, enviar, onSesion) {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: undefined }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const erroresLocales = validar(valores)
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) return

    setEnviando(true)
    try {
      const sesion = await enviar(valores)
      onSesion(sesion)
    } catch (error) {
      if (error.status === 422 && error.errors) setErrores(primerErrorPorCampo(error.errors))
      else setErrorGeneral(error.message) // 401, 429 (RN07) y errores del servidor.
      setEnviando(false)
    }
  }

  return { valores, errores, errorGeneral, enviando, manejarCambio, manejarEnvio }
}

/** CU11 – Autorregistro de paciente dentro de la reserva. */
function FormularioRegistro({ onSesion }) {
  const { registrarse } = useAuth()
  const formulario = useFormularioCuenta(
    { ...datosPersonalesIniciales(null), fecha_nacimiento: '' },
    (valores) => {
      const errores = validarDatosCuenta(valores, true)
      const errorFecha = validarFechaNacimiento(valores.fecha_nacimiento)
      if (errorFecha) errores.fecha_nacimiento = errorFecha
      return errores
    },
    async (valores) => (await registrarse(datosCuentaParaEnviar(valores))).data,
    onSesion,
  )
  const { valores, errores, enviando } = formulario

  return (
    <form onSubmit={formulario.manejarEnvio} noValidate className="flex flex-col gap-6">
      {formulario.errorGeneral && <Alert variante="error">{formulario.errorGeneral}</Alert>}

      <CamposDatosPersonales valores={valores} errores={errores} onCambio={formulario.manejarCambio} deshabilitado={enviando} />

      <div className="sm:w-1/2 sm:pr-2">
        <Input
          etiqueta="Fecha de nacimiento"
          name="fecha_nacimiento"
          type="date"
          max={fechaISO(-1)}
          min="1900-01-02"
          value={valores.fecha_nacimiento}
          onChange={formulario.manejarCambio}
          error={errores.fecha_nacimiento}
          disabled={enviando}
        />
      </div>

      <CamposContrasena valores={valores} errores={errores} onCambio={formulario.manejarCambio} esNuevo deshabilitado={enviando} />

      <Button type="submit" bloque cargando={enviando}>
        {enviando ? 'Creando cuenta…' : 'Crear cuenta y continuar al pago'}
      </Button>
    </form>
  )
}

/** CU01 – Inicio de sesión dentro de la reserva. */
function FormularioLogin({ onSesion }) {
  const { login } = useAuth()
  const formulario = useFormularioCuenta(
    { correo: '', contrasena: '' },
    ({ correo, contrasena }) => {
      const errores = {}
      if (!PATRON_CORREO.test(correo.trim())) errores.correo = 'Ingrese un correo electrónico válido.'
      if (!contrasena) errores.contrasena = 'La contraseña es obligatoria.'
      return errores
    },
    ({ correo, contrasena }) => login({ correo: correo.trim(), contrasena }),
    onSesion,
  )
  const { valores, errores, enviando } = formulario

  return (
    <form onSubmit={formulario.manejarEnvio} noValidate className="flex flex-col gap-5 sm:max-w-md">
      {formulario.errorGeneral && <Alert variante="error">{formulario.errorGeneral}</Alert>}
      <Input
        etiqueta="Correo electrónico"
        name="correo"
        type="email"
        autoComplete="email"
        value={valores.correo}
        onChange={formulario.manejarCambio}
        error={errores.correo}
        disabled={enviando}
        autoFocus
      />
      <Input
        etiqueta="Contraseña"
        name="contrasena"
        type="password"
        autoComplete="current-password"
        value={valores.contrasena}
        onChange={formulario.manejarCambio}
        error={errores.contrasena}
        disabled={enviando}
      />
      <Button type="submit" bloque cargando={enviando}>
        {enviando ? 'Ingresando…' : 'Ingresar y continuar al pago'}
      </Button>
    </form>
  )
}

/**
 * Etapa 'cuenta': para pagar la cita se necesita una cuenta de paciente.
 * Al crearla o iniciar sesión, la reserva continúa con lo ya elegido.
 */
export function PasoCuenta({ agendando, onSesion, onVolver }) {
  const [modo, setModo] = useState('registro')

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Para pagar, identifíquese</h3>
        <p className="text-sm text-suave">
          Su elección se conserva. Cree su cuenta de paciente (toma un minuto) o ingrese con la que ya tiene.
        </p>
      </header>

      <div role="tablist" aria-label="Tipo de acceso" className="inline-flex w-full rounded-xl border border-borde bg-gris p-1 sm:w-fit">
        {MODOS.map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            role="tab"
            aria-selected={modo === opcion.valor}
            onClick={() => setModo(opcion.valor)}
            className={`flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
              modo === opcion.valor ? 'bg-superficie text-texto shadow-suave' : 'text-suave hover:text-texto'
            }`}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>

      {agendando ? (
        <Alert>Agendando su cita…</Alert>
      ) : modo === 'registro' ? (
        <FormularioRegistro onSesion={onSesion} />
      ) : (
        <FormularioLogin onSesion={onSesion} />
      )}

      <button type="button" onClick={onVolver} className="w-fit cursor-pointer text-sm font-semibold text-suave hover:text-texto">
        ← Volver a mi elección
      </button>
    </div>
  )
}
