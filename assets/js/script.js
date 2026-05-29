/* ============================================
   Projetos Data
   Extraído de sobremim.md
   ============================================ */
const projects = [
  {
    id: 1,
    name: 'VOLTIN Climatização',
    title: 'VOLTIN Climatização',
    description:
      'Sistema Full Stack desenvolvido para uma empresa real do segmento de climatização. Entregando experiência moderna, rápida e profissional com frontend, backend, banco de dados e deploy completo em VPS Linux.',
    techs: [
      'Next.js',
      'TypeScript',
      'TailwindCSS',
      'Framer Motion',
      'TanStack Query',
      'NestJS',
      'Prisma',
      'PostgreSQL',
      'Docker',
    ],
    link: '#',
    slides: [
      'assets/images/01VOLTIN.png',
      'assets/images/02VOLTIN.png',
      'assets/images/03VOLTIN.png',
    ],
  },
  {
    id: 2,
    name: 'FINANÇAS PRO',
    title: 'FINANÇAS PRO',
    description:
      'Dashboard financeiro moderno para gerenciamento pessoal e empresarial. Controle de receitas, despesas, saldo, categorias, investimentos e ativos financeiros com gráficos dinâmicos e integração com APIs do mercado.',
    techs: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Node.js',
      'Express',
      'Yahoo Finance API',
      'CoinGecko API',
    ],
    link: '#',
    slides: [
      'assets/images/01FINANCAS.png',
      'assets/images/02FINANCAS.png',
      'assets/images/03FINANCAS.png',
    ],
  },
  {
    id: 3,
    name: 'Sistema de Gestão para Oficinas',
    title: 'Sistema de Gestão para Oficinas',
    description:
      'Sistema leve, rápido e funcional para oficinas mecânicas. Unindo a facilidade do desenvolvimento web com a praticidade de um sistema desktop instalável com Electron.',
    techs: ['Electron', 'HTML', 'CSS', 'JavaScript', 'Node.js'],
    link: '#',
    slides: [
      'assets/images/01OFICINA.png',
      'assets/images/02OFICINA.png',
      'assets/images/03OFICINA.png',
    ],
  },
];

/* ============================================
   State
   ============================================ */
const state = {
  currentProject: 0,
  currentSlide: 0,
  isPlaying: true,
  progressInterval: null,
  progressStart: null,
  SEGMENT_DURATION: 5000,
};

/* ============================================
   DOM References
   ============================================ */
const $ = (id) => document.getElementById(id);

const dom = {
  progressBar: $('progress-bar'),
  storyImage: $('story-image'),
  storyTitle: $('story-title'),
  storyDescription: $('story-description'),
  storyTechs: $('story-techs'),
  navPrev: $('nav-prev'),
  navNext: $('nav-next'),
  playPauseBtn: $('play-pause-btn'),
  playIcon: $('play-icon'),
  pauseIcon: $('pause-icon'),
  touchLeft: $('touch-left'),
  touchRight: $('touch-right'),
};

/* ============================================
   Progress Bar (Story principal)
   ============================================ */
function buildProgressBar() {
  dom.progressBar.innerHTML = '';
  projects.forEach((project) => {
    project.slides.forEach((_, sIdx) => {
      const segment = document.createElement('div');
      segment.className = 'progress-segment';
      segment.dataset.slide = sIdx;

      const fill = document.createElement('div');
      fill.className = 'progress-fill';
      segment.appendChild(fill);
      dom.progressBar.appendChild(segment);
    });
  });
}

function getSegmentIndex(projectIdx, slideIdx) {
  let idx = 0;
  for (let p = 0; p < projectIdx; p++) {
    idx += projects[p].slides.length;
  }
  return idx + slideIdx;
}

function updateProgressBar() {
  const activeIdx = getSegmentIndex(state.currentProject, state.currentSlide);
  const segments = dom.progressBar.querySelectorAll('.progress-segment');

  segments.forEach((seg, i) => {
    seg.classList.remove('active', 'completed');
    if (i < activeIdx) {
      seg.classList.add('completed');
    } else if (i === activeIdx) {
      seg.classList.add('active');
    }
  });
}

function updateProgressFill(progressPct) {
  const activeIdx = getSegmentIndex(state.currentProject, state.currentSlide);
  const segments = dom.progressBar.querySelectorAll('.progress-segment');
  const activeSegment = segments[activeIdx];
  if (activeSegment) {
    activeSegment.style.setProperty('--progress-width', `${progressPct}%`);
  }
}

/* ============================================
   Render Story Principal
   ============================================ */
function renderStory() {
  const project = projects[state.currentProject];
  const slide = project.slides[state.currentSlide];

  dom.storyImage.classList.add('loading');
  dom.storyImage.src = slide;
  dom.storyImage.onload = () => dom.storyImage.classList.remove('loading');
  dom.storyImage.onerror = () => {
    dom.storyImage.classList.remove('loading');
    dom.storyImage.alt = 'Imagem indisponível';
  };

  dom.storyTitle.textContent = project.title;
  dom.storyDescription.textContent = project.description;

  dom.storyTechs.innerHTML = project.techs
    .map((tech) => `<span class="tech-badge">${tech}</span>`)
    .join('');

  updateProgressBar();
}

