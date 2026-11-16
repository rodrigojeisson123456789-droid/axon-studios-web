import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  estimateProject,
  extras,
  initialProject,
  modules,
  scopes,
  services,
} from "../data.js";
import { useExperience } from "../experience.jsx";
import { Icon, SectionHeading } from "./ui.jsx";
export default function Configurator() {
  const { enabled, hydrated, useSelection } = useExperience();
  const [project, setProject] = useState(initialProject);
  const estimate = estimateProject(project);
  const chooseType = (type) =>
    setProject((current) => ({
      ...current,
      type,
      extras:
        type === "datos"
          ? current.extras.filter((id) => id !== "db")
          : current.extras,
    }));
  const toggleExtra = (id) =>
    setProject((current) => ({
      ...current,
      extras: current.extras.includes(id)
        ? current.extras.filter((key) => key !== id)
        : [...current.extras, id],
    }));
  const pill = (id, label, checked, group, onChange, disabled = false) => (
    <label key={id} className={`config-pill${checked ? " is-selected" : ""}`}>
      <input
        type={group === "extra" ? "checkbox" : "radio"}
        name={group}
        value={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {checked && (
        <motion.span
          className="pill-highlight"
          layoutId={group === "extra" ? undefined : `pill-${group}`}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 35,
            duration: enabled ? undefined : 0,
          }}
        />
      )}
      <span>{label}</span>
      {group === "extra" && checked && <Icon name="check" size={12} />}
    </label>
  );
  return (
    <section
      className="section container project-config"
      id="configurador"
      aria-labelledby="config-title"
    >
      <SectionHeading
        eyebrow="04 / DALE FORMA A TU IDEA"
        id="config-title"
        description="Elige lo que necesitas. El plano se actualiza contigo y muestra una referencia inicial de tiempo, sin compromiso."
      >
        Arma tu proyecto.
        <br />
        <span className="heading-accent">Mira cómo toma forma.</span>
      </SectionHeading>
      <div className="config-layout">
        <form
          className="config-options"
          id="cfg"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset>
            <legend>
              <span>01</span>¿Qué quieres crear?
            </legend>
            <div className="config-choices">
              {services.map((item) =>
                pill(
                  item.id,
                  item.id === "web"
                    ? "Página o app web"
                    : item.id === "android"
                      ? "App Android"
                      : "Base de datos",
                  project.type === item.id,
                  "tipo",
                  () => chooseType(item.id),
                ),
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>02</span>¿En qué punto estás?
            </legend>
            <div className="config-choices">
              {scopes.map((scope) =>
                pill(
                  scope.id,
                  scope.label,
                  project.scope === scope.id,
                  "alcance",
                  () => setProject({ ...project, scope: scope.id }),
                ),
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>03</span>¿Qué más necesitas?
            </legend>
            <div className="config-choices">
              {extras.map((extra) =>
                pill(
                  extra.id,
                  extra.label,
                  project.extras.includes(extra.id),
                  "extra",
                  () => toggleExtra(extra.id),
                  project.type === "datos" && extra.id === "db",
                ),
              )}
            </div>
          </fieldset>
          <p className="config-help">
            <Icon name="plus" size={15} />
            Empieza por lo esencial. Podemos definir el resto juntos.
          </p>
        </form>
        <div className="config-blueprint">
          <div className="blueprint-head">
            <span>
              <span className="status-dot" />
              TU PROYECTO / VISTA PREVIA
            </span>
            <span>AX—04</span>
          </div>
          <svg
            id="cfg-diagram"
            viewBox="0 0 340 235"
            role="img"
            aria-label={`Módulos seleccionados: ${modules
              .filter((item) => estimate.active.includes(item.id))
              .map((item) => item.label)
              .join(", ")}`}
          >
            {modules.map((item) => {
              const active = estimate.active.includes(item.id);
              return (
                <g
                  key={item.id}
                  className={`cfg-node${active ? " on" : ""}`}
                  data-module={item.id}
                >
                  <motion.path
                    initial={false}
                    d={`M170 115L${item.x} ${item.y}`}
                    animate={{ opacity: active ? 0.9 : 0.3 }}
                    transition={{ duration: enabled ? 0.35 : 0 }}
                  />
                  <motion.circle
                    initial={false}
                    cx={item.x}
                    cy={item.y}
                    r="10"
                    animate={{
                      fill: active ? "#0b6cff" : "#0d1421",
                      stroke: active ? "#78b0ff" : "#3b4d70",
                    }}
                    transition={{ duration: enabled ? 0.35 : 0 }}
                  />
                  <text x={item.x} y={item.textY}>
                    {item.label}
                  </text>
                </g>
              );
            })}
            <circle className="cfg-core-halo" cx="170" cy="115" r="29" />
            <circle className="cfg-core" cx="170" cy="115" r="18" />
            <path className="cfg-center-mark" d="m163 118 7-12 7 12m-10-2h6" />
          </svg>
          <div className="config-estimate">
            <span>Plazo orientativo</span>
            <output id="cfg-est" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={estimate.range}
                  initial={enabled ? { opacity: 0, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: enabled ? 0.12 : 0 }}
                >
                  {estimate.range}
                </motion.span>
              </AnimatePresence>
            </output>
          </div>
          <p className="config-summary" aria-live="polite">
            {estimate.description}.
          </p>
          <p className="config-disclaimer">
            Referencia automática para complejidad baja o media. No es una
            cotización ni un plazo acordado: se confirma al revisar funciones,
            contenido e integraciones. El soporte posterior no se incluye en
            estas semanas.
          </p>
          <button
            type="button"
            className="button"
            disabled={!hydrated}
            onClick={() => useSelection(estimate)}
          >
            Enviar esta configuración
            <Icon name="arrow" />
          </button>
        </div>
      </div>
      <noscript>
        <p className="noscript-note">
          Activa JavaScript para actualizar el configurador, o cuéntanos tu idea
          en el <a href="#contacto">formulario de contacto</a>.
        </p>
      </noscript>
    </section>
  );
}
