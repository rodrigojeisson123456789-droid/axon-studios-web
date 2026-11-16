import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { examples } from "../data.js";
import { useExperience } from "../experience.jsx";
import { Icon, SectionHeading, ServiceLink } from "./ui.jsx";
const orders = [
  {
    id: "A-01",
    customer: "Ana · ejemplo",
    client: "ana",
    item: "Productos de catálogo",
    status: "En proceso",
  },
  {
    id: "B-02",
    customer: "Luis · ejemplo",
    client: "luis",
    item: "Servicio personalizado",
    status: "Entregado",
  },
  {
    id: "A-03",
    customer: "Ana · ejemplo",
    client: "ana",
    item: "Pedido de reposición",
    status: "Entregado",
  },
];
function WebDemo() {
  const [mobile, setMobile] = useState(false);
  return (
    <div className="demo-web">
      <div className="demo-controls" aria-label="Vista de la página de ejemplo">
        <span>PRUEBA EL FORMATO</span>
        <div>
          <button
            type="button"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
          >
            <Icon name="web" size={14} />
            Escritorio
          </button>
          <button
            type="button"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
          >
            <Icon name="phone" size={14} />
            Celular
          </button>
        </div>
      </div>
      <motion.div
        layout
        className={`demo-web-frame${mobile ? " is-mobile" : ""}`}
      >
        <div className="demo-browser">
          <span className="browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span>tu-negocio.web</span>
          <Icon name="arrow" size={11} />
        </div>
        <div className="demo-site">
          <div className="demo-site-nav">
            <b>estudio /</b>
            <span>Diseño con intención</span>
          </div>
          <p className="demo-site-eyebrow">ESPACIOS PARA LO QUE VIENE</p>
          <h4>
            Un lugar para
            <br />
            lo que imaginas<span>.</span>
          </h4>
          <div className="demo-site-bottom">
            <span>
              Ideas que toman forma
              <Icon name="arrow" size={13} />
            </span>
            <div className="architecture" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </motion.div>
      <p className="demo-caption">
        CONCEPTO ILUSTRATIVO · NO ES UN SITIO DE CLIENTE
      </p>
    </div>
  );
}
function AndroidDemo() {
  const { enabled } = useExperience();
  const [filter, setFilter] = useState("Todos");
  const selected = orders.filter(
    (order) => filter === "Todos" || order.status === filter,
  );
  return (
    <div className="demo-android">
      <div className="android-device">
        <div className="android-status">
          <span>9:41</span>
          <span>● ▰</span>
        </div>
        <div className="android-head">
          <span>MI NEGOCIO / DEMO</span>
          <h4>
            Mis pedidos
            <Icon name="box" size={20} />
          </h4>
        </div>
        <div className="android-filter" aria-label="Filtrar pedidos de ejemplo">
          {["Todos", "En proceso", "Entregado"].map((label) => (
            <button
              type="button"
              key={label}
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="order-count" aria-live="polite">
          {selected.length}{" "}
          {selected.length === 1 ? "pedido de ejemplo" : "pedidos de ejemplo"}
        </p>
        <motion.div layout className="orders-list">
          <AnimatePresence initial={false}>
            {selected.map((order) => (
              <motion.div
                layout
                key={order.id}
                className="order"
                initial={enabled ? { opacity: 0, x: 12 } : false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: enabled ? 0.2 : 0 }}
              >
                <span className="order-icon">
                  <Icon name="box" size={16} />
                </span>
                <div>
                  <b>{order.id}</b>
                  <span>{order.item}</span>
                  <small>{order.customer}</small>
                </div>
                <span
                  className={`order-status${order.status === "Entregado" ? " done" : ""}`}
                >
                  {order.status}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="android-bottom">
          <Icon name="web" size={16} />
          <span>
            <Icon name="box" size={16} />
            Pedidos
          </span>
          <Icon name="database" size={16} />
        </div>
      </div>
      <p className="demo-caption">PRUEBA LOS FILTROS · DATOS FICTICIOS</p>
    </div>
  );
}
function DataDemo() {
  const { enabled } = useExperience();
  const [client, setClient] = useState("ana");
  const matches = orders.filter((order) => order.client === client);
  return (
    <div className="demo-data">
      <div className="data-demo-head">
        <span className="database-badge">
          <Icon name="database" size={15} />
          UNA BASE. INFORMACIÓN CONECTADA.
        </span>
        <div className="db-relation" aria-hidden="true">
          <span>Clientes</span>
          <i />
          <b>1 → N</b>
          <i />
          <span>Pedidos</span>
        </div>
      </div>
      <label className="data-client-label" htmlFor="demo-client">
        Ver pedidos de
      </label>
      <select
        id="demo-client"
        value={client}
        onChange={(event) => setClient(event.target.value)}
      >
        <option value="ana">Ana · cliente de ejemplo</option>
        <option value="luis">Luis · cliente de ejemplo</option>
      </select>
      <div className="demo-table-wrap">
        <table>
          <caption className="sr-only">
            Pedidos del cliente seleccionado
          </caption>
          <thead>
            <tr>
              <th scope="col">Pedido</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody key={client}>
            {matches.map((order) => (
              <motion.tr
                key={order.id}
                initial={enabled ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: enabled ? 0.3 : 0 }}
              >
                <td>
                  {order.id}
                  <small>{order.item}</small>
                </td>
                <td>
                  <span
                    className={`order-status${order.status === "Entregado" ? " done" : ""}`}
                  >
                    {order.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="data-result" aria-live="polite">
        <Icon name="check" size={14} />
        {matches.length}{" "}
        {matches.length === 1 ? "pedido relacionado" : "pedidos relacionados"}
      </p>
      <p className="demo-caption">RELACIÓN SIMPLIFICADA · DATOS FICTICIOS</p>
    </div>
  );
}
export default function Examples() {
  const { enabled } = useExperience();
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const select = (next, focus = false) => {
    setActive(next);
    if (focus) refs.current[next]?.focus();
  };
  const keydown = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % 3;
    if (event.key === "ArrowLeft") next = (index + 2) % 3;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 2;
    if (next !== undefined) {
      event.preventDefault();
      select(next, true);
    }
  };
  return (
    <section
      className="section explore-section"
      id="explora"
      aria-labelledby="explore-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow="02 / EXPLORA LAS POSIBILIDADES"
          id="explore-title"
          description="Tres conceptos interactivos para imaginar tu proyecto. Son demostraciones con datos ficticios, no trabajos de clientes."
        >
          No solo lo imagines.
          <br />
          <span className="heading-accent">Explóralo.</span>
        </SectionHeading>
        <div className="explorer">
          <div
            className="example-tabs"
            role="tablist"
            aria-label="Ejemplos de soluciones"
          >
            {examples.map((example, index) => (
              <button
                ref={(el) => {
                  refs.current[index] = el;
                }}
                id={`tab-${example.id}`}
                key={example.id}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls={`panel-${example.id}`}
                tabIndex={active === index ? 0 : -1}
                onKeyDown={(event) => keydown(event, index)}
                onClick={() => select(index)}
              >
                {active === index && (
                  <motion.span
                    className="tab-highlight"
                    layoutId="example-tab"
                    transition={{ duration: enabled ? 0.35 : 0 }}
                  />
                )}
                <span className="tab-number">0{index + 1}</span>
                <span>{example.tab}</span>
                <Icon name="arrow" size={17} />
              </button>
            ))}
          </div>
          {examples.map((example, index) => (
            <div
              key={example.id}
              role="tabpanel"
              id={`panel-${example.id}`}
              aria-labelledby={`tab-${example.id}`}
              tabIndex={0}
              hidden={active !== index}
            >
              {active === index && (
                <div className="example-panel">
                  <motion.div
                    className="example-copy"
                    initial={enabled ? { opacity: 0, y: 14 } : false}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="example-tag">
                      CONCEPTO / {example.label}
                    </span>
                    <h3>
                      {example.title[0]}
                      <br />
                      {example.title[1]}
                    </h3>
                    <p>{example.description}</p>
                    <div className="example-features">
                      {example.features.map((feature) => (
                        <span key={feature}>{feature}</span>
                      ))}
                    </div>
                    <ServiceLink type={example.id}>
                      Hablemos de tu proyecto
                    </ServiceLink>
                    <div className="example-hint">
                      <span className="status-dot" />
                      Interactúa con la vista de ejemplo.
                    </div>
                  </motion.div>
                  <motion.div
                    className="demo-stage"
                    initial={
                      enabled ? { opacity: 0, scale: 0.98, y: 10 } : false
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: enabled ? 0.45 : 0 }}
                  >
                    {example.id === "web" ? (
                      <WebDemo />
                    ) : example.id === "android" ? (
                      <AndroidDemo />
                    ) : (
                      <DataDemo />
                    )}
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
