import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Input } from '../../../../shared/components/ui/Input'
import { useRegistrarConsultaPage } from './RegistrarConsultaPage'

/**
 * CU17 – Registrar Consulta Médica.
 */
export function RegistrarConsultaPage() {
  const pagina = useRegistrarConsultaPage()

  return (
    <section className="flex flex-col gap-6 max-w-3xl">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Registrar Consulta Médica</h1>
        <p className="text-suave">Complete la ficha clínica del paciente para cerrar la atención (la cita pasará a estado "Atendida").</p>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <form onSubmit={pagina.handleSubmit} className="flex flex-col gap-5 bg-fondo-suave p-6 rounded-lg border">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            etiqueta="ID de la Cita Médica" 
            type="number" 
            name="id_cita_medica" 
            value={pagina.formData.id_cita_medica} 
            onChange={pagina.handleChange} 
            required 
            placeholder="Ej. 1"
          />
          <Input 
            etiqueta="Escala del Dolor (0-10)" 
            type="number" 
            name="escala_del_dolor" 
            value={pagina.formData.escala_del_dolor} 
            onChange={pagina.handleChange} 
            min="0"
            max="10"
            placeholder="Opcional"
          />
        </div>
        
        <Input 
          etiqueta="Motivo de Consulta" 
          type="text" 
          name="motivo_de_consultas" 
          value={pagina.formData.motivo_de_consultas} 
          onChange={pagina.handleChange} 
          required 
          placeholder="Ej. Dolor de cabeza y fiebre"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            etiqueta="Peso (kg)" 
            type="number" 
            step="0.01" 
            name="peso" 
            value={pagina.formData.peso} 
            onChange={pagina.handleChange} 
            required 
            placeholder="Ej. 70.5"
          />
          <Input 
            etiqueta="Estatura (cm)" 
            type="number" 
            step="0.01" 
            name="estatura" 
            value={pagina.formData.estatura} 
            onChange={pagina.handleChange} 
            required 
            placeholder="Ej. 175"
          />
        </div>

        {/* Usamos textarea nativo con clases de Tailwind porque no vimos un componente Textarea en shared */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Síntomas</label>
          <textarea 
            name="sintomas" 
            value={pagina.formData.sintomas} 
            onChange={pagina.handleChange} 
            rows="3" 
            placeholder="Describa los síntomas del paciente..."
            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primario" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Tratamiento</label>
          <textarea 
            name="tratamiento" 
            value={pagina.formData.tratamiento} 
            onChange={pagina.handleChange} 
            rows="3" 
            placeholder="Indique el tratamiento a seguir..."
            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primario" 
          />
        </div>

        <div className="flex justify-end mt-2">
          <Button type="submit" variante="primario" cargando={pagina.guardando}>
            Guardar Consulta Médica
          </Button>
        </div>
      </form>
    </section>
  )
}