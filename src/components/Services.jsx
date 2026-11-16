import { services } from "../data.js";
import { Icon, SectionHeading, ServiceLink, TiltCard } from "./ui.jsx";
function ServiceVisual({ type }) {
  if (type === "web")
    return (
      <div className="service-visual visual-web" aria-hidden="true">
        <div className="mini-browser">
          <div className="mini-toolbar">
            <i />
            <i />
            <i />
            <span>tu-negocio.web</span>
          </div>
          <div className="mini-site">
            <div className="mini-type">
              <b>Ideas que</b>
              <b>
                toman forma<span>.</span>
              </b>
              <i />
              <i />
            </div>
            <div className="mini-arch">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="mini-site-footer">
            <span>DISEÑADO PARA TI</span>
            <Icon name="arrow" size={11} />
          </div>
        </div>
        <span className="visual-chip chip-web">
          <Icon name="check" size={12} /> Tu espacio digital
        </span>
      </div>
    );
  if (type === "android")
    return (
      <div className="service-visual visual-android" aria-hidden="true">
        <div className="mini-device">
          <div className="mini-notch" />
          <span>Tu negocio, a mano</span>
          <b>
            Todo en orden<span>✦</span>
          </b>
          <div className="mini-app-chart">
            {[40, 60, 45, 80, 65, 95].map((n, i) => (
              <i key={i} style={{ height: n + "%" }} />
            ))}
          </div>
          <div className="mini-app-row">
            <Icon name="box" size={13} />
            <span>Pedidos</span>
            <i />
          </div>
          <div className="mini-app-row">
            <Icon name="database" size={13} />
            <span>Inventario</span>
            <i />
          </div>
        </div>
        <span className="visual-chip chip-android">
          <Icon name="check" size={12} /> Más simple. Más cerca.
        </span>
      </div>
    );
  return (
    <div className="service-visual visual-data" aria-hidden="true">
      <div className="data-stack">
        <i />
        <i />
        <i />
      </div>
      <div className="data-connectors">
        <i />
        <i />
        <i />
      </div>
      <div className="data-nodes">
        <span>CLIENTES</span>
        <span>PEDIDOS</span>
        <span>PRODUCTOS</span>
      </div>
      <span className="visual-chip chip-data">
        <span className="status-dot" /> Cada pieza, conectada.
      </span>
    </div>
  );
}
export default function Services() {
  return (
    <>
      <div className="service-strip">
        <div className="container strip-inner">
          <span>TECNOLOGÍA CON DIRECCIÓN</span>
          <p>
            Una presencia propia.
            <Icon name="arrow" size={16} /> Una operación más simple.
            <Icon name="arrow" size={16} /> Información conectada.
          </p>
        </div>
      </div>
      <section
        className="section container"
        id="servicios"
        aria-labelledby="services-title"
      >
        <SectionHeading
          eyebrow="01 / LO QUE HACEMOS"
          id="services-title"
          description="No todo negocio necesita lo mismo. Empezamos por lo que quieres resolver."
        >
          Tres caminos.
          <br />
          Tu siguiente paso.
        </SectionHeading>
        <div className="services-grid">
          {services.map((service, index) => (
            <TiltCard
              key={service.id}
              className={`service-card service-${service.id}`}
            >
              <div className="card-top">
                <span className="service-icon">
                  <Icon name={service.icon} />
                </span>
                <span className="card-index">{service.number} / 03</span>
              </div>
              <ServiceVisual type={service.id} />
              <div className="card-copy">
                <h3>{service.title}</h3>
                <p className="service-tagline">{service.tagline}</p>
                <p className="service-description">{service.description}</p>
                <ul>
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <Icon name="check" size={13} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <ServiceLink type={service.id} className="service-link">
                {service.cta}
              </ServiceLink>
            </TiltCard>
          ))}
        </div>
      </section>
    </>
  );
}
