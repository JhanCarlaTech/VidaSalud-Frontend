import { useCallback, useEffect, useRef, useState } from 'react'

const Reconocimiento = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined
const IDIOMA = 'es-BO'

/** Mensajes de los errores del reconocimiento de voz del navegador. */
const ERRORES = {
  'not-allowed': 'El navegador no tiene permiso para usar el micrófono. Habilítelo en la barra de direcciones.',
  'service-not-allowed': 'El navegador no permite el dictado en esta página.',
  'no-speech': 'No se escuchó nada. Intente de nuevo, más cerca del micrófono.',
  'audio-capture': 'No se encontró un micrófono.',
  network: 'El dictado necesita conexión a internet en este navegador.',
}

/**
 * Dictado con la Web Speech API (CU22). El texto se va mostrando mientras se habla;
 * al terminar se entrega a `alTerminar` para generar el reporte.
 * @param {(texto: string) => void} alTerminar
 */
export function useDictado(alTerminar) {
  const [escuchando, setEscuchando] = useState(false)
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')
  const reconocimiento = useRef(null)
  const ultimo = useRef('')
  const terminar = useRef(alTerminar)

  useEffect(() => {
    terminar.current = alTerminar
  })

  useEffect(() => () => reconocimiento.current?.abort(), [])

  const iniciar = useCallback(() => {
    if (!Reconocimiento) return
    setError('')
    setTexto('')
    ultimo.current = ''

    const instancia = new Reconocimiento()
    instancia.lang = IDIOMA
    instancia.interimResults = true
    instancia.continuous = false
    instancia.onresult = (evento) => {
      const frase = Array.from(evento.results).map((resultado) => resultado[0].transcript).join('')
      ultimo.current = frase
      setTexto(frase)
    }
    instancia.onerror = (evento) => setError(ERRORES[evento.error] ?? 'No se pudo usar el dictado. Escriba la consulta.')
    instancia.onend = () => {
      setEscuchando(false)
      if (ultimo.current.trim()) terminar.current(ultimo.current.trim())
    }

    reconocimiento.current = instancia
    instancia.start()
    setEscuchando(true)
  }, [])

  const detener = useCallback(() => reconocimiento.current?.stop(), [])

  return { soportado: Boolean(Reconocimiento), escuchando, texto, setTexto, error, iniciar, detener }
}

/**
 * Lectura en voz alta con la síntesis del navegador, con una voz en español si la hay.
 */
export function useLectura() {
  const soportada = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [hablando, setHablando] = useState(false)

  useEffect(() => () => soportada && window.speechSynthesis.cancel(), [soportada])

  const leer = useCallback(
    (texto) => {
      if (!soportada || !texto) return
      window.speechSynthesis.cancel()
      const enunciado = new SpeechSynthesisUtterance(texto)
      enunciado.lang = IDIOMA
      const voz = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('es'))
      if (voz) enunciado.voice = voz
      enunciado.onstart = () => setHablando(true)
      enunciado.onend = () => setHablando(false)
      enunciado.onerror = () => setHablando(false)
      window.speechSynthesis.speak(enunciado)
    },
    [soportada],
  )

  const callar = useCallback(() => {
    if (!soportada) return
    window.speechSynthesis.cancel()
    setHablando(false)
  }, [soportada])

  return { soportada, hablando, leer, callar }
}
