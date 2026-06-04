document.addEventListener('DOMContentLoaded', () => {
  // --- Jhey.dev inspired Mouse Spotlight Glow Effect ---
  const spotlight = document.querySelector('.spotlight');
  if (spotlight) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
      spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
  }

  // --- Theme Toggle (Dark / Light Mode) ---
  const themeToggleBtn = document.querySelector('.theme-toggle');
  const activeTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcon(activeTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    if (!sunIcon || !moonIcon) return;

    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  // --- ScrollSpy / Navigation Highlighter (Brittany Chiang style) ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 200; // Offset for detection

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Typing Effect in Title ---
  const typingTextElement = document.querySelector('.typing-text');
  if (typingTextElement) {
    const roles = JSON.parse(typingTextElement.getAttribute('data-words') || '["Ingeniero en Informática.", "Especialista en Automatización.", "Desarrollador de IA."]');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
      } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 800);
  }

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('contact-toast');

  if (contactForm && toast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Por favor, rellene todos los campos.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // Lógica de envío real con Formspree
      const endpoint = 'https://formspree.io/f/mnjryzzp'; // <-- ¡CAMBIA ESTO!

      if (endpoint.includes('TU_ID_AQUI')) {
        // Simulación si aún no han puesto el ID
        setTimeout(() => {
          showToast('¡Simulación de envío! Agrega tu ID de Formspree en app.js.', 'success');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1200);
        return;
      }

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      })
        .then(response => {
          if (response.ok) {
            showToast('¡Mensaje enviado con éxito! Me pondré en contacto muy pronto.', 'success');
            contactForm.reset();
          } else {
            showToast('Ocurrió un error al enviar. Intenta nuevamente.', 'error');
          }
        })
        .catch(error => {
          showToast('Ocurrió un error de red.', 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }

  function showToast(message, type) {
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // --- Image Modal (Lightbox) ---
  const modal = document.getElementById("image-modal");
  const img = document.getElementById("profile-img");
  const modalImg = document.getElementById("expanded-img");
  const closeBtn = document.querySelector(".close-modal");

  if (modal && img && modalImg && closeBtn) {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      // Reflow for CSS transition
      modal.offsetHeight;
      modal.classList.add("show");
      modalImg.src = img.src;
    });

    const closeModal = () => {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    };

    closeBtn.addEventListener("click", closeModal);
    
    // Cerrar al dar clic fuera de la imagen
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }
});
