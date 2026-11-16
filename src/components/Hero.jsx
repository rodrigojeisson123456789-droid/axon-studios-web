import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useExperience } from "../experience.jsx";
import { Icon } from "./ui.jsx";
// Deterministic geometry keeps the server and client markup identical.
const points = Array.from({ length: 62 }, (_, i) => ({
  x: 25 + ((i * 263) % 1350),
  y: 35 + ((i * i * 137) % 730),
}));
const links = points.flatMap((point, i) =>
  points
    .slice(i + 1)
    .filter((other) => Math.hypot(point.x - other.x, point.y - other.y) < 145)
    .map((other, j) => (
      <path
        key={`${i}-${j}`}
        d={`M${point.x} ${point.y}L${other.x} ${other.y}`}
      />
    )),
);
export default function Hero() {
  const { enabled, hydrated, reduced, toggle } = useExperience();
  const [clock, setClock] = useState(null);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 70, damping: 22 }),
    springY = useSpring(y, { stiffness: 70, damping: 22 });
  useEffect(() => {
    setClock(new Date());
  }, []);
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const move = (event) => {
    if (!enabled || !matchMedia("(hover:hover) and (pointer:fine)").matches)
      return;
    const r = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - r.left) / r.width - 0.5) * 12);
    y.set(((event.clientY - r.top) / r.height - 0.5) * 10);
  };
  return (
    <section
      className="hero"
      id="inicio"
      aria-labelledby="hero-title"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <div className="hero-mesh" aria-hidden="true" />
      <motion.svg
        className="neural-field"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
        style={{ x: enabled ? springX : 0, y: enabled ? springY : 0 }}
      >
        <g className="neural-links">{links}</g>
        <g className="neural-nodes">
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={1 + (i % 3) * 0.4} />
          ))}
        </g>
      </motion.svg>
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" />
            AXON STUDIOS · DISEÑO + DESARROLLO
          </p>
          <h1 id="hero-title">
            Creamos lo
            <br />
            que sigue<span className="title-dot">.</span>
          </h1>
          <p className="hero-line">
            Convertimos ideas en{" "}
            <span className="rotating-words" aria-hidden="true">
              <span>páginas web</span>
              <span>apps Android</span>
              <span>bases de datos</span>
            </span>
            <span className="sr-only">
              páginas web, apps Android y bases de datos.
            </span>
          </p>
          <p className="hero-description">
            Tecnología y diseño para empresas, emprendimientos y organizaciones.
            Construyamos el siguiente paso de tu negocio.
          </p>
          <div className="hero-actions">
            <a className="button" href="#contacto">
              Hablemos de tu proyecto
              <Icon name="arrow" />
            </a>
            <a className="text-link" href="#servicios">
              Explorar servicios
              <Icon name="down" size={18} />
            </a>
          </div>
          <button
            className="motion-toggle"
            hidden={!hydrated || reduced}
            type="button"
            onClick={toggle}
          >
            <Icon name={enabled ? "pause" : "play"} size={12} />
            {enabled ? "Pausar animaciones" : "Activar animaciones"}
          </button>
        </div>
        <div
          className="hero-art"
          role="img"
          aria-label="Símbolo de Axon Studios con una órbita de luz azul"
        >
          <div className="signal-orbit orbit-outer" />
          <div className="signal-orbit orbit-inner" />
          <div className="logo-glow" />
          <motion.div
            className="signal-depth"
            style={{
              rotateY: enabled ? springX : 0,
              rotateX: enabled ? springY : 0,
              transformPerspective: 900,
            }}
          >
            <img
              className="hero-mark"
              src="./img/5 (1).png"
              width="320"
              height="320"
              alt=""
            />
          </motion.div>
          <span className="signal-label label-web">
            <Icon name="web" size={15} /> WEB
          </span>
          <span className="signal-label label-android">
            <Icon name="phone" size={15} /> ANDROID
          </span>
          <span className="signal-label label-data">
            <Icon name="database" size={15} /> DATOS
          </span>
          <span className="hero-coordinate" aria-hidden="true">
            AX / LA PRÓXIMA VERSIÓN
          </span>
        </div>
        <div className="hero-bottom">
          <p className="hero-hud">
            <span>Lima, Perú</span>
            {clock && (
              <time dateTime={clock.toISOString()} aria-label="Hora en Lima">
                {new Intl.DateTimeFormat("es-PE", {
                  timeZone: "America/Lima",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(clock)}
              </time>
            )}
            <span className="hero-location">Diseñamos lo que viene.</span>
          </p>
          <a
            className="scroll-cue"
            href="#servicios"
            aria-label="Ver servicios"
          >
            <span>DESLIZA PARA EXPLORAR</span>
            <Icon name="down" size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
