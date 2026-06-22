
const body = document.body;
const toggle = document.querySelector('[data-menu-toggle]');
if (toggle) {
  toggle.addEventListener('click', () => body.classList.toggle('mobile-open'));
  document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => body.classList.remove('mobile-open')));
}

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
reveals.forEach((el) => revealObserver.observe(el));


const params = new URLSearchParams(window.location.search);
const selectedApartment = params.get('apartment');
const apartmentSelect = document.querySelector('#apartment');
if (selectedApartment && apartmentSelect) {
  const normalized = selectedApartment.toLowerCase();
  [...apartmentSelect.options].forEach((option) => {
    if (option.textContent.toLowerCase().includes(normalized) || option.value.toLowerCase().includes(normalized)) {
      apartmentSelect.value = option.value;
    }
  });
}

const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach((input) => input.setAttribute('min', today));
const arrival = document.querySelector('#arrival');
const departure = document.querySelector('#departure');
if (arrival && departure) {
  arrival.addEventListener('change', () => {
    departure.min = arrival.value || today;
    if (departure.value && departure.value <= arrival.value) departure.value = '';
  });
}

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = document.querySelector('[data-lightbox-img]');
const lightboxClose = document.querySelector('[data-lightbox-close]');
document.querySelectorAll('[data-lightbox-src]').forEach((item) => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-lightbox-src');
    const alt = item.getAttribute('data-lightbox-alt') || 'Apartment photo';
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
  });
});
const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightboxImg.src = '';
};
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
