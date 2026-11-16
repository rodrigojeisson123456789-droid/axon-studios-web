import { useEffect, useRef, useState } from "react";
import { Logo, Icon } from "./ui.jsx";
import { useExperience } from "../experience.jsx";
export default function Header() {
  const [open, setOpen] = useState(false);
  const { hydrated } = useExperience();
  const toggle = useRef(null);
  useEffect(() => {
    const escape = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const query = matchMedia("(max-width:760px)");
    const resize = () => setOpen(false);
    document.addEventListener("keydown", escape);
    query.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", escape);
      query.removeEventListener("change", resize);
    };
  }, [open]);
  return (
    <header className="site-header">
      <nav className="container navigation" aria-label="Principal">
        <Logo />
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          hidden={!hydrated}
          aria-controls="nav-links"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Menú <Icon name={open ? "close" : "menu"} />
        </button>
        <ul className={`nav-links${open ? " is-open" : ""}`} id="nav-links">
          {[
            ["servicios", "Servicios"],
            ["explora", "Posibilidades"],
            ["proceso", "Proceso"],
            ["configurador", "Configurador"],
            ["contacto", "Hablemos"],
          ].map(([id, label]) => (
            <li key={id}>
              <a
                className={id === "contacto" ? "nav-contact" : ""}
                href={"#" + id}
                onClick={() => setOpen(false)}
              >
                {label}
                {id === "contacto" && <Icon name="arrow" size={18} />}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
