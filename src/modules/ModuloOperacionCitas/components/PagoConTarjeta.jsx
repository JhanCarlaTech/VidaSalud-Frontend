
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Alert } from '../../../shared/components/ui/Alert'
import { Button } from '../../../shared/components/ui/Button'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useTema } from '../../../shared/hooks/useTema'
import { formatearMoneda } from '../../../shared/utils/formatters'
import { confirmarPagoEnLinea, iniciarPagoEnLinea, obtenerConfiguracionStripe } from '../services/pago.service'

/** Stripe.js se descarga una sola vez por clave pública. */
const instancias = new Map()
function cargarStripe(clavePublica) {
  if (!instancias.has(clavePublica)) instancias.set(clavePublica, loadStripe(clavePublica))
  return instancias.get(clavePublica)
}

/** Lee un token del tema activo (las variables --vs-* de styles/index.css). */
function token(nombre) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--vs-${nombre}`).trim()
}

/**
 * Formulario de Stripe con los colores del sistema. Stripe no lee nuestras clases,
 * así que se le pasan los valores del tema actual (claro u oscuro).
 */
function apariencia(tema) {
  const primario = token('primario')
  const borde = token('borde')
  return {
    theme: tema === 'oscuro' ? 'night' : 'stripe',
    variables: {
      colorPrimary: primario,
      colorText: token('texto'),
      colorTextSecondary: token('suave'),
      colorTextPlaceholder: token('sutil'),
      colorDanger: token('peligro'),
      colorBackground: token('superficie'),
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSizeBase: '15px',
      borderRadius: '8px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': { border: `1px solid ${borde}`, boxShadow: 'none' },
      '.Input:focus': { borderColor: primario, boxShadow: `0 0 0 3px color-mix(in srgb, ${primario} 20%, transparent)` },
      '.Label': { fontWeight: '500' },
      '.Tab': { border: `1px solid ${borde}`, boxShadow: 'none' },
      '.Tab--selected': { borderColor: primario, boxShadow: `0 0 0 1px ${primario}` },
    },
  }
}

const FUENTES = [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }]

function mensajeDeError(error) {
  return error?.errors ? Object.values(error.errors)[0][0] : (error?.message ?? 'No se pudo preparar el pago.')
}

/**
 * CU24 – Pago con tarjeta mediante Stripe.
 * Los datos de la tarjeta van del navegador directamente a Stripe; la API solo
 * crea el cobro y verifica después su estado real.
 *
 * @param {{ cita: { id: number }, idEspecialidad: number, onPagado: (pago: object) => void }} props
 */
export function PagoConTarjeta({ cita, idEspecialidad, onPagado }) {
  const [preparacion, setPreparacion] = useState({ estado: 'cargando' })
  const { tema } = useTema()

  useEffect(() => {
    let vigente = true

    Promise.all([obtenerConfiguracionStripe(), iniciarPagoEnLinea(cita.id, idEspecialidad)])
      .then(([configuracion, intento]) => {
        if (!vigente) return
        if (!intento.client_secret) {
          onPagado(intento.pago) // Ya estaba cobrada (p. ej., se pagó en otra pestaña).
          return
        }
        if (!configuracion.habilitado) throw new Error('El pago en línea no está disponible en este momento.')
        setPreparacion({
          estado: 'listo',
          stripe: cargarStripe(configuracion.clave_publica),
          clientSecret: intento.client_secret,
          pago: intento.pago,
          modoPrueba: configuracion.clave_publica.startsWith('pk_test_'),
        })
      })
      .catch((error) => vigente && setPreparacion({ estado: 'error', mensaje: mensajeDeError(error) }))

    return () => {
      vigente = false
    }
    // onPagado cambia en cada render del padre; el cobro solo depende de la cita y la especialidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cita.id, idEspecialidad])

  if (preparacion.estado === 'cargando') return <Spinner mensaje="Preparando el pago seguro…" />
  if (preparacion.estado === 'error') return <Alert variante="error">{preparacion.mensaje}</Alert>

  return (
    <Elements
      stripe={preparacion.stripe}
      options={{ clientSecret: preparacion.clientSecret, appearance: apariencia(tema), fonts: FUENTES, locale: 'es' }}
    >
      <FormularioTarjeta cita={cita} pago={preparacion.pago} modoPrueba={preparacion.modoPrueba} onPagado={onPagado} />
    </Elements>
  )
}

function FormularioTarjeta({ cita, pago, modoPrueba, onPagado }) {
  const stripe = useStripe()
  const elements = useElements()
  const [listo, setListo] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  async function pagar(evento) {
    evento.preventDefault()
    if (!stripe || !elements) return

    setError('')
    setEnviando(true)
    try {
      // 3-D Secure, si el banco lo pide, se resuelve en una ventana de Stripe sin salir de la página.
      const { error: errorStripe } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: { return_url: window.location.href },
      })

      if (errorStripe) {
        setError(errorStripe.message ?? 'No se pudo procesar la tarjeta.')
        return
      }

      // El estado se toma del servidor (que pregunta a Stripe), no del navegador.
      const confirmado = await confirmarPagoEnLinea(cita.id)
      if (confirmado.estado === 'Completado') {
        onPagado(confirmado)
      } else {
        setError(confirmado.ultimo_error ?? 'El banco todavía está procesando el pago. Revise "Mis citas" en unos minutos.')
      }
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={pagar} className="flex flex-col gap-4">
      {/* Solo tarjeta: sin el registro opcional en Link ni billeteras, para un formulario corto. */}
      <PaymentElement
        onReady={() => setListo(true)}
        options={{ layout: 'tabs', wallets: { link: 'never', applePay: 'never', googlePay: 'never' } }}
      />

      {modoPrueba && (
        <p className="text-xs text-suave">
          Modo de prueba de Stripe: use la tarjeta <span className="font-medium text-texto tabular-nums">4242 4242 4242 4242</span>,
          cualquier fecha futura y cualquier CVC. No se cobra dinero real.
        </p>
      )}
      {error && <Alert variante="error">{error}</Alert>}

      <Button type="submit" bloque cargando={enviando} disabled={!stripe || !listo}>
        Pagar {formatearMoneda(pago.monto)}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-suave">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
          <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Z" />
        </svg>
        Pago cifrado y procesado por Stripe. La clínica no guarda los datos de su tarjeta.
      </p>
    </form>
  )
}
