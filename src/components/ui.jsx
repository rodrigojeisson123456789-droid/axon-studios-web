import { motion, useMotionValue, useSpring } from "motion/react";
import { useExperience } from "../experience.jsx";
const paths = {
  arrow: (
    <>
      <path d="M7 17 17 7M7 7h10v10" />
    </>
  ),
  right: <path d="M4 12h16m-6-6 6 6-6 6" />,
  down: <path d="M12 4v16m-6-6 6 6 6-6" />,
  web: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18m-13 5h4m-4 3h8" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5h4m-3 14h2" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  pause: <path d="M9 5v14m6-14v14" />,
  play: <path d="m8 4 12 8-12 8Z" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 8h16M4 16h16" />,
  box: (
    <>
      <path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5m-9 5v9" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" />
    </>
  ),
};
export function Icon({ name = "arrow", size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
export function Logo({ footer = false }) {
  return (
    <a
      className="logo"
      href="#inicio"
      aria-label={
        footer ? "Axon Studios, volver al inicio" : "Axon Studios, inicio"
      }
    >
      <img src="./img/4 (1).png" width="34" height="34" alt="" />
      <span>
        axon<span className="logo-light"> studios</span>
        <span className="logo-dot">.</span>
      </span>
    </a>
  );
}
export function SectionHeading({ eyebrow, id, children, description }) {
  return (
    <div className="section-heading" data-reveal>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{children}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
export function ServiceLink({ type, children, className = "text-link" }) {
  const { chooseService } = useExperience();
  return (
    <a
      className={className}
      href="#contacto"
      onClick={() => chooseService(type)}
    >
      {children}
      <Icon name="arrow" />
    </a>
  );
}
export function TiltCard({ children, className = "" }) {
  const { enabled } = useExperience();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 25 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 25 });
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const move = (event) => {
    if (
      !enabled ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - rect.top) / rect.height - 0.5) * 5);
    y.set(((event.clientX - rect.left) / rect.width - 0.5) * 5);
  };
  return (
    <motion.article
      className={className}
      data-reveal
      onPointerMove={move}
      onPointerLeave={reset}
      style={{
        rotateX: enabled ? rotateX : 0,
        rotateY: enabled ? rotateY : 0,
        transformPerspective: 1000,
      }}
    >
      {children}
    </motion.article>
  );
}
