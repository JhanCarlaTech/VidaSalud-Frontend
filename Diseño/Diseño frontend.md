### Análisis del Diseño y Paleta de Colores de la Imagen

El diseño de la imagen destaca por su estilo **Minimalista Premium / Monocromático**:

1. **Fondo Base (Light Canvas):** Blanco puro (`#FFFFFF`) y Gris Claro Monocromático (`#F4F4F5` / `#E4E4E7`).


2. **Color de Acento / Primario:** Negro Puro (`#000000` / `#09090B`) utilizado para botones de llamados a la acción (CTA), encabezados y estados seleccionados.


3. **Texto Secundario y Bordes:** Gris Neutro Medio (`#71717A` / `#A1A1AA`) para etiquetas secundarias, descripciones breves y bordes ultra finos de los formularios.


4. **Tipografía:** Sans-serif geométrica, moderna y limpia, con alto contraste y peso mediano/bold en los titulares.



---

### Prompt para Inteligencia Artificial o Guía de Diseño (Frontend)

Copia y pega el siguiente prompt en tu herramienta de IA o documento de especificación de interfaz:

> **System / Style Prompt:**
> "Diseña la interfaz de usuario (UI) para la capa de Frontend de nuestro proyecto web basándote en una estética **Minimalista Monocromática Premium** inspirada en marcas de lujo modernas (estilo ETQ / Apple).
> 
> 
> **1. Paleta de Colores Básica:**
> * **Primary Accent / Main Buttons:** `#000000` (Negro Puro)
> 
> 
> * **Primary Contrast Text / Button Text:** `#FFFFFF` (Blanco Puro)
> 
> 
> * **Background Body:** `#FFFFFF` (Blanco Neutro)
> 
> 
> * **Surface / Modal Background:** `#FFFFFF` / `#FAFAFA`
> 
> * **Borders / Dividers:** `#E4E4E7` (Gris ultra fino suave)
> 
> 
> * **Muted Text / Descriptions:** `#71717A` (Gris medio neutro)
> 
> 
> * **Interactive / Toggles:** `#000000` para estado activo / `#E4E4E7` para inactivo.
> 
> 
> 
> 
> **2. Principios de Tipografía y Espaciado:**
> * Usa una tipografía Sans-Serif geométrica (ej. *Inter*, *Helvetica Neue* o *System UI*).
> 
> 
> * Espaciado amplio (padding y margin generosos) con estructura limpia de grillas.
> 
> 
> * Encabezados con peso `font-semibold` o `font-bold` y textos secundarios en `font-normal`.
> 
> 
> 
> 
> **3. Componentes Visuales:**
> * **Botones:** Bordes rectos o con un leve `border-radius: 4px` a `6px`, de color negro sólido `#000000` con texto blanco `#FFFFFF` para acciones principales, y fondo blanco con borde gris fino para acciones secundarias.
> 
> 
> * **Modales / Contenedores:** Limpios, centrados, con sombras ultra suaves (`box-shadow: 0 4px 20px rgba(0,0,0,0.05)`) o bordes delgados `#E4E4E7` sin recargas de color.
> 
> 
> * **Switches / Toggles:** Estilo redondeado 'capsule' blanco y negro de alto contraste."
> 
> 
> 
> 

---

### Variables CSS (para incluir directamente en tu proyecto React/CSS)

Si estás usando CSS3 o Tailwind CSS en tu Frontend (Vite/React), puedes agregar estas variables globales a tu archivo de estilos principal (`src/index.css` o `style.css`):

```css
:root {
  /* Paleta de Colores Minimalista Monocromática */
  --bg-primary: #ffffff;
  --bg-surface: #ffffff;
  --bg-muted: #f4f4f5;
  
  --text-main: #09090b;
  --text-muted: #71717a;
  --text-inverse: #ffffff;

  --border-color: #e4e4e7;
  --border-dark: #000000;

  --btn-bg-primary: #000000;
  --btn-text-primary: #ffffff;
  --btn-bg-hover: #27272a;

  /* Tipografía y Bordes */
  --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --radius-sm: 4px;
  --radius-md: 8px;
}
