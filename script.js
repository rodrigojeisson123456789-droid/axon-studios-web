(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const header = $('#header'), toggle = $('#menu-toggle'), nav = $('#nav-links'), bar = $('#progress');
  const contactFloat = $('.contact-float'), contactSection = $('#contacto');
  if ('IntersectionObserver' in window) {
    let heroVisible = true, contactVisible = false;
    const updateContactFloat = () => contactFloat.classList.toggle('is-hidden', heroVisible || contactVisible);
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      updateContactFloat();
    }, { threshold: 0.05 });
    const contactObserver = new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      updateContactFloat();
    }, { threshold: 0.05 });
    heroObserver.observe($('#inicio'));
    contactObserver.observe(contactSection);
  }

  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    const pr = max > 0 ? scrollY / max : 0;
    bar.style.transform = `scaleX(${pr})`;
    document.documentElement.style.setProperty('--p', pr);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const reveals = document.querySelectorAll('.reveal');
  const steps = document.querySelectorAll('#steps li');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('active'); io.unobserve(en.target); }
    }), { threshold: 0.2 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 90}ms`; io.observe(el); });

    const so = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('on'); so.unobserve(en.target); }
    }), { threshold: 0.6 });
    steps.forEach((el, i) => { el.style.setProperty('--d', `${i * 150}ms`); el.style.transitionDelay = ''; so.observe(el); });

    const links = [...nav.querySelectorAll('a:not(.nav-cta)')];
    const spy = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('current', a.getAttribute('href') === `#${en.target.id}`));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
  } else {
    reveals.forEach((el) => el.classList.add('active'));
    steps.forEach((el) => el.classList.add('on'));
  }

  // Palabra rotatoria (efecto de escritura)
  const rotor = $('#rotor');
  if (rotor && !reduce) {
    const words = rotor.dataset.words.split(',');
    let w = 0, c = words[0].length, del = true;
    const tick = () => {
      const word = words[w];
      c += del ? -1 : 1;
      rotor.textContent = word.slice(0, c);
      let wait = del ? 45 : 85;
      if (!del && c === word.length) { del = true; wait = 1800; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 250; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 1800);
  }

  // Hero: red neuronal interactiva
  const hero = $('#inicio'), cv = $('#neural'), ctx = cv.getContext('2d');
  const mouse = { x: -999, y: -999 };
  let W, H, dpr, nodes = [], visible = true;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(64, Math.round(W * H / 19000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.2 + .7
    }));
  };
  const LINK = 112, PULL = 170;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!reduce) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < PULL) { a.x += (mouse.x - a.x) * .012; a.y += (mouse.y - a.y) * .012; }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(92,155,255,${(1 - d / LINK) * .26})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (dm < PULL) {
        ctx.strokeStyle = `rgba(11,108,255,${(1 - dm / PULL) * .7})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = dm < PULL ? '#5C9BFF' : 'rgba(147,160,184,.7)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
    }
    if (visible && !reduce) requestAnimationFrame(draw);
  };
  size(); draw();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduce) draw(); }, 150); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) draw(); }).observe(hero);
  }

  const signal = $('.hero-signal');
  if (fine) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      hero.style.setProperty('--mx', `${mouse.x}px`);
      hero.style.setProperty('--my', `${mouse.y}px`);
      if (!reduce) {
        signal.style.setProperty('--rx', `${((e.clientX / innerWidth) - .5) * 14}deg`);
        signal.style.setProperty('--ry', `${-((e.clientY / innerHeight) - .5) * 14}deg`);
      }
    });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  }

  // Spotlight en tarjetas
  document.querySelectorAll('.spot').forEach((el) => el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  }));

  // Botones magnéticos
  if (fine && !reduce) {
    document.querySelectorAll('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }


  // Contadores
  const counters = document.querySelectorAll('[data-count]');
  const countUp = (el) => {
    const end = +el.dataset.count; if (reduce) return;
    const t0 = performance.now(), dur = 1200;
    const f = (t) => { const k = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } }), { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  // Terminal: despliegue simulado
  const out = $('#term-out');
  if (out) {
    const lines = [
      ['<span class="p">$</span> axon init mi-proyecto', 500],
      ['<span class="dim">› Analizando objetivos y usuarios…</span>', 700],
      ['<span class="ok">✔</span> Prototipo validado', 600],
      ['<span class="p">$</span> axon build --prod', 600],
      ['<span class="dim">› Compilando · pruebas 48/48 · seguridad OK</span>', 800],
      ['<span class="ok">✔</span> Build optimizado', 600],
      ['<span class="p">$</span> axon deploy', 600],
      ['<span class="ok">✔</span> En línea · listo para tus usuarios', 0]
    ];
    const render = (n) => { out.innerHTML = lines.slice(0, n).map((l) => l[0]).join('\n'); };
    if (reduce || !('IntersectionObserver' in window)) render(lines.length);
    else {
      const to = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; to.disconnect();
        let i = 0; const next = () => { render(++i); if (i < lines.length) setTimeout(next, lines[i - 1][1]); };
        next();
      }, { threshold: 0.4 });
      to.observe($('#terminal'));
    }
  }

  // Titular que se "decodifica"
  const h1 = $('#h1');
  if (h1 && !reduce) {
    const final = h1.textContent, chars = '01<>/{}[]#$%&*+=';
    let f = 0;
    const run = () => {
      h1.textContent = [...final].map((ch, i) => ch === ' ' || i < f / 1.6 ? ch : chars[Math.random() * chars.length | 0]).join('');
      if (f++ < final.length * 1.6) requestAnimationFrame(() => setTimeout(run, 30)); else h1.textContent = final;
    };
    run();
  }

  // Reloj de Lima
  const clock = $('#clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });
    const t = () => { clock.textContent = fmt.format(new Date()); }; t(); setInterval(t, 30000);
  }

  // Cursor con estela
  const cur = $('#cursor');
  if (cur && fine && !reduce) {
    document.documentElement.classList.add('has-cursor');
    let cx = 0, cy = 0, tx = 0, ty = 0;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; });
    document.addEventListener('pointerover', (e) => cur.classList.toggle('big', !!e.target.closest('a, button, label, summary, input, textarea')));
    document.addEventListener('pointerleave', () => { cur.style.opacity = 0; });
    const loop = () => { cx += (tx - cx) * .18; cy += (ty - cy) * .18; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
    loop();
  }

  // Configurador de proyecto
  const cfg = $('#cfg');
  const labels = { web: 'sitio o app web', app: 'app móvil', plataforma: 'plataforma o panel', ia: 'solución con IA', mvp: 'primera versión', completo: 'producto completo', escalar: 'escalar un producto existente' };
  const extraNames = { design: 'diseño UX/UI', api: 'integraciones y APIs', admin: 'panel de administración', ai: 'funciones con IA', care: 'soporte posterior' };
  let spec = '';
  const upd = () => {
    const tipo = cfg.tipo.value, alc = cfg.alcance.value;
    const extras = [...cfg.querySelectorAll('[name=extra]:checked')].map((i) => i.value);
    const on = new Set(['ui', ...extras]);
    if (tipo === 'plataforma') { on.add('admin'); on.add('api'); }
    if (tipo === 'ia') on.add('ai');
    document.querySelectorAll('#bp .n').forEach((g) => g.classList.toggle('on', on.has(g.dataset.k)));
    const base = { web: 4, app: 8, plataforma: 10, ia: 6 }[tipo] * { mvp: 1, completo: 1.8, escalar: 1.3 }[alc];
    const w = base + extras.filter((x) => x !== 'care' && !(tipo === 'ia' && x === 'ai') && !(tipo === 'plataforma' && (x === 'admin' || x === 'api'))).length * 1.5;
    const lo = Math.max(2, Math.round(w * .85)), hi = Math.round(w * 1.25);
    $('#est').textContent = `${lo} a ${hi} semanas`;
    const ex = extras.length ? ` con ${extras.map((x) => extraNames[x]).join(', ')}` : '';
    spec = `Quiero crear: ${labels[tipo]} (${labels[alc]})${ex}. Plazo orientativo: ${lo} a ${hi} semanas.`;
    $('#est-sum').textContent = `${labels[tipo][0].toUpperCase()}${labels[tipo].slice(1)}, ${labels[alc]}${ex}.`;
  };
  cfg.addEventListener('change', upd); upd();
  $('#cfg-send').addEventListener('click', () => {
    const m = $('#message'); m.value = `${spec}\n\nMás detalles: `;
    $('#contacto').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => $('#email').focus({ preventScroll: true }), 600);
  });

  // Buscador de comandos (Ctrl/Cmd + K)
  const dlg = $('#cmd'), q = $('#cmd-q'), list = $('#cmd-list');
  const cmds = [
    ['Ir a Nosotros', () => go('#nosotros')], ['Ir a Servicios', () => go('#servicios')], ['Ir a Tecnología', () => go('#tecnologia')],
    ['Armar mi proyecto', () => go('#configurador')], ['Ver el proceso', () => go('#proceso')], ['Preguntas frecuentes', () => go('#faq')],
    ['Escribir un mensaje', () => { go('#contacto'); setTimeout(() => $('#email').focus({ preventScroll: true }), 600); }]
  ];
  let sel = 0, shown = cmds;
  const go = (h) => { dlg.close(); document.querySelector(h).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  const paint = () => {
    list.innerHTML = '';
    shown.forEach((c, i) => { const li = document.createElement('li'); li.textContent = c[0]; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', i === sel); li.onclick = () => c[1](); list.append(li); });
  };
  const openCmd = () => { q.value = ''; shown = cmds; sel = 0; paint(); dlg.showModal(); q.focus(); };
  $('#cmd-open').addEventListener('click', openCmd);
  addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? dlg.close() : openCmd(); } });
  q.addEventListener('input', () => { shown = cmds.filter((c) => c[0].toLowerCase().includes(q.value.toLowerCase())); sel = 0; paint(); });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); paint(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); paint(); e.preventDefault(); }
    if (e.key === 'Enter' && shown[sel]) shown[sel][1]();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  // Formulario de contacto y archivo adjunto
  const form = $('#contact-form'), status = $('#form-status'), btn = form.querySelector('button');
  const attachment = $('#attachment'), attachmentName = $('#attachment-name'), clearAttachment = $('#attachment-clear');
  const maxFileSize = 10 * 1024 * 1024;
  const allowedFile = /\.(docx?|pdf|pptx?|jpe?g|png|gif|webp|bmp|svg|avif|heic|tiff?)$/i;
  const say = (msg, isError = false) => { status.textContent = msg; status.classList.toggle('error', isError); };
  const showAttachment = () => {
    const file = attachment.files[0];
    attachmentName.textContent = file ? file.name : 'Ningún archivo seleccionado';
    attachmentName.title = file ? file.name : '';
    attachmentName.classList.toggle('has-file', Boolean(file));
    clearAttachment.hidden = !file;
  };

  attachment.addEventListener('change', showAttachment);
  clearAttachment.addEventListener('click', () => {
    attachment.value = '';
    showAttachment();
    attachment.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input:not([type="hidden"]):not([type="file"]), textarea')];
    fields.forEach((f) => f.setAttribute('aria-invalid', String(!f.checkValidity())));
    const invalid = fields.find((f) => !f.checkValidity());
    if (invalid) {
      say(invalid.type === 'email' ? 'Escribe un correo válido.' : 'Cuéntanos brevemente tu proyecto.', true);
      return invalid.focus();
    }
    const file = attachment.files[0];
    if (file && !allowedFile.test(file.name)) {
      say('Adjunta un documento Word, PDF, PowerPoint o una imagen.', true);
      return attachment.focus();
    }
    if (file && file.size > maxFileSize) {
      say('El archivo supera el límite de 10 MB. Elige uno más pequeño.', true);
      return attachment.focus();
    }

    btn.disabled = true;
    say('Enviando…');
    try {
      const response = await fetch(form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error(typeof result.message === 'string' ? result.message : 'El servicio rechazó el envío.');
      }
      form.reset();
      say('Mensaje enviado. Te responderemos pronto.');
    } catch (error) {
      say(error instanceof Error && error.message
        ? `No pudimos enviar el mensaje: ${error.message}`
        : 'No pudimos enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.', true);
    } finally {
      btn.disabled = false;
    }
  });

  $('#year').textContent = new Date().getFullYear();
})();
