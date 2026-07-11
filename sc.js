document.querySelectorAll('.bottom-nav-button').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.bottom-nav-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    this.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });
    
    const targetId = this.getAttribute('data-target');
    if (targetId && /^[a-zA-Z0-9_-]+$/.test(targetId)) {
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
        
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  });
});

const promoBanner = document.getElementById('promoBanner');
const promoBannerClose = document.getElementById('promoBannerClose');
const promoBannerCloseBtn = document.getElementById('promoBannerCloseBtn');

function closePromoBanner() {
  if (promoBanner) {
    promoBanner.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (promoBannerClose) {
  promoBannerClose.addEventListener('click', closePromoBanner);
}
if (promoBannerCloseBtn) {
  promoBannerCloseBtn.addEventListener('click', closePromoBanner);
}
if (promoBanner) {
  promoBanner.addEventListener('click', (e) => {
    if (e.target === promoBanner) {
      closePromoBanner();
    }
  });
}

function initReadMoreButtons() {
  document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
      const description = this.previousElementSibling;
      if (!description) return;
      
      const isExpanded = description.classList.contains('expanded');
      
      if (isExpanded) {
        description.classList.remove('expanded');
        description.classList.add('collapsed');
        this.classList.remove('expanded');
        this.innerHTML = '<i class="fas fa-chevron-down"></i> Baca Selengkapnya';
      } else {
        description.classList.remove('collapsed');
        description.classList.add('expanded');
        this.classList.add('expanded');
        this.innerHTML = '<i class="fas fa-chevron-up"></i> Baca Lebih Sedikit';
      }
    });
  });
}

const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const imageModalClose = document.getElementById('imageModalClose');

function openImageModal(imageSrc) {
  if (modalImage && imageModal && imageSrc) {
    const sanitizedSrc = String(imageSrc).replace(/[<>"']/g, '');
    if (/^https?:\/\//i.test(sanitizedSrc) || /^\/[^\/]/.test(sanitizedSrc)) {
      modalImage.src = sanitizedSrc;
      imageModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
}

function closeImageModal() {
  if (imageModal) {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (imageModalClose) {
  imageModalClose.addEventListener('click', closeImageModal);
}

if (imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      closeImageModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (imageModal && imageModal.classList.contains('active')) {
      closeImageModal();
    }
    
    const testimoniModal = document.getElementById('testimoniModal');
    if (testimoniModal && testimoniModal.classList.contains('active')) {
      if (typeof tutupTestimoniModal === 'function') {
        tutupTestimoniModal();
      } else {
        testimoniModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    if (promoBanner && promoBanner.classList.contains('active')) {
      closePromoBanner();
    }
  }
});