/* ============================================
   Navegação Story Principal
   ============================================ */
function navigate(direction) {
  resetProgress();

  const maxProject = projects.length - 1;
  const maxSlide = projects[state.currentProject].slides.length - 1;

  if (direction === 'next') {
    if (state.currentSlide < maxSlide) {
      state.currentSlide++;
    } else if (state.currentProject < maxProject) {
      state.currentProject++;
      state.currentSlide = 0;
    } else {
      state.currentProject = 0;
      state.currentSlide = 0;
    }
  } else {
    if (state.currentSlide > 0) {
      state.currentSlide--;
    } else if (state.currentProject > 0) {
      state.currentProject--;
      state.currentSlide = projects[state.currentProject].slides.length - 1;
    } else {
      state.currentProject = maxProject;
      state.currentSlide = projects[maxProject].slides.length - 1;
    }
  }

  renderStory();
  if (state.isPlaying) startProgress();
}

/* ============================================
   Progress Auto-Play
   ============================================ */
function startProgress() {
  stopProgress();
  state.progressStart = performance.now();

  function tick(now) {
    if (!state.isPlaying) return;

    const elapsed = now - state.progressStart;
    const progress = Math.min((elapsed / state.SEGMENT_DURATION) * 100, 100);
    updateProgressFill(progress);

    if (progress >= 100) {
      navigate('next');
      return;
    }

    state.progressInterval = requestAnimationFrame(tick);
  }

  state.progressInterval = requestAnimationFrame(tick);
}

function stopProgress() {
  if (state.progressInterval) {
    cancelAnimationFrame(state.progressInterval);
    state.progressInterval = null;
  }
}

function resetProgress() {
  stopProgress();
  updateProgressFill(0);
}

/* ============================================
   Play / Pause
   ============================================ */
function togglePlay() {
  state.isPlaying = !state.isPlaying;

  if (state.isPlaying) {
    dom.playIcon.style.display = 'block';
    dom.pauseIcon.style.display = 'none';
    dom.playPauseBtn.setAttribute('aria-label', 'Pausar autoplay');
    startProgress();
  } else {
    dom.playIcon.style.display = 'none';
    dom.pauseIcon.style.display = 'block';
    dom.playPauseBtn.setAttribute('aria-label', 'Continuar autoplay');
    stopProgress();
  }
}

/* ============================================
   Keyboard
   ============================================ */
function handleKeydown(e) {
  const lbOpen = lightboxDom.el.classList.contains('open');

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      if (lbOpen) {
        lightboxNavigate('next');
      } else {
        navigate('next');
      }
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (lbOpen) {
        lightboxNavigate('prev');
      } else {
        navigate('prev');
      }
      break;
    case 'Escape': {
      if (!lbOpen) break;
      e.preventDefault();
      closeLightbox();
      break;
    }
    case ' ':
      if (lbOpen) break;
      e.preventDefault();
      togglePlay();
      break;
  }
}

/* ============================================
   Touch / Click (Story principal)
   ============================================ */
function handleInteraction(e) {
  const clientX = e.clientX;
  const half = window.innerWidth / 2;

  if (clientX < half) {
    navigate('prev');
  } else {
    navigate('next');
  }
}

/* ============================================
   Visibility
   ============================================ */
function handleVisibilityChange() {
  if (document.hidden) {
    if (state.isPlaying) stopProgress();
  } else {
    if (state.isPlaying) startProgress();
  }
}

/* ============================================
   Filtro de Projetos (Abas)
   ============================================ */
