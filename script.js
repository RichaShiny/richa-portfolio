const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('visible'));
}

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = '1';
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => glow.style.opacity = '0');
}

const svg = document.querySelector('#system-field');
if (svg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const NS = 'http://www.w3.org/2000/svg';
  const particlesGroup = svg.querySelector('.field-particles');
  const linesGroup = svg.querySelector('.field-lines');
  const cx = 450, cy = 350;
  const particles = [];
  const total = window.innerWidth < 700 ? 46 : 82;

  for (let i = 0; i < total; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 85 + Math.random() * 255;
    const speed = 0.00016 + Math.random() * 0.00034;
    const phase = Math.random() * Math.PI * 2;
    const node = document.createElementNS(NS, 'circle');
    node.setAttribute('r', String(1.4 + Math.random() * 2.2));
    node.setAttribute('class', `field-particle${i % 12 === 0 ? ' hot' : ''}`);
    particlesGroup.appendChild(node);
    particles.push({ node, angle, radius, speed, phase });
  }

  for (let i = 0; i < 18; i++) {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('class', 'field-line');
    linesGroup.appendChild(line);
  }
  const lines = [...linesGroup.children];

  let pointerX = 0, pointerY = 0;
  window.addEventListener('mousemove', (e) => {
    pointerX = (e.clientX / innerWidth - .5) * 18;
    pointerY = (e.clientY / innerHeight - .5) * 18;
  }, { passive: true });

  function frame(t) {
    const positions = particles.map((p, i) => {
      const a = p.angle + t * p.speed;
      const pulse = Math.sin(t * 0.001 + p.phase) * 11;
      const r = p.radius + pulse;
      const x = cx + Math.cos(a) * r + pointerX * (p.radius / 340);
      const y = cy + Math.sin(a) * r * .72 + pointerY * (p.radius / 340);
      p.node.setAttribute('cx', x.toFixed(2));
      p.node.setAttribute('cy', y.toFixed(2));
      p.node.setAttribute('opacity', String(.28 + (i % 7) * .07));
      return [x, y];
    });
    lines.forEach((line, i) => {
      const a = positions[(i * 4) % positions.length];
      const b = positions[(i * 4 + 9) % positions.length];
      line.setAttribute('x1', a[0]); line.setAttribute('y1', a[1]);
      line.setAttribute('x2', b[0]); line.setAttribute('y2', b[1]);
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
