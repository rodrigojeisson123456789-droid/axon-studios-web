import { useEffect, useRef, useState } from "react";
import { useExperience } from "../experience.jsx";
import { Icon } from "./ui.jsx";
const endpoint = "https://formsubmit.co/5473c1bcf66cecbf981bb3fac3f8a6ae";
export default function Contact() {
  const { service, selection, chooseService, clearSelection, resetContact } =
    useExperience();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ text: "", state: "" });
  const formRef = useRef(null),
    attachmentRef = useRef(null),
    sending = useRef(false),
    controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  const validateAttachment = () => {
    const field = attachmentRef.current;
    const file = field.files[0];
    let error = "";
    if (file && !/\.(docx?|pdf|pptx?|jpe?g|png|webp)$/i.test(file.name))
      error = "Elige un archivo PDF, Word, PowerPoint, JPG, PNG o WebP.";
    if (file && file.size > 10 * 1024 * 1024)
      error = "El archivo supera los 10 MB. Elige uno más pequeño.";
    field.setCustomValidity(error);
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return error;
  };
  const attachmentChanged = () => {
    const error = validateAttachment();
    setStatus({ text: error, state: error ? "error" : "" });
    if (error) attachmentRef.current.reportValidity();
  };
  const submit = async (event) => {
    event.preventDefault();
    if (sending.current) return;
    const form = formRef.current;
    const error = validateAttachment();
    if (error || !form.reportValidity()) {
      if (error) attachmentRef.current.reportValidity();
      return;
    }
    const message = form.elements.namedItem("message");
    if (!message.value.trim()) {
      setStatus({
        text: "Cuéntanos brevemente qué necesitas para poder ayudarte.",
        state: "error",
      });
      message.focus();
      return;
    }
    const data = new FormData(form);
    const file = attachmentRef.current.files[0];
    if (file) data.set("attachment", file, file.name);
    data.set("message", message.value.trim());
    sending.current = true;
    setBusy(true);
    setStatus({ text: "Enviando tu consulta…", state: "pending" });
    const current = new AbortController();
    controller.current = current;
    const timeout = setTimeout(() => current.abort(), 25000);
    try {
      const response = await fetch(
        endpoint.replace("formsubmit.co/", "formsubmit.co/ajax/"),
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
          signal: current.signal,
        },
      );
      if (!response.ok) throw new Error("Delivery failed");
      const result = await response.json();
      if (result.success !== true && result.success !== "true")
        throw new Error("Delivery not confirmed");
      form.reset();
      resetContact();
      attachmentRef.current.setCustomValidity("");
      attachmentRef.current.removeAttribute("aria-invalid");
      setStatus({
        text: "Tu consulta fue enviada. Gracias por contarnos tu idea; te responderemos al correo que indicaste.",
        state: "success",
      });
    } catch (error) {
      setStatus({
        text:
          error.name === "AbortError"
            ? "No pudimos confirmar el envío a tiempo. Conservamos tu mensaje. Espera unos minutos y, si no recibes confirmación, vuelve a intentarlo."
            : "No pudimos confirmar el envío. Conservamos tu mensaje para que puedas volver a intentarlo. Revisa tu conexión y prueba de nuevo en unos minutos.",
        state: "error",
      });
    } finally {
      clearTimeout(timeout);
      controller.current = null;
      sending.current = false;
      setBusy(false);
    }
  };
  return (
    <section
      className="section contact-section"
      id="contacto"
      aria-labelledby="contact-title"
    >
      <div className="container contact-grid">
        <div className="contact-copy" data-reveal>
          <p className="eyebrow">
            <span className="status-dot" />
            CONSTRUYAMOS LO QUE SIGUE
          </p>
          <h2 id="contact-title">
            Tu próxima
            <br />
            versión empieza
            <br />
            <span>con una idea.</span>
          </h2>
          <p>
            No hace falta un documento técnico.
            <br />
            Cuéntanos qué quieres hacer y qué te gustaría mejorar.
          </p>
          <div className="contact-location">
            <span>
              <Icon name="arrow" size={25} />
            </span>
            <p>
              Desde Lima, Perú.
              <br />
              Conversemos sobre tu proyecto.
            </p>
          </div>
          <div className="contact-graphic" aria-hidden="true">
            <i />
            <i />
            <i />
            <Icon name="arrow" size={130} />
          </div>
        </div>
        <form
          ref={formRef}
          id="contact-form"
          className="contact-form"
          action={endpoint}
          method="POST"
          encType="multipart/form-data"
          onSubmit={submit}
          aria-busy={busy}
          data-reveal
        >
          <p className="form-eyebrow">
            INICIEMOS UNA CONVERSACIÓN <Icon name="arrow" size={16} />
          </p>
          <fieldset disabled={busy}>
            <legend className="sr-only">Datos de tu consulta</legend>
            <input
              type="hidden"
              name="_subject"
              value="Nueva consulta desde Axon Studios"
            />
            <input
              type="hidden"
              name="configuracion"
              value={selection?.summary || ""}
            />
            {selection && (
              <div className="config-review">
                <p>Tu configuración</p>
                <span>{selection.summary}</span>
                <button type="button" onClick={clearSelection}>
                  Quitar configuración
                </button>
              </div>
            )}
            <label htmlFor="service">¿Qué necesitas?</label>
            <select
              id="service"
              name="servicio"
              value={service}
              onChange={(event) => chooseService(event.target.value)}
            >
              <option value="">Quiero orientación</option>
              <option value="web">Una página web</option>
              <option value="android">Una app Android</option>
              <option value="datos">Una base de datos</option>
              <option value="combinado">Combinar varios servicios</option>
            </select>
            <label htmlFor="email">
              Tu correo electrónico <span>(obligatorio)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              required
              maxLength={254}
            />
            <label htmlFor="message">
              Cuéntanos tu idea <span>(obligatorio)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="¿A qué se dedica tu negocio y qué necesitas resolver?"
              required
              maxLength={5000}
            />
            <label htmlFor="attachment">
              ¿Tienes una referencia? <span>(opcional)</span>
            </label>
            <div className="file-input-wrap">
              <Icon name="upload" size={18} />
              <input
                ref={attachmentRef}
                id="attachment"
                name="attachment"
                type="file"
                accept=".doc,.docx,.pdf,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                aria-describedby="file-help"
                onChange={attachmentChanged}
              />
            </div>
            <small id="file-help">
              PDF, Word, PowerPoint, JPG, PNG o WebP. Máximo 10 MB.
            </small>
            <p className="privacy-note">
              Usaremos tu correo y mensaje para responder esta consulta. El
              envío se procesa mediante{" "}
              <a
                href="https://formsubmit.co/privacy.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                FormSubmit (privacidad, abre otra pestaña)
              </a>
              . No adjuntes contraseñas ni información sensible.
            </p>
          </fieldset>
          <p
            className="form-status"
            role="status"
            aria-live="polite"
            data-state={status.state}
          >
            {status.text}
          </p>
          <button type="submit" className="button" disabled={busy}>
            {busy ? "Enviando…" : "Enviar mi consulta"}
            <Icon name="arrow" />
          </button>
          <small className="form-footnote">
            Revisaremos tu idea para definir juntos el siguiente paso.
          </small>
        </form>
      </div>
    </section>
  );
}
