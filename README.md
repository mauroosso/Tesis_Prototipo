# LeadFlow LATAM 🚀

## Plataforma de Generación y Conversión de Leads B2B para Latinoamérica

LeadFlow es un prototipo completo de plataforma tipo Apollo.io, diseñada específicamente para pequeñas y medianas empresas en Latinoamérica. Combina funcionalidades de prospección, engagement multicanal y CRM visual con una interfaz minimalista inspirada en las mejores prácticas de diseño SaaS B2B.

---

## 📋 Índice

- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos Implementados](#módulos-implementados)
- [Base de Datos Simulada](#base-de-datos-simulada)
- [Diseño y UX](#diseño-y-ux)
- [Guía de Uso](#guía-de-uso)
- [Capturas de Pantalla](#capturas-de-pantalla)

---

## ✨ Características Principales

### 🎯 Prospección y Enriquecimiento
- **Personas**: Búsqueda y filtrado avanzado de contactos B2B en LATAM
- **Empresas**: Catálogo de empresas con información detallada (industria, tamaño, facturación)
- **Filtros inteligentes**: Por país, industria, tamaño, seniority, departamento
- **Datos enriquecidos**: Email, LinkedIn, teléfono, información de empresa

### 💬 Engagement Multicanal
- **Secuencias automatizadas**: Timeline visual de outreach combinando LinkedIn, Email y WhatsApp
- **Warm-up Social**: Tareas sugeridas para calentar prospectos antes del contacto directo
- **Mensajes personalizados**: Variables dinámicas ({nombre}, {empresa}, {industria})
- **IA integrada**: Sugerencias de copy y optimización de mensajes

### 📊 CRM Visual
- **Kanban interactivo**: Gestión visual de oportunidades con drag & drop
- **Pipeline completo**: Nuevo → Contactado → Interesado → Reunión → Cliente
- **Indicadores de urgencia**: Alta, media, baja prioridad
- **Acciones rápidas**: LinkedIn, Email, WhatsApp directamente desde las cards

### 📈 Analíticas y Reportes
- **Dashboard completo**: Métricas clave (aperturas, respuestas, conversiones)
- **Performance por canal**: Comparativa LinkedIn vs Email vs WhatsApp
- **Insights con IA**: Mejores horarios, mensajes que funcionan, recomendaciones personalizadas
- **Embudo de conversión**: Visualización completa del funnel de ventas

### 🔌 Integraciones
- Email: Gmail, Outlook
- Social: LinkedIn, WhatsApp Business
- CRM: HubSpot, Zoho
- Calendario: Google Calendar
- Notificaciones: Slack

### 🎓 Academy & Comunidad
- Recursos educativos (videos, guías, artículos)
- Mejores prácticas para LATAM
- Comunidad de usuarios

---

## 🛠 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Gestión de Estado**: React Hooks
- **Drag & Drop**: HTML5 Drag API nativo

---

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Tesis_Prototipo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

### Comandos disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Build de producción
npm run start    # Ejecutar build
npm run lint     # Linter
```

---

## 📁 Estructura del Proyecto

```
Tesis_Prototipo/
├── app/                      # App Router de Next.js
│   ├── page.tsx             # Home / Dashboard
│   ├── personas/            # Módulo de Personas
│   ├── empresas/            # Módulo de Empresas
│   ├── crm/                 # CRM Visual Kanban
│   ├── warm-up/             # Warm-up Social
│   ├── secuencias/          # Secuencias Multicanal
│   ├── analiticas/          # Dashboard de Analíticas
│   ├── integraciones/       # Integraciones
│   ├── academy/             # Academy & Recursos
│   ├── globals.css          # Estilos globales
│   └── layout.tsx           # Layout principal
│
├── components/              # Componentes React
│   ├── Sidebar.tsx         # Navegación lateral fija
│   └── AppLayout.tsx       # Layout wrapper
│
├── data/                    # Base de datos simulada
│   ├── companies.ts        # 200 empresas LATAM
│   └── people.ts           # 200 contactos B2B
│
├── public/                  # Assets estáticos
├── tailwind.config.ts      # Configuración Tailwind
├── tsconfig.json           # Configuración TypeScript
├── next.config.js          # Configuración Next.js
└── package.json            # Dependencias
```

---

## 🗂 Módulos Implementados

### 1. Home / Dashboard
- Encabezado personalizado ("Bienvenido, [nombre] 👋")
- Tabs: Configuración inicial / Recomendaciones
- Progreso de onboarding con checklist
- Cards de flujos IA sugeridos
- Tips y consejos contextuales

### 2. Personas
- Tabla estilo Apollo.io con datos completos
- Filtros lateral (país, seniority, departamento, estado)
- Búsqueda en tiempo real
- Selección múltiple y acciones masivas
- Badges de estado y "Nuevo rol"
- Acciones rápidas (LinkedIn, Email)

### 3. Empresas
- Vista de cards con diseño limpio
- Información clave: logo, país, industria, tamaño, facturación
- Segmentación: Startup, PyME, Enterprise
- Canal preferido de contacto
- Acciones: Ver empleados, Guardar, Visitar sitio

### 4. CRM Visual (Kanban)
- 5 columnas: Nuevo, Contactado, Interesado, Reunión, Cliente
- Drag & drop nativo funcional
- Cards con foto, empresa, última acción, próxima acción
- Indicadores de urgencia (verde, amarillo, rojo)
- Acciones rápidas al hover

### 5. Warm-up Social
- Tareas sugeridas por tipo: Visitar, Seguir, Reaccionar, Comentar
- Comentarios sugeridos por IA
- Tracking de progreso
- Integración con LinkedIn
- CTA para crear secuencias

### 6. Secuencias Multicanal
- Timeline visual paso a paso
- Multicanal: LinkedIn + Email + WhatsApp
- Variables dinámicas personalizables
- Preview de mensajes
- Métricas por secuencia (apertura, respuesta, conversión)
- Optimización con IA

### 7. Analíticas
- Métricas principales en cards
- Performance por canal (barras de progreso)
- Mejores horarios para enviar
- Insights con IA contextual
- Embudo de conversión visual
- Exportación de reportes

### 8. Integraciones
- Vista de todas las integraciones disponibles
- Estados: Conectado, Error, Desconectado
- Agrupación por categoría
- Panel de estado con métricas
- Acciones: Conectar, Configurar, Reconectar, Desconectar

### 9. Academy
- Recursos categorizados (Videos, Guías, Artículos)
- Sección de populares con badge
- Tiempos estimados de lectura/visualización
- Comunidad LATAM
- Links a documentación y soporte

---

## 💾 Base de Datos Simulada

### Empresas (120+ registradas)
Representación realista de empresas B2B en LATAM:
- **Países**: Argentina, México, Colombia, Chile, Perú, Uruguay, Ecuador, Bolivia, Paraguay, Costa Rica, Panamá, Guatemala, El Salvador, Honduras, Nicaragua
- **Industrias**: Tecnología, E-commerce, Logística, Fintech, Marketing, Agro, Consultoría, HealthTech, PropTech, EduTech, y más
- **Segmentos**: Startup, PyME, Enterprise
- **Datos**: Nombre, logo, descripción, tamaño, facturación estimada, canal preferido, website

### Personas (32+ registradas)
Contactos B2B realistas:
- **Cargos**: CEO, Founder, CTO, CMO, Gerente Comercial, Head of Sales, VP de Ventas, etc.
- **Seniority**: C-Level, VP, Director, Manager, Individual Contributor
- **Departamentos**: Sales, Marketing, Operations, Product, Engineering, Finance, HR
- **Estados**: Nuevo, Warm-up, Contactado, Interesado, Reunión, Cliente
- **Datos**: Nombre completo, email verificado, LinkedIn, teléfono, última acción, próxima acción

---

## 🎨 Diseño y UX

### Paleta de Colores
```css
Primario:  #00A3FF (Azul Apollo)
Éxito:     #A4E24E (Verde lime)
Warning:   #FFB020 (Amarillo/Naranja)
Gris texto:#707070
Gris claro:#F5F5F5
```

### Principios de Diseño

1. **Minimalismo**: Espacios blancos amplios, tipografía ligera
2. **Claridad**: Jerarquía visual clara, información esencial primero
3. **Microinteracciones**: Hover states sutiles, transiciones suaves
4. **Consistencia**: Componentes reutilizables, diseño uniforme
5. **Accesibilidad**: Colores con buen contraste, tamaños legibles

### Componentes Visuales
- **Cards**: Blancas con border sutil, hover con sombra
- **Botones**: Planos (flat), esquinas redondeadas
- **Iconos**: Lucide React, tamaño 16-24px, colores semánticos
- **Tablas**: Estilo Apollo con hover en filas
- **Sidebar**: Fijo, categorías agrupadas, íconos + texto
- **Badges**: Redondeados, colores según estado

---

## 📖 Guía de Uso

### Navegación

La aplicación usa un **sidebar fijo** a la izquierda con las siguientes secciones:

#### PROSPECT & ENRICH
- **Personas**: Busca y filtra contactos B2B
- **Empresas**: Explora empresas que coinciden con tu ICP
- **Listas**: Organiza tus prospectos (placeholder)
- **Enriquecimiento**: Enriquece datos de contactos (placeholder)

#### ENGAGE
- **Secuencias**: Crea y gestiona secuencias multicanal
- **Emails**: Administra tus campañas de email (placeholder)
- **Warm-up Social**: Tareas para calentar prospectos

#### WIN DEALS
- **Reuniones**: Calendario de reuniones (placeholder)
- **Conversaciones**: Inbox unificado (placeholder)
- **Oportunidades**: Pipeline de ventas (placeholder)
- **CRM Visual**: Kanban para gestionar leads

#### TOOLS & AUTOMATION
- **Tareas**: To-do list (placeholder)
- **Workflows**: Automatizaciones (placeholder)
- **Analíticas**: Dashboard de métricas

#### INBOUND
- **Visitantes**: Tracking de visitas web (placeholder)

#### CONFIGURACIÓN
- **Ajustes**: Configuración general (placeholder)
- **Integraciones**: Conecta herramientas externas

#### APRENDER
- **Academy**: Recursos educativos

### Flujo de Trabajo Recomendado

1. **Configuración Inicial** (Home)
   - Conecta Gmail y LinkedIn
   - Define tu ICP
   - Importa contactos

2. **Prospección** (Personas/Empresas)
   - Filtra por país, industria, tamaño
   - Selecciona contactos relevantes
   - Agrégalos a lista de prospección

3. **Warm-up** (Warm-up Social)
   - Visita perfiles
   - Sigue a tus prospectos
   - Reacciona y comenta publicaciones

4. **Outreach** (Secuencias)
   - Crea secuencia multicanal
   - Personaliza mensajes con variables
   - Activa la secuencia

5. **Seguimiento** (CRM Visual)
   - Mueve leads entre etapas
   - Prioriza por urgencia
   - Ejecuta acciones rápidas

6. **Optimización** (Analíticas)
   - Revisa métricas
   - Identifica mejores horarios
   - Aplica insights de IA

---

## 📸 Capturas de Pantalla

*(Las capturas se generarían ejecutando la aplicación)*

### Home
Dashboard de bienvenida con progreso de onboarding y flujos IA sugeridos.

### Personas
Tabla completa estilo Apollo con filtros laterales y acciones masivas.

### Empresas
Vista de cards con información clave de cada empresa.

### CRM Visual
Kanban con drag & drop para gestión visual de oportunidades.

### Secuencias
Timeline multicanal con preview de mensajes.

### Analíticas
Dashboard con métricas, gráficos y insights de IA.

---

## 🌎 Enfoque LATAM

Este prototipo está diseñado específicamente para el mercado latinoamericano:

### Características LATAM-Specific

1. **Idioma**: Todo en español neutro, cálido y humano
2. **Países**: Datos de 14+ países de LATAM
3. **Horarios**: Insights adaptados a zonas horarias LATAM
4. **Canales**: WhatsApp Business como canal principal
5. **Cultura**: Tono más personal y cálido vs. mercados anglosajones
6. **Ejemplos**: Casos de éxito y empresas reales de la región

---

## 🤝 Mejores Prácticas Implementadas

### Outreach Ético
- ✅ Solo mensajes reales, nunca spam
- ✅ Personalización genuina con variables
- ✅ Intervalos realistas entre mensajes
- ✅ Respeto a límites de LinkedIn

### UX/UI
- ✅ Diseño responsive (mobile-first approach)
- ✅ Loading states y feedback visual
- ✅ Microinteracciones sutiles
- ✅ Accesibilidad con contraste adecuado

### Performance
- ✅ Componentes optimizados con React hooks
- ✅ Lazy loading de imágenes
- ✅ Minimización de re-renders
- ✅ Build optimizado de Next.js

---

## 🔮 Próximos Pasos (Roadmap Potencial)

Si este fuera un proyecto real en desarrollo, los siguientes pasos serían:

### Fase 2: Backend
- [ ] API REST con Node.js + Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación con JWT
- [ ] Integración real con APIs de LinkedIn, Gmail, etc.

### Fase 3: Features Avanzadas
- [ ] IA generativa para copy de mensajes
- [ ] Scraping de LinkedIn (respetando TOS)
- [ ] Email tracking real
- [ ] A/B testing de mensajes
- [ ] Webhooks y automatizaciones

### Fase 4: Escalabilidad
- [ ] Multi-tenancy
- [ ] Roles y permisos
- [ ] Planes de pricing
- [ ] Facturación automática

---

## 📝 Notas Técnicas

### Variables de Entorno
Para producción, configurar:
```env
NEXT_PUBLIC_API_URL=
DATABASE_URL=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
```

### Deployment
Compatible con Vercel, Netlify, AWS Amplify:
```bash
npm run build
npm run start
```

---

## 👨‍💻 Autor

**Mauricio Osso**
Prototipo desarrollado para Tesis - Plataforma B2B Lead Generation LATAM

---

## 📄 Licencia

Este es un proyecto prototipo educativo.

---

## 🙏 Agradecimientos

- Inspiración de diseño: Apollo.io
- Iconografía: Lucide React
- Framework: Next.js Team
- Comunidad: Developers LATAM

---

**LeadFlow LATAM** - *Generación de leads B2B simple, efectiva y hecha para LATAM* 🚀
