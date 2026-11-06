import { useState } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { Textarea } from '../../../shared/components/ui/Textarea'
import { CONTACTO_CLINICA, IMAGENES_SITIO } from '../utils/sitio'
import { EncabezadoSeccion } from './Encabezado'
import { EspacioImagen } from './EspacioImagen'
import { Revelar } from './Revelar'

function DatoContacto({ titulo, children }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold tracking-wider text-suave uppercase">{titulo}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

/**
 * "Contáctanos": datos de la clínica, horarios, ubicación y un mensaje que se
 * envía desde la aplicación de correo del visitante.
 */
export function SeccionContacto() {
  const [valores, setValores] = useState({ nombre: '', correo: '', mensaje: '' })

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
  }

  function enviar(evento) {
    evento.preventDefault()
    const asunto = encodeURIComponent(`Consulta desde la web – ${valores.nombre}`)
    const cuerpo = encodeURIComponent(`${valores.mensaje}\n\n${valores.nombre} · ${valores.correo}`)
    window.location.href = `mailto:${CONTACTO_CLINICA.correo}?subject=${asunto}&body=${cuerpo}`
  }

  const telefonoWhatsapp = CONTACTO_CLINICA.whatsapp.replace(/\D/g, '')

  return (
    <section id="contacto" className="scroll-mt-16 bg-superficie">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
        <Revelar>
          <EncabezadoSeccion
            antetitulo="Contáctanos"
            titulo="Estamos para ayudarle"
            descripcion="Escríbanos, llámenos o visítenos. Respondemos sus consultas en horario de atención."
          />
        </Revelar>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Revelar className="flex flex-col gap-6">
            <dl className="grid gap-6 rounded-md border border-borde bg-white p-6 sm:grid-cols-2">
              <DatoContacto titulo="Dirección">{CONTACTO_CLINICA.direccion}</DatoContacto>
              <DatoContacto titulo="Teléfono">
                <a href={`tel:${CONTACTO_CLINICA.telefono.replace(/\s/g, '')}`} className="hover:underline">
                  {CONTACTO_CLINICA.telefono}
                </a>
              </DatoContacto>
              <DatoContacto titulo="WhatsApp">
                <a href={`https://wa.me/${telefonoWhatsapp}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {CONTACTO_CLINICA.whatsapp}
                </a>
              </DatoContacto>
              <DatoContacto titulo="Correo">
                <a href={`mailto:${CONTACTO_CLINICA.correo}`} className="hover:underline">
                  {CONTACTO_CLINICA.correo}
                </a>
              </DatoContacto>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <dt className="text-xs font-semibold tracking-wider text-suave uppercase">Horario de atención</dt>
                {CONTACTO_CLINICA.horario.map((franja) => (
                  <dd key={franja.dias} className="flex justify-between gap-4 border-b border-borde pb-2 text-sm last:border-b-0">
                    <span>{franja.dias}</span>
                    <span className="font-medium tabular-nums">{franja.horas}</span>
                  </dd>
                ))}
              </div>
            </dl>
            <div className="aspect-[12/7] w-full">
              <EspacioImagen src={IMAGENES_SITIO.mapa} descripcion="Mapa de ubicación" tamano="1200 × 700" />
            </div>
          </Revelar>

          <Revelar retraso={120}>
            <form onSubmit={enviar} className="flex h-full flex-col gap-5 rounded-md border border-borde bg-white p-6">
              <h3 className="text-lg font-semibold">Envíenos un mensaje</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input etiqueta="Nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} required />
                <Input etiqueta="Correo electrónico" name="correo" type="email" value={valores.correo} onChange={manejarCambio} required />
              </div>
              <Textarea
                etiqueta="Mensaje"
                name="mensaje"
                rows={6}
                maxLength={1000}
                placeholder="¿En qué podemos ayudarle?"
                value={valores.mensaje}
                onChange={manejarCambio}
                required
              />
              <div className="mt-auto flex flex-col gap-2">
                <Button type="submit" bloque>
                  Enviar mensaje
                </Button>
                <p className="text-center text-xs text-suave">Se abrirá su aplicación de correo con el mensaje listo para enviar.</p>
              </div>
            </form>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
