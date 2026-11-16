import { Logo, Icon } from "./ui.jsx";
export function Process() {
  return (
    <section
      className="section container"
      id="proceso"
      aria-labelledby="process-title"
    >
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">03 / UN PROCESO CLARO</p>
          <h2 id="process-title">
            De “tengo una idea”
            <br />a “ya está en marcha”.
          </h2>
        </div>
        <p>
          Primero entendemos el problema.
          <br />
          Después elegimos cómo construir la solución.
        </p>
      </div>
      <ol className="process-grid">
        <li data-reveal>
          <span>01 / CONVERSAMOS</span>
          <h3>Entender tu negocio</h3>
          <p>
            Qué necesitas resolver, quién lo va a usar y qué sería un buen
            resultado para ti.
          </p>
        </li>
        <li data-reveal>
          <span>02 / DEFINIMOS</span>
          <h3>Acordar lo esencial</h3>
          <p>
            Definimos pantallas, funciones, alcance y propuesta antes de
            comenzar el desarrollo.
          </p>
        </li>
        <li data-reveal>
          <span>03 / CONSTRUIMOS</span>
          <h3>Ver cómo avanza</h3>
          <p>
            Diseñamos y desarrollamos con revisiones para que puedas probar y
            dar tu opinión.
          </p>
        </li>
        <li data-reveal>
          <span>04 / ENTREGAMOS</span>
          <h3>Ponerlo en marcha</h3>
          <p>
            Revisamos el funcionamiento y coordinamos la publicación o entrega
            según el proyecto.
          </p>
        </li>
      </ol>
      <div className="principle">
        <span aria-hidden="true">↗</span>
        <p>
          La mejor tecnología es la que
          <br />
          <strong>resuelve algo para tu negocio.</strong>
        </p>
        <span className="principle-sign">
          AXON STUDIOS
          <br />
          DISEÑO + DESARROLLO
        </span>
      </div>
    </section>
  );
}
export function FAQ() {
  return (
    <section
      className="faq-section section container"
      id="preguntas"
      aria-labelledby="faq-title"
    >
      <div>
        <p className="eyebrow">ANTES DE EMPEZAR</p>
        <h2 id="faq-title">
          Buenas preguntas.
          <br />
          Respuestas claras.
        </h2>
      </div>
      <div className="faq-list">
        <details>
          <summary>
            No sé si necesito una web o una app. ¿Me ayudan?
            <span aria-hidden="true">＋</span>
          </summary>
          <p>
            Sí. Cuéntanos qué necesitas resolver y cómo trabajas hoy. Podemos
            definir contigo si conviene empezar con una página web, una app
            Android o con la organización de tus datos.
          </p>
        </details>
        <details>
          <summary>
            ¿Cuánto cuesta y cuánto demora?<span aria-hidden="true">＋</span>
          </summary>
          <p>
            Depende de las funciones, el contenido disponible y las
            integraciones. Después de entender tu proyecto, acordamos alcance,
            presupuesto y plazo en una propuesta. No necesitas tener todo
            definido para escribirnos.
          </p>
        </details>
        <details>
          <summary>
            ¿Mi página se podrá ver desde un celular?
            <span aria-hidden="true">＋</span>
          </summary>
          <p>
            Sí. Diseñamos las páginas para adaptarse a diferentes tamaños de
            pantalla y revisamos su uso en celular y escritorio.
          </p>
        </details>
        <details>
          <summary>
            ¿Las aplicaciones son para Android o también iPhone?
            <span aria-hidden="true">＋</span>
          </summary>
          <p>
            Por ahora nos enfocamos en aplicaciones Android. Si también
            necesitas llegar a usuarios de iPhone, conversemos sobre el alcance
            y las alternativas antes de definir el proyecto.
          </p>
        </details>
        <details>
          <summary>
            ¿Pueden trabajar con una base de datos que ya tengo?
            <span aria-hidden="true">＋</span>
          </summary>
          <p>
            Podemos revisar su estructura y lo que necesitas cambiar o conectar.
            La viabilidad y el trabajo necesario se definen después de esa
            revisión. Para la primera consulta no envíes contraseñas ni datos
            privados.
          </p>
        </details>
        <details>
          <summary>
            ¿Qué pasa con el hosting, el código y el soporte?
            <span aria-hidden="true">＋</span>
          </summary>
          <p>
            La propuesta debe detallar qué archivos y accesos se entregan, quién
            administra el hosting o la publicación, sus costos y si se incluye
            mantenimiento. Lo acordamos antes de empezar para que tengas claro
            qué estás contratando.
          </p>
        </details>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="site-footer container">
      <div className="footer-top">
        <a
          className="logo"
          href="#inicio"
          aria-label="Axon Studios, volver al inicio"
        >
          <img src="img/4 (1).png" alt="" width="30" height="30" />
          <span>
            axon<span className="logo-light"> studios</span>
            <span className="logo-dot">.</span>
          </span>
        </a>
        <p>Páginas web. Apps Android. Bases de datos.</p>
        <a className="text-link" href="#inicio">
          Volver arriba <span aria-hidden="true">↑</span>
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Axon Studios</span>
        <span>DISEÑAMOS EL SIGUIENTE PASO.</span>
        <span>Lima, Perú</span>
      </div>
    </footer>
  );
}