function initProjectFilter() {
  const filterBar = document.querySelector('.project-filter__bar');
  if (!filterBar) return;

  const buttons = filterBar.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      cards.forEach((card) => {
        if (filter === 'all' || card.dataset.project === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================
   Carrossel das Seções de Detalhes / Cards
   ============================================ */
const carouselImageMap = {
  1: ['assets/images/01VOLTIN.png', 'assets/images/02VOLTIN.png', 'assets/images/03VOLTIN.png'],
  2: ['assets/images/01FINANCAS.png', 'assets/images/02FINANCAS.png', 'assets/images/03FINANCAS.png'],
  3: ['assets/images/01OFICINA.png', 'assets/images/02OFICINA.png', 'assets/images/03OFICINA.png'],
};

function initCarousels() {
  document.querySelectorAll('.project-card__carousel, .project-detail__carousel').forEach((el) => {
    const projectId = parseInt(el.dataset.project, 10);
    const images = carouselImageMap[projectId];
    if (!images) return;

    let current = 0;
    const viewport = el.querySelector('.carousel__viewport');
    const imgEl = el.querySelector('.carousel__img');
    const dotsContainer = el.querySelector('.carousel__dots');
    const prevBtn = el.querySelector('.carousel__btn--prev');
    const nextBtn = el.querySelector('.carousel__btn--next');

    // Build dots
    images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = index;
      imgEl.src = images[current];
      imgEl.alt = `Slide ${current + 1}`;

      dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => {
      const idx = current === 0 ? images.length - 1 : current - 1;
      goTo(idx);
    });

    nextBtn.addEventListener('click', () => {
      const idx = current === images.length - 1 ? 0 : current + 1;
      goTo(idx);
    });

    // Set initial image
    goTo(0);
  });
}

/* ============================================
   Lightbox
   ============================================ */
const lightboxDom = {
  el: document.getElementById('lightbox'),
  img: document.getElementById('lightbox-img'),
  close: document.getElementById('lightbox-close'),
  backdrop: document.getElementById('lightbox-backdrop'),
  prev: document.getElementById('lightbox-prev'),
  next: document.getElementById('lightbox-next'),
};

// Track current context inside lightbox
const lightboxCtx = {
  /** 'carousel' | 'story' | 'funny' | null */
  source: null,
  /** project id (only for carousel) */
  projectId: null,
  /** current slide index within the source's image list */
  slideIndex: 0,
  /** list of image URLs for navigation */
  images: [],
};

function openLightbox(src) {
  if (!src) return;
  lightboxDom.img.src = src;
  lightboxDom.el.classList.add('open');
  lightboxDom.el.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightboxDom.el.classList.remove('open');
  lightboxDom.el.setAttribute('aria-hidden', 'true');
  lightboxCtx.source = null;
  lightboxCtx.projectId = null;
  lightboxCtx.slideIndex = 0;
  lightboxCtx.images = [];
  setTimeout(() => { lightboxDom.img.src = ''; }, 300);
}

function lightboxNavigate(dir) {
  if (lightboxCtx.images.length === 0) return;

  if (dir === 'next') {
    lightboxCtx.slideIndex = (lightboxCtx.slideIndex + 1) % lightboxCtx.images.length;
  } else {
    lightboxCtx.slideIndex = (lightboxCtx.slideIndex - 1 + lightboxCtx.images.length) % lightboxCtx.images.length;
  }

  lightboxDom.img.src = lightboxCtx.images[lightboxCtx.slideIndex];
}

function setupLightboxTriggers() {
  // All carousel images (project detail slides & project cards)
  document.querySelectorAll('.carousel__viewport img').forEach((img) => {
    img.addEventListener('click', (e) => {
      const carousel = e.currentTarget.closest('.project-card__carousel, .project-detail__carousel');
      const projectId = parseInt(carousel?.dataset?.project, 10);
      const images = carouselImageMap[projectId] || [];

      lightboxCtx.source = 'carousel';
      lightboxCtx.projectId = projectId;
      lightboxCtx.images = images;

      // Find current index from image src
      const currentSrc = e.currentTarget.src;
      const idx = images.findIndex((imgPath) => currentSrc.includes(imgPath));
      lightboxCtx.slideIndex = idx >= 0 ? idx : 0;

      openLightbox(e.currentTarget.src);
    });
  });

  // Funny image on "Sobre Mim"
  const funnyImg = document.querySelector('.about__funny img');
  if (funnyImg) {
    funnyImg.addEventListener('click', () => {
      lightboxCtx.source = 'funny';
      lightboxCtx.images = [];
      openLightbox(funnyImg.src);
    });
  }

  // Story slide images (main story viewer)
  const storyImg = document.querySelector('.story-slide img');
  if (storyImg) {
    storyImg.addEventListener('click', () => {
      lightboxCtx.source = 'story';
      lightboxCtx.images = [];
      openLightbox(storyImg.src);
    });
  }
}

// Close handlers
lightboxDom.close.addEventListener('click', closeLightbox);
lightboxDom.backdrop.addEventListener('click', closeLightbox);

// Lightbox navigation
lightboxDom.prev.addEventListener('click', () => lightboxNavigate('prev'));
lightboxDom.next.addEventListener('click', () => lightboxNavigate('next'));

/* ============================================
   Theme Toggle
   ============================================ */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ============================================
   Init
   ============================================ */
function init() {
  buildProgressBar();
  renderStory();
  startProgress();

  // Story navigation
  dom.navPrev.addEventListener('click', () => navigate('prev'));
  dom.navNext.addEventListener('click', () => navigate('next'));
  dom.playPauseBtn.addEventListener('click', togglePlay);
  document.addEventListener('keydown', handleKeydown);
  dom.touchLeft.addEventListener('click', handleInteraction);
  dom.touchRight.addEventListener('click', handleInteraction);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Filtro de projetos (abas)
  initProjectFilter();

  // Carrosséis dos cards de projeto
  initCarousels();

  // Lightbox
  setupLightboxTriggers();

  // Theme toggle
  initThemeToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
