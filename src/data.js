export const services = [
  {
    id: "web",
    number: "01",
    icon: "web",
    title: "Páginas web",
    tagline: "Tu negocio merece su propio espacio.",
    description:
      "Una web para presentar lo que haces, mostrar tus servicios y facilitar que tus próximos clientes te contacten.",
    features: [
      "Webs para negocios y emprendimientos",
      "Landing pages para tus servicios",
      "Diseño adaptable a celular y escritorio",
    ],
    cta: "Quiero una página web",
  },
  {
    id: "android",
    number: "02",
    icon: "phone",
    title: "Apps Android",
    tagline: "Tu operación. En la palma de tu mano.",
    description:
      "Lleva una tarea de tu negocio al celular: registrar pedidos, consultar información o acompañar a tus clientes.",
    features: [
      "Aplicaciones a medida para Android",
      "Interfaces claras y fáciles de usar",
      "Conexión con tus sistemas y datos",
    ],
    cta: "Quiero una app Android",
  },
  {
    id: "datos",
    number: "03",
    icon: "database",
    title: "Bases de datos",
    tagline: "Cada dato tiene algo que aportar.",
    description:
      "Organiza y relaciona la información que mueve tu negocio para consultarla y conectarla con tus aplicaciones.",
    features: [
      "Diseño de tablas y relaciones",
      "Consultas y organización de información",
      "Integración con páginas web y apps",
    ],
    cta: "Quiero ordenar mis datos",
  },
];
export const scopes = [
  { id: "mvp", label: "Primera versión" },
  { id: "completo", label: "Producto completo" },
  { id: "escalar", label: "Ya existe, quiero mejorarlo" },
];
export const extras = [
  { id: "design", label: "Diseño UX/UI", effort: 1.5 },
  { id: "api", label: "Integraciones y APIs", effort: 2 },
  { id: "admin", label: "Panel de administración", effort: 2 },
  { id: "db", label: "Base de datos integrada", effort: 2 },
  { id: "care", label: "Soporte posterior", effort: 0 },
];
export const initialProject = { type: "web", scope: "mvp", extras: [] };
export const modules = [
  { id: "ui", label: "Interfaz", x: 50, y: 65, textY: 42 },
  { id: "design", label: "Diseño", x: 170, y: 25, textY: 9 },
  { id: "api", label: "APIs", x: 290, y: 65, textY: 42 },
  { id: "admin", label: "Panel", x: 50, y: 175, textY: 204 },
  { id: "db", label: "Datos", x: 290, y: 175, textY: 204 },
  { id: "care", label: "Soporte", x: 170, y: 210, textY: 190 },
];
export function estimateProject(project) {
  const type = services.find((s) => s.id === project.type) || services[0];
  const scope = scopes.find((s) => s.id === project.scope) || scopes[0];
  const selected = extras.filter(
    (extra) =>
      project.extras.includes(extra.id) &&
      !(type.id === "datos" && extra.id === "db"),
  );
  const weeks =
    { web: 4, android: 8, datos: 3 }[type.id] *
      { mvp: 1, completo: 1.8, escalar: 1.3 }[scope.id] +
    selected.reduce((n, extra) => n + extra.effort, 0);
  const range = `${Math.max(2, Math.round(weeks * 0.85))} a ${Math.max(3, Math.round(weeks * 1.25))} semanas`;
  const active = new Set([
    type.id === "datos" ? "db" : "ui",
    ...selected.map((extra) => extra.id),
  ]);
  const description = `${type.title}, ${scope.label.toLocaleLowerCase("es")}${selected.length ? "; " + selected.map((extra) => extra.label.toLocaleLowerCase("es")).join(", ") : ""}`;
  return {
    type: type.id,
    range,
    active: [...active],
    description,
    summary: `${description}. Referencia inicial: ${range}, sujeta a revisión del alcance.`,
  };
}
export const examples = [
  {
    id: "web",
    tab: "Una web para tu negocio",
    label: "PÁGINA WEB",
    title: ["Que te conozcan.", "Que te contacten."],
    description:
      "Un espacio para presentar tu negocio de servicios, contar tu propuesta y abrir una conversación con tus próximos clientes.",
    features: ["Presentación", "Servicios", "Contacto"],
  },
  {
    id: "android",
    tab: "Tu operación en Android",
    label: "APP ANDROID",
    title: ["Menos pasos.", "Más control."],
    description:
      "Organiza pedidos desde el celular. Prueba los filtros de esta demostración para explorar una tarea que tu equipo podría resolver con una app.",
    features: ["Pedidos", "Estados", "Consulta móvil"],
  },
  {
    id: "datos",
    tab: "Información conectada",
    label: "BASE DE DATOS",
    title: ["Cada dato,", "en su lugar."],
    description:
      "Una misma base conecta clientes y pedidos. Selecciona un cliente de ejemplo y descubre cómo se relaciona su información.",
    features: ["Relaciones", "Consultas", "Integración"],
  },
];
