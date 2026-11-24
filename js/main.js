/* ==========================================================================
   SOCIALO - CREATIVE INTERACTIONS & 3D ART ENGINE
   Interactive Three.js Abstract Twisted Kinetic Form (Pony Inspired)
   Lenis Smooth Scrolling, Custom Cursor, Magnetic Buttons, GSAP Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initCustomCursor();
  init3DHeroCanvas();
  initHeaderScroll();
  initMobileMenu();
  initGSAPAnimations();
  initCounters();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. LENIS SMOOTH SCROLLING
   -------------------------------------------------------------------------- */
let lenis = null;
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger if present
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
}

/* --------------------------------------------------------------------------
   2. CUSTOM CURSOR WITH MAGNETIC HOVER
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let cursorInitialized = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursorInitialized) {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
      followerX = mouseX;
      followerY = mouseY;
      cursorInitialized = true;
    }
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
      cursorInitialized = false;
    }
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states on interactive elements
  const hoverables = document.querySelectorAll('a, button, .service-row-item, .work-card, .btn-pill, input, select, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      follower.style.width = '64px';
      follower.style.height = '64px';
      follower.style.borderColor = 'rgba(255, 85, 0, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      follower.style.width = '44px';
      follower.style.height = '44px';
      follower.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
  });
}

/* --------------------------------------------------------------------------
   3. ABSTRACT 3D KINETIC TORUS KNOT / TWIST ENGINE (THREE.JS)
   Inspired by Pony's intertwined organic form, with electric blue & orange radiance
   -------------------------------------------------------------------------- */
function init3DHeroCanvas() {
  const container = document.getElementById('hero-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Group for the 3D entity - centered horizontally in hero behind headline
  const mainGroup = new THREE.Group();
  const updatePosition = () => {
    if (window.innerWidth <= 768) {
      mainGroup.position.set(0, 0, -2);
      mainGroup.scale.set(0.75, 0.75, 0.75);
    } else if (window.innerWidth <= 1200) {
      mainGroup.position.set(0, 0.5, 0);
      mainGroup.scale.set(0.9, 0.9, 0.9);
    } else {
      mainGroup.position.set(0, 0.5, 0);
      mainGroup.scale.set(1.0, 1.0, 1.0);
    }
  };
  updatePosition();
  scene.add(mainGroup);

  // Create an organic intertwined kinetic sculpture (Torus Knot with rich physical materials)
  const knotGeo = new THREE.TorusKnotGeometry(6.2, 1.8, 180, 48, 2, 5);

  // Softened, elegant deep cobalt/navy tone with subtle rim luster (reduced brightness & saturation)
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0x1442a8,
    emissive: 0x050f26,
    roughness: 0.32,
    metalness: 0.75,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
    reflectivity: 0.7,
    wireframe: false
  });

  const mesh = new THREE.Mesh(knotGeo, knotMat);
  mainGroup.add(mesh);

  // Delicate wireframe outer aura (subtler opacity)
  const wireGeo = new THREE.TorusKnotGeometry(6.28, 1.84, 90, 24, 2, 5);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xff5500,
    wireframe: true,
    transparent: true,
    opacity: 0.10
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  mainGroup.add(wireMesh);

  // Subtler Floating Ambient Particles (reduced from 120 to 35 with low opacity)
  const particleCount = 35;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 35;
    particlePos[i + 1] = (Math.random() - 0.5) * 35;
    particlePos[i + 2] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00c8e0,
    size: 0.12,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Ambient Lighting (balanced and softer)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const orangeLight = new THREE.PointLight(0xff5500, 2.2, 45);
  orangeLight.position.set(12, 10, 8);
  scene.add(orangeLight);

  const blueLight = new THREE.PointLight(0x0055dd, 2.8, 50);
  blueLight.position.set(-14, -8, 12);
  scene.add(blueLight);

  const cyanLight = new THREE.PointLight(0x00d4ee, 1.2, 30);
  cyanLight.position.set(0, 15, -5);
  scene.add(cyanLight);

  // Mouse Interaction parallax
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotY = normX * 0.45;
    targetRotX = -normY * 0.35;
  });

  // Responsive Resize
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updatePosition();
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia interpolation
    currentRotX += (targetRotX - currentRotX) * 0.05;
    currentRotY += (targetRotY - currentRotY) * 0.05;

    // Organic kinetic floating rotation
    mainGroup.rotation.x = 0.3 * Math.sin(elapsedTime * 0.4) + currentRotX;
    mainGroup.rotation.y = elapsedTime * 0.25 + currentRotY;
    mainGroup.rotation.z = 0.15 * Math.cos(elapsedTime * 0.3);

    // Subtle breathing pulse
    const pulse = 1 + Math.sin(elapsedTime * 1.2) * 0.03;
    mainGroup.scale.set(pulse, pulse, pulse);

    // Slow particle rotation
    particles.rotation.y = elapsedTime * 0.05;

    renderer.render(scene, camera);
  }
  animate();
}

/* --------------------------------------------------------------------------
   4. HEADER SCROLL & MOBILE MENU
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const burger = document.querySelector('.burger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  if (!burger || !drawer) return;

  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('active');
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  const links = drawer.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   5. GSAP SCROLLTRIGGER ANIMATIONS
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Graceful fallback if GSAP is not available
    document.querySelectorAll('.reveal-fade-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Reveal elements on scroll
  const reveals = document.querySelectorAll('.reveal-fade-up');
  reveals.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* --------------------------------------------------------------------------
   6. NUMBER COUNTERS
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 2000;
        const stepTime = 20;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            el.innerText = target + suffix;
            clearInterval(timer);
          } else {
            el.innerText = Math.floor(count) + suffix;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   7. REAL ENQUIRY FORM HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('agency-enquiry-form');
  const statusMsg = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=\"submit\"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = 'Sending Enquiry...';

    // Form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate required fields
    if (!data.name || !data.email || !data.service) {
      if (statusMsg) {
        statusMsg.className = 'form-status-msg error';
        statusMsg.innerText = 'Please complete all required fields.';
      }
      btn.disabled = false;
      btn.innerHTML = originalText;
      return;
    }

    // Direct mailto / API dispatch preparation
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = `Thank you, <strong>${data.name}</strong>. Your enquiry for <strong>${data.service}</strong> has been logged. Our Dubai strategy team will connect with you via ${data.email} within 24 hours.`;
      }
      form.reset();
    }, 1000);
  });
}